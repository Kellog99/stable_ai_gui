import "./SettingsModal.css"
import { Group, Modal, NativeSelect, ScrollArea, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Gpu } from "lucide-react";
import { ServerConfig, SettingsModalProps } from "@/interfaces/globalVariableInterface";
import useBackendVariablesStore from "@/store/globalStore";
import { getDevicesList, getServerConfiguration, validatePath } from "@/functionalities/TITANNServices/get_settings";
import { pathConfigs, ServerConfigDescritpion } from "./settingsConfig";
import { handleSave } from "@/functionalities/TITANNServices/post_info";

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
}) => {
    const {
        port,
        hostname,
        setPort,
        setHostname
    } = useBackendVariablesStore()

    const [globalParameters, setGlobalParameters] = useState<ServerConfig>()

    // Get the global variable from the backend
    useEffect(() => {
        getServerConfiguration(hostname, port)
            .then(setGlobalParameters)
            .then(() => { })
    }, [hostname, port]);
    console.log("global parameters = ", globalParameters)


    /** Update any field in globalParameters */
    const updateField = (field: string, value: string) => {
        setGlobalParameters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };



    // ########################### devices ###########################
    const [deviceList, setDeviceList] = useState<string[]>(["cpu"])

    useEffect(() => {
        getDevicesList(hostname, port)
            .then((listDevices: string[]) => {
                if (listDevices && listDevices.length > 0) {
                    setDeviceList(listDevices)
                }
                else {
                    // the cpu always exists
                    setDeviceList(["cpu"])
                }
            })
    }, [hostname, port])
    // ################################################################

    console.log("globalParameters = ", globalParameters)
    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title="Configuration Window"
            styles={{
                content: {
                    minHeight: "400px",
                    borderRadius: '16px',
                    padding: "10px",
                    backgroundColor: "var(--bg)",
                    color: "white"
                },
                title: {
                    fontWeight: "bold",
                    fontSize: "1.7rem",
                    margin: 0,
                    color: "white"
                },
                header: {
                    background: "none"
                },
                body: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                }
            }}
            scrollAreaComponent={ScrollArea.Autosize}
            centered
            size="40rem"
        >
            <p className="settings-text">
                With this parameters it is possible to set all the paths that are required for a working application (it is suggested to provide the absolute path).
                Moreover, it is possible to set the hostname and the port for the backend services and the device where the computations will be performed.
            </p>
            <div className="settings-container">
                {
                    Object.entries(pathConfigs).map(([key, config]: [string, ServerConfigDescritpion]) => {
                        const value = globalParameters?.[key as keyof ServerConfig] ?? "";
                        console.log(`config key = ${key}, value = ${value}`)

                        return (
                            <TextInput
                                key={key}
                                className="flex-1"
                                label={config.label}
                                description={config.description}
                                value={value}
                                rightSection={<config.Icon />}
                                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newValue = e.target.value;
                                    let isValid = true;

                                    if (config.type === "path") {
                                        isValid = await validatePath(hostname, port, newValue);
                                    }
                                    else if (config.type === "number") {
                                        isValid = /^\d*$/.test(newValue);
                                    }
                                    if (isValid || config.type !== "number") {
                                        if (key === "host") {
                                            setPort(newValue)
                                        }
                                        if (key === "port") {
                                            setHostname(newValue)
                                        }
                                        updateField(key, newValue);
                                    }

                                }}
                            />
                        )
                    })
                }
                <NativeSelect
                    label="Select Device"
                    description="Select the device where the computation occours."
                    data={deviceList}
                    rightSection={<Gpu />}
                />
            </div>

            <Group mt="lg" justify="center">
                <button
                    onClick={onClose}
                    className="settings-button close"
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        handleSave(globalParameters)
                            .then(onClose)
                    }}
                    className="settings-button save">
                    Save
                </button>
            </Group>
        </Modal>
    );
}

export default SettingsModal;