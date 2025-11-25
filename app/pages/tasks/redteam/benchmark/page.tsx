"use client"

import React, { useEffect, useState } from 'react';
import { AttackManagementProps, RegisterObjectProps } from '@/interfaces/NNInterfaces';
import './Benchmark.css';
import TableWrapper from "./TableWrapper"
import { Settings, Ruler, BrickWallFireIcon, Info, ChevronRight } from 'lucide-react';
import useNNTrustStore from '@/store/nnTrustStore';
import { Alert } from '@mantine/core';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import useStore from '@/store/dsStore';

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


  // variables for executing the benchmarking
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



  return (
    <>
      <div className="container-pages">
        {/* Header */}

        <HeaderPageTask
          Icon={BrickWallFireIcon}
          title="Red Teaming"
          descrition="Here it is possible to controll the advancement of all the vulnerabilities that have been executed in the Benchmark page."
          buttonprops={{
            description: "Management Report",
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