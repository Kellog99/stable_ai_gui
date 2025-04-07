import { Image} from '@mantine/core';

function ImageDisplayer({ data, alt, className }: {data: string | Uint8Array | URL, alt: string, className: string}) {
    
    let source: string;

    if (typeof data === "string" || data instanceof URL )  {
        source = data.toString();
        
      } else if (data instanceof Uint8Array) {
        const blob = new Blob([data], { type: "image/png" });
        source = URL.createObjectURL(blob);
      } else {

        return <p>Invalid image data</p>;
      }

    return(
        <div className={className}>
            <Image
                src={source}
                alt={alt}
            />
        </div>
    )
}

export default ImageDisplayer;