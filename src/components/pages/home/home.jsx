import { List } from "lucide-react";
import React from "react";
import MyWorks from "./work_exps";
import MyCar from "./MyCar";

function Home() {
  const imagePath = "/myself.jpg";
  return (
    <>
      <div className="flex flex-col items-center min-h-screen py-2 font-sans">
        <p className="text-3xl font-bold text-gray-600">
          A Little About Myself
        </p>

        <div className="flex flex-col py-5 md:flex-row px-10 gap-x-10 w-full">
          <img
            loading="lazy"
            src={imagePath}
            alt="NO-IMAGE"
            className="w-1/2 h-1/4 md:w-1/4 rounded-lg shadow-lg"
          />
          <div>
            <p className="font-sans leading-relaxed mb-1">
              Hey, This is Zhiyuan, you can also call me Alex if the
              pronounciation is a problem. I made this page mainly introdcing
              myself and my work, hopefully it can bring me a job, LoL.
            </p>
            <p className="font-sans leading-relaxed mb-1">
              This website includes my previous work experience and some of my
              self-made mini projects. There are also some of photos about me
              and my hobbies. Feel free to take a look.
            </p>
            <p className="font-light text-sm leading-relaxed mb-1">
              This website is still under development, bugs may be found.
            </p>
            <div className="flex flex-col gap-y-4">
              <MyWorks />
              <MyCar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
