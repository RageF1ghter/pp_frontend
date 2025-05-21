
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
    </>
  )
}

export default Home;
