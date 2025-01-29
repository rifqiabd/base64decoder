"use client";

import { Button } from "@/components/ui/button";
import { Navbar } from "./components/Navbar";
import Favicon from "react-favicon";

export default function Home() {
  return (
    <>
      <Favicon url="/favicon.ico" />
      <Navbar toolName="Home" />
      <title>Home</title>
      <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-5xl font-bold text-center">
          Bulk Base64 Image Decoder!
        </h1>
        <p className="mt-4 text-lg text-center">
          Decode multiple base64 images at once!
        </p>

        <div className="mt-5 p-5 rounded border shadow w-2xl max-w-3xl">
          <ol>
            <li>For scrapping website images.</li>
          </ol>
        </div>
      </div>
    </>
  );
}
