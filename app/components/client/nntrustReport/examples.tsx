import { ReportProps } from "@/interfaces/reportInterfaces";
// Mock data for demonstration
const mockData: ReportProps = {
    info: {
        name: 'ResNet-50',
        description: 'Deep residual network with 50 layers',
        parameters: 25000000,
        classNames: ['class_0', 'class_1', 'class_2', 'class_3', 'class_4', 'class_5', 'class_6', 'class_7', 'class_8', 'class_9'],

    },
    metrics:
    {
        accuracy: 0.76,
        precision: 0.75,
        f1_score: 0.74,
        confusion_matrix: Array(10).fill().map(() => Array(10).fill().map(() => Math.floor(Math.random() * 100))),
    },
    attacks: {
        "fgsm": {
            accuracy: 0.23,
            precision: 0.21,
            f1_score: 0.22,
            misclassification: 77,
            power: 0.031,
            num_queries: 1,
            robustness: [0.23, { '0': 0.1, '1': 0.3, '2': 0.5, '3': 0.2, '4': 0.4 }],
            confusion_matrix: Array(10).fill().map(() => Array(10).fill().map(() => Math.floor(Math.random() * 100)))
        },
        "pgd": {
            accuracy: 0.15,
            precision: 0.14,
            f1_score: 0.16,
            misclassification: 85,
            power: 0.031,
            num_queries: 40,
            robustness: [0.15, { '0': 0.05, '1': 0.2, '2': 0.3, '3': 0.1, '4': 0.25 }],
            confusion_matrix: Array(10).fill().map(() => Array(10).fill().map(() => Math.floor(Math.random() * 100)))
        }
    }
};

export default mockData