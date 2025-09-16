import
{
  faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Badge, Card, CardSection, Grid, GridCol, Group, Text } from '@mantine/core';
import Dataset from "../../interfaces/genericInterface";
import { image_type, text_type } from "../../properties/types";
import RouterButton from "../client/buttons/RouterButton";
import classes from './DatasetBT.module.css';
import ImageDisplayer from "./ImageDisplayer";
import TextDisplayer from "./TextDisplayer";

interface DatasetBTProps
{
  query?: string;
  datasets: Dataset[] | null;
}


export default function DatasetBT ( { query, datasets }: DatasetBTProps )
{

  if ( !datasets ) {
    return null
  } else {
    const filteredDatasets = query
      ? datasets?.filter( dataset =>
        dataset.name.toLowerCase().includes( query.toLowerCase() )
      )
      : datasets;

    return (
      <div className={ classes.dataset_buttons }>
        <Grid
          columns={ 4 }
          gutter="xs"
        >

          { filteredDatasets.length > 0 ? ( filteredDatasets.map( ( dataset, index ) => (

            <GridCol span={ 1 } key={ index }>
              <Card className={ classes.card } shadow="sm" padding="lg" radius="md" withBorder>
                <CardSection className={ classes.cardsection }>
                  <RouterButton name={ dataset.name } route="/pages/dataquality/datasets">
                    { dataset.prototype.type === image_type ? (
                      <ImageDisplayer className={ classes.ImageDisplayer } data={ dataset.prototype.datas[ 0 ] } alt={ dataset.name } />
                    ) : dataset.prototype.type === text_type ? (
                      <TextDisplayer className={ classes.TextDisplayer } data={ dataset.prototype.datas[ 0 ] } />
                    ) : null }
                  </RouterButton>
                </CardSection>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={ 700 } size="lg">{ dataset.name }</Text>
                  <Badge color="#334155">{ dataset.task }</Badge>
                </Group>
                <Text size="sm" c="dimmed">
                  { dataset.n_samples } samples
                </Text>
              </Card>
            </GridCol>
          ) )
          ) : (
            <Alert
              variant="light"
              color="orange"
              radius="md"
              title="Attention!"
              icon={ <FontAwesomeIcon icon={ faCircleExclamation } /> }
              style={ { display: 'inline-block', maxWidth: '100%', marginTop: "30px" } }
            >
              No datasets found.
              <br />
              Try uploading a new dataset or check the datasets folder.

            </Alert>
          ) }
        </Grid>
      </div>

    );

  }
}
