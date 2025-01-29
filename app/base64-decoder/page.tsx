"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ImageList from "../components/ImageList"
import { decodeBase64Images } from "../utils/decodeBase64Images"
import { Navbar } from "../components/Navbar"

export default function Home() {
  const [base64Data, setBase64Data] = useState("")
  const [decodedImages, setDecodedImages] = useState<string[]>([])

  const handleDecode = async () => {
    const images = await decodeBase64Images(base64Data)
    setDecodedImages(images)
  }

  const handleDeleteImages = (indicesToDelete: number[]) => {
    setDecodedImages((prevImages) => prevImages.filter((_, index) => !indicesToDelete.includes(index)))
  }

  const handleClearAll = () => {
    setDecodedImages([])
  }

  return (
    <>
      <Navbar toolName="Base64 Image Decoder" />
      <main className="p-4">
        <div className="max-w-4xl mx-auto">
          <Textarea
            className="w-full h-40 mb-4"
            placeholder="Paste your base64 image data here (one per line)"
            value={base64Data}
            onChange={(e) => setBase64Data(e.target.value)}
          />
          <Button onClick={handleDecode} className="mb-4">
            Decode Images
          </Button>
          <ImageList images={decodedImages} onDeleteImages={handleDeleteImages} onClearAll={handleClearAll} />
        </div>
      </main>
    </>
  )
}

