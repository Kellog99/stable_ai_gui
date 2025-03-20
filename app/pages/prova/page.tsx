import  useStore  from "../../store/dsStore";

export default async function prova(props: {searchParams: Promise<{ name: string }> }) {
    
    const { searchParams } = props;
  
    const { name } = await searchParams;
   


    return (
        <div>
        <h1>This is a new page</h1>
        <h2>You are using {name} dataset</h2>
        </div>
    )
}