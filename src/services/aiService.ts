import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env";
import { AITaskSuggestion } from "../types/task";

class AIService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }

  async generateTaskSuggestion(userInput: string): Promise<AITaskSuggestion> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });
      const prompt = `
        Given this user task input: "${userInput}"
        
        Generate a clearer task title and a structured description.
        Respond in JSON format with exactly this structure:
        {
          "title": "A clear, actionable task title",
          "description": "A structured description with specific steps or details"
        }
        
        Keep the title concise (under 50 characters) and the description practical and actionable.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const suggestion = JSON.parse(jsonMatch[0]);
        return {
          title: suggestion.title || userInput,
          description: suggestion.description || `Complete: ${userInput}`,
        };
      }

      return {
        title: this.capitalizeFirstLetter(userInput),
        description: `Complete: ${userInput}`,
      };
    } catch (error) {
        console.error('AI Service Error:', error);
        return {
        title: this.capitalizeFirstLetter(userInput),
        description: `Complete the task: ${userInput}`,
      };
    }
  }

   private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const aiService = new AIService();
