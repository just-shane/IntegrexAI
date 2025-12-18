
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are IntegrexAI, a world-class expert on Mazak Integrex multi-tasking CNC machines.
Your expertise covers:
1. Mazatrol (SmoothAi, SmoothX, SmoothG, Matrix 2 controllers).
2. EIA/ISO G-code programming for Mazak.
3. Multi-axis machining strategies (milling, turning, B-axis indexing).
4. Tooling setup, offsets, and tool life management.
5. Maintenance procedures and troubleshooting specific Mazak alarms (e.g., 200 series, 100 series).
6. Safety protocols for heavy machinery.

Always provide technical, precise, and safety-conscious answers. If you suggest G-code or Mazatrol units, format them clearly in code blocks.
Remind users to always dry-run or use machine simulation (Smooth Simulation) before running new programs.`;

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response: GenerateContentResponse = await this.chat.sendMessage({ message });
      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to connect to IntegrexAI service.");
    }
  }

  async *sendMessageStream(message: string) {
    try {
      const response = await this.chat.sendMessageStream({ message });
      for await (const chunk of response) {
        yield (chunk as GenerateContentResponse).text || "";
      }
    } catch (error) {
      console.error("Gemini Stream Error:", error);
      throw new Error("Stream connection failed.");
    }
  }
}

export const gemini = new GeminiService();
