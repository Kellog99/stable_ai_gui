"use client";
import React, { useState, useEffect, useRef } from "react";
import  './ModelInversion.css';

export default function ModelInversion() {
    const [activeTab, setActiveTab] = useState("inversion");
    const [log, setLog] = useState(["Ready to start attack..."]);
    const [attributes, setAttributes] = useState([]);
    const canvasRef = useRef(null);

    const runInversion = () => {
        setLog([]);
        const iterations = [
            { iter: 0, loss: 2.45, text: "Initializing random input..." },
            { iter: 50, loss: 1.82, text: "Computing gradients..." },
            { iter: 100, loss: 1.24, text: "Backpropagating..." },
            { iter: 200, loss: 0.81, text: "Optimizing reconstruction..." },
            { iter: 300, loss: 0.52, text: "Applying regularization..." },
            { iter: 500, loss: 0.30, text: "Refining features..." },
            { iter: 700, loss: 0.18, text: "Converging..." },
            { iter: 1000, loss: 0.09, text: "Complete!" }
        ];

        iterations.forEach((item, i) => {
            setTimeout(() => {
                setLog(prev => [
                    ...prev,
                    `[Iter ${item.iter}] Loss: ${item.loss} - ${item.text}`
                ]);
                drawCanvas(item.iter / 1000);
            }, i * 700);
        });
    };

    const drawCanvas = (progress) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;

        const img = ctx.createImageData(w, h);
        const data = img.data;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                const dist = Math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2);

                const noise = Math.random() * (1 - progress) * 50;
                const signal = progress * (200 - dist * 0.8);
                const v = Math.max(0, Math.min(255, signal + noise));

                data[i] = v;
                data[i + 1] = v * 0.9;
                data[i + 2] = v * 0.8;
                data[i + 3] = 255;
            }
        }

        ctx.putImageData(img, 0, 0);
    };

    const runAttributeInference = () => {
        setAttributes([]);
        setTimeout(() => {
            setAttributes([
                { name: "Age", value: "34–38", conf: 87 },
                { name: "Gender", value: "Male", conf: 92 },
                { name: "Marital Status", value: "Married", conf: 73 }
            ]);
        }, 1500);
    };

    return (
        <div className="container">
            <div className="header">
                <h1 className="title">Model Inversion</h1>
                <p className="subtitle">
                    Reconstruction & Attribute Inference Framework
                </p>
            </div>

            {/* Tabs */}
            <div className="nav-tabs">
                {["inversion", "attribute", "gradient"].map(tab => (
                    <button
                        key={tab}
                        className={`nav-tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Inversion */}
            {activeTab === "inversion" && (
                <>
                    <div className="panel">
                        <button className="btn primary" onClick={runInversion}>
                            Start Reconstruction
                        </button>
                    </div>

                    <div className="grid">
                        <canvas ref={canvasRef} width={256} height={256} />
                        <div className="log">
                            {log.map((l, i) => (
                                <div key={i}>{l}</div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Attribute */}
            {activeTab === "attribute" && (
                <>
                    <button className="btn primary" onClick={runAttributeInference}>
                        Infer Attributes
                    </button>

                    <div className="panel">
                        {attributes.map((a, i) => (
                            <div key={i} className="attribute">
                                <div>{a.name}</div>
                                <div>{a.value}</div>
                                <div className="bar">
                                    <div
                                        className="fill"
                                        style={{ width: `${a.conf}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Gradient */}
            {activeTab === "gradient" && (
                <div className="panel">
                    <p>Gradient attack simulation output...</p>
                </div>
            )}
        </div>
    );
}