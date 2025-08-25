import { use } from "react";
import { useState, useEffect } from "react";
// import "./ImageSc.css";

const ImageSc = ({ imgSrc }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [start, setStart] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const getImages = async () => {
      setImages([...images, ...imgSrc]);
      setIsLoading(false);
    };
    getImages();
  }, []);

  useEffect(() => {
    console.log(images);
  }, [images]);

  useEffect(() => {
    let timer = null;
    if (start) {
      timer = setInterval(() => {
        setIndex((prev) => {
          if (prev < images.length - 1) {
            return prev + 1;
          } else {
            return 0;
          }
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [start]);

  return (
    <>
      {isLoading ? (
        <div className="w-1/2 h-1/4 md:w-1/4 rounded-lg shadow-lg bg-gray-300 animate-pulse"></div>
      ) : (
        <img
          className="max-w-md h-auto rounded-lg shadow-lg"
          src={images[index]}
          alt="img"
          onMouseEnter={() => setStart(false)}
          onMouseLeave={() => setStart(true)}
        />
      )}
    </>
  );
};

export default ImageSc;
