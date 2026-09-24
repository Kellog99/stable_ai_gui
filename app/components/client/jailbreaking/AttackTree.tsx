"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Modal, ScrollArea } from '@mantine/core';
import { Bot, Flame, Target, TrendingUp, GitBranch } from 'lucide-react';
import { BubbleInterface } from '@/interfaces/testInterfaces';
import Bubble from './Bubble';
import { scoreToColor } from './scoreColor';
import { AttackTreeModel, TreeTurnNode, ancestorPath, buildAttackTree } from './attackTree';
import './AttackTree.css';

interface AttackTreeProps {
    conversationChat?: BubbleInterface[][];
    goal?: string;
}

interface Size {
    w: number;
    h: number;
}

const EMPTY_SIZE: Size = { w: 0, h: 0 };

/** Inset kept between the tree and the edges of the cell, in px. */
const CANVAS_INSET = 32;
/** A lone path would otherwise blow up to fill 76vh; a very wide tree would
 *  shrink past readability. Clamp the auto-fit between these — below ~0.7 the
 *  node captions stop being legible, so a wider-than-the-cell tree keeps a
 *  readable size and scrolls horizontally instead of being squashed. */
const MIN_SCALE = 0.7;
const MAX_SCALE = 1.7;

/** One-line gist of the turn shown under the node; the full text is in the modal. */
function truncate(text: string, max = 72): string {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max - 1)}…`;
}

const AttackTree: React.FC<AttackTreeProps> = ({ conversationChat, goal }) => {
    const model: AttackTreeModel = useMemo(
        () => buildAttackTree(conversationChat),
        [conversationChat]
    );
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const canvasRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState<Size>(EMPTY_SIZE);
    const [graphSize, setGraphSize] = useState<Size>(EMPTY_SIZE);

    // Measure the cell and the tree's natural size so the tree can be scaled to
    // fill the cell. `offsetWidth/Height` report the *untransformed* layout box,
    // so measuring the scaled element does not feed back into its own scale.
    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const graph = graphRef.current;
        if (!canvas || !graph) return;

        const measure = () => {
            const cw = canvas.clientWidth;
            const ch = canvas.clientHeight;
            const gw = graph.offsetWidth;
            const gh = graph.offsetHeight;
            // Bail out when nothing moved, otherwise the observer and the state
            // update would keep waking each other up.
            setCanvasSize((prev) => (prev.w === cw && prev.h === ch ? prev : { w: cw, h: ch }));
            setGraphSize((prev) => (prev.w === gw && prev.h === gh ? prev : { w: gw, h: gh }));
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(canvas);
        observer.observe(graph);
        return () => observer.disconnect();
    }, [model]);

    const scale = useMemo(() => {
        if (!graphSize.w || !graphSize.h || !canvasSize.w || !canvasSize.h) return 1;
        const fit = Math.min(
            (canvasSize.w - CANVAS_INSET) / graphSize.w,
            (canvasSize.h - CANVAS_INSET) / graphSize.h
        );
        if (!Number.isFinite(fit) || fit <= 0) return 1;
        return Math.min(MAX_SCALE, Math.max(MIN_SCALE, fit));
    }, [graphSize, canvasSize]);

    const selected = selectedId ? model.byId.get(selectedId) ?? null : null;
    const path = selected ? ancestorPath(model, selected) : [];

    const renderNode = (node: TreeTurnNode): React.ReactNode => {
        const color = scoreToColor(node.score);
        const onBestPath = model.bestPath.has(node.id);
        const scored = typeof node.score === 'number';
        const label = `Round ${node.depth} · ${scored ? `judge score ${Math.round(node.score!)}/10` : 'not scored'}`;
        return (
            <li key={node.id} className={onBestPath ? 'tree-branch--best' : undefined}>
                <button
                    type="button"
                    className={`tree-node ${node.id === model.bestId ? 'tree-node--best' : ''}`}
                    onClick={() => setSelectedId(node.id)}
                    title={label}
                    aria-label={label}
                >
                    <span className="tree-node__circle" style={{ backgroundColor: color }}>
                        {scored ? Math.round(node.score!) : '—'}
                    </span>
                    <span className="tree-node__preview">
                        {node.prompt ? truncate(node.prompt) : 'No attacker prompt'}
                    </span>
                </button>
                {node.children.length > 0 && <ul>{node.children.map(renderNode)}</ul>}
            </li>
        );
    };

    if (model.nodeCount === 0) {
        return (
            <div className="attack-tree">
                <div className="attack-tree__empty">No escalation tree to show.</div>
            </div>
        );
    }

    return (
        <div className="attack-tree">
            <div className="attack-tree__header">
                <span className="attack-tree__title">
                    <GitBranch size={14} /> Escalation tree
                </span>
                <span className="attack-tree__meta">
                    {model.nodeCount} turn{model.nodeCount === 1 ? '' : 's'} ·{' '}
                    {model.maxDepth} round{model.maxDepth === 1 ? '' : 's'} ·{' '}
                    {(conversationChat ?? []).length} path
                    {(conversationChat ?? []).length === 1 ? '' : 's'}
                </span>
                <span className="attack-tree__hint">Click a node for the full turn</span>
            </div>

            <div className="attack-tree__canvas" ref={canvasRef}>
                {/* Sized to the scaled tree so centering and scrolling stay exact,
                    since a transform does not affect layout on its own. */}
                <div
                    className="attack-tree__fit"
                    style={
                        graphSize.w
                            ? { width: graphSize.w * scale, height: graphSize.h * scale }
                            : undefined
                    }
                >
                    <div
                        className="attack-tree__scale"
                        ref={graphRef}
                        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
                    >
                        <ul className="attack-tree__graph">
                            <li>
                                <div className="tree-goal" title={goal ?? 'Attack goal'}>
                                    <span className="tree-goal__circle">
                                        <Target size={15} color="rgb(187, 58, 58)" />
                                    </span>
                                    <span className="tree-goal__label">Goal</span>
                                    <span className="tree-goal__preview">
                                        {goal ? truncate(goal, 64) : 'Attack goal'}
                                    </span>
                                </div>
                                {model.roots.length > 0 && <ul>{model.roots.map(renderNode)}</ul>}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <Modal
                opened={selected !== null}
                onClose={() => setSelectedId(null)}
                title={selected ? `Escalation round ${selected.depth}` : ''}
                size="46rem"
                scrollAreaComponent={ScrollArea.Autosize}
                centered
                styles={{
                    content: {
                        borderRadius: '16px',
                        backgroundColor: 'color-mix(in hsl, var(--bg-dark) 50%, var(--bg) 50%)',
                        border: '1px solid #444',
                        boxShadow: '0 24px 70px rgba(0, 0, 0, 0.45)',
                        color: 'white',
                    },
                    header: {
                        backgroundColor: 'color-mix(in hsl, var(--bg-dark) 50%, var(--bg) 50%)',
                        borderBottom: '1px solid #444',
                    },
                    title: {
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: 'white',
                    },
                    body: {
                        padding: '14px',
                    },
                }}
            >
                {selected && (
                    <div className="tree-turn">
                        <div className="tree-turn__summary">
                            <span
                                className="tree-turn__score"
                                style={{ backgroundColor: scoreToColor(selected.score) }}
                            >
                                {typeof selected.score === 'number'
                                    ? `Judge score ${Math.round(selected.score)}/10`
                                    : 'Not scored'}
                            </span>
                            <span className="tree-turn__stat">
                                <span className="tree-turn__stat-value">{selected.depth}</span>
                                <span className="tree-turn__stat-label">Round</span>
                            </span>
                            <span className="tree-turn__stat">
                                <span className="tree-turn__stat-value">
                                    {selected.children.length}
                                </span>
                                <span className="tree-turn__stat-label">Branches</span>
                            </span>
                            <span className="tree-turn__stat">
                                <span className="tree-turn__stat-value">
                                    {selected.chatIndices.length}
                                </span>
                                <span className="tree-turn__stat-label">Paths</span>
                            </span>
                        </div>

                        {/* Ancestors of this turn — click to walk back up the branch. */}
                        {path.length > 1 && (
                            <div className="tree-turn__path">
                                <span className="tree-turn__path-label">Branch</span>
                                {path.map((step, i) => (
                                    <React.Fragment key={step.id}>
                                        {i > 0 && <span className="tree-turn__path-sep">›</span>}
                                        <button
                                            type="button"
                                            className={`tree-turn__path-step ${step.id === selected.id ? 'active' : ''}`}
                                            style={{ borderColor: scoreToColor(step.score) }}
                                            onClick={() => setSelectedId(step.id)}
                                        >
                                            {step.depth}
                                        </button>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}

                        {selected.improvement && (
                            <div className="tree-turn__section">
                                <span className="bubble-label">
                                    <TrendingUp size={12} /> Escalation rationale
                                </span>
                                <p className="tree-turn__improvement">{selected.improvement}</p>
                            </div>
                        )}

                        <div className="tree-turn__section">
                            <span className="bubble-label">
                                <Flame size={12} /> Attacker prompt
                            </span>
                            <Bubble msg={selected.prompt || '—'} user={true} loading={false} />
                        </div>

                        <div className="tree-turn__section">
                            <span className="bubble-label">
                                <Bot size={12} /> Target response
                            </span>
                            {selected.response ? (
                                <Bubble
                                    msg={selected.response}
                                    user={false}
                                    score={selected.score}
                                    loading={false}
                                />
                            ) : (
                                <p className="tree-turn__empty">
                                    The target produced no response for this step.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AttackTree;
