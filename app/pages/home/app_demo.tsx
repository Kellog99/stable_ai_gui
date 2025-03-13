import React from 'react';
import DeckGL from '@deck.gl/react';
import {createRoot} from 'react-dom/client';
import {COORDINATE_SYSTEM} from '@deck.gl/core';
import {PointCloudLayer} from '@deck.gl/layers';
import type {PickingInfo} from '@deck.gl/core';



export default async function App() {

  type DataType = {
    position: [x: number, y: number, z: number];
    normal: [nx: number, ny: number, nz: number];
    color: [r: number, g: number, b: number];
  };

  const metadataResponse = await fetch("http://127.0.0.1:8000/get-tsne", { next: { revalidate: 6000 } });
      
  if (!metadataResponse.ok) {
    throw new Error(`API request failed with status ${metadataResponse.status}`);
  }

  const data = await metadataResponse.json();

  const layer = new PointCloudLayer<DataType>({
    id: 'PointCloudLayer',
    data: data,
    
    getColor: (d: DataType) => d.color,
    getNormal: (d: DataType) => d.normal,
    getPosition: (d: DataType) => d.position,
    pointSize: 3,
    //coordinateOrigin: [-122.4, 37.74],
    coordinateOrigin: [0, 0],
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    pickable: true
  });

  return <DeckGL
    initialViewState={{
      longitude: 0,
      latitude: 0,
      zoom: 11
    }}
    controller
    getTooltip={({object}: PickingInfo<DataType>) => object && object.position.join(', ')}
    layers={[layer]}
  />;
}


export function renderToDOM(container: HTMLDivElement) {
    createRoot(container).render(<App />);
  }