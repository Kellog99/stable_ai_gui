"use client";

import { Badge, Card, CardSection, Group, Text } from "@mantine/core";
import { FixedSizeGrid, GridChildComponentProps } from "react-window";
import ImageDisplayer from "../server/ImageDisplayer";
import TextDisplayer from "../server/TextDisplayer";
import classes from '../../pages/dataquality/embeddings/page.module.css'
import { image_type, text_type } from "@/properties/types";
import useStore from "@/store/dsStore";
import { useMemo } from "react";

interface FeatureCardProps
{
  index?: number,
  data: string,
  featureType: string,
  label?: number,
  labelString?: string,
  labelColor?: [],
  outlier?: string,
  score?: number
}

interface FeatureDisplayerProps
{
  indexes?: number[],
  featureData: string[],
  featureType: string,
  labelData?: number[],
  label_dict?: { [ key: number ]: string },
  outliers?: string[],
  scores?: number[],
  columns?: number
  dimensions?: { width: number, height: number }
}


export function FeatureCard ( props: FeatureCardProps )
{
  const { index, data, featureType, label, labelString, labelColor, outlier, score } = props

  return (
    <Card className={ classes.card } shadow="sm" padding="lg" radius="md" withBorder>
      <CardSection className={ classes.cardsection }>
        { featureType === image_type ? (
          <ImageDisplayer className={ classes.ImageDisplayer } data={ data } alt="" />
        ) : featureType === text_type ? (
          <TextDisplayer className={ classes.TextDisplayer } data={ data } />
        ) : null }
      </CardSection>

      { index || index == 0 || label || label == 0 || labelString ? (
        <>
          <Group justify="space-between" mt="md" mb="xs">
            { labelString != null ? <Text fw={ 700 } size="lg">{ labelString }</Text> : null }
            { label != null ? ( labelColor ? ( <Badge color={ `rgb(${labelColor.join( "," )})` }> Class ID: { label } </Badge> ) : ( <Badge color="#ec777e"> Class ID: { label } </Badge> )
            ) : null }
          </Group>

          { index || index == 0 ? (
            <Text size="sm" c="dimmed">
              Sample: { index }
            </Text> ) : null }</> ) : ( outlier && score ? (
              <>
                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={ 500 }>Score: { score.toFixed( 3 ) }</Text>
                  <Badge color={ outlier == "Outlier" ? "#fa5252" : "#228be6" }>{ outlier }</Badge>
                </Group>
              </>
            ) : null ) }
    </Card>
  );
}



export default function FeatureDisplayer ( props: FeatureDisplayerProps )
{
  const { indexes, featureData, featureType, labelData, label_dict, outliers, scores, columns, dimensions } = props

  const itemSize = 280;
  const totalItems = featureData.length;
  const setHoverIndex = useStore( ( state ) => state.setHoverIndex )
  const colorMap = useStore( ( state ) => state.colorMap )

  const { columnCount, rowCount } = useMemo(() => {
  if (!columns && dimensions) {
    const maxPossibleColumns = Math.floor(dimensions.width / itemSize);
    const maxPossibleRows = Math.floor(dimensions.height / itemSize);

    const targetRows = Math.ceil(Math.sqrt(totalItems)); // key change: target row count

    let computedRows = Math.min(maxPossibleRows, targetRows);
    computedRows = Math.max(1, computedRows);

    let computedColumns = Math.ceil(totalItems / computedRows);

    // If columns are too wide to fit, fallback
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
  }, [ columns, dimensions, itemSize, totalItems ] );


  return (
    <FixedSizeGrid
      columnCount={ columnCount }
      columnWidth={ itemSize }
      height={ dimensions ? dimensions.height : 600 }
      rowCount={ rowCount }
      rowHeight={ itemSize }
      width={ dimensions ? dimensions.width - dimensions.width*0.08 : columnCount * itemSize }
     
    >
      { ( { columnIndex, rowIndex, style }: GridChildComponentProps ) =>
      {
        const index = rowIndex * columnCount + columnIndex;
        if ( index >= featureData.length ) return null;
        return (
          <div style={ {
            ...style,
            background: "transparent",
            padding: '8px',

          } }>

            { indexes ? (
              <div
                onMouseEnter={ () => setHoverIndex( indexes[ index ] ) }
                onMouseLeave={ () => setHoverIndex( null ) }
              >
                <FeatureCard
                  data={ featureData[ index ] }
                  featureType={ featureType }
                  { ...( indexes ? { index: indexes[ index ] } : {} ) }
                  { ...( labelData ? { label: labelData[ index ] } : {} ) }
                  { ...( labelData && label_dict ? { labelString: label_dict[ labelData[ index ] ] } : {} ) }
                  { ...( labelData && colorMap ? { labelColor: colorMap[ labelData[ index ] ] } : {} ) }
                  { ...( outliers ? { outlier: outliers[ index ] } : {} ) }
                  { ...( scores ? { score: scores[ index ] } : {} ) }
                />
              </div>
            ) : (
              <FeatureCard
                data={ featureData[ index ] }
                featureType={ featureType }
                { ...( indexes ? { index: indexes[ index ] } : {} ) }
                { ...( labelData ? { label: labelData[ index ] } : {} ) }
                { ...( labelData && label_dict ? { labelString: label_dict[ labelData[ index ] ] } : {} ) }
                { ...( outliers ? { outlier: outliers[ index ] } : {} ) }
                { ...( scores ? { score: scores[ index ] } : {} ) }
              />
            ) }
          </div>
        );
      } }
    </FixedSizeGrid>
  )
}