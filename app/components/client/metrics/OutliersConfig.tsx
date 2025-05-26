import IForestConfig from "./accuracyConfigs/IForestConfig";
import KNNConfig from "./accuracyConfigs/KNNConfig";
import LOFConfig from "./accuracyConfigs/LOFConfig";
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
        "KNN" : KNNConfig,
        "LOF": LOFConfig
    };

    const MetricConfigComponent = metricComponentMap[ props.mode ];
    return ( 
    <>
    { MetricConfigComponent ? <MetricConfigComponent /> : <div>Unsupported metric</div> }
    </>)
}