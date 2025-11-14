"use client"

import React, { useState } from 'react';
import { AttackManagementProps, RegisterObjectProps } from '@/interfaces/NNInterfaces';
import './Benchmark.css';
import TableWrapper from "./TableWrapper"
import { Play, Settings, Ruler, Bug, Gauge, BrickWallFireIcon, Info, ChevronRight } from 'lucide-react';
import useNNTrustStore from '@/store/nnTrustStore';
import { Alert } from '@mantine/core';

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
  const [isClicked, setIsCLicked] = useState<boolean>(false)

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
      const status: AttackManagementProps[] = await response.json();
      setExecutedAttacks(status)
      console.log(status)
      setIsCLicked(true)
    } catch (error) {
      console.error('ERROR:', error);
    } finally {
      setExecuteBenchmark(true);
    }

  };


  return (
    <>
      < div className="attack-list" >
        <div className='attack-title'>
          <div className='attack-header'>
            <BrickWallFireIcon size={"calc(var(--icon-size) * 3)"} color='red' />
            <div>
              <h1 style={{ margin: "0", fontSize: "2.5rem" }}>Red Teaming</h1>
              <p style={{ margin: '0' }}>Choose all the vulnerabilities to test and the metrics that have to be computed for each attack.</p>
            </div>
          </div>

          <button
            className='attack-button'
            disabled={!executeBenchmark}
            onClick={handleClick}>
            <Play size={"calc(var(--icon-size) )"} />
            <p>Execute benchmark</p>
          </button>
        </div>


        <div>
          {/* Attacks Selection */}
          <TableWrapper
            title='Vulnearbility selection'
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
          <TableWrapper
            title='Metric Selection'
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