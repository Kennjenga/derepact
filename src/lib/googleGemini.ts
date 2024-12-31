import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function verifyImageWithGemini(imageUrl: string): Promise<boolean> {
  try {
    // Fetch the image as an array buffer
    const imageResp = await fetch(imageUrl).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
      }
      return response.arrayBuffer();
    });

    // Convert the image to base64
    const base64Image = Buffer.from(imageResp).toString("base64");

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

    // Generate content using the Gemini model
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg", // Adjust MIME type if necessary
        },
      },
      "Verify if this image is valid and meets the required criteria.",
    ]);

    // Process the response
    const responseText = result.response.text();
    console.log("Gemini Response:", responseText);

    // Determine validity based on the response
    // You can customize this logic based on the actual response format
    return responseText.toLowerCase().includes("valid");
  } catch (error) {
    console.error("Error verifying image with Google Gemini:", error);
    return false; // Return false if verification fails
  }
}