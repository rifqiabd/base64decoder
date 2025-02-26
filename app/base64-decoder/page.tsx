"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageList from "../components/ImageList";
import { Navbar } from "../components/Navbar";
import Favicon from "react-favicon";

export default function Home() {
  const [base64Data, setBase64Data] = useState("");
  const [decodedImages, setDecodedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Instead of updating state on every keystroke, update the textarea value directly
    if (textareaRef.current) {
      textareaRef.current.value = e.target.value;
    }
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce updating the state
    timeoutRef.current = setTimeout(() => {
      setBase64Data(e.target.value);
    }, 300); // 300ms delay
  }, []);

  const handleDecode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the latest value from the textarea ref
      const inputValue = textareaRef.current?.value || base64Data;
      
      // Log the input value (first few chars)
      console.log("Input value length:", inputValue.length);
      console.log("Input value start:", inputValue.substring(0, 50) + "...");
      
      // Send to the server API
      const response = await fetch('/api/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Data: inputValue }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to decode images');
      }
      
      const data = await response.json();
      console.log("API response:", data);
      console.log("Number of images:", data.images.length);
      if (data.images.length > 0) {
        console.log("First image data (start):", data.images[0].substring(0, 50) + "...");
      }
      
      setDecodedImages(data.images);
    } catch (err) {
      console.error('Error decoding images:', err);
      setError(err instanceof Error ? err.message : 'Failed to decode images');
    } finally {
      setIsLoading(false);
    }
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
            ref={textareaRef}
            className="w-full h-40 mb-4"
            placeholder="Paste your base64 image data here (one per line)"
            defaultValue={base64Data}
            onChange={handleTextareaChange}
          />
          <Button 
            onClick={handleDecode} 
            className="mb-4" 
            disabled={isLoading}
          >
            {isLoading ? 'Decoding...' : 'Decode Images'}
          </Button>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {decodedImages.length > 0 ? (
            <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded">
              <p>Successfully decoded {decodedImages.length} images</p>
            </div>
          ) : isLoading ? (
            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded">
              <p>Decoding images...</p>
            </div>
          ) : (
            <div className="mb-4 p-2 bg-gray-50 border border-gray-200 rounded">
              <p>No images decoded yet. Paste base64 data and click "Decode Images"</p>
            </div>
          )}
          
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
