"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "./imageUpload";
import ViewResult from "./viewResult";

const DesignToCode = () => {
  // Control the active tab using state
  const [activeTab, setActiveTab] = useState("aiGenerator");

  // Callback to be triggered when generation is successful
  const handleGenerateSuccess = () => {
    setActiveTab("reviewResult");
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full mt-7 h-12"
    >
      <TabsList className="grid w-full grid-cols-2 h-12 gap-5">
        <TabsTrigger className="h-10 cursor-pointer" value="aiGenerator">
          AI Generator
        </TabsTrigger>
        <TabsTrigger className="h-10 cursor-pointer" value="reviewResult">
          Review Result
        </TabsTrigger>
      </TabsList>
      <TabsContent value="aiGenerator">
        <ImageUpload onGenerateSuccess={handleGenerateSuccess} />
      </TabsContent>
      <TabsContent value="reviewResult">
        <ViewResult />
      </TabsContent>
    </Tabs>
  );
};

export default DesignToCode;
