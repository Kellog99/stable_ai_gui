import { getModels } from "@/functionalities/NNTrustBackendUtils";
import useStore from "@/store/nnTrustStore";
import styles from "@/styles/ModelCard.module.css";
import { Brain } from 'lucide-react';
import { useEffect } from "react";

export function ModelCard ()
{
    const setModelName = useStore( ( state ) => state.setModelName )
    const modelName = useStore( ( state ) => state.modelName )
    const setModels = useStore( ( state ) => state.setModels )
    const models = useStore( ( state ) => state.models )


    const handleClick = ( clickedModelName: string ) =>
    {
        setModelName( clickedModelName );
        if ( clickedModelName === modelName ) {
            setModelName( null );
        }
    }

    useEffect( () =>
    {
        getModels().then( ( fetchedModels ) =>
        {
            console.log( "Fetched models:", fetchedModels );
            setModels( fetchedModels.models );
        } )
    }, [] )

    console.log( "Models from store:", models );

    return (
        <>
            <div className={ styles.modelsContainer }>
                { models?.map( ( model, index ) => (
                    <div
                        className={ `${styles.card} ${modelName === model.name ? styles.cardSelected : ""
                            }` }
                        key={ index }
                        onClick={ () => handleClick( model.name ) }
                    >
                        <div className={ styles.iconSection }>
                            <Brain className={ styles.icon } />
                        </div>

                        <div className={ styles.contentSection }>
                            <div className={ styles.topSection }>
                                <h3 className={ styles.modelName }>{ model.name }</h3>
                            </div>

                            <div className={ styles.divider }></div>

                            <div className={ styles.bottomSection }>
                                <div className={ styles.infoColumns }>
                                    <div className={ styles.infoRow }>
                                        <span className={ styles.label }>task:</span>
                                        <span className={ styles.value }>{ model.task }</span>
                                    </div>
                                    <div className={ styles.infoRow }>
                                        <span className={ styles.label }>num_classes:</span>
                                        <span className={ styles.value }>{ model.numClasses }</span>
                                    </div>
                                </div>

                                <div className={ styles.infoColumns }>
                                    <div className={ styles.infoRow }>
                                        <span className={ styles.label }>pretrained:</span>
                                        <span className={ styles.value }>{ model.pretrained ? "true" : "false" }</span>
                                    </div>
                                    <div className={ styles.infoRow }>
                                        <span className={ styles.label }>mode:</span>
                                        <span className={ styles.value }>{ model.mode }</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) ) }
            </div>

        </>
    );
}
