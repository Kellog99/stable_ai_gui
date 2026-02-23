"use client";

import classes from "@/pages/tasks/dataquality/embeddings/page.module.css";
import { image_type, text_type } from "@/properties/types";
import useStore from "@/store/dsStore";
import { Badge, Card, CardSection, CloseButton, Group, Modal, Text } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { FixedSizeGrid, GridChildComponentProps } from "react-window";

import { useThumbnailWS } from "@/functionalities/useThumbnailWS";


interface FeatureCardProps {
    index?: number,
    data: string,
    featureType: string,
    label?: number,
    labelString?: string,
    labelColor?: number[],
    uncertainty?: boolean,
    outlier?: string,
    score?: number
}

interface FeatureDisplayerProps {
    indexes?: number[],
    featureData: string[],
    featureType: string,
    labelData?: number[],
    label_dict?: { [key: number]: string },
    outliers?: string[],
    scores?: number[],
    uncertainty?: boolean,
    columns?: number
    dimensions?: { width: number, height: number }
}



export function FeatureCard(props: FeatureCardProps) {
    const { index, data, featureType, label, labelString, labelColor, outlier, score, uncertainty } = props
    const [showSection, setShowSection] = useState(false)

    return (
        <>
            <Card className={classes.card} shadow="sm" radius="md" withBorder>
                <div onClick={() => setShowSection(true)} style={{ cursor: "pointer" }}>
                    <CardSection className={classes.cardsection}>
                        {featureType === image_type ? (
                            data ? (
                                <img
                                    src={data}
                                    alt=""
                                    className={classes.ImageDisplayer}
                                    style={{
                                        width: "100%",
                                        height: "192px",
                                        objectFit: "contain",
                                        backgroundColor: "#f7f7f7",
                                        display: "block",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        height: "192px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#f7f7f7",
                                        color: "#9ca3af",
                                    }}
                                >
                                    Loading...
                                </div>
                            )
                        ) : featureType === text_type ? (
                            <div className={classes.TextDisplayer}>
                                <Text size="sm" c="black">
                                    {data}
                                </Text>
                            </div>
                        ) : null}
                    </CardSection>

                </div>
                {index || index == 0 || label || label == 0 || labelString ? (
                    <>
                        <Group justify="space-between" mt="md" mb="xs">
                            {labelString != null ? <Text fw={700} size="lg" c="#334155">{labelString}</Text> : null}
                            {label != null ? (labelColor ? (<Badge color={`rgb(${labelColor.join(",")})`}> Class ID: {label} </Badge>) : (<Badge color="#334155"> Class ID: {label} </Badge>)
                            ) : null}
                        </Group>
                        {index || index == 0 ?
                            (<Text size="sm" c="dimmed">
                                Sample: {index}
                            </Text>) : null}


                        {(index || index == 0) && uncertainty && score && labelColor ? (<>
                            <Group justify="space-between" mt="md" mb="xs">
                                <Badge color={`rgb(${labelColor.join(",")})`}> Score: {score.toFixed(3)} </Badge>
                            </Group>
                            <Text size="sm" c="dimmed">
                                Sample: {index}
                            </Text>
                        </>

                        ) : null}</>) : (outlier && score ? (
                            <>
                                <Group justify="space-between" mt="md" mb="xs">
                                    <Text fw={600} c="#334155">Score: {score.toFixed(3)}</Text>
                                    <Badge color={outlier == "Outlier" ? "#fa5252" : "#228be6"}>{outlier}</Badge>
                                </Group>
                            </>
                        ) : null)}
            </Card>

            <Modal
                opened={showSection}
                onClose={() => setShowSection(false)}
                centered
                withCloseButton={featureType === text_type ? true : false}
                radius={8}
                zIndex={1000}
                overlayProps={{
                    blur: 10,
                    backgroundOpacity: 0.4,
                }}
                size="auto"
                padding={featureType === text_type ? "sm" : 0}
                styles={{
                    body: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        maxWidth: "50vw",
                        maxHeight: "50vh"
                    },
                    content: {
                        overflow: "visible",
                        position: "relative",
                        padding: featureType === image_type ? 0 : undefined,
                        maxWidth: "50vw",
                        maxHeight: "50vh",
                    },
                    header: {
                        display: featureType === image_type ? "none" : undefined,
                    },
                }}
            >
                {featureType === image_type ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            maxWidth: "50vw",
                            maxHeight: "50vh",
                        }}
                    >
                        <img
                            src={data}
                            alt="preview"

                        />
                        <CloseButton
                            onClick={() => setShowSection(false)}
                            style={{
                                position: "absolute",
                                top: 6,
                                right: 6,
                                zIndex: 1,
                            }}
                            size="md"
                        />
                    </div>
                ) : props.featureType === text_type ? (
                    <>
                        <Text fw={500} size="lg" c="dark"
                            style={{
                                maxWidth: "60vw",
                                overflow: "auto",
                                margin: "2px",
                            }}>
                            {data}
                        </Text>
                    </>
                ) : null}
            </Modal>
        </>
    );
}



