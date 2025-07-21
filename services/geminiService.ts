
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, RecipeDetails } from "../types";

// Ensure the API key is available, but do not hardcode it.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: {
                type: Type.STRING,
                description: "The name of the recipe.",
            },
            description: {
                type: Type.STRING,
                description: "A brief, enticing description of the dish.",
            },
        },
        required: ["name", "description"],
    },
};

const recipeDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of all ingredients required for the recipe, with measurements.",
        },
        instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of step-by-step instructions to prepare the dish.",
        },
    },
    required: ["ingredients", "instructions"],
};

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const getRecipesFromIngredients = async (ingredients: string): Promise<Recipe[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Suggest 3 diverse and creative recipes I can cook with the following ingredients: ${ingredients}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Recipe[];

    } catch (error) {
        console.error("Error fetching recipes from text:", error);
        throw new Error("Failed to parse recipe suggestions from AI.");
    }
};

export const getRecipesFromImage = async (imageFile: File): Promise<Recipe[]> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = {
            text: "Identify the key ingredients in this image. Based on those ingredients, suggest 3 diverse and creative recipes. Focus on common dishes."
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Recipe[];

    } catch (error) {
        console.error("Error fetching recipes from image:", error);
        throw new Error("Failed to parse recipe suggestions from the uploaded image.");
    }
};


export const getRecipeDetails = async (recipeName: string): Promise<RecipeDetails> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide detailed cooking instructions for "${recipeName}". I need a list of ingredients with measurements and a clear, step-by-step guide for the instructions.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeDetailsSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as RecipeDetails;

    } catch (error) {
        console.error(`Error fetching details for ${recipeName}:`, error);
        throw new Error("Failed to parse recipe details from AI.");
    }
};

export const generateCoverImage = async (recipeName: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `A delicious, professional food photograph of "${recipeName}". Centered, well-lit, on a clean, light-colored background.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '4:3',
            },
        });
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error(`Error generating cover image for: "${recipeName}"`, error);
        return `https://picsum.photos/400/300?random=${encodeURIComponent(recipeName)}`;
    }
};

export const generateRecipeImages = async (instructions: string[]): Promise<string[]> => {
    const imagePromises = instructions.map(async (instruction) => {
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: `A minimalist, clean, 2D animated style illustration showing this cooking step: "${instruction}". Flat design, simple colored background, no text.`,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                    aspectRatio: '16:9',
                },
            });
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } catch (error) {
            console.error(`Error generating image for instruction: "${instruction}"`, error);
            // Return a placeholder or empty string on failure to not break the whole sequence
            return "https://picsum.photos/1280/720?random=" + Math.random(); 
        }
    });

    return Promise.all(imagePromises);
};
