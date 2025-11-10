"use client"

import React, { useEffect, useState } from 'react';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import './Benchmark.css';
import TableWrapper from "./TableWrapper"
import { Play, Settings, Ruler, Bug, Gauge, Info, ChevronRight, BrickWallFire } from 'lucide-react';
import useNNTrustStore, { AttackManagementProps } from '@/store/nnTrustStore';
import { Alert } from '@mantine/core';
import useStore from '@/store/dsStore';
import { setKeyboardInteraction } from 'recharts/types/state/tooltipSlice';

const Benchmark: React.FC = () => {

  const { attacks, metrics, selectedAttacks, selectedMetrics, setSelectedAttacks, setSelectedMetrics, setExecutedAttacks } = useNNTrustStore()

  const datasetName = useStore((state) => state.datasetUsed)?.name
  const modelName = useNNTrustStore((state) => state.modelName)
  const setBenchmarkID = useNNTrustStore((state) => state.setBenchmarkID)
  const benchmarkID = useNNTrustStore((state) => state.benchmarkID)
  // variables for executing the benchmarking
  const [executeBenchmark, setExecuteBenchmark] = useState<boolean>(true)
  const [isBenchmarkAvailable, setIsBenchmarkAvailable] = useState<boolean>(false)

 useEffect(() => {
  const isAttacksEmpty = !selectedAttacks || Object.keys(selectedAttacks).length === 0;
  const isMetricsEmpty = !selectedMetrics || Object.keys(selectedMetrics).length === 0;

  setIsBenchmarkAvailable(!(isAttacksEmpty || isMetricsEmpty));
}, [selectedAttacks, selectedMetrics]);

  console.log("SELECTED ATTACKS:", selectedAttacks)
  console.log("SELECTED METRICS:", selectedMetrics)


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

      console.log("current map", currentMap)
    }
  }

  //preparing data to send to backend
  const attacksCleaned = Object.fromEntries(
    Object.entries(selectedAttacks).map(([key, value]) => [
      key,
      { name: value.id }
    ])
  );

  const benchmarkDatas = {
    attacks: Object.values(selectedAttacks),
    metrics: Object.values(selectedMetrics),
    dataset: datasetName,
    model: modelName
  };

  console.log("benchmark to send", benchmarkDatas)




  // Click Execution Attack Handle
  const [isClicked, setIsCLicked] = useState<boolean>(false)

  const handleClick = async () => {
    try {
      // Block any new click on the button
      setExecuteBenchmark(false);

      const response = await fetch('http://localhost:8082/job/start', {
        method: "POST",
        body: JSON.stringify(benchmarkDatas),
        headers: {
          'Content-type': 'application/json'
        }
      });

      console.log('Status:', response.status);
      //const status: AttackManagementProps[] = await response.json();
      //setExecutedAttacks(status)
      //console.log(status)


      const id = await response.json();
      console.log("id:", id)
      setBenchmarkID(id)

      setIsCLicked(true)
    } catch (error) {
      console.error('ERROR:', error);
    } finally {
      setExecuteBenchmark(true);
    }

  };

  console.log("benchmarkID from store", benchmarkID)


  return (
    <>
      < div className="attack-list" >
        <div className='attack-title'>
          <div className='attack-header'>
            <div className='attack-icon'>
              <BrickWallFire size={'6vw'} color='red' />
              <h1>Red Teaming</h1>
            </div>
            <p style={{ margin: '0' }}>This page provides a set of vulnerabilities that can be used to test the model's robustness and a set of metrics to register the performance of each attack.</p>
          </div>
          <div className="tooltip-container">
            <button
              className="attack-button"
              disabled={!isBenchmarkAvailable && !executeBenchmark}
              onClick={handleClick}
            >
              <Play className="icon" />
              <div className="btn-desc">Execute benchmark</div>
            </button>
            {!isBenchmarkAvailable && (
              <span className="tooltip">Before executing the benchmark, make sure you have selected at least one attack and one metric.</span>
            )}
          </div>
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

      </div >
      {
        isClicked && (
          <div className="alert-message">
            <Alert
              icon={<Info size={20} />}
              title="Alert Message"
              variant="filled"
              color="blue"
              radius="lg"
              withCloseButton
              style={{ width: "32vw", aspectRatio: "1.6", background: "var(--navy-400)" }}
              onClose={() => setIsCLicked(false)}
            >
              <div className='message-body'>
                <p style={{ fontSize: "1vw" }}>
                  A Benchmark containing {Object.keys(selectedAttacks).length} vulnearbilities has been scheduled.
                  Visit the management page for checking the advancement of the experiments.
                </p>
                <button
                  onClick={() => window.location.href = "/pages/tasks/redteam/management"}
                  className="allert-button"
                >
                  Go to Management Table <ChevronRight size={"2vw"} />
                </button>
              </div>
            </Alert>
          </div>
        )}
    </>)
};

export default Benchmark;