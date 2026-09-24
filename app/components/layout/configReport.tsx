import {File, HardDrive} from 'lucide-react';
import {JsonRepository} from '@/components/client/repository/jsonRepository';

/** Legacy report configuration kept for consumers of the old layout API. */
export const reportSection = {
    id: 'report_loader',
    title: 'Report',
    description: 'Browse generated reports.',
    Icon: File,
    buttons: [
        {id: 'repo-model-report', name: 'Repository Model', Icon: HardDrive, child: <JsonRepository/>},
    ],
};
