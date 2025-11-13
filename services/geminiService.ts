
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generatePassportPhoto = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `
              Analyze the person in this image and generate a professional passport-size photograph.
              Follow these rules strictly:
              1.  The background MUST be a solid, plain, neutral color, either off-white or light gray (e.g., #f0f0f0). Do not use pure white.
              2.  The person's head should be centered in the frame.
              3.  The person should be facing forward with a neutral expression.
              4.  Retain the original person's features, hair, and clothing. Do not add or change clothing unless it is inappropriate for a passport photo.
              5.  The final image should have a standard passport photo aspect ratio (e.g., 2x2 inches or 35x45mm).
              6.  Ensure good lighting and remove any shadows from the face or background.
              7.  The output must be only the image.
            `,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("No image data found in the API response.");

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to generate passport photo.");
  }
};
