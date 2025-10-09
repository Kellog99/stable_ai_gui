import { ChartLine, TestTube, SquareActivity, Ruler, Image, ChartScatter, Bot, BookCopy, ShieldX, CircleCheck, Eraser, Crop } from "lucide-react";


export interface NavigationSection {
    key: string;
    title: string;
    icon: any;
    href?: string;
    items?: NavigationSection[];
}



export const DQsections: NavigationSection[] = [
    {
        key: 'visualization',
        title: 'Visualization',
        icon: Image,
        items: [
            {
                key: 'embeddings',
                title: 'Embeddings',
                href: '/pages/dataquality/embeddings',
                icon: ChartScatter,
                // requiresEmbeddings: true,

            },
            {
                key: 'prototypes',
                title: 'Prototypes',
                href: '/pages/dataquality/prototypes',
                icon: Bot,
                // requiresEmbeddings: true,

            },
        ],
    },
    {
        key: 'metrics',
        title: 'Metrics',
        icon: Ruler,
        items: [
            {
                key: 'duplicates',
                title: 'Duplicates',
                href: '/pages/dataquality/metrics/duplicates',
                icon: BookCopy,
                // requiresEmbeddings: true,

            },
            {
                key: 'outliers',
                title: 'Outliers',
                href: '/pages/dataquality/metrics/outliers',
                icon: ShieldX,
                // requiresEmbeddings: true,

            },
            {
                key: 'completeness',
                title: 'Completeness',
                href: '/pages/dataquality/metrics/completeness',
                icon: CircleCheck,
                // requiresEmbeddings: true,

            },
        ],
    },
    {
        key: 'actions',
        title: 'Actions',
        icon: SquareActivity,
        items: [
            {
                key: 'embedder',
                title: 'Embedder',
                href: '/pages/dataquality/actions/embeddings',
                icon: ChartScatter,
            },
            {
                key: 'cleanDuplicates',
                title: 'Clean Duplicates',
                href: '/pages/dataquality/actions/cleanDuplicates',
                icon: Eraser
                // requiresEmbeddings: true,
            },
            {
                key: 'cropping',
                title: 'Cropping',
                href: '/pages/dataquality/actions/cropping',
                icon: Crop
            },
        ],
    },
];



export const TitannSections: NavigationSection[] = [
    {
        key: 'home',
        title: 'Benchmark',
        href: '/pages/tasks/redteam/benchmark',
        icon: ChartLine,
    },
    {
        key: 'test',
        title: 'Test',
        href: '/pages/tasks/redteam/test',
        icon: TestTube,
    },
];