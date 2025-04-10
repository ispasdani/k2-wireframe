import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "./imageUpload";
import ViewResult from "./viewResult";

const DesignToCode = () => {
  return (
    <Tabs defaultValue="aiGenerator" className="w-full mt-7 h-12">
      <TabsList className="grid w-full grid-cols-2 h-12 gap-5">
        <TabsTrigger className="h-10 cursor-pointer" value="aiGenerator">
          AI Generator
        </TabsTrigger>
        <TabsTrigger className="h-10 cursor-pointer" value="reviewResult">
          Review Result
        </TabsTrigger>
      </TabsList>
      <TabsContent value="aiGenerator">
        <ImageUpload />
      </TabsContent>
      <TabsContent value="reviewResult">
        <ViewResult />
      </TabsContent>
    </Tabs>
  );
};

export default DesignToCode;
