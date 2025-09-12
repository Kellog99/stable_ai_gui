import { ReportProps } from "@/interfaces/reportInterfaces";
// Mock data for demonstration
const mockData: ReportProps = {
    info: {
        name: "resnetv2_50d_evos.ah_in1k",
        parameters: 25591368,
        classes: 1000,
        dimensionality: [3, 224, 224]
    },
    metrics: {
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
            risk: 88,
            precision: 0.052403524518013,
            f1score: 0.03702068328857422,
            accuracy: 0.03678151220083237
        },
        "priorgd": {
            risk: 58,
            precision: 0.05812346562743187,
            f1score: 0.04263010993599892,
            accuracy: 0.05626918002963066
        },
         "broo": {
            risk: 32,
            precision: 0.4465811848640442,
            f1score: 0.44248276948928833,
            accuracy: 0.46011626720428467
        },
        "banditprior": {
            risk: 12,
            precision: 0.4465811848640442,
            f1score: 0.44248276948928833,
            accuracy: 0.46011626720428467
        }
    }
}

export default mockData