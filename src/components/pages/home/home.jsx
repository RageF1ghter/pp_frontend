import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Home() {
  return (
    <>
      <p>Homepage</p>
      {/* <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button variant="secondary">Button</Button>
        <div
          role="button"
          aria-pressed="false"
          tabindex="0"
          onclick="toggleLike()"
          onKeyDown="if(event.key==='Enter') toggleLike()"
        >
          ❤️ Like
        </div>
      </div> */}
    </>
  );
}

export default Home;
