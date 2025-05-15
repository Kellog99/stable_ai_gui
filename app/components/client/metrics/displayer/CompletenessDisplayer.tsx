import { BarChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import { Flex, RingProgress, Text } from '@mantine/core';

export default function CompletenessDisplayer ()
{
    const data = [
        { month: 'January', Smartphones: 1200, Laptops: 900, Tablets: 200 },
        { month: 'February', Smartphones: 1900, Laptops: 1200, Tablets: 400 },
        { month: 'March', Smartphones: 400, Laptops: 1000, Tablets: 200 },
        { month: 'April', Smartphones: 1000, Laptops: 200, Tablets: 800 },
        { month: 'May', Smartphones: 800, Laptops: 1400, Tablets: 1200 },
        { month: 'June', Smartphones: 750, Laptops: 600, Tablets: 1000 },
    ];
    return (
        <>
            <Flex
                direction="column"
                align="center"
            >
                {/*
                <h3>Score on the { featureName } feature</h3>*/}

                <RingProgress
                    size={ 180 }
                    roundCaps
                    sections={ [ { value: 80, color: 'green' } ] }
                    transitionDuration={ 1000 }
                    //label = {80}
                    label={ <Text ta="center" fw={ 700 } size="lg">{ 80 }%</Text> }
                />


                <BarChart
                    h={ 300 }
                    data={ data }
                    dataKey="month"
                    getBarColor={ ( value ) => ( value > 700 ? 'teal.8' : 'red.8' ) }
                    series={ [ { name: 'Laptops', color: 'gray.6' } ] }
                />
            </Flex>
        </>
    )
}