"use client"

import useStore from '../../../../store/dsStore';
import { Accordion, Button, List, Space, Text } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
  faTrashCan
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';


export default function MetricsAddedDisplayer ()
{

  const configs = useStore( ( state ) => state.metricsConfig )
  const setConfigs = useStore( ( state ) => state.setMetricsConfigs )

  const handleClick = ( indexC: number ) =>
  {
    const newConfigs = configs.filter( ( _, index ) => index !== indexC );
    setConfigs( newConfigs )
  }

  return (
    <>
      {configs.length > 0 ? (
        <>
        { configs.map( ( config, index ) => (
        <React.Fragment key={`${config.metricName}-${index}`}> 
         <Accordion >
          <Accordion.Item value={ config.metricName }>
            <Accordion.Control>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'left' }}>
                <Text fw={700} size='sm'>{config.metricName} computed on {config.featureName}</Text>
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(index)
                  }}
                  style={{ 
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'}}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </span>
              </div>
            </Accordion.Control>
            <Accordion.Panel>
              {config.outliersMode? (<Text size="sm">Mode: {config.outliersMode}</Text>):null}
              <Text size="sm">Configs:</Text>
              { Object.entries( config.internalConfigs ).map( ( [ key, value ], index2 ) => (
                <List withPadding key={`config-${key}-${index}-${index2}`}>
                  <List.Item style={{ fontSize: '0.875rem'}}><span>{ key }:</span> { JSON.stringify( value ) }</List.Item>
                </List>
              ) ) }
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion> 
        </React.Fragment> ) ) }
      <Space h="sm" />

      <div style={ { display: 'flex', justifyContent: 'flex-end', marginBottom:'0px', paddingBottom: '0px'} }>
        <Button variant="transparent" onClick={()=>setConfigs([])} leftSection={ <FontAwesomeIcon icon={ faTrashCan } /> }>
          <Text size="sm">Clear all</Text>
        </Button>
      </div> </>) : null}
    </> )

}