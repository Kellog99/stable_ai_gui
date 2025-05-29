import Dataset from "@/interfaces/DatasetInterface";

export function getScoreColor(score: number) {
  if (score >= 0.8) {
    return 'green';
  } else if (score >= 0.5) {
    return 'yellow';
  } else {
    return 'red';
  }
}

export function IsFeatureBond(
    dataset: Dataset,
    nameFeature1: string,
    typeFeature2: string,
    nameFeature2?: string
    ): boolean | string | string[] {

    const getFeatureType = (name: string): string | undefined => {
        const feature = dataset.features.find((f) => f.name === name);
        return feature?.type;
    };

    const matches: string[] = [];

    for (const [from, to] of dataset.edges) {
        console.log("TOOOO",from,to)
        if (from === nameFeature1) {
        const targetType = getFeatureType(to);
        console.log("TARGET_TYPE",targetType)
        if (targetType === typeFeature2) {
            if (nameFeature2 === undefined) {
             console.log("TOINT",to)
             matches.push(to);
             //return matches;
            } else if (to === nameFeature2) {
            return true; 
            }
        }
        }
    }
    if (matches && matches.length > 0){
      return matches
    } else {
    return false;
    }
    }

export function IsFeaturePresent(
  dataset: Dataset, 
  featureType: string
) : boolean {

  if (dataset.features.some((f) => f.type === featureType)) {
    return true
  } else {
    return false
  };
  
}