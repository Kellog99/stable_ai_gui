import { ReportProps, BenchmarkDataProps } from "@/interfaces/reportInterfaces";
// Mock data for demonstration

const lenBench = 30

export const
    benchmarkData: BenchmarkDataProps = {
        robustness: Array.from({ length: lenBench }, () => Math.random() * 100),
        wobbliness: Array.from({ length: lenBench }, () => Math.random() * 100),
        accuracy: Array.from({ length: lenBench }, () => Math.random()),
        params: Array.from({ length: lenBench }, () => Math.ceil(Math.random() * 1e10))
    },
    mockData: ReportProps = {
        info: {
            name: "resnetv2_50d_evos.ah_in1k",
            parameters: 25591368,
            classes: 1000,
            dimensionality: [3, 224, 224]
        },
        metrics: {
            params: 290123941,
            robustness: 30.32,
            wobbliness: 10.32,
            accuracy: 0.87,

            confusion_matrix: [
                [0.7, 0.3],
                [0.1, 0.9]
            ]
        },
        attacks:
        {
            "fgsm": {
                name: "fast-gradient sign method",
                risk: 88,
                precision: 0.052403524518013,
                f1score: 0.03702068328857422,
                accuracy: 0.03678151220083237
            },
            "priorgd": {
                name: "prior gradient descent",
                risk: 58,
                precision: 0.05812346562743187,
                f1score: 0.04263010993599892,
                accuracy: 0.05626918002963066
            },
            "broo": {
                name: "aaa",
                risk: 32,
                precision: 0.4465811848640442,
                f1score: 0.44248276948928833,
                accuracy: 0.46011626720428467
            },
            "banditprior": {
                name: "banditi e priori",
                risk: 12,
                precision: 0.4465811848640442,
                f1score: 0.44248276948928833,
                accuracy: 0.46011626720428467
            }
        }
    }

