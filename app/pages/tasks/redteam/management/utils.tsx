import {
    Clock,
    Loader,
    CheckCircle2,
    XCircle
} from 'lucide-react';

export const statuses = ["Completed", "In Progress", "Pending", "Closed"];

export const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Completed':
            return <CheckCircle2 size={20} className="status-icon completed" />;
        case 'In Progress':
            return <Loader size={20} className="status-icon in-progress" />;
        case 'Pending':
            return <Clock size={20} className="status-icon pending" />;
        case 'Closed':
            return <XCircle size={20} className="status-icon closed" />;
        default:
            return <Clock size={20} className="status-icon" />;
    }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Completed':
            return 'status-completed';
        case 'In Progress':
            return 'status-in-progress';
        case 'Pending':
            return 'status-pending';
        case 'Closed':
            return 'status-closed';
        default:
            return '';
    }
};