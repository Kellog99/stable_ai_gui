import React, { useState, useRef, useEffect } from 'react';
import tinycolor from 'tinycolor2';

interface Feature {
  type: string;
  name: string;
}

interface SchemaVisualizationProps {
  features: Feature[];
  connections: [number, number][];
  labelColorMap: Record<string, string>;
}

const SchemaVisualization: React.FC<SchemaVisualizationProps> = ({
  features,
  connections,
  labelColorMap,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({
          width,
          height: Math.max(400, width * 0.5),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const radius = Math.min(dimensions.width, dimensions.height) * 0.08;
  const centerX = dimensions.width * 0.25;
  const centerY = dimensions.height / 2;

  const getCirclePosition = (index: number, total: number) => {
    if (index === 0) {
      return { x: centerX, y: centerY };
    } else {
      const connectedNodesCount = total - 1;
      const rightSectionWidth = dimensions.width * 0.5;
      const spacing = rightSectionWidth / connectedNodesCount;
      const x = centerX + dimensions.width * 0.25 + spacing * (index - 1);
      const yOffset = index % 2 === 0 ? radius : -radius;
      return { x, y: centerY + yOffset };
    }
  };

  const darkenHexColor = (color: string): string => {
    return tinycolor(color).darken(40).toString();
  };

  const maxRadius = features.reduce((max, feature) => {
    const nameParts = feature.name.includes("_") ? feature.name.split("_") : [feature.name];
    const estimatedWidth = Math.max(...nameParts.map(part => part.length)) * 6;
    return Math.max(max, estimatedWidth / 2 + 10);
  }, 20);

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
      >
        {connections.map(([from, to], idx) => {
          const fromPos = getCirclePosition(from, features.length);
          const toPos = getCirclePosition(to, features.length);
          return (
            <line
              key={`connection-${idx}`}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke="#CBD5E1"
              strokeWidth="2"
            />
          );
        })}

        {features.map((feature, idx) => {
          const { x, y } = getCirclePosition(idx, features.length);
          const baseColor = labelColorMap[feature.name] || '#FFABAB';
          const textColor = darkenHexColor(baseColor);
          const nameParts = feature.name.includes("_")
            ? feature.name.split("_").map(part => part === "embeddings" ? "embs" : part)
            : [feature.name === "embeddings" ? "embs" : feature.name];

          return (
            <g 
              key={`feature-${idx}`}
            >
              <circle
                cx={x}
                cy={y}
                r={maxRadius}
                fill={baseColor}
                stroke={textColor}
                strokeWidth="2"
                className="transition-all duration-200 cursor-pointer"
              />
              {nameParts.map((part, index) => (
                <text
                  key={index}
                  x={x}
                  y={y + (index - (nameParts.length - 1) / 2) * 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={textColor}
                  className="text-sm font-medium select-none"
                >
                  {part}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default SchemaVisualization;