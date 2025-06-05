
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Home() {
  const { username } = useParams();
  const [time, setTime] = useState('morning');

  const getHour = () => {
    const date = new Date();
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) {
      setTime('morning');
    } else if (hour >= 12 && hour < 18) {
      setTime('afternoon');
    } else {
      setTime('evening');
    }
  }

  useEffect(() => {
    getHour();
  }, []);
  return (
    <>
      <h1>This is the homepage</h1>
      <h2>Good {time}, {username}</h2>
      <p className="text-sm md:text-base lg:text-xl">
        Responsive text
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 bg-red-200">Left</div>
        <div className="w-full md:w-1/2 bg-blue-200">Right</div>
      </div>
    </>
  )
}

export default Home;
