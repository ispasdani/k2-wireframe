"use client";

import { CloudUpload, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCodeStore } from "@/store/codeStore";
import { useUser } from "@clerk/nextjs";

interface AIModel {
  name: string;
  icon: string;
}

const ImageUpload: React.FC = () => {
  const AIModelList: AIModel[] = [
    {
      name: "Gemini Google",
      icon: "/icons/google.png",
    },
    {
      name: "llama By Meta",
      icon: "/icons/meta.png",
    },
    {
      name: "Deepseek",
      icon: "/icons/deepseek.png",
    },
  ];

  // Hooks must be called unconditionally
  const { user } = useUser();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const setCodeData = useCodeStore(
    (state: { setCodeData: any }) => state.setCodeData
  );
  const codeData = useCodeStore((state) => state.codeData);
  const generateCodeWithGemini = useAction(
    api.generatedWithGoogleGemini.generateCodeWithGemini
  );

  const onImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files[0]) {
      const imageUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(imageUrl);

      // Convert image to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result?.toString().split(",")[1] || "";
        setCodeData({
          imageBase64: base64,
          description,
          generatedCode: "",
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleGenerateCode = async () => {
    if (!previewUrl || !selectedModel || !user) return;

    if (selectedModel === "Gemini Google") {
      try {
        const { imageBase64, description: storedDescription } =
          useCodeStore.getState().codeData;
        const userId = user.id;
        const generatedCode = await generateCodeWithGemini({
          imageBase64,
          description: storedDescription || undefined,
          userId,
        });
        setCodeData({
          imageBase64,
          description: storedDescription,
          generatedCode,
        });
      } catch (error) {
        console.error("Error generating code:", error);
      }
    }
    // Add logic for other models later
  };

  console.log(codeData);

  // Render loading state after hooks
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {!previewUrl ? (
          <div className="p-7 border border-dashed rounded-md shadow-md flex flex-col justify-center items-center">
            <CloudUpload className="h-10 w-10" />
            <h2 className="font-bold text-lg">Upload Image</h2>
            <p className="text-gray-400 mt-3">Select Wireframe Image</p>
            <div className="p-5 border border-dashed w-full h-full flex items-center justify-center mt-7 rounded-md">
              <label htmlFor="imageSelect">
                <p className="py-2 bg-primary text-white rounded-md px-5 cursor-pointer">
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
              onClick={() => {
                setPreviewUrl(null);
                setCodeData({
                  imageBase64: "",
                  description,
                  generatedCode: "",
                });
              }}
            />
          </div>
        )}
        <div className="p-7 border border-dashed shadow-md rounded-md">
          <p className="font-bold text-lg">Select AI Model</p>
          <Select onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              {AIModelList.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  <div className="flex items-center">
                    <Image
                      src={model.icon}
                      alt={model.name}
                      width={18}
                      height={18}
                      className="mr-2"
                    />
                    {model.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="font-bold text-lg mt-7">
            Enter description about your desired code
          </p>
          <Textarea
            className="mt-3 h-[200px]"
            placeholder="Write about your code"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setCodeData({
                imageBase64: useCodeStore.getState().codeData.imageBase64,
                description: e.target.value,
                generatedCode: useCodeStore.getState().codeData.generatedCode,
              });
            }}
          />
        </div>
      </div>

      <div className="mt-7 flex items-center justify-center w-full">
        <Button
          className="w-full cursor-pointer py-5"
          onClick={handleGenerateCode}
          disabled={!previewUrl || !selectedModel || !user}
        >
          <WandSparkles className="mr-2" /> Convert To Code
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
