
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize with process.env.API_KEY directly per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLearningPath = async (studentDetails: {
  state: string,
  hoursLogged: number,
  goals: string[]
}) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a detailed hybrid driving learning path for a student in ${studentDetails.state}, Australia. 
      Mix Online Theory and Offline Practical lessons.
      They have logged ${studentDetails.hoursLogged} hours. Goals: ${studentDetails.goals.join(', ')}.
      Format the output as JSON with an array of modules containing title, description, type (ONLINE or OFFLINE), and estimatedHours.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            path: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["ONLINE", "OFFLINE"] },
                  estimatedHours: { type: Type.NUMBER }
                },
                required: ["title", "description", "type", "estimatedHours"]
              }
            }
          }
        }
      }
    });

    // Access text property directly (it's a getter, not a method)
    return response.text ? JSON.parse(response.text).path : null;
  } catch (error) {
    console.error("Error generating learning path:", error);
    return null;
  }
};

export const getLicenceGuidance = async (state: string, currentStage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a step-by-step guide for getting a full driver's licence in ${state}, Australia, starting from ${currentStage}.
      Include specific requirements like logbook hours, hazard perception tests, and driving tests.
      Format the output as JSON with an array of 'steps' each having 'title', 'requirements' (array of strings), and 'description'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING }
                },
                required: ["title", "requirements", "description"]
              }
            }
          }
        }
      }
    });
    // Access text property directly (it's a getter, not a method)
    return response.text ? JSON.parse(response.text).steps : null;
  } catch (error) {
    console.error("Error fetching licence guidance:", error);
    return null;
  }
};
