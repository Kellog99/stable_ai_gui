"use client"

import  useStore  from "../../store/dsStore";
export default function prova() {
    const { datasetUsed } = useStore();
    
    if (datasetUsed) {
        console.log(datasetUsed)
    }

    return (
        <div>
        <h1>This is a new page</h1>
        
        </div>
    )
}