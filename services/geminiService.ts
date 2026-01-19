/**
 * Gemini AI Service for Ukho Network (React Native)
 * Adapted from web version for mobile compatibility
 */

import { GoogleGenAI, Modality, Type } from "@google/genai";
import Constants from "expo-constants";
import { Audio } from "expo-av";
import { NewsItem } from "../types";

// Get API key from environment variables (via expo-constants)
const API_KEY = Constants.expoConfig?.extra?.geminiApiKey || process.env.GEMINI_API_KEY || "";

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Base64 decoding for React Native
function decodeBase64(base64: string): Uint8Array {
  // For React Native, we can use a polyfill or native base64 decoding
  // Using a simple implementation that works cross-platform
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = base64.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  let output = '';

  for (let i = 0; i < str.length; i += 4) {
    const enc1 = chars.indexOf(str.charAt(i));
    const enc2 = chars.indexOf(str.charAt(i + 1));
    const enc3 = chars.indexOf(str.charAt(i + 2));
    const enc4 = chars.indexOf(str.charAt(i + 3));

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    output += String.fromCharCode(chr1);
    if (enc3 !== 64) output += String.fromCharCode(chr2);
    if (enc4 !== 64) output += String.fromCharCode(chr3);
  }

  const bytes = new Uint8Array(output.length);
  for (let i = 0; i < output.length; i++) {
    bytes[i] = output.charCodeAt(i);
  }
  return bytes;
}

/**
 * Fetches ancestral wisdom from Gemini AI
 */
export const getAncestralWisdom = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Provide a short South African ancestral proverb or piece of wisdom. Include a one-sentence modern interpretation.",
      config: {
        systemInstruction: "You are a wise South African elder. Use deep, poetic language. Mention 'Ubuntu', 'roots', and 'unity'. Keep it under 180 characters."
      }
    });
    return response.text || "Umuntu ngumuntu ngabantu. A person is a person through other people.";
  } catch (error) {
    console.error("Error fetching wisdom:", error);
    return "Umuntu ngumuntu ngabantu. A person is a person through other people.";
  }
};

/**
 * Uses Gemini 2.5 TTS to recite clan praises.
 * Adapted for React Native using expo-av
 */
export const recitePraises = async (clan: string, praises: string): Promise<void> => {
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
      // Decode base64 to Uint8Array
      const audioBytes = decodeBase64(base64Audio);
      
      // Convert Uint8Array to base64 data URI for expo-av
      // expo-av can play base64 audio directly
      const base64DataUri = `data:audio/pcm;base64,${base64Audio}`;
      
      // Request audio permissions
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create and play sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: base64DataUri },
        { shouldPlay: true }
      );

      // Clean up when playback finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    }
  } catch (error) {
    console.error("TTS Error:", error);
    // Fallback: Could show an error message to the user
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

