"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageList from "../components/ImageList";
import { decodeBase64Images } from "../utils/decodeBase64Images";
import { Navbar } from "../components/Navbar";
import Favicon from "react-favicon";

export default function Home() {
  const [base64Data, setBase64Data] = useState("");
  const [decodedImages, setDecodedImages] = useState<string[]>([]);

  const handleDecode = async () => {
    const images = await decodeBase64Images(base64Data);
    setDecodedImages(images);
  };

  const handleDeleteImages = (indicesToDelete: number[]) => {
    setDecodedImages((prevImages) =>
      prevImages.filter((_, index) => !indicesToDelete.includes(index))
    );
  };

  const handleClearAll = () => {
    setDecodedImages([]);
  };

  const titleName = "Base64 Image Decoder";

  return (
    <>
      <Favicon url="/favicon.ico" />
      <title>{titleName}</title>
      <Navbar toolName="Base64 Decoder" />
      <main className="p-4">
        <div className="max-w-5xl mx-auto">
          <Textarea
            className="w-full h-40 mb-4"
            placeholder="Paste your base64 image data here (one per line)"
            value={base64Data}
            onChange={(e) => setBase64Data(e.target.value)}
          />
          <Button onClick={handleDecode} className="mb-4">
            Decode Images
          </Button>
          <ImageList
            images={decodedImages}
            onDeleteImages={handleDeleteImages}
            onClearAll={handleClearAll}
          />
        </div>
      </main>
    </>
  );
}
