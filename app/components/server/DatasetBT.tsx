import useStore from '@/store/dsStore';
import
{
  faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Badge, Card, CardSection, Grid, GridCol, Group, Text } from '@mantine/core';
import Dataset from "../../interfaces/genericInterface";
import { image_type, text_type } from "../../properties/types";
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
  const datasetName = useStore( ( state ) => state.datasetUsed )?.name
  const datasetUsed = useStore( ( state ) => state.datasetUsed )
  const setDatasetUsed = useStore( ( state ) => state.setData )


  if ( !datasets ) {
    return null
  } else {
    console.log( "DATASETS LOADED", datasets );
    const filteredDatasets = query
      ? datasets?.filter( dataset =>
        dataset.name.toLowerCase().includes( query.toLowerCase() )
      )
      : datasets;

    const handleClick = ( dataset: Dataset ) =>
    {
      setDatasetUsed( dataset );
      if ( dataset.name === datasetName ) {
        setDatasetUsed( null );
      }
    }


    return (
      <div className={ classes.dataset_buttons }>
        <Grid
          columns={ 3 }
          gutter="xs"
        >

          { filteredDatasets.length > 0 ? ( filteredDatasets.map( ( dataset, index ) => (

            <GridCol span={ 1 } key={ index }>
              <Card
                className={ `${classes.card} ${datasetName === dataset.name ? classes.cardSelected : ""
                  }` }
                onClick={ () => handleClick( dataset ) }
              >
                <CardSection className={ classes.cardsection }>

                  { dataset.prototype.type === image_type ? (
                    <ImageDisplayer className={ classes.ImageDisplayer } data={ dataset.prototype.datas[ 0 ] } alt={ dataset.name } />
                  ) : dataset.prototype.type === text_type ? (
                    <TextDisplayer className={ classes.TextDisplayer } data={ dataset.prototype.datas[ 0 ] } />
                  ) : null }
                </CardSection>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={ 700 } size="lg" c="#334155">{ dataset.name }</Text>
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
