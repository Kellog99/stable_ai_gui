import {
    SquareActivity,
    Ruler,
    Image,
    ChartScatter,
    Bot,
    BookCopy,
    ShieldX,
    CircleCheck,
    Eraser,
    Crop,
    Database,
    LucideIcon,
    FileText
} from "lucide-react";


export interface NavigationSection {
    id: string;
    title: string;
    Icon: LucideIcon;
    href?: string;
    items?: NavigationSection[];
    requiresEmbeddings?: boolean
}


export const sections: { [key: string]: NavigationSection[] } = {
    "Data Quality":
        [
            {
                id: "dataset",
                title: "Dataset",
                Icon: Database,
                href: "/pages/tasks/dataquality/datasets"
            },
            {
                id: 'visualization',
                title: 'Visualization',
                Icon: Image,
                items: [
                    {
                        id: 'embeddings',
                        title: 'Embeddings',
                        href: '/pages/tasks/dataquality/embeddings',
                        Icon: ChartScatter,
                        requiresEmbeddings: true,

                    },
                    {
                        id: 'prototypes',
                        title: 'Prototypes',
                        href: '/pages/tasks/dataquality/prototypes',
                        Icon: Bot,
                        requiresEmbeddings: true,

                    },
                ],
            },
            {
                id: 'metrics',
                title: 'Metrics',
                Icon: Ruler,
                items: [
                    {
                        id: 'duplicates',
                        title: 'Duplicates',
                        href: '/pages/tasks/dataquality/metrics/duplicates',
                        Icon: BookCopy,
                        requiresEmbeddings: true,

                    },
                    {
                        id: 'outliers',
                        title: 'Outliers',
                        href: '/pages/tasks/dataquality/metrics/outliers',
                        Icon: ShieldX,
                        requiresEmbeddings: true,

                    },
                    {
                        id: 'completeness',
                        title: 'Completeness',
                        href: '/pages/tasks/dataquality/metrics/completeness',
                        Icon: CircleCheck,
                        requiresEmbeddings: true,

                    },
                ],
            },
            {
                id: 'actions',
                title: 'Actions',
                Icon: SquareActivity,
                items: [
                    {
                        id: 'embedder',
                        title: 'Embedder',
                        href: '/pages/tasks/dataquality/actions/embeddings',
                        Icon: ChartScatter,
                    },
                    {
                        id: 'cleanDuplicates',
                        title: 'Cleaninig',
                        href: '/pages/tasks/dataquality/actions/cleanDuplicates',
                        Icon: Eraser,
                        requiresEmbeddings: true,
                    },
                    {
                        id: 'cropping',
                        title: 'Cropping',
                        href: '/pages/tasks/dataquality/actions/cropping',
                        Icon: Crop
                    },
                ],
            },
        ],
    "Report": [
        {
            id: "report",
            title: "Report",
            href: "/pages/report",
            Icon: FileText
        }
    ]
};


