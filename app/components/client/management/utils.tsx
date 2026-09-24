import {CheckCircle2, Clock, Loader, XCircle} from 'lucide-react';
import type {AttackStatus} from '@/interfaces/NNInterfaces';

export const statusLabels = {
    pending: 'Pending',
    'in progress': 'In progress',
    finished: 'Finished',
    error: 'Error',
} as const satisfies Record<AttackStatus, string>;

export const getStatusLabel = (status: AttackStatus): string => statusLabels[status];

export const getStatusIcon = (status: AttackStatus) => {
    switch (status) {
        case 'finished':
            return <CheckCircle2 size={20} className="status-icon completed"/>;
        case 'in progress':
            return <Loader size={20} className="status-icon in-progress"/>;
        case 'pending':
            return <Clock size={20} className="status-icon pending"/>;
        case 'error':
            return <XCircle size={20} className="status-icon closed"/>;
        default:
            return <Clock size={20} className="status-icon"/>;
    }
};

export const getStatusColor: (status: AttackStatus) => string = (status: AttackStatus) => {
    switch (status) {
        case 'finished':
            return 'status-completed';
        case 'in progress':
            return 'status-in-progress';
        case 'pending':
            return 'status-pending';
        case 'error':
            return 'status-closed';
        default:
            return '';
    }
};
