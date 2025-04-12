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

// Define props to include our callback
interface ImageUploadProps {
  onGenerateSuccess: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onGenerateSuccess }) => {
  const AIModelList: AIModel[] = [
    { name: "Gemini Google", icon: "/icons/google.png" },
    { name: "llama By Meta", icon: "/icons/meta.png" },
    { name: "Deepseek", icon: "/icons/deepseek.png" },
  ];

  const { user } = useUser();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const setCodeData = useCodeStore((state) => state.setCodeData);
  const codeData = useCodeStore((state) => state.codeData);
  const generateCodeWithGemini = useAction(
    api.generatedWithGoogleGemini.generateCodeWithGemini
  );

  // Update the selected model in the store along with its icon path
  const handleModelChange = (modelValue: string) => {
    const selectedModelData = AIModelList.find(
      (model) => model.name === modelValue
    );
    setCodeData({
      selectedModel: modelValue,
      selectedModelIcon: selectedModelData?.icon || "",
    });
  };

  const onImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const imageUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(imageUrl);

      // Convert image to base64 and update the store while preserving the current description
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result?.toString().split(",")[1] || "";
        setCodeData({
          imageBase64: base64,
          // Keep existing description and reset generatedCode for a new generation
          description: codeData.description,
          generatedCode: "",
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleGenerateCode = async () => {
    if (
      (!previewUrl && !codeData.imageBase64) ||
      !codeData.selectedModel ||
      !user
    )
      return;

    if (codeData.selectedModel === "Gemini Google") {
      try {
        const { imageBase64, description } = useCodeStore.getState().codeData;
        const userId = user.id;
        const generatedCode = await generateCodeWithGemini({
          imageBase64,
          description: description || undefined,
          userId,
        });
        // Update the store with the new generated code; other values remain unchanged.
        setCodeData({
          imageBase64,
          description,
          generatedCode,
          selectedModel: codeData.selectedModel,
          selectedModelIcon: codeData.selectedModelIcon,
        });
        // Switch the active tab to "reviewResult" after code generation succeeds.
        onGenerateSuccess();
      } catch (error) {
        console.error("Error generating code:", error);
      }
    }
    // Add logic for other models if needed later.
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setCodeData({
      imageBase64: "",
      description: "",
      generatedCode: "",
      selectedModel: "",
      selectedModelIcon: "",
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Image Upload Panel */}
        {!previewUrl && !codeData.imageBase64 ? (
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
          <div className="p-5 border border-dashed rounded-md shadow-md relative">
            {/*
              Use the local previewUrl if available; otherwise show
              the uploaded image from the store (converted from base64)
            */}
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview of uploaded image"
                width={500}
                height={500}
                className="w-full h-[300px] object-contain"
              />
            ) : (
              <Image
                src={`data:image/*;base64,${codeData.imageBase64}`}
                alt="Preview of uploaded image"
                width={500}
                height={500}
                className="w-full h-[300px] object-contain"
              />
            )}
            <X
              className="absolute top-2 right-2 cursor-pointer"
              onClick={clearPreview}
            />
          </div>
        )}

        {/* Controls Panel */}
        <div className="p-7 border border-dashed shadow-md rounded-md">
          <p className="font-bold text-lg">Select AI Model</p>
          <Select
            onValueChange={handleModelChange}
            defaultValue={codeData.selectedModel || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select AI Model">
                {codeData.selectedModel || "Select AI Model"}
              </SelectValue>
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
            value={codeData.description}
            onChange={(e) =>
              setCodeData({
                description: e.target.value,
                imageBase64: codeData.imageBase64,
                generatedCode: codeData.generatedCode,
                selectedModel: codeData.selectedModel,
                selectedModelIcon: codeData.selectedModelIcon,
              })
            }
          />
        </div>
      </div>

      <div className="mt-7 flex items-center justify-center w-full">
        <Button
          className="w-full cursor-pointer py-5"
          onClick={handleGenerateCode}
          disabled={
            (!previewUrl && !codeData.imageBase64) ||
            !codeData.selectedModel ||
            !user
          }
        >
          <WandSparkles className="mr-2" />{" "}
          {codeData.generatedCode ? "Regenerate" : "Convert To Code"}
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