export default function FeatureDisplayer({
    indexes,
    featureData,
    featureType,
    labelData,
    label_dict,
    outliers,
    scores,
    uncertainty,
    columns,
    dimensions,
}: FeatureDisplayerProps) {

    const setHoverIndex = useStore((state) => state.setHoverIndex);
    const colorMap = useStore((state) => state.colorMap);
    const uqColors = useStore((state) => state.uqColors);

    const gridRef = useRef<any>(null);
    const itemSize = 280;
    const totalItems = featureData.length;

    const { thumbnails, connectionStatus, requestThumbnails } = useThumbnailWS(featureType, featureData);


    const { columnCount, rowCount } = useMemo(() => {
        if (!columns && dimensions) {
            const maxPossibleColumns = Math.floor(dimensions.width / itemSize);
            const maxPossibleRows = Math.floor(dimensions.height / itemSize);

            const targetRows = Math.ceil(Math.sqrt(totalItems)); // key change: target row count

            let computedRows = Math.min(maxPossibleRows, targetRows);
            computedRows = Math.max(1, computedRows);

            let computedColumns = Math.ceil(totalItems / computedRows);

            if (computedColumns * itemSize > dimensions.width) {
                computedColumns = Math.max(1, maxPossibleColumns);
                computedRows = Math.ceil(totalItems / computedColumns);
            }

            return { columnCount: computedColumns, rowCount: computedRows };
        } else if (columns && !dimensions) {
            return {
                columnCount: columns,
                rowCount: Math.ceil(totalItems / columns)
            };
        }

        return { columnCount: 1, rowCount: totalItems };
    }, [columns, dimensions, itemSize, totalItems]);


    useEffect(() => {
        if (
            connectionStatus === 'connected' &&
            featureData.length > 0 &&
            columnCount > 0 &&
            rowCount > 0
        ) {

            const gridHeight = dimensions ? dimensions.height : 600;
            const gridWidth = dimensions
                ? dimensions.width - dimensions.width * 0.08
                : columnCount * itemSize;

            const visibleRows = Math.ceil(gridHeight / itemSize);
            const visibleCols = Math.ceil(gridWidth / itemSize);

            const initialIndices: number[] = [];

            for (let row = 0; row < Math.min(visibleRows, rowCount); row++) {
                for (let col = 0; col < Math.min(visibleCols, columnCount); col++) {
                    const index = row * columnCount + col;
                    if (index < featureData.length) {
                        initialIndices.push(index);
                    }
                }
            }
            if (initialIndices.length > 0) {
                console.log("initials,", initialIndices)
                requestThumbnails(initialIndices);
            }
        }
    }, [connectionStatus, featureData.length, dimensions, itemSize, columnCount, rowCount]);


    return (
        <FixedSizeGrid
            ref={gridRef}
            columnCount={columnCount}
            columnWidth={itemSize}
            height={dimensions ? dimensions.height : 600}
            rowCount={rowCount}
            rowHeight={itemSize}
            width={dimensions ? dimensions.width - dimensions.width * 0.08 : columnCount * itemSize}
            onItemsRendered={({ visibleRowStartIndex, visibleRowStopIndex, visibleColumnStartIndex, visibleColumnStopIndex }) => {
                const visibleIndices: number[] = [];
                for (let row = visibleRowStartIndex; row <= visibleRowStopIndex; row++) {
                    for (let col = visibleColumnStartIndex; col <= visibleColumnStopIndex; col++) {
                        const index = row * columnCount + col;
                        if (index < featureData.length) visibleIndices.push(index);
                    }
                }
                requestThumbnails(visibleIndices);
            }}
        >
            {
                ({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
                    const index = rowIndex * columnCount + columnIndex;
                    if (index >= featureData.length) return null;

                    const imagePath = featureData[index];
                    const thumbnailUrl = featureType === image_type ? thumbnails.get(imagePath) : imagePath;

                    return (
                        <div style={{ ...style, padding: "8px" }}>
                            {indexes ? (
                                <div
                                    onMouseEnter={() => setHoverIndex(indexes ? indexes[index] : null)}
                                    onMouseLeave={() => setHoverIndex(null)}
                                >
                                    <FeatureCard
                                        data={thumbnailUrl as string}
                                        featureType={featureType}

                                        {...(indexes ? { index: indexes[index] } : {})}
                                        {...(labelData ? { label: labelData[index] } : {})}
                                        {...(labelData && label_dict ? { labelString: label_dict[labelData[index]] } : {})}
                                        {...(labelData && colorMap ? { labelColor: colorMap[labelData[index]] } : {})}
                                        {... (uncertainty ? { uncertainty: true } : { uncertainty: false })}
                                        {... (uncertainty && uqColors ? { labelColor: uqColors[indexes[index]] } : null)}
                                        {...(outliers ? { outlier: outliers[index] } : {})}
                                        {...(scores ? { score: scores[indexes[index]] } : {})}
                                    />
                                </div>) : (

                                <FeatureCard
                                    data={thumbnailUrl as string}
                                    featureType={featureType}

                                    {...(indexes ? { index: indexes[index] } : {})}
                                    {...(labelData ? { label: labelData[index] } : {})}
                                    {...(labelData && label_dict ? { labelString: label_dict[labelData[index]] } : {})}
                                    {...(outliers ? { outlier: outliers[index] } : {})}
                                    {...(scores ? { score: scores[index] } : {})}
                                />
                            )}
                        </div>
                    );
                }
            }
        </FixedSizeGrid >
    );
}
