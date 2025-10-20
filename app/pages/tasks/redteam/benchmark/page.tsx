"use client"

import React, { useState } from 'react';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import './Benchmark.css';
import TableWrapper from "./TableWrapper"
import { Play, Settings, Ruler, Bug, Gauge, BrickWallFireIcon } from 'lucide-react';
import useNNTrustStore from '@/store/nnTrustStore';

const Benchmark: React.FC = () => {

  const { attacks, metrics, selectedAttacks, selectedMetrics, setSelectedAttacks, setSelectedMetrics, monitoring, setMonitoring, setExecutedAttacks } = useNNTrustStore()

  // Click Selection Handle
  const handleSelectionClick = (
    id: string,
    map: Map<string, RegisterObjectProps>,
    setMap: (map: Map<string, RegisterObjectProps>) => void,
    completeList: Map<string, RegisterObjectProps>
  ) => {
    //with the first two cases I handle the selection button for selecting every attacks or deselecting everything
    if (id === 'all') {
      setMap(completeList)
    }
    else if (id === 'none') {
      setMap(new Map())
    }
    else {
      const copiedMap = new Map(map);

      if (copiedMap.has(id)) {
        copiedMap.delete(id)
      }
      else {
        copiedMap.set(id, completeList.get(id)!)
      }
      setMap(copiedMap)
    }
  };

  // variables for executing the benchmarking
  const [executeBenchmark, setExecuteBenchmark] = useState<boolean>(true)


  // Click Execution Attack Handle
  const handleClick = async () => {
    try {
      // Block any new click on the button
      setExecuteBenchmark(false);
      // Allows to see the Monitoring
      setMonitoring(true)
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
          <p style={{
            fontSize: '1.3vw',
            color: 'gray',
            margin: 0
          }}>
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
          Icon={Settings}
        />

        {/* Metrics Selection */}
        <div className='option-attacks'>
          <div className='attack-icon'>
            <Gauge size={'3vw'} color='red' />
            <h2>Metric Selection</h2>
          </div>
          <p style={{
            fontSize: '1.3vw',
            color: 'gray',
            margin: 0
          }}> Here it is possible to select all the metrics to measure during the vulnearbility test.</p>
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
        />
      </div>

    </div >);
};

export default Benchmark;