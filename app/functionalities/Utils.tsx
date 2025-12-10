import { IconAlertTriangle, IconCheck, IconUpload, IconX } from "@tabler/icons-react";


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
