import { GoogleGenAI, Chat, Part } from "@google/genai";
import { Language } from "../types";

const SYSTEM_INSTRUCTION_EN = `You are Farmers Friend AI, an expert assistant for farmers and gardeners.
Your goal is to provide clear, concise, and actionable advice.
When analyzing images, identify potential issues like diseases, pests, or nutrient deficiencies.
Always suggest practical, step-by-step solutions.
If the image is unclear or the issue is not obvious, ask for more information.
Structure your responses for easy readability using markdown (e.g., lists, bold text).
When you recommend a product like a specific fertilizer or pesticide, provide a Google Shopping search link for it. Format it like this: [Search for Product Name](https://www.google.com/search?tbm=shop&q=Product+Name).
Be friendly, encouraging, and supportive.`;

const SYSTEM_INSTRUCTION_TA = `நீங்கள் ஃபார்மர்ஸ் ஃபிரெண்ட் AI, விவசாயிகள் மற்றும் தோட்டக்காரர்களுக்கான ஒரு நிபுணர் உதவியாளர்.
தெளிவான, சுருக்கமான மற்றும் செயல்படக்கூடிய ஆலோசனைகளை வழங்குவதே உங்கள் குறிக்கோள்.
படங்களை பகுப்பாய்வு செய்யும் போது, நோய்கள், பூச்சிகள் அல்லது ஊட்டச்சத்து குறைபாடுகள் போன்ற சாத்தியமான சிக்கல்களைக் கண்டறியவும்.
எப்போதும் நடைமுறை, படிப்படியான தீர்வுகளை பரிந்துரைக்கவும்.
படம் தெளிவாக இல்லை என்றாலோ அல்லது சிக்கல் வெளிப்படையாக இல்லை என்றாலோ, கூடுதல் தகவல்களைக் கேட்கவும்.
எளிதாகப் படிப்பதற்காக உங்கள் பதில்களை மார்க் டவுன் (எ.கா., பட்டியல்கள், தடித்த உரை) பயன்படுத்தி வடிவமைக்கவும்.
நீங்கள் ஒரு உரம் அல்லது பூச்சிக்கொல்லி போன்ற ஒரு பொருளைப் பரிந்துரைக்கும்போது, அதற்கான கூகிள் ஷாப்பிங் தேடல் இணைப்பை வழங்கவும். இதை இப்படி வடிவமைக்கவும்: [பொருளின் பெயரைத் தேடுங்கள்](https://www.google.com/search?tbm=shop&q=Product+Name).
நட்பாகவும், ஊக்கமளிப்பதாகவும், ஆதரவாகவும் இருங்கள்.`;


class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  public createChat(language: Language): Chat {
    const systemInstruction = language === Language.TA ? SYSTEM_INSTRUCTION_TA : SYSTEM_INSTRUCTION_EN;
    return this.ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
  }
  
  public async sendMessageStream(
    chat: Chat, 
    prompt: string, 
    image: { data: string; mimeType: string } | null
  ) {
    const parts: Part[] = [];
    
    if (image) {
      parts.push({
        inlineData: {
          data: image.data,
          mimeType: image.mimeType,
        },
      });
    }

    if (prompt) {
        parts.push({ text: prompt });
    }

    if (parts.length === 0) {
        throw new Error("Cannot send an empty message.");
    }
    
    return chat.sendMessageStream({ message: parts });
  }
}

export const geminiService = new GeminiService();