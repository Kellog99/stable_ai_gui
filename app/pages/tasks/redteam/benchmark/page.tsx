"use client"

import React, { useState, useEffect } from 'react';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import './Benchmark.css';
import TableWrapper from "./TableWrapper"
import { Play, Settings, Ruler, BrickWallFire, Bug, Gauge } from 'lucide-react';
import useNNTrustStore from '@/store/nnTrustStore';

const Benchmark: React.FC = () => {
  const [attacks, setAttacks] = useState<RegisterObjectProps[]>([]);
  const [metrics, setMetrics] = useState<RegisterObjectProps[]>([]);

  const [selectedAttacks, setSelectedAttacks] = useState<Set<string>>(new Set());
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchItem() {
      // fetching the attacks
      try {
        const response = await fetch('http://127.0.0.1:8000/attacks/getInfo');
        if (!response.ok) {
          throw new Error(`HTTP error for the attack List! Status: ${response.status}`);
        }
        const json = await response.json();
        setAttacks(json);
        if (json.length > 0) {
          const allIds = json.map((attack: RegisterObjectProps) => attack.id);
          setSelectedAttacks(new Set(allIds));
        }
      } catch (err) {
        console.log(err instanceof Error ? err.message : "An error occurred");
      }
      // fetching the metrics
      try {
        const response = await fetch('http://127.0.0.1:8000/metrics/getInfo');
        if (!response.ok) {
          throw new Error(`HTTP error for the metric List! Status: ${response.status}`);
        }
        const json = await response.json();
        setMetrics(json);
        if (json.length > 0) {
          const allIds = json.map((metric: RegisterObjectProps) => metric.id);
          setSelectedMetrics(new Set(allIds));
        }
      } catch (err) {
        console.log(err instanceof Error ? err.message : "An error occurred");
      }
    }
    fetchItem();
  }, []);

  // variables for executing the benchmarking
  const [executeBenchmark, setExecuteBenchmark] = useState<boolean>(true)
  const setStoredAttacks = useNNTrustStore((state) => state.setAttacks)
  const ableMonitoring = useNNTrustStore((state) => state.setEnableMonitoring)

  const storedAttacks = useNNTrustStore((state) => state.attacks)
  // True display of the page when everything goes as planned.
  return (
    < div className="attack-list" >
      <div className='attack-title'>
        <div className='attack-header'>
          <div className='attack-icon'>
            <BrickWallFire size={'6vw'} color='red' />
            <h1>Red Teaming</h1>
          </div>
          <p style={{ margin: '0' }}>This page provides a set of vulnerabilities that can be used to test the model's robustness and a set of metrics to register the performance of each attack.</p>
        </div>
        <button
          className='attack-button'
          disabled={!executeBenchmark}
          onClick={() => {
            //Since there must be only one benchmark at the time I have to disable the button at the beginning
            setExecuteBenchmark(false);
            setStoredAttacks(selectedAttacks)
            ableMonitoring(true)
            console.log(storedAttacks)

            setExecuteBenchmark(true)
          }}>
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
          setSelectedElements={setSelectedAttacks}
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
          setSelectedElements={setSelectedMetrics}
          Icon={Ruler}
        />
      </div>

    </div >);
};

export default Benchmark;