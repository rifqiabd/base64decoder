import { useState } from "react";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ArrowBigDownDash, FileArchive, RotateCcw, Trash2 } from "lucide-react";

interface ImageListProps {
  images: string[];
  onDeleteImages: (indicesToDelete: number[]) => void;
  onClearAll: () => void;
}

export default function ImageList({
  images,
  onDeleteImages,
  onClearAll,
}: ImageListProps) {
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());

  const toggleImageSelection = (index: number) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedImages(newSelection);
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `image_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteSelected = () => {
    onDeleteImages(Array.from(selectedImages));
    setSelectedImages(new Set());
  };

  const downloadSelectedImages = async () => {
    const zip = new JSZip();
    images.forEach((image, index) => {
      if (selectedImages.has(index)) {
        // Extract base64 data from data URL
        const base64Data = image.split(",")[1];
        zip.file(`image_${index + 1}.jpg`, base64Data, { base64: true });
      }
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "selected_images.zip");
  };

  const downloadAllImages = async () => {
    const zip = new JSZip();
    images.forEach((image, index) => {
      // Extract base64 data from data URL
      const base64Data = image.split(",")[1];
      zip.file(`image_${index + 1}.jpg`, base64Data, { base64: true });
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "all_images.zip");
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button
          onClick={handleDeleteSelected}
          disabled={selectedImages.size === 0}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Trash2 /> Delete ({selectedImages.size})
        </Button>

        <Button
          variant="destructive"
          onClick={onClearAll}
          disabled={images.length === 0}
        >
          <RotateCcw /> Star Over
        </Button>

        <Button
          onClick={downloadSelectedImages}
          disabled={selectedImages.size === 0}
        >
          <ArrowBigDownDash /> Selected ({selectedImages.size})
        </Button>

        <Button onClick={downloadAllImages} disabled={images.length === 0}>
          <FileArchive /> Zip ({selectedImages.size})
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
              <Button
                onClick={() => downloadImage(image, index)}
                className="flex-1 text-sm"
              >
                Download
              </Button>
              <Button
                onClick={() => onDeleteImages([index])}
                variant="destructive"
                className="flex-1 text-sm"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
