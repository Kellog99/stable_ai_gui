import IForestConfig from "./accuracyConfigs/IForestConfig";
import MahalanobisConfig from "./accuracyConfigs/MahalanobisConfig";

interface OutliersConfigProp{
    mode: string
}

export default function OutliersConfig (props: OutliersConfigProp)
{
    const metricComponentMap: Record<string, React.ComponentType> = {
        "Mahalanobis": MahalanobisConfig,
        "Isolation Forest": IForestConfig,
    };

    const MetricConfigComponent = metricComponentMap[ props.mode ];
    return ( 
    <>
    { MetricConfigComponent ? <MetricConfigComponent /> : <div>Unsupported metric</div> }
    </>)
}