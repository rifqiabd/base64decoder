"use client";

import { Navbar } from "./components/Navbar";
import Favicon from "react-favicon";

export default function Home() {
  return (
    <>
        <Favicon url="/favicon.ico" />
        <Navbar toolName="Home" />
        <title>Home</title>
    </>
  );
}
