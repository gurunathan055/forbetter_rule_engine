
import { GoogleGenAI, Type } from "@google/genai";
import { Department, RuleSeverity } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRulesFromData = async (sampleData: any, department: Department) => {
  const prompt = `
    Analyze this FMCG data sample for the ${department} department:
    ${JSON.stringify(sampleData, null, 2)}

    Generate a list of 5 essential Business Rules for data quality and operational efficiency.
    Rules should be formatted as a JSON array of objects with the following structure:
    - name: string
    - description: string
    - condition: a valid JavaScript expression where data variables are accessed directly (e.g., 'data.price > 100')
    - severity: one of ['info', 'warning', 'critical']
    - action: string describing what happens if the rule is violated.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              condition: { type: Type.STRING },
              severity: { type: Type.STRING },
              action: { type: Type.STRING },
            },
            required: ["name", "description", "condition", "severity", "action"]
          }
        }
      }
    });

    // Directly access .text property (not a method)
    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Error generating rules:", error);
    return [];
  }
};

export const analyzeAnomalies = async (results: any[]) => {
  const prompt = `
    Review these Business Rule Engine results for an FMCG company:
    ${JSON.stringify(results.slice(0, 10), null, 2)}

    Identify key patterns of data quality issues and suggest 3 high-level strategic improvements for the supply chain management.
  `;

  try {
    // Using gemini-3-pro-preview for complex reasoning task
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt
    });
    // Directly access .text property (not a method)
    return response.text || "Could not perform AI analysis at this time.";
  } catch (error) {
    return "Could not perform AI analysis at this time.";
  }
};
