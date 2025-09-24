import { BenchmarkDataProps } from "@/interfaces/reportInterfaces";
// Mock data for demonstration

const lenBench = 30

export const benchmarkData: BenchmarkDataProps = {
    robustness: Array.from({ length: lenBench }, () => Math.random() * 100),
    wobbliness: Array.from({ length: lenBench }, () => Math.random() * 100),
    accuracy: Array.from({ length: lenBench }, () => Math.random()),
    params: Array.from({ length: lenBench }, () => Math.ceil(Math.random() * 1e10))
}

