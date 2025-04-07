import { Badge, Card, CardSection, Group, Text } from "@mantine/core";
import { FixedSizeGrid, GridChildComponentProps } from "react-window";
import ImageDisplayer from "./ImageDisplayer";
import TextDisplayer from "./TextDisplayer";
import classes from '../../pages/dataquality/embeddings/page.module.css'
import { image_type, text_type } from "@/properties/types";

function FeatureCard ( { index, data, featureType, label }: { index: number, data: string, featureType: string, label?: number } ){
  
  return (
    <Card className={classes.card} shadow="sm" padding="lg" radius="md" withBorder>
      <CardSection className={classes.cardsection}>
        { featureType === image_type ? (
           <ImageDisplayer className={classes.ImageDisplayer} data={ data } alt="" />
        ) : featureType === text_type ? (
          <TextDisplayer className={classes.TextDisplayer} data={ data } />
        ) : null }
      </CardSection>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={ 700 } size="lg">Sample: { index }</Text>
        {label != null ? <Badge color="#ec777e"> Class: { label } </Badge> : null }
      </Group>
      {/*
      <Text size="sm" c="dimmed">
        INFO
      </Text>
      */}
    </Card>
  );
}


export default function FeatureDisplayer({ indexes, featureData, featureType, labelData }: { indexes: number[], featureData: string[], featureType: string, labelData?: number[] }) {
    const COLUMN_COUNT = 4;
    const COLUMN_WIDTH = 300;
    const ROW_HEIGHT = 350;
    const rowCount = Math.ceil( featureData.length / COLUMN_COUNT );

    

    return (
        <FixedSizeGrid
            columnCount={COLUMN_COUNT}
            columnWidth={COLUMN_WIDTH}
            height={600}
            rowCount={rowCount}
            rowHeight={ROW_HEIGHT}
            width={COLUMN_COUNT * COLUMN_WIDTH}
            className="mx-auto"
        >
            {({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
            const index = rowIndex * COLUMN_COUNT + columnIndex; // this index goes from zero to featureData.length
            if (index >= featureData.length) return null;
            return (
                <div style={{
                ...style,
                padding: '8px',
                }}>
                <FeatureCard index={indexes[index]} data={featureData[index]} featureType={featureType} {...(labelData ? { label: labelData[index] } : {})} />
                </div>
            );
            }}
        </FixedSizeGrid>
    )
}