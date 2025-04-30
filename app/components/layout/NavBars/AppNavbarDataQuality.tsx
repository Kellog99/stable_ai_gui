"use client"

import "@mantine/core/styles.css";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from "react";
import Link from 'next/link'
import
{
    Stack,
    Button,
    Text,
    Box,
    Space, Group,
    Menu,
    Divider
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
    faHouse, faImage, faChartLine, faBolt, faDatabase
} from '@fortawesome/free-solid-svg-icons';
import
{
    IconChevronDown,
    IconChevronUp
} from '@tabler/icons-react';
import classes from './AppNavbarDataQuality.module.css';
import RouterButton from "@/components/client/buttons/RouterButton";
import useStore from "@/store/dsStore";


function AppNavbarDataQuality ()
{
    const router = useRouter();


    const [ opened, { toggle, close } ] = useDisclosure( false )
    const pathName = usePathname();
    const isActive = ( path: string ) => pathName === path;

    const datasetUsed = useStore( ( state ) => state.datasetUsed ) 
    const isDatasetUndefined = datasetUsed == undefined;

    const [ visualVisible, setVisualVisible ] = useState( false );
    const [ metricVisible, setMetricVisible ] = useState( false );
    const [ actionVisible, setActionVisible ] = useState( false );

    const searchParams = useSearchParams();
    const [ datasetName, setDatasetName ] = useState<string | null>( "" )

    useEffect( () =>
    {
        if ( searchParams.get( "datasetName" ) ) {
            setDatasetName( searchParams.get( "datasetName" ) )
        }
    }, [ searchParams ] )

    const isMetricActive = ( metricName: string ) =>
    {
        return pathName === "/pages/dataquality/metrics" && searchParams.get( 'metric' ) === metricName;
    };

    const handleButtonClick = ( itemId: any ) =>
    {
        const params = new URLSearchParams( searchParams );
        params.set( 'metric', itemId );
        router.push( `/pages/dataquality/metrics?${params.toString()}` );
    };

    return (
        <Box p="md" style={ { height: '100%' } }>
            <Stack h="100%" gap="md">
                <Box>
                    <Link href="/" style={ { textDecoration: 'none' } }>
                        <Button
                            leftSection={ <FontAwesomeIcon icon={ faDatabase } /> }
                            radius="xl"
                            variant={ isActive( "/" ) ? "filled" : "subtle" }
                        >
                            Datasets
                        </Button>
                    </Link>
                    <Space h="xs" />
                   
                    <RouterButton name={datasetUsed?.name} route={"/pages/dataquality/datasets"}>
                        <Button
                            leftSection={ <FontAwesomeIcon icon={ faHouse } /> }
                            radius="xl"
                            variant={ isActive( "/pages/dataquality/datasets" ) ? "filled" : "subtle" }
                            disabled={ isDatasetUndefined }
                        >
                            Dataset Description
                        </Button>
                    </RouterButton>
                    
                </Box>

               
                <Divider />
                

                <Box>
                    <Group gap="xs" mb="xs" mr="xs">
                    <Button
                    className={classes.navbar}
                    onClick={() => setVisualVisible((prev) => !prev)}
                    rightSection={
                        visualVisible ? (
                          <div
                            style={{
                              width: '12px',
                              height: '1px',
                              backgroundColor: 'currentColor',
                              borderRadius: '1px',
                            }}
                          />
                        ) : (
                          <IconChevronDown size={18} stroke={1.5} />
                        )
                      }
                    pr={12}
                    leftSection={
                        <FontAwesomeIcon
                        icon={faImage}
                        size="sm"
                        style={{ opacity: 0.6 }}
                        />
                    }
                    >
                    <Text size="sm" fw={600} c="dimmed">
                        Visualization
                    </Text>
                    </Button>
                    </Group>

                    { visualVisible && (
                        <Stack mt="sm">
                            <Box >
                                <RouterButton name={ datasetName } route={ "/pages/dataquality/embeddings" }>
                                    <Button
                                        radius="xl"
                                        variant={ isActive( "/pages/dataquality/embeddings" ) ? "filled" : "subtle" }
                                        disabled={ isDatasetUndefined }
                                    >
                                        <Text size="sm" fw={ 600 } c="dimmed">
                                            Embeddings
                                        </Text>
                                    </Button>
                                </RouterButton>
                                <RouterButton name={ datasetName } route={ "/pages/dataquality/prototypes" }>
                                    <Button
                                        radius="xl"
                                        variant={ isActive( "/pages/dataquality/prototypes" ) ? "filled" : "subtle" }
                                        disabled={ isDatasetUndefined }
                                    >
                                        <Text size="sm" fw={ 600 } c="dimmed">
                                            Prototypes
                                        </Text>
                                    </Button>
                                </RouterButton>
                            </Box>
                        </Stack>
                    ) }
                </Box>

                <Box>
                    <Group gap="xs" mb="xs" mr="xs">
                        <Button
                            className={ classes.navbar }
                            onClick={() => setMetricVisible((prev) => !prev)}
                            rightSection={
                                metricVisible ? (
                                    <div
                                    style={{
                                      width: '12px',
                                      height: '1px',
                                      backgroundColor: 'currentColor',
                                      borderRadius: '1px',
                                    }}
                                  />
                                ) : (
                                <IconChevronDown size={18} stroke={1.5} />
                                )
                            } pr={ 12 }
                            leftSection={ <FontAwesomeIcon icon={ faChartLine } size="sm" style={ { opacity: 0.6 } } /> }>
                            <Text size="sm" fw={ 600 } c="dimmed">
                                Metrics
                            </Text>
                        </Button>
                    </Group>

                    { metricVisible && (
                        <Stack mt="sm">
                            <Box>
                                <RouterButton name={ datasetName } route={ "/pages/dataquality/metrics" }>
                                    <Button
                                        radius="xl"
                                        variant={ isActive( "/pages/dataquality/metrics" ) ? "filled" : "subtle" }
                                        disabled={ isDatasetUndefined }
                                    >
                                        <Text size="sm" fw={ 600 } c="dimmed">
                                            Metric Page
                                        </Text>
                                    </Button>
                                </RouterButton>

                                <RouterButton name={ datasetName } route={ "/pages/dataquality/metrics/duplicates" }>
                                    <Button
                                        radius="xl"
                                        variant={ isActive( "/pages/dataquality/metrics/duplicates" ) ? "filled" : "subtle" }
                                        disabled={ isDatasetUndefined }
                                    >
                                        <Text size="sm" fw={ 600 } c="dimmed">
                                            Duplicates
                                        </Text>
                                    </Button>
                                </RouterButton>

                                {/*
                                <Button
                                    radius="xl"
                                    variant={ isMetricActive( "duplicates" ) ? "filled" : "subtle" }
                                    disabled={ isDatasetUndefined }
                                    onClick={ () => handleButtonClick( "duplicates" ) }
                                >
                                    <Text size="sm" fw={ 600 } c="dimmed">
                                        Duplicates
                                    </Text>
                                </Button>

                                <Button
                                    radius="xl"
                                    variant={ isMetricActive( "outliers" ) ? "filled" : "subtle" }
                                    disabled={ isDatasetUndefined }
                                    onClick={ () => handleButtonClick( "outliers" ) }
                                >
                                    <Text size="sm" fw={ 600 } c="dimmed">
                                        Outliers
                                    </Text>
                                </Button>
                                */}
                            </Box>
                        </Stack>
                    ) }
                </Box>


                <Box>
                    <Group gap="xs" mb="xs" mr="xs">
                        <Button
                            className={ classes.navbar }
                            onClick={() => setActionVisible((prev) => !prev)}
                            rightSection={
                                actionVisible ? (
                                    <div
                                    style={{
                                      width: '12px',
                                      height: '1px',
                                      backgroundColor: 'currentColor',
                                      borderRadius: '1px',
                                    }}
                                  />
                                ) : (
                                <IconChevronDown size={18} stroke={1.5} />
                                )
                            }
                            leftSection={ <FontAwesomeIcon icon={ faBolt } size="sm" style={ { opacity: 0.6 } } /> }>
                            <Text size="sm" fw={ 600 } c="dimmed">
                                Actions
                            </Text>
                        </Button>
                    </Group>

                    { actionVisible && (
                        <Stack mt="sm">
                            <Box>
                                <Link href="/">
                                    <Button
                                        radius="xl"
                                        variant={ isActive( "/" ) ? "filled" : "subtle" }
                                        disabled
                                    >
                                        Embeddings
                                    </Button>
                                </Link>
                            </Box>
                        </Stack>
                    ) }
                </Box>
            </Stack>
        </Box>
    )
}

export default React.memo( AppNavbarDataQuality )