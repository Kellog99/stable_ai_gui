"use client"

import { Flex, Paper, RingProgress, Text } from "@mantine/core"


interface DuplicatesDTO
{
    name: string,
    featureName: string,
    score: number,
    indexes: [ number, number ][]
}
export default function DuplicatesDisplayer ( duplicates: DuplicatesDTO )
{
    return (
        <>
            <Flex
                direction="column"
                align="center"
            >
                <h2>This is the Duplicates component</h2>
                <h3>{ duplicates.name } metric computed on the { duplicates.featureName } feature</h3>

                <RingProgress
                    size={ 180 }
                    roundCaps
                    sections={ [ { value: duplicates.score, color: 'green' } ] }
                    transitionDuration={ 1000 }
                    label={ <Text ta="center" fw={ 700 } size="lg">{ duplicates.score }%</Text> }
                />

                
            </Flex>
        </>
    )

}