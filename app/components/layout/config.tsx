import { Task } from "@/interfaces/NNInterfaces";
import { ChartLine, TestTube, SquareActivity, Ruler, Image, ChartScatter, Bot, BookCopy, ShieldX, CircleCheck, Eraser, Crop, Database, LucideIcon, Info, FileText, BarChart3 } from "lucide-react";


// These are the major buttons to show on the homepage
export const AvailableTasks: Task[] = [
    {
        title: "Data Quality",
        Icon: FileText,
        description: 'View the analysis on the loaded dataset.',
        footer: "See Analysis",
        color: "linear-gradient(to bottom right, #059669, #533A71)",
        href: "/pages/tasks/dataquality/datasets",
    },
    {
        title: "RedTeaming Tool",
        Icon: BarChart3,
        footer: "Start Benchmark",
        color: "linear-gradient(to bottom right, #3b82f6, red)",
        description: 'Allows a vulnerability assesment on the selected model and generates a detailed performance reports across multiple attack vectors.',
        href: "/pages/tasks/redteam/benchmark"
    },
    {
        title: "Custom Attack",
        Icon: TestTube,
        description: 'Test individual adversarial attacks with custom parameters and visualize the results.',
        footer: "Execute Test",
        color: "linear-gradient(to bottom right, #9333ea, #7c3aed)",
        href: "/pages/tasks/redteam/test"
    }
]

export interface NavigationSection {
    id: string;
    title: string;
    Icon: LucideIcon;
    href?: string;
    items?: NavigationSection[];
    requiresEmbeddings?: boolean
}


export const DQsections: NavigationSection[] = [
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
                title: 'Clean Duplicates',
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
];



export const TitannSections: NavigationSection[] = [
    {
        id: 'home',
        title: 'Benchmark',
        href: '/pages/tasks/redteam/benchmark',
        Icon: ChartLine,
    },
    {
        id: 'test',
        title: 'Test',
        href: '/pages/tasks/redteam/test',
        Icon: TestTube,
    },
    {
        id: 'management',
        title: 'Vulnerabilities Management',
        href: '/pages/tasks/redteam/management',
        Icon: Info,
    },
];