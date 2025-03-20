import {Text} from '@mantine/core';

export default function TextDisplayer({ data }: {data: string}) {
    return(
        <div>
            <Text fw={500}>{data}</Text>
        </div>
    )

}