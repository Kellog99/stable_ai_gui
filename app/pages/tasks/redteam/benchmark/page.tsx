"use client"

import React, { useState } from 'react';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import './Benchmark.css';
import TableWrapper from "./TableWrapper"
import { Play, Settings, Ruler, Bug, Gauge, BrickWallFireIcon } from 'lucide-react';
import useNNTrustStore from '@/store/nnTrustStore';

const Benchmark: React.FC = () => {

  const { attacks, metrics, selectedAttacks, selectedMetrics, setSelectedAttacks, setSelectedMetrics, setExecutedAttacks } = useNNTrustStore()

  // Handle the selection of an attack
  const handleSelectionClick = (
    id: string,
    map: { [key: string]: RegisterObjectProps },
    setMap: (map: { [key: string]: RegisterObjectProps }) => void,
    completeList: { [key: string]: RegisterObjectProps }
  ) => {
    //with the first two cases I handle the selection button for selecting every attacks or deselecting everything
    if (id === 'all') {
      setMap(completeList)
    }
    else if (id === 'none') {
      setMap({})
    }
    else {
      const copiedMap = { ...map };

      if (id in copiedMap) {
        delete copiedMap[id]
      }
      else {
        copiedMap[id] = completeList[id]
      }
      setMap(copiedMap)
    }
  };

  // Handle the saving of a new set of parameters
  const handleParametersChange = (
    id: string,
    parameters: number[],
    setMap: (map: { [key: string]: RegisterObjectProps }) => void,
    registeredObject: { [key: string]: RegisterObjectProps },
  ) => {
    // Get the appropriate map based on type
    const currentMap: { [key: string]: RegisterObjectProps } = { ...registeredObject };
    const currentObject = currentMap[id];
    if (currentObject && currentObject.parameters) {
      // updating the new parameters that wants to be set
      currentObject.parameters.map((param, index) => {
        param.default = parameters[index]
      })
      // Update the map
      currentMap[id] = currentObject;
      // Save to store
      setMap(currentMap);
    }
  }


  // variables for executing the benchmarking
  const [executeBenchmark, setExecuteBenchmark] = useState<boolean>(true)


  // Click Execution Attack Handle
  const handleClick = async () => {
    try {
      // Block any new click on the button
      setExecuteBenchmark(false);
      const response = await fetch('http://127.0.0.1:8000/attacks/executeBenchmark', {
        method: "POST",
        body: JSON.stringify(selectedAttacks),
        headers: {
          'Content-type': 'application/json'
        }
      });

      console.log('Status:', response.status);
      const results = await response.json();
      console.log('Response:', results);
      setExecutedAttacks(results)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('ERROR:', error);
    } finally {
      setExecuteBenchmark(true);
    }

  };

  return (
    < div className="attack-list" >
      <div className='attack-title'>
        <div className='attack-header'>
          <div className='attack-icon'>
            <BrickWallFireIcon size={'6vw'} color='red' />
            <h1>Red Teaming</h1>
          </div>
          <p style={{ margin: '0' }}>This page provides a set of vulnerabilities that can be used to test the model's robustness and a set of metrics to register the performance of each attack.</p>
        </div>
        <button
          className='attack-button'
          disabled={!executeBenchmark}
          onClick={handleClick}>
          <Play className='icon' />
          <div className='btn-desc'> Execute benchmark</div>
        </button>
      </div>


      <div>
        {/* Attacks Selection */}
        <div className='option-attacks'>
          <div className='attack-icon'>
            <Bug size={'3vw'} color='red' />
            <h2>Vulnearbility selection</h2>
          </div>
          <p style={{ margin: 0 }}>
            Here below, are listed all the possible vulnerabilities that can be tested on the selected model.
            For customizing a vulnearbility click on the "Settings" icon on the right. A Panel will be shown on top where all the possible customizable parameters are shown.
          </p>
        </div>
        <TableWrapper
          elements={attacks}
          selectedElement={selectedAttacks}
          handleSelection={(id: string) => handleSelectionClick(
            id,
            selectedAttacks,
            setSelectedAttacks,
            attacks
          )}
          handleParametersChange={(id: string, parameters: number[]) => {
            handleParametersChange(
              id,
              parameters,
              setSelectedAttacks,
              selectedAttacks
            )
          }}
          Icon={Settings}
        />

        {/* Metrics Selection */}
        <div className='option-attacks'>
          <div className='attack-icon'>
            <Gauge size={'3vw'} color='red' />
            <h2>Metric Selection</h2>
          </div>
          <p > Here it is possible to select all the metrics to measure during the vulnearbility test.</p>
        </div>
        <TableWrapper
          elements={metrics}
          selectedElement={selectedMetrics}
          handleSelection={(id: string) => handleSelectionClick(
            id,
            selectedMetrics,
            setSelectedMetrics,
            metrics
          )}
          Icon={Ruler}
          handleParametersChange={(id: string, parameters: number[]) => {
            handleParametersChange(id,
              parameters,
              setSelectedMetrics,
              selectedMetrics)
          }} />
      </div>

    </div >);
};

export default Benchmark;