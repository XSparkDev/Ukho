
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { NewsItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Manual implementation of base64 decoding as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Utility to decode raw PCM bytes from Gemini API into a browser-playable AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const getAncestralWisdom = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Provide a short South African ancestral proverb or piece of wisdom. Include a one-sentence modern interpretation.",
      config: {
        systemInstruction: "You are a wise South African elder. Use deep, poetic language. Mention 'Ubuntu', 'roots', and 'unity'. Keep it under 180 characters."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching wisdom:", error);
    return "Umuntu ngumuntu ngabantu. A person is a person through other people.";
  }
};

/**
 * Uses Gemini 2.5 TTS to recite clan praises.
 */
export const recitePraises = async (clan: string, praises: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Recite these clan praises for ${clan} with deep respect and rhythm: ${praises}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        audioCtx,
        24000,
        1,
      );
      
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
};

/**
 * Fetches structured fictional news about a futuristic tribal network using JSON output.
 */
export const fetchVibraniumNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 5 fictional news items about a futuristic South African tribal network. Focus on categories like tech, royal, border, or culture.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING, description: "One of: tech, royal, border, culture" },
              title: { type: Type.STRING },
              summary: { type: Type.STRING }
            },
            required: ["id", "category", "title", "summary"]
          }
        }
      }
    });
    const jsonStr = response.text || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error fetching Vibranium news:", error);
    return [];
  }
};
