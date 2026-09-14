import {
    Clock,
    Loader,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import type {AttackStatus} from '@/interfaces/NNInterfaces';

export const statusLabels = {
    pending: 'Pending',
    'in progress': 'In Progress',
    finished: 'Finished',
    error: 'Error',
} as const satisfies Record<AttackStatus, string>;

export type AttackStatusLabel = typeof statusLabels[AttackStatus];
export type DisplayStatus = AttackStatus | AttackStatusLabel;

export const statuses: readonly AttackStatusLabel[] = Object.values(statusLabels);

export const getStatusLabel = (status: AttackStatus): AttackStatusLabel => statusLabels[status];

const toStatusLabel = (status: DisplayStatus): AttackStatusLabel =>
    status in statusLabels ? statusLabels[status as AttackStatus] : status as AttackStatusLabel;

export const getStatusIcon = (status: DisplayStatus) => {
    switch (toStatusLabel(status)) {
        case 'Finished':
            return <CheckCircle2 size={20} className="status-icon completed" />;
        case 'In Progress':
            return <Loader size={20} className="status-icon in-progress" />;
        case 'Pending':
            return <Clock size={20} className="status-icon pending" />;
        case 'Error':
            return <XCircle size={20} className="status-icon closed" />;
        default:
            return <Clock size={20} className="status-icon" />;
    }
};

export const getStatusColor = (status: DisplayStatus) => {
    switch (toStatusLabel(status)) {
        case 'Finished':
            return 'status-completed';
        case 'In Progress':
            return 'status-in-progress';
        case 'Pending':
            return 'status-pending';
        case 'Error':
            return 'status-closed';
        default:
            return '';
    }
};
