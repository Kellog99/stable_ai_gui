"use client";

import { useEffect, useState } from 'react';
import { Modal, ScrollArea } from '@mantine/core';
import { History, Check, X, Loader2, RefreshCw } from 'lucide-react';
import useBackendVariablesStore from '@/store/globalStore';
import { JailbreakAttackOutput, JailbreakHistoryEntry } from '@/interfaces/testInterfaces';
import './SavedAttacksBoard.css';

interface SavedAttacksBoardProps {
    attackId: string | null;
    attackName?: string;
    onSelect: (output: JailbreakAttackOutput) => void;
}

/** Best-effort human readable timestamp for a saved run. */
function formatSavedAt(saved_at: string): string {
    const date = new Date(saved_at);
    if (Number.isNaN(date.getTime())) return saved_at;
    return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

const SavedAttacksBoard: React.FC<SavedAttacksBoardProps> = ({ attackId, attackName, onSelect }) => {
    const { hostname, port } = useBackendVariablesStore();

    const [open, setOpen] = useState(false);
    const [entries, setEntries] = useState<JailbreakHistoryEntry[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = () => {
        if (!hostname || !port || !attackId) return;
        setLoadingList(true);
        setError(null);
        fetch(`http://${hostname}:${port}/test/jailbreaking/history?attack_id=${encodeURIComponent(attackId)}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data: JailbreakHistoryEntry[]) => setEntries(data))
            .catch((err) => {
                console.error('Failed to load saved attacks:', err);
                setError('Failed to load saved attacks.');
                setEntries([]);
            })
            .finally(() => setLoadingList(false));
    };

    // Refresh the board whenever it's opened, or the selected attack changes while it's open.
    useEffect(() => {
        if (open) fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, attackId, hostname, port]);

    const handleSelect = (entry: JailbreakHistoryEntry) => {
        if (!hostname || !port || !attackId) return;
        setLoadingId(entry.id);
        setError(null);
        fetch(`http://${hostname}:${port}/test/jailbreaking/history/${encodeURIComponent(attackId)}/${encodeURIComponent(entry.id)}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data: JailbreakAttackOutput) => {
                onSelect(data);
                setOpen(false);
            })
            .catch((err) => {
                console.error('Failed to load saved attack:', err);
                setError('Failed to load the selected attack.');
            })
            .finally(() => setLoadingId(null));
    };

    const handleDelete = (entry: JailbreakHistoryEntry) => {
        if (!hostname || !port || !attackId) return;
        setDeletingId(entry.id);
        setError(null);
        fetch(`http://${hostname}:${port}/test/jailbreaking/history/${encodeURIComponent(attackId)}/${encodeURIComponent(entry.id)}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                setEntries((prev) => prev.filter((e) => e.id !== entry.id));
            })
            .catch((err) => {
                console.error('Failed to delete saved attack:', err);
                setError('Failed to delete the selected attack.');
            })
            .finally(() => setDeletingId(null));
    };

    if (!attackId) return null;

    return (
        <>
            <button
                type="button"
                className={`saved-attacks-toggle ${open ? 'active' : ''}`}
                onClick={() => setOpen(true)}
            >
                <History size={16} />
                Past attacks
                {/* Past attacks{attackName ? ` — ${attackName}` : ''} */}
            </button>

            <Modal
                opened={open}
                onClose={() => setOpen(false)}
                title="Past attacks"
                size="35rem"
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
                <div className="saved-attacks-panel">
                    <div className="saved-attacks-panel__header">
                        <span className="saved-attacks-panel__title">
                            Saved runs{attackName ? ` — ${attackName}` : ''}
                        </span>
                        <button
                            type="button"
                            className="saved-attacks-refresh"
                            onClick={fetchHistory}
                            disabled={loadingList}
                            aria-label="Refresh saved attacks"
                        >
                            <RefreshCw size={14} className={loadingList ? 'spin' : ''} />
                        </button>
                    </div>

                    {error && <div className="saved-attacks-error">{error}</div>}

                    {loadingList ? (
                        <div className="saved-attacks-empty">
                            <Loader2 size={16} className="spin" /> Loading...
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="saved-attacks-empty">No saved runs yet for this attack.</div>
                    ) : (
                        <ul className="saved-attacks-list">
                            {entries.map((entry) => (
                                <li key={entry.id} className="saved-attacks-row">
                                    <button
                                        type="button"
                                        className="saved-attacks-item"
                                        disabled={loadingId !== null}
                                        onClick={() => handleSelect(entry)}
                                    >
                                        <span className={`saved-attacks-badge ${entry.success ? 'success' : 'fail'}`}>
                                            {entry.success ? <Check size={12} /> : <X size={12} />}
                                        </span>
                                        <span className="saved-attacks-item__body">
                                            <span className="saved-attacks-item__goal">{entry.goal}</span>
                                            <span className="saved-attacks-item__meta">
                                                {formatSavedAt(entry.saved_at)}
                                                {typeof entry.best_score === 'number' && ` · ${Math.round(entry.best_score)}/10`}
                                                {` · ${entry.n_attempts} attempt${entry.n_attempts === 1 ? '' : 's'}`}
                                            </span>
                                        </span>
                                        {loadingId === entry.id && <Loader2 size={14} className="spin" />}
                                    </button>
                                    <button
                                        type="button"
                                        className="saved-attacks-delete"
                                        disabled={loadingId !== null || deletingId !== null}
                                        onClick={() => handleDelete(entry)}
                                        aria-label="Delete this saved attack"
                                        title="Delete this saved attack"
                                    >
                                        {deletingId === entry.id
                                            ? <Loader2 size={12} className="spin" />
                                            : <X size={12} />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default SavedAttacksBoard;
