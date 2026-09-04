"use client"

import FileDropZone from '@/components/client/upload/FileDropZone';
import styles from '@/styles/HomePage.module.css';
import {useEffect} from 'react';

import {getAttacksList, getCoreElements, getMetricsList} from './functionalities/TITANNServices/get_info';
import useNNTrustStore from '@/store/nnTrustStore';
import {Brain, DatabaseIcon} from 'lucide-react';
import {infoDataset, infoModel} from './components/client/upload/config';
import {DatasetInfo, ModelInfo} from './interfaces/homePageInterface';
import useBackendVariablesStore from './store/globalStore';
import {title} from './store/title';

export default function HomePage() {

    // Extracting the main variables that are needed for the services.
    const {
        hostname,
        port
    } = useBackendVariablesStore()

    // At this level It is asked for the list of all the attacks
    const {
        model,
        listModels,
        dataset,
        listDatasets,
        setModel,
        setDataset,
        setAttacks,
        setMetrics,
        setListModels,
        setListDatasets,
    } = useNNTrustStore()

    // ################## Attacks' list ##################
    useEffect(() => {
        getMetricsList(hostname, port)
            .then(setMetrics)
            .catch(err => console.error("Failed to load attacks:", err));
    }, [setMetrics, hostname, port]);

    useEffect(() => {
        getAttacksList(hostname, port)
            .then(setAttacks)
            .catch(err => console.error("Failed to load attacks:", err));
    }, [setAttacks, hostname, port]);

    // ################## Models' list ##################
    useEffect(() => {
        if (listModels !== null) return;

        getCoreElements(
            hostname,
            port,
            "path_model_repo",
            "model"
        )
            .then((listModels) => setListModels(listModels as ModelInfo[]))
            .catch(err => console.error("Failed to load models:", err));
    }, [hostname, port, listModels, setListModels]);

    // ################## Datasets' list ##################
    useEffect(() => {
        if (listDatasets !== null) return;

        getCoreElements(
            hostname,
            port,
            "path_ds_repo",
            "dataset"
        )
            .then((listDatasets) => setListDatasets(listDatasets as DatasetInfo[]))
            .catch(err => console.error("Failed to load datasets:", err));
    }, [hostname, port, listDatasets, setListDatasets]);


    // ################## Selection handler ##################
    // this handler works fine for both model and dataset
    const createToggleHandler = <T extends ModelInfo | DatasetInfo>(
        setter: (value: T | null) => void,
        currentValue: T | null
    ) => {
        return (selected: T | null) => {
            if (selected === null) {
                setter(null);
                return;
            }

            setter(selected.id === currentValue?.id ? null : selected);
        };
    };

    // ################## Deletion handler ##################
    const createDeletionHandler = <T extends ModelInfo | DatasetInfo>(
        setter: (value: T[]) => void,
        currentList: T[]
    ) => {
        return (selected: T) => {
            setter(currentList.filter(value => value.id !== selected.id));
        };
    };
    return (
        <div className={styles.home_page}>
            <div className={styles.home_header}>
                <h1 className={styles.home_title}>
                    Welcome to {title}
                </h1>
                <p className={styles.home_subtitle}>
                    Upload the <b>Dataset</b> or the <b>Model</b> in the space below or upload them from the
                    appropriate <b>Repository</b> to conduct a quality and vulnerability analysis.
                </p>
            </div>

            <div className={styles.upload_container}>
                {/* Model selection */}
                <div className={styles.selection_card}>
                    <FileDropZone
                        key="model_loader"
                        title="Model"
                        description="Drag and drop your model or choose an existing model."
                        elements={listModels ?? []}
                        Icon={Brain}
                        fileDropInformation={infoModel}
                        handleSelection={createToggleHandler(setModel, model)}
                        handleDeletion={createDeletionHandler(setListModels, listModels ?? [])}
                        handleRefresh={() => setListModels(null)}
                    />
                </div>

                {/* Dataset selection */}
                <div className={styles.selection_card}>
                    <FileDropZone
                        key="dataset_loader"
                        title="Dataset"
                        description="Load your dataset or choose an existing dataset."
                        elements={listDatasets ?? []}
                        Icon={DatabaseIcon}
                        fileDropInformation={infoDataset}
                        handleSelection={createToggleHandler(setDataset, dataset)}
                        handleDeletion={createDeletionHandler(setListDatasets, listDatasets ?? [])}
                        handleRefresh={() => setListDatasets(null)}
                    />
                </div>
            </div>
        </div>
    );
}
