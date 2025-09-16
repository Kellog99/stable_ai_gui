"use client";

import { Badge, Card, CardSection, Group, Modal, Text, Image, CloseButton } from "@mantine/core";
import { FixedSizeGrid, GridChildComponentProps } from "react-window";
import ImageDisplayer from "../server/ImageDisplayer";
import TextDisplayer from "../server/TextDisplayer";
import classes from '@/pages/dataquality/embeddings/page.module.css';
import { image_type, text_type } from "@/properties/types";
import useStore from "@/store/dsStore";
import { useMemo, useState } from "react";
import path from 'path';
import datasets_folder from "@/properties/static";

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
              <ImageDisplayer className={classes.ImageDisplayer} data={data} alt="" />
            ) : featureType === text_type ? (
              <TextDisplayer className={classes.TextDisplayer} data={data} />
            ) : null}
          </CardSection>
        </div>

        {index || index == 0 || label || label == 0 || labelString ? (
          <>
            <Group justify="space-between" mt="md" mb="xs">
              {labelString != null ? <Text fw={700} size="lg">{labelString}</Text> : null}
              {label != null ? (labelColor ? (<Badge color={`rgb(${labelColor.join(",")})`}> Class ID: {label} </Badge>) : (<Badge color="#334155"> Class ID: {label} </Badge>)
              ) : null}
            </Group>
            {index || index ==0 ? 
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
                  <Text fw={500}>Score: {score.toFixed(3)}</Text>
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
            <img src={path.sep+datasets_folder+path.sep+data} alt="preview" style={{ maxWidth: "50vw", maxHeight: "50vh"}} />
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
            <Text fw={500} size="lg"
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
  )
}



export default function FeatureDisplayer(props: FeatureDisplayerProps) {
  const { indexes, featureData, featureType, labelData, label_dict, outliers, scores, uncertainty, columns, dimensions } = props

  const itemSize = 280;
  const totalItems = featureData.length;
  const setHoverIndex = useStore((state) => state.setHoverIndex)
  const colorMap = useStore((state) => state.colorMap)
  const uqColors = useStore((state) => state.uqColors)

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


  return (
    <FixedSizeGrid
      columnCount={columnCount}
      columnWidth={itemSize}
      height={dimensions ? dimensions.height : 600}
      rowCount={rowCount}
      rowHeight={itemSize}
      width={dimensions ? dimensions.width - dimensions.width * 0.08 : columnCount * itemSize}

    >
      {({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
        const index = rowIndex * columnCount + columnIndex;
        if (index >= featureData.length) return null;
        return (
          <div style={{
            ...style,
            background: "transparent",
            padding: '8px',

          }}>

            {indexes ? (
              <div
                onMouseEnter={() => setHoverIndex(indexes[index])}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <FeatureCard
                  data={featureData[index]}
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
              </div>
            ) : (
              <FeatureCard
                data={featureData[index]}
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
      }}
    </FixedSizeGrid>
  )
}