// ClientComponent.js
// This component displays the pre-rendered content on the client
"use client"; // Mark this as a Client Component

import React from 'react';

export default function ClientComponent({ children }) {
  return (
    <div className="client-component">
      <h2>Client-side Component</h2>
      <div className="image-container">
        {/* The children prop will contain the pre-rendered HTML from the ServerComponent */}
        {children}
      </div>
    </div>
  );
}