import { create } from "zustand";

interface CodeData {
  imageBase64: string;
  description: string;
  generatedCode: string;
  selectedModel: string;
}

interface CodeStore {
  codeData: CodeData;
  setCodeData: (newData: Partial<CodeData>) => void;
}

export const useCodeStore = create<CodeStore>((set) => ({
  codeData: {
    imageBase64: "",
    description: "",
    generatedCode: "",
    selectedModel: "",
  },
  setCodeData: (newData) =>
    set((state) => ({
      codeData: { ...state.codeData, ...newData },
    })),
}));
