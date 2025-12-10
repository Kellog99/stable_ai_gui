import { Task } from "@/interfaces/NNInterfaces";
import { ChartLine, TestTube, LucideIcon, Info, BarChart3 } from "lucide-react";


export const AvailableTasks: Task[] = [
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