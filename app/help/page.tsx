"use client";

import { Navbar } from "../components/Navbar";
import Favicon from "react-favicon";

export default function Help() {
  return (
    <>
      <Favicon url="/favicon.ico" />
      <Navbar toolName="Help" />
      <title>Help</title>
      <div className="mt-2 p-8 max-w-4xl">
        <h2 className="text-4xl font-semibold">How to Use</h2>
        <ol className="list-decimal list-inside mt-4 text-left">
          <li>Open the website from which you want to scrape images.</li>
          <li>
            Obtain the Base64 data through devtools by right-clicking anywhere,
            then select inspect tools or use the F12 shortcut.
          </li>
          <li>Go to the network tab, then refresh with Ctrl+R.</li>
          <li>Filter the network by the format &quot;data:image/jpeg&quot;.</li>
          <li>
            Right-click on one of the data entries, and copy all fetch (node.js).
          </li>
          <li>Return to the decoder application and paste it into the input.</li>
          <li>Happy decoding 🥳</li>
        </ol>
      </div>
    </>
  );
}
