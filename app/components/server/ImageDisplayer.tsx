import { Image} from '@mantine/core';
import path from 'path';
import datasets_folder from "@/properties/static";

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
                src={path.sep+datasets_folder+path.sep+source}
                alt={alt}
                style={{
                  paddingTop: "4px",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain", // 🔥 this makes it fill the space nicely
                  display: "block"
                }}
            />
        </div>
    )
}

export default ImageDisplayer;