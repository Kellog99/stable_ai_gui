"use client"

import React, { useEffect, useState } from 'react';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import './Benchmark.css';
import TableWrapper from "./TableWrapper"
import { Settings, Ruler, BrickWallFireIcon, Info, ChevronRight } from 'lucide-react';
import useNNTrustStore from '@/store/nnTrustStore';
import { Group, Modal } from '@mantine/core';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import { startJob } from '@/properties/urlsNNTrust';
const Benchmark: React.FC = () => {

  const {
    attacks,
    metrics,
    setBenchmarkId
  } = useNNTrustStore()

  const [selectedAttacks, setSelectedAttacks] = useState<{ [key: string]: RegisterObjectProps }>({})
  const [selectedMetrics, setSelectedMetrics] = useState<{ [key: string]: RegisterObjectProps }>({})

  // Handler for the element's 
  const handleSelectionClick = (
    id: string,
    map: { [key: string]: RegisterObjectProps },
    setMap: (map: { [key: string]: RegisterObjectProps }) => void,
    completeList: { [key: string]: RegisterObjectProps }
  ) => {

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

  // handler for changing the parameters
  const handleParametersChange = (
    id: string,
    parameters: number[],
    setMap: (map: { [key: string]: RegisterObjectProps }) => void,
    registeredObject: { [key: string]: RegisterObjectProps },
  ) => {

    const currentMap: { [key: string]: RegisterObjectProps } = { ...registeredObject };
    const currentObject = currentMap[id];
    if (currentObject && currentObject.parameters) {
      currentObject.parameters.map((param, index) => {
        param.default = parameters[index]
      })

      currentMap[id] = currentObject;
      setMap(currentMap);
    }
  }


  // #################### Benchmark constraints #################### 
  const [executeBenchmark, setExecuteBenchmark] = useState<boolean>(true)
  // Provides the context of why the Benchmarking is not executable
  const [description, setDescription] = useState<string>("")

  useEffect(() => {
    setExecuteBenchmark(Object.keys(attacks).length > 0)
    if (Object.keys(attacks).length === 0) {
      setDescription("No attacks are available for the execution.")
    }
    else {
      setExecuteBenchmark(Object.keys(selectedAttacks).length > 0)

      if (Object.keys(selectedAttacks).length === 0) {
        setDescription(`None of the ${Object.keys(attacks).length} attacks have been selected.`)
      }
      else {
        setDescription("Another Benchmarking is running. Please wait till the end.")
      }
    }

  }, [attacks, selectedAttacks])

  // Click Execution Attack Handle
  const [isClicked, setIsCLicked] = useState<boolean>(false)

  const handleClick = async () => {
    try {
      // Block any new click on the button
      setExecuteBenchmark(false);

      const response = await fetch(startJob, {
        method: "POST",
        body: JSON.stringify(selectedAttacks),
        headers: {
          'Content-type': 'application/json'
        }
      });
      const id = await response.json();
      console.log("id:", id)
      setBenchmarkId(id)

      setIsCLicked(true)
    } catch (error) {
      console.error('ERROR:', error);
    } finally {
      setExecuteBenchmark(true);
    }

  };



  return (
    <>
      <div className="container-pages">
        {/* Header */}

        <HeaderPageTask
          Icon={BrickWallFireIcon}
          title="Red Teaming"
          descrition="Here it is possible to controll the advancement of all the vulnerabilities that have been executed in the Benchmark page."
          buttonprops={{
            description: "Execute Benchmark",
            isDisabled: !executeBenchmark,
            disabledDescription: description,
            handleClick: handleClick
          }}
        />


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

      </div >

      <Modal
        opened={isClicked}
        className='alert-message'
        onClose={() => setIsCLicked(false)}
        withCloseButton={false}
        styles={{
          title: {
            color: "white",
            fontWeight: "bold",
            marginBottom: "15px"
          },
          content: {
            backgroundColor: "var(--bg-light)",
            borderRadius: "var(--border-radius)",
            color: "white",
            fontSize: "0.8rem"

          }
        }}
        centered>
        <Modal.Title>
          <Group >
            <Info /> Information
          </Group>
        </Modal.Title>

        A Benchmark containing {Object.keys(selectedAttacks).length} vulnearbilities has been scheduled.
        Visit the management page for checking the advancement of the experiments.

        <button
          onClick={() => window.location.href = "/pages/tasks/redteam/management"}
          className="allert-button"
        >
          Go to Management Table <ChevronRight size={"var(--icon-size)"} />
        </button>
      </Modal>

    </>)
};

export default Benchmark;