import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import { useParams } from "react-router-dom";
import useFetch from "./useFetch";
import "./home.css";
import Game from "./2048";

function Home() {
  return (
    <>
      {/* <div className="triangle-up"></div>
      <div className="triangle-down"></div>
      <div className="triangle-left"></div>
      <div className="triangle-right"></div> */}
      <Game></Game>
    </>
  );
}

export default Home;
