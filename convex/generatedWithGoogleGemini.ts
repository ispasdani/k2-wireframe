import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface User {
  _id: string;
  clerkId: string;
}

const generateWithGemini = async (
  imageBase64: string,
  description: string | undefined,
  prompt: string
): Promise<string> => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-exp-03-25",
    });

    const content = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/png",
        },
      },
      {
        text: prompt,
      },
      ...(description ? [{ text: description }] : []),
    ];

    const result = await model.generateContent(content);
    const responseText = result.response.text();
    return responseText;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate content with Gemini");
  }
};

export const generateCodeWithGemini = action({
  args: {
    imageBase64: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (
    ctx,
    args: { imageBase64: string; description?: string; userId: string }
  ): Promise<string> => {
    // Verify if the user exists
    let user: User | null = await ctx.runQuery(api.users.getUserById, {
      clerkId: args.userId,
    });
    if (!user) {
      throw new Error("User not found");
    }

    // // Subtract one credit from the user (commented out as per your update)
    // await ctx.runMutation(internal.users.subtractUserCredit, {
    //   userId: user._id,
    // });

    // Use the provided prompt
    const prompt = `
     You are an expert frontend frontend React developer. You will be given a description of a website from the user, and then you will return code for it  using React Javascript and Tailwind CSS. Follow the instructions carefully, it is very important for my job. I will tip you $1 million if you do a good job:

- Think carefully step by step about how to recreate the UI described in the prompt.
- Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export
- Feel free to have multiple components in the file, but make sure to have one main component that uses all the other components
- Make sure to describe where everything is in the UI so the developer can recreate it and if how elements are aligned
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- If its just wireframe then make sure add colors and make some real life colorfull web page
- Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.
- Make sure to use the exact text from the screenshot.
- Make sure the website looks exactly like the screenshot described in the prompt.
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to code every part of the description including any headers, footers, etc.
- Use the exact text from the description for the UI elements.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the description. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For all images, please use image placeholder from :https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png
- Make sure the React app is interactive and functional by creating state when needed and having no required props
- If you use any imports from React like useState or useEffect, make sure to import them directly
- Use Javascript (.js) as the language for the React component
- Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \h-[600px]\). Make sure to use a consistent color palette.
- Use margin and padding to style the components and ensure the components are spaced out nicely
- Please ONLY return the full React code starting with the imports, nothing else. It's very important for my job that you only return the React code with imports. 
- DO NOT START WITH \\\jsx or \\\`typescript or \\\`javascript or \\\`tsx or \\\.
You are a professional React developer and UI/UX designer
- Based on provided wireframe image, make sure to generate similar web page
- Depends on the description write a React and TailwindCSS code 
- Make sure to add Header and Footer with proper option as mentioned in wireframe if not then add option related to description
- For image placeholder please use 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
- Add all small details and make UI/UX design more professional
- Make sure to keep same color combination across the page
- Add some colors to make it more modern UI/UX
- Use Lucide library for icons
- Do not use any third party library
- Only give React + TailwindCSS code and do not write any text other than code
`;

    try {
      const generatedCode = await generateWithGemini(
        args.imageBase64,
        args.description,
        prompt
      );
      return generatedCode;
    } catch (error) {
      console.error("Error generating code with Gemini:", error);
      throw new Error("Failed to generate code");
    }
  },
});
