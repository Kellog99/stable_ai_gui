import { darkenColor, getStatusColor, getStatusIcon } from "@/functionalities/Utils";
import { Alert, Text } from "@mantine/core";
import React from "react";

interface AlertProps {
    result: "success" | "warning" | "error";
    textToDisplay: React.ReactNode;
}

export function AlertCust({ result, textToDisplay }: AlertProps) {
    const color = getStatusColor(result)
    const darkColor = darkenColor(color, 40);

    return (
        <>
            <Alert
                variant="filled"
                color={color}
                radius="md"
                title={
                    <span style={{ color: darkenColor(color, 40) }}>
                        {result.charAt(0).toUpperCase() + result.slice(1)}
                    </span>
                }
                icon={React.cloneElement(getStatusIcon(result), { color: darkColor })}
                style={{ display: 'inline-block', maxWidth: '100%', marginTop: "30px" }}>
                <Text size="sm">
                    <span style={{ color: darkenColor(color, 40) }}>
                        {textToDisplay}
                    </span>
                </Text>
            </Alert>
        </>
    )
}