"use client"

import FileDropZone from '@/components/client/FileDropZone';
import styles from '@/styles/HomePage.module.css';
import { listOfSections } from '@/components/layout/homePageConfig';


export default function HomePage() {


    return (
        <div className={styles.home_page}>
            <div className={styles.home_container}>
                <div className={styles.home_header}>
                    <h1 className={styles.home_title}>
                        Welcome to Stable-AI
                    </h1>
                    <p className={styles.home_subtitle}>
                        Upload the <b>Dataset</b> or the <b>Model</b> in the space below or upload them from the appropriate <b>Repository</b> to conduct a quality and vulnerability analysis.
                    </p>
                </div>

                <div className={styles.upload_grid}>
                    {listOfSections.map((dropElement, index) => (
                        <FileDropZone
                            key={index}
                            {...dropElement}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
