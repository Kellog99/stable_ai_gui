import {
    ChartLine,
    Fence,
    FileText,
    HatGlasses,
    Home,
    Info,
    LockKeyholeOpenIcon,
    LucideIcon,
    TestTube
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
    //             href: "/pages/dataquality/datasets"
    //         },
    //         {
    //             id: 'visualization',
    //             title: 'Visualization',
    //             Icon: Camera,
    //             items: [
    //                 {
    //                     id: 'embeddings',
    //                     title: 'Embeddings',
    //                     href: '/pages/dataquality/embeddings',
    //                     Icon: ChartScatter,
    //                     requiresEmbeddings: true,

    //                 },
    //                 {
    //                     id: 'prototypes',
    //                     title: 'Prototypes',
    //                     href: '/pages/dataquality/prototypes',
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
    //                     href: '/pages/dataquality/metrics/duplicates',
    //                     Icon: BookCopy,
    //                     requiresEmbeddings: true,

    //                 },
    //                 {
    //                     id: 'outliers',
    //                     title: 'Outliers',
    //                     href: '/pages/dataquality/metrics/outliers',
    //                     Icon: ShieldX,
    //                     requiresEmbeddings: true,

    //                 },
    //                 {
    //                     id: 'completeness',
    //                     title: 'Completeness',
    //                     href: '/pages/dataquality/metrics/completeness',
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
    //                     href: '/pages/dataquality/actions/embeddings',
    //                     Icon: ChartScatter,
    //                 },
    //                 {
    //                     id: 'cleanDuplicates',
    //                     title: 'Cleaninig',
    //                     href: '/pages/dataquality/actions/cleanDuplicates',
    //                     Icon: Eraser,
    //                     requiresEmbeddings: true,
    //                 },
    //                 {
    //                     id: 'cropping',
    //                     title: 'Cropping',
    //                     href: '/pages/dataquality/actions/cropping',
    //                     Icon: Crop
    //                 },
    //             ],
    //         },
    //     ],

    "Red Teaming": [
        {
            id: 'test',
            title: 'Test',
            href: '/pages/redteam/test',
            Icon: TestTube,
            items: [
                {
                    id: 'evasion',
                    title: 'Evasion',
                    href: '/pages/redteam/test/evasion',
                    Icon: LockKeyholeOpenIcon,
                },
                {
                    id: 'privacy',
                    title: 'Privacy',
                    href: '/pages/redteam/test/privacy',
                    Icon: HatGlasses,
                },
                {
                    id: 'jailbreaking',
                    title: 'Jailbreak',
                    href: '/pages/redteam/test/jailbreak',
                    Icon: Fence,
                },

            ]
        },

        {
            id: 'bench',
            title: 'Benchmark',
            href: '/pages/redteam/benchmark',
            Icon: ChartLine,
        },
        {
            id: 'management',
            title: 'Jobs Info',
            href: '/pages/redteam/management',
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


