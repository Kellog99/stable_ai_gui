import {Text} from '@mantine/core';

export default function TextDisplayer({ data, className }: {data: string, className: string}) {
    return(
        <div className={className}>
            <Text fw={500}>{data}</Text>
        </div>
    )

}