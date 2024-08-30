import {
  FileData,
  type GenerativeContentBlob,
  GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { googleAIStudioAPIKey } from '../../shared/configs';

if (!googleAIStudioAPIKey) {
  throw new Error('AI studio API key not provided.');
}

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

export const startAIServices = () => {
  try {
    if (genAI === null) {
      if (!googleAIStudioAPIKey) {
        throw new Error('Cannot start AI service. API Key not provided.');
      }

      genAI = new GoogleGenerativeAI(googleAIStudioAPIKey);
    }
    if (model === null) {
      model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
      });
    }
  } catch (err) {
    throw err;
  }
};
export const genContent = async (file: FileData, prompt: string) => {
  if (model === null) {
    throw new Error('Cannot generate content. AI model not started yet.');
  }

  const res = await model.generateContent([
    { fileData: file },
    { text: prompt },
  ]);

  console.log('> [AI] prompt: ', prompt);

  const textRes = res.response.text();

  console.log('> [AI] answer: ', prompt);

  return textRes;
};
