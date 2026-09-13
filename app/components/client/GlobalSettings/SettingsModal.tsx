import "./SettingsModal.css"
import {Group, Modal, NativeSelect, ScrollArea, TextInput} from "@mantine/core";
import React, {useEffect, useRef, useState} from "react";
import {Gpu} from "lucide-react";
import {ServerConfig, SettingsModalProps} from "@/interfaces/globalVariableInterface";
import useBackendVariablesStore from "@/store/globalStore";
import {getDevicesList, getServerConfiguration, validatePath} from "@/functionalities/TITANNServices/get_settings";
import {pathConfigs, ServerConfigDescritpion} from "./settingsConfig";
import {handleSave} from "@/functionalities/TITANNServices/post_info";

const SettingsModal: React.FC<SettingsModalProps> = (
    {
        isOpen,
        onClose,
    }
) => {
    const {
        port,
        hostname,
        setPort,
        setHostname
    } = useBackendVariablesStore()

    const [globalParameters, setGlobalParameters] = useState<ServerConfig>()
    const [invalidPaths, setInvalidPaths] = useState<Record<string, boolean>>({})
    const [folderField, setFolderField] = useState<string>()
    const folderInputRef = useRef<HTMLInputElement>(null)

    // Get the global variable from the backend
    useEffect(() => {
        if (!isOpen) return;

        getServerConfiguration(hostname, port)
            .then((configuration) => {
                setGlobalParameters(configuration)
                setInvalidPaths({})
            })
            .catch((err) => console.error("Failed to load server configuration:", err));
    }, [isOpen]);


    /** Update any field in globalParameters */
    const updateField = (field: string, value: string) => {
        setGlobalParameters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validateEditedPath = async (field: string, value: string) => {
        if (!value) {
            setInvalidPaths((current) => ({...current, [field]: false}));
            return;
        }

        try {
            const isValid = await validatePath(hostname, port, value);
            setInvalidPaths((current) => ({...current, [field]: !isValid}));
        } catch (error) {
            console.error("Failed to validate path:", error);
        }
    };

    const chooseFolder = (field: string) => {
        setFolderField(field);
        folderInputRef.current?.click();
    };

    const handleFolderSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile || !folderField) return;

        // Browsers intentionally expose the selected folder as a relative path.
        // This is the path that can safely be passed to the backend for validation.
        const selectedFolder = selectedFile.webkitRelativePath.split("/")[0];
        updateField(folderField, selectedFolder);
        setInvalidPaths((current) => ({...current, [folderField]: false}));
        void validateEditedPath(folderField, selectedFolder);

        // Allow selecting the same folder again later.
        event.target.value = "";
    };


    // ########################### devices ###########################
    const [deviceList, setDeviceList] = useState<string[]>(["cpu"])

    useEffect(() => {
        if (!isOpen) return;

        getDevicesList(hostname, port)
            .then((listDevices: string[]) => {
                if (listDevices && listDevices.length > 0) {
                    setDeviceList(listDevices)
                } else {
                    // the cpu always exists
                    setDeviceList(["cpu"])
                }
            })
    }, [isOpen])
    // ################################################################

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title="Configuration Window"
            classNames={{
                content: "settings-modal-content",
                title: "settings-modal-title",
                header: "settings-modal-header",
                body: "settings-modal-body",
            }}
            scrollAreaComponent={ScrollArea.Autosize}
            centered
            size="40rem"
        >
            <p className="settings-text">
                With this parameters it is possible to set all the paths that are required for a working application (it
                is suggested to provide the absolute path).
                Moreover, it is possible to set the hostname and the port for the backend services and the device where
                the computations will be performed.
            </p>
            <div className="settings-container">
                {
                    Object.entries(pathConfigs).map(([key, config]: [string, ServerConfigDescritpion]) => {
                        const value = globalParameters?.[key as keyof ServerConfig] ?? "";
                        return (
                            <TextInput
                                key={key}
                                label={config.label}
                                description={config.description}
                                value={value}
                                className={`settings-input ${invalidPaths[key] ? "settings-input-invalid" : ""}`}
                                error={invalidPaths[key] ? "This path does not exist." : undefined}
                                rightSection={config.type === "path" ? (
                                    <button
                                        type="button"
                                        className="settings-folder-button"
                                        aria-label={`Select ${config.label}`}
                                        onClick={() => chooseFolder(key)}
                                    >
                                        <config.Icon/>
                                    </button>
                                ) : <config.Icon/>}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newValue = e.target.value;

                                    if (config.type === "number" && !/^\d*$/.test(newValue)) {
                                        return;
                                    }

                                    // Update the controlled value immediately so the input remains editable.
                                    updateField(key, newValue);
                                    setInvalidPaths((current) => ({...current, [key]: false}));

                                    if (key === "host") {
                                        setHostname(newValue);
                                    } else if (key === "port") {
                                        setPort(newValue);
                                    }
                                }}
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    if (config.type === "path") {
                                        void validateEditedPath(key, e.currentTarget.value);
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
                    rightSection={<Gpu/>}
                />
            </div>

            <input
                ref={folderInputRef}
                className="settings-folder-input"
                type="file"
                // @ts-expect-error webkitdirectory is supported by Chromium-based browsers.
                webkitdirectory="true"
                directory="true"
                onChange={handleFolderSelected}
            />

            <Group className="settings-actions" justify="center">
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
