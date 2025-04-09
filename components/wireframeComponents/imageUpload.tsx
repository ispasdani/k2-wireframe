"use client";

import { CloudUpload, Files, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const ImageUpload = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const onImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const imageUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(imageUrl);
    }
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {!previewUrl ? (
          <div className="p-7 border border-dashed rounded-md shadow-md flex flex-col justify-center items-center">
            <CloudUpload className="h-10 w-10" />
            <h2 className="font-bold text-lg">Upload Image</h2>

            <p className="text-gray-400 mt-3">Select Wireframe Image</p>

            <div className="p-5 border border-dashed w-full flex items-center justify-center mt-7">
              <label htmlFor="imageSelect">
                <p className="p-2 bg-primary text-white rounded-md px-5 cursor-pointer">
                  Select Image
                </p>
              </label>
            </div>
            <input
              type="file"
              id="imageSelect"
              className="hidden"
              multiple={false}
              onChange={onImageSelect}
            />
          </div>
        ) : (
          <div className="p-5 border border-dashed rounded-md">
            <Image
              src={previewUrl}
              alt="preview of uploaded image"
              width={500}
              height={500}
              className="w-full h-[300px] object-contain"
            />
            <X
              className="flex justify-center items-center w-full cursor-pointer mt-4"
              onClick={() => setPreviewUrl(null)}
            />
          </div>
        )}
        <div className="p-7 border border-dashed shadow-md rounded-md">
          <p className="font-bold text-lg">
            Enter description about your desired code
          </p>
          <Textarea
            className="mt-3 h-[200px]"
            placeholder="Write about your code"
          />
        </div>
      </div>

      <div className="mt-7 flex items-center justify-center w-full">
        <Button className="w-full cursor-pointer">
          <WandSparkles /> Convert To Code
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
