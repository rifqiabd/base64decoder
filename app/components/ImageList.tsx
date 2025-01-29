import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ImageListProps {
  images: string[]
  onDeleteImages: (indicesToDelete: number[]) => void
  onClearAll: () => void
}

export default function ImageList({ images, onDeleteImages, onClearAll }: ImageListProps) {
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set())

  const toggleImageSelection = (index: number) => {
    const newSelection = new Set(selectedImages)
    if (newSelection.has(index)) {
      newSelection.delete(index)
    } else {
      newSelection.add(index)
    }
    setSelectedImages(newSelection)
  }

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `image_${index + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDeleteSelected = () => {
    onDeleteImages(Array.from(selectedImages))
    setSelectedImages(new Set())
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button
          onClick={handleDeleteSelected}
          disabled={selectedImages.size === 0}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Delete Selected ({selectedImages.size})
        </Button>
        <Button
          onClick={onClearAll}
          disabled={images.length === 0}
          className="bg-gray-500 hover:bg-gray-600 text-white"
        >
          Clear All
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="border rounded-lg p-2 bg-white shadow-sm">
            <img
              src={image || "/placeholder.svg"}
              alt={`Decoded image ${index + 1}`}
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedImages.has(index)}
                onChange={() => toggleImageSelection(index)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">Select</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => downloadImage(image, index)} className="flex-1 text-sm">
                Download
              </Button>
              <Button onClick={() => onDeleteImages([index])} variant="destructive" className="flex-1 text-sm">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

