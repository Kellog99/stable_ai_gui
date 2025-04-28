import IForestConfig from "./accuracyConfigs/IForestConfig";
import LUNARConfig from "./accuracyConfigs/LUNARConfig";
import MahalanobisConfig from "./accuracyConfigs/MahalanobisConfig";

interface OutliersConfigProp{
    mode: string
}

export default function OutliersConfig (props: OutliersConfigProp)
{
    const metricComponentMap: Record<string, React.ComponentType> = {
        "mahalanobis": MahalanobisConfig,
        "isolation forest": IForestConfig,
        "lunar": LUNARConfig,
    };

    const MetricConfigComponent = metricComponentMap[ props.mode ];
    return ( 
    <>
    { MetricConfigComponent ? <MetricConfigComponent /> : <div>Unsupported metric</div> }
    </>)
}