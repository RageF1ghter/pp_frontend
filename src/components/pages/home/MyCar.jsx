import ExpandCard from "./expand";
import ImageSc from "./ImageSc";
const MyCar = () => {
  const myCars = ["/alfa_01.JPEG", "/alfa_02.JPEG", "/alfa_03.JPEG"];

  const content = (
    <div className="flex flex-col gap-y-2">
      <p>This is my 2017 Alfa Romeo Giulia</p>
      <ImageSc imgSrc={myCars} imgAlt="My Car" />
    </div>
  );

  return <ExpandCard content={content} contentName="My Car" />;
};

export default MyCar;
