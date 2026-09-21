import { BubbleInterface } from '@/interfaces/testInterfaces';

/**
 * Tree-Crescendo reconstruction.
 *
 * The backend sends `conversations`: one entry per *leaf* of the escalation
 * tree, each entry being the full root→leaf path as a flat list of turns
 * (attacker, target, attacker, target, ...). Paths that come from the same
 * branch therefore share a common prefix of identical turns, which is all that
 * is needed to rebuild the tree client-side: insert every path into a trie
 * keyed, at each level, by the turn itself. No extra backend call is required.
 */

/** One escalation step: the attacker's question plus the target's answer. */
export interface TreeTurnNode {
    id: string;
    /** Escalation round, 1-based. */
    depth: number;
    /** The escalating question asked at this step. */
    prompt: string;
    /** The target's answer, when it produced one. */
    response?: string;
    /** Judge score for this step. */
    score?: number;
    /** Attacker's stated rationale for how this step escalates. */
    improvement?: string;
    parentId?: string;
    children: TreeTurnNode[];
    /** Indices of the conversations (leaf paths) running through this node. */
    chatIndices: number[];
}

export interface AttackTreeModel {
    /** Nodes of the first escalation round; the synthetic root is not included. */
    roots: TreeTurnNode[];
    /** Every node, by id — used to walk a node's ancestors. */
    byId: Map<string, TreeTurnNode>;
    /** Id of the highest-scoring node, highlighted as the best path. */
    bestId?: string;
    /** Ids on the root→best path, rendered as the highlighted branch. */
    bestPath: Set<string>;
    nodeCount: number;
    maxDepth: number;
}

interface PairedStep {
    prompt: string;
    response?: string;
    score?: number;
    improvement?: string;
    depth?: number;
}

/**
 * Collapse a flat turn list into (attacker question, target answer) steps.
 * A trailing attacker turn with no answer stays a step on its own, so a branch
 * the target never replied to is still shown.
 */
function pairTurns(chat: BubbleInterface[]): PairedStep[] {
    const steps: PairedStep[] = [];
    for (let i = 0; i < chat.length; i++) {
        const turn = chat[i];
        if (turn.sender !== 'user') {
            // A target turn with no preceding attacker turn: keep it rather
            // than silently dropping part of the conversation.
            steps.push({
                prompt: '',
                response: turn.msg,
                score: turn.score,
                improvement: turn.improvement,
                depth: turn.depth,
            });
            continue;
        }
        const next = chat[i + 1];
        if (next && next.sender === 'model') {
            steps.push({
                prompt: turn.msg,
                response: next.msg,
                // The judge scores the response, so prefer the target turn's score.
                score: next.score ?? turn.score,
                improvement: turn.improvement ?? next.improvement,
                depth: turn.depth ?? next.depth,
            });
            i++; // the target turn has been consumed
        } else {
            steps.push({
                prompt: turn.msg,
                response: undefined,
                score: turn.score,
                improvement: turn.improvement,
                depth: turn.depth,
            });
        }
    }
    return steps;
}

/** Rebuild the escalation tree from the per-leaf conversation paths. */
export function buildAttackTree(conversationChat?: BubbleInterface[][]): AttackTreeModel {
    const roots: TreeTurnNode[] = [];
    const byId = new Map<string, TreeTurnNode>();
    let counter = 0;
    let maxDepth = 0;

    (conversationChat ?? []).forEach((chat, chatIdx) => {
        let siblings = roots;
        let parentId: string | undefined;

        pairTurns(chat).forEach((step, level) => {
            // Two paths share a node when, under the same parent, the step is
            // identical — a node has exactly one prompt and one response, so
            // matching on both is what makes branches split at the right point.
            let node = siblings.find(
                (n) => n.prompt === step.prompt && n.response === step.response
            );

            if (!node) {
                // `depth` is sent by the backend; fall back to the position in
                // the path for attacks that don't report it.
                const depth = step.depth ?? level + 1;
                node = {
                    id: `node-${counter++}`,
                    depth,
                    prompt: step.prompt,
                    response: step.response,
                    score: step.score,
                    improvement: step.improvement,
                    parentId,
                    children: [],
                    chatIndices: [],
                };
                siblings.push(node);
                byId.set(node.id, node);
                if (depth > maxDepth) maxDepth = depth;
            }

            if (!node.chatIndices.includes(chatIdx)) node.chatIndices.push(chatIdx);
            parentId = node.id;
            siblings = node.children;
        });
    });

    // Best node = highest judge score, which is the branch that got furthest.
    let bestId: string | undefined;
    let best = -Infinity;
    byId.forEach((node) => {
        if (typeof node.score === 'number' && node.score > best) {
            best = node.score;
            bestId = node.id;
        }
    });

    const bestPath = new Set<string>();
    let cursor = bestId ? byId.get(bestId) : undefined;
    while (cursor) {
        bestPath.add(cursor.id);
        cursor = cursor.parentId ? byId.get(cursor.parentId) : undefined;
    }

    return { roots, byId, bestId, bestPath, nodeCount: byId.size, maxDepth };
}

/** Root→node ancestor chain, the node itself included. */
export function ancestorPath(model: AttackTreeModel, node: TreeTurnNode): TreeTurnNode[] {
    const path: TreeTurnNode[] = [];
    let cursor: TreeTurnNode | undefined = node;
    while (cursor) {
        path.push(cursor);
        cursor = cursor.parentId ? model.byId.get(cursor.parentId) : undefined;
    }
    path.reverse();
    return path;
}

/**
 * Whether an attack produces an escalation tree worth rendering as one.
 * Tree-Crescendo is registered as `TreeCrescendoAttack`, which the backend's
 * factory turns into the id `treecrescendo` (class name minus the "Attack"
 * suffix, lowercased); the loose match keeps aliases like `tree_crescendo`
 * working too.
 */
export function isTreeAttack(attackId?: string | null): boolean {
    if (!attackId) return false;
    return attackId.toLowerCase().replace(/[^a-z]/g, '').includes('treecrescendo');
}
