import { reportFetch_get } from "@/properties/urlsNNTrust";
import React from "react";

interface OpenPdfButtonProps {
  param1: string;
  param2: string;
}

const OpenPdfButton: React.FC<OpenPdfButtonProps> = ({ param1, param2 }) => {
  const openBase64Pdf = (base64: string) => {
    let cleaned = base64;
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
    }
    const byteCharacters = atob(cleaned);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");
  };

  const handleClick = async () => {
    try {
      // Build query URL
      const url = `${reportFetch_get}?id=${encodeURIComponent(param1)}&pdf_report=${encodeURIComponent(param2)}`;
      const response = await fetch(url);
      const base64 = await response.text(); // service returns raw base64 string

      if (!base64) {
        console.error("Empty Base64 received");
        return;
      }

      openBase64Pdf(base64);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{ padding: "2px 10px", cursor: "pointer" }}
    >
      <p style={{fontWeight: "600"}}>Open PDF</p>
    </button>
  );
};

export default OpenPdfButton;
