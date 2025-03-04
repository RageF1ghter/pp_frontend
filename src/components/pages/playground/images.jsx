import { useState, useEffect } from "react";
export default function Images() {
    const [images, setImages] = useState([]);

    const fetchCat = async () => {
        const response = await fetch("https://api.thecatapi.com/v1/images/search");
        const data = await response.json();
        setImages([...images, data[0]]);
    };

    useEffect(() => {
        fetchCat();
    },[]);

    return(
        <>
            <h2>Cat!!!</h2>
            {images.map((image) => (
                <div key={image.id}>
                    <img key={image.id} src={image.url} alt="Cat img" loading="lazy"/>
                </div>
                
            ))}
        </>
    )

    
}