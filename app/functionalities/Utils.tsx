import Dataset from "@/interfaces/genericInterface";
import { label_type } from "@/properties/types";
import featureLoader from "./FeatureLoader";
import { IconAlertTriangle, IconCheck, IconUpload, IconX } from "@tabler/icons-react";

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
    if (from === nameFeature1) {
      const targetType = getFeatureType(to);
      if (targetType === typeFeature2) {
        if (nameFeature2 === undefined) {
          matches.push(to);
        } else if (to === nameFeature2) {
          return true;
        }
      }
    }
  }
  if (matches && matches.length > 0) {
    return matches
  } else {
    return false;
  }
}

export async function IsFeatureSameLength(
  dataset: Dataset,
  featureLength: number
): Promise<string[]> {
  console.log("RX", dataset)
  if (Array.isArray(dataset?.features)) {
    const extractedFeatures = dataset.features
      .filter(({ type }) => type === label_type)
      .map(({ name }) => name);

    // Run featureLoader for each label
    const featureResults = await Promise.all(
      extractedFeatures.map((label) => featureLoader(dataset.name, label))
    );
    // Filter based on datas.length and return corresponding names
    const labelFeature = extractedFeatures.filter((_, i) => featureResults[i].datas.length === featureLength);


    return labelFeature;
  }

  return [];
}
export function IsFeaturePresent(
  dataset: Dataset,
  featureType: string
): boolean {

  if (dataset.features.some((f) => f.type === featureType)) {
    return true
  } else {
    return false
  };
}


export const darkenColor = (color: any, percent: number) => {
  let r, g, b;

  if (color.startsWith('#')) {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (color.startsWith('rgb')) {

    const rgbValues = color.match(/\d+/g);

    r = parseInt(rgbValues[0]);
    g = parseInt(rgbValues[1]);
    b = parseInt(rgbValues[2]);
  } else {
    // fallback for named colors (simplest: return original)
    return color;
  }

  // Darken each channel
  r = Math.max(0, Math.min(255, r - (r * percent) / 100));
  g = Math.max(0, Math.min(255, g - (g * percent) / 100));
  b = Math.max(0, Math.min(255, b - (b * percent) / 100));

  return `rgb(${r}, ${g}, ${b})`;
};


export const getStatusColor = (uploadStatus: string) => {
  if (uploadStatus === 'success') return '#81c498ff';
  if (uploadStatus === 'error') return '#FF6961';
  if (uploadStatus === 'warning') return "#FFB347"
  return '#6ca3b5ff';
};

export const getStatusIcon = (uploadStatus: string) => {
  if (uploadStatus === 'success') return <IconCheck size={20} />;
  if (uploadStatus === 'error') return <IconX size={20} />;
  if (uploadStatus === "warning") return <IconAlertTriangle size={20} />;
  return <IconUpload size={20} />;
};



// Color scheme for different risk levels
export function getRiskColor(value: number) {
  // Clamp the value between 0 and 100
  value = Math.max(0, Math.min(100, value));

  // Normalize to 0-1 range
  const t = value / 100;

  // Light green RGB values
  const lightGreen = { r: 144, g: 238, b: 144 };

  // Dark red RGB values
  const darkRed = { r: 139, g: 0, b: 0 };

  // Interpolate between the colors
  const r = Math.round(lightGreen.r + (darkRed.r - lightGreen.r) * t);
  const g = Math.round(lightGreen.g + (darkRed.g - lightGreen.g) * t);
  const b = Math.round(lightGreen.b + (darkRed.b - lightGreen.b) * t);

  // Return as RGB string
  return `rgb(${r}, ${g}, ${b})`;
}

export function getRobustnessColor(value: number) {
  // Clamp the value between 0 and 100
  value = Math.max(0, Math.min(100, value));

  // Normalize to 0-1 range
  const t = value / 100;

  // Dark red for low values
  const darkRed = { r: 139, g: 0, b: 0 };

  // Light green for high values
  const lightGreen = { r: 144, g: 238, b: 144 };

  // Interpolate from red → green
  const r = Math.round(darkRed.r + (lightGreen.r - darkRed.r) * t);
  const g = Math.round(darkRed.g + (lightGreen.g - darkRed.g) * t);
  const b = Math.round(darkRed.b + (lightGreen.b - darkRed.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}