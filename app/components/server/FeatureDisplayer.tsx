import { Badge, Card, CardSection, Group, Text } from "@mantine/core";
import { FixedSizeGrid, GridChildComponentProps } from "react-window";
import ImageDisplayer from "./ImageDisplayer";
import TextDisplayer from "./TextDisplayer";
import classes from '../../pages/dataquality/embeddings/page.module.css'
import { image_type, text_type } from "@/properties/types";
import useStore from "@/store/dsStore";

//label_dict?:{[key: number]: string}

interface FeatureCardProps
{
  index?: number,
  data: string,
  featureType: string,
  label?: number,
  labelString?: string,
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
  columnCount?: number
}


export function FeatureCard ( props: FeatureCardProps )
{
  const { index, data, featureType, label, labelString, outlier, score } = props

  return (
    <Card className={ classes.card } shadow="sm" padding="lg" radius="md" withBorder>
      <CardSection className={ classes.cardsection }>
        { featureType === image_type ? (
          <ImageDisplayer className={ classes.ImageDisplayer } data={ data } alt="" />
        ) : featureType === text_type ? (
          <TextDisplayer className={ classes.TextDisplayer } data={ data } />
        ) : null }
      </CardSection>

      { index || index == 0 || label || labelString ? (
        <>
          <Group justify="space-between" mt="md" mb="xs">
            { labelString != null ? <Text fw={ 700 } size="lg">{ labelString }</Text> : null }
            { label != null ? <Badge color="#ec777e"> Class ID: { label } </Badge> : null }
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
  const { indexes, featureData, featureType, labelData, label_dict, outliers, scores, columnCount } = props
  const COLUMN_COUNT = columnCount ? columnCount : 4;
  const COLUMN_WIDTH = 260;
  const ROW_HEIGHT = 290;
  const rowCount = Math.ceil( featureData.length / COLUMN_COUNT );
  const setHoverIndex = useStore( ( state ) => state.setHoverIndex )


  return (
    <FixedSizeGrid
      columnCount={ COLUMN_COUNT }
      columnWidth={ COLUMN_WIDTH }
      height={ 600 }
      rowCount={ rowCount }
      rowHeight={ ROW_HEIGHT }
      width={ COLUMN_COUNT * COLUMN_WIDTH }
      className="mx-auto"
    >
      { ( { columnIndex, rowIndex, style }: GridChildComponentProps ) =>
      {
        const index = rowIndex * COLUMN_COUNT + columnIndex; // this index goes from zero to featureData.length
        if ( index >= featureData.length ) return null;
        return (
          <div style={ {
            ...style,
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