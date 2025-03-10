import { useEffect, useState } from "react";

const BlobImage = (props) => {
    const [imageSrc, setImageSrc] = useState(null);
    useEffect(()=> {
        const blob = new Blob([props.file], {type: props.fileType})
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            setImageSrc(reader.result);
        }
    }, [props.blob])
    return (
        <img style={{maxWidth:150, height:"auto"}} src={imageSrc} alt={props.fileName} />
    )
}
export default BlobImage;