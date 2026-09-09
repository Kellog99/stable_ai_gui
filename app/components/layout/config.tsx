import {
    ChartLine,
    TestTube,
    LucideIcon,
    Info,
    FileText,
    HatGlasses,
    LockKeyholeOpenIcon,
    Home,
    Fence,
    BookCopy,
    Bot,
    ChartScatter,
    CircleCheck,
    Crop,
    Database,
    Eraser,
    Ruler,
    ShieldX,
    SquareActivity,
    Camera
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
    "Home": [
        {
            id: 'home',
            title: 'Homepage',
            href: '/',
            Icon: Home,
        }
    ],
    // "Data Quality":
    //     [
    //         {
    //             id: "dataset",
    //             title: "Dataset",
    //             Icon: Database,
    //             href: "/pages/tasks/dataquality/datasets"
    //         },
    //         {
    //             id: 'visualization',
    //             title: 'Visualization',
    //             Icon: Camera,
    //             items: [
    //                 {
    //                     id: 'embeddings',
    //                     title: 'Embeddings',
    //                     href: '/pages/tasks/dataquality/embeddings',
    //                     Icon: ChartScatter,
    //                     requiresEmbeddings: true,

    //                 },
    //                 {
    //                     id: 'prototypes',
    //                     title: 'Prototypes',
    //                     href: '/pages/tasks/dataquality/prototypes',
    //                     Icon: Bot,
    //                     requiresEmbeddings: true,

    //                 },
    //             ],
    //         },
    //         {
    //             id: 'metrics',
    //             title: 'Metrics',
    //             Icon: Ruler,
    //             items: [
    //                 {
    //                     id: 'duplicates',
    //                     title: 'Duplicates',
    //                     href: '/pages/tasks/dataquality/metrics/duplicates',
    //                     Icon: BookCopy,
    //                     requiresEmbeddings: true,

    //                 },
    //                 {
    //                     id: 'outliers',
    //                     title: 'Outliers',
    //                     href: '/pages/tasks/dataquality/metrics/outliers',
    //                     Icon: ShieldX,
    //                     requiresEmbeddings: true,

    //                 },
    //                 {
    //                     id: 'completeness',
    //                     title: 'Completeness',
    //                     href: '/pages/tasks/dataquality/metrics/completeness',
    //                     Icon: CircleCheck,
    //                     requiresEmbeddings: true,

    //                 },
    //             ],
    //         },
    //         {
    //             id: 'actions',
    //             title: 'Actions',
    //             Icon: SquareActivity,
    //             items: [
    //                 {
    //                     id: 'embedder',
    //                     title: 'Embedder',
    //                     href: '/pages/tasks/dataquality/actions/embeddings',
    //                     Icon: ChartScatter,
    //                 },
    //                 {
    //                     id: 'cleanDuplicates',
    //                     title: 'Cleaninig',
    //                     href: '/pages/tasks/dataquality/actions/cleanDuplicates',
    //                     Icon: Eraser,
    //                     requiresEmbeddings: true,
    //                 },
    //                 {
    //                     id: 'cropping',
    //                     title: 'Cropping',
    //                     href: '/pages/tasks/dataquality/actions/cropping',
    //                     Icon: Crop
    //                 },
    //             ],
    //         },
    //     ],

    "Red Teaming": [
        {
            id: 'test',
            title: 'Test',
            href: '/pages/tasks/redteam/test',
            Icon: TestTube,
            items: [
                {
                    id: 'evasion',
                    title: 'Evasion',
                    href: '/pages/tasks/redteam/test/evasion',
                    Icon: LockKeyholeOpenIcon,
                },
                {
                    id: 'privacy',
                    title: 'Privacy',
                    href: '/pages/tasks/redteam/test/privacy',
                    Icon: HatGlasses,
                },
                {
                    id: 'jailbreaking',
                    title: 'Jailbreak',
                    href: '/pages/tasks/redteam/test/jailbreak',
                    Icon: Fence,
                },

            ]
        },

        {
            id: 'bench',
            title: 'Benchmark',
            href: '/pages/tasks/redteam/benchmark',
            Icon: ChartLine,
        },
        {
            id: 'management',
            title: 'Jobs Info',
            href: '/pages/tasks/redteam/management',
            Icon: Info,
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


