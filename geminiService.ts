
import { GoogleGenAI, Type } from "@google/genai";
import { ArticleCardContent, ArticleStyle, LayoutType } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSeriesContent(
  userInput: string,
  style: ArticleStyle,
  base64Image?: string
): Promise<{ cards: ArticleCardContent[], themeColor: string }> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    你是一位顶尖的视觉叙事专家。你的任务是将用户的输入拆解为一个“三部曲”系列的视觉海报（起始、展开、终章）。
    输出必须是 JSON 格式。
    
    逻辑要求：
    1. 分解叙事：将内容逻辑地分为三个阶段。
    2. 布局多样化：为每张卡片从以下布局中选择最合适的：hero (大标题优先), story (正文优先), split (图文对比), quote (金句优先)。
    3. 内容：使用中文。标题要简短有力，正文要富有文学感。
    4. 颜色：提供一个适合该主题的十六进制主题色 (themeColor)。
    
    JSON 结构：
    {
      "themeColor": "#xxxxxx",
      "cards": [
        { "title": "...", "subtitle": "...", "body": ["...", "..."], "layout": "hero", "imagePrompt": "...", "accentText": "..." },
        { "title": "...", "subtitle": "...", "body": ["...", "..."], "layout": "story", "imagePrompt": "...", "accentText": "..." },
        { "title": "...", "subtitle": "...", "body": ["...", "..."], "layout": "quote", "imagePrompt": "...", "accentText": "..." }
      ]
    }
  `;

  const prompt = `输入：${userInput}。风格：${style}。请创作三部曲内容。`;
  
  const parts: any[] = [{ text: prompt }];
  if (base64Image) {
    parts.push({
      inlineData: { mimeType: "image/jpeg", data: base64Image }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          themeColor: { type: Type.STRING },
          cards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                body: { type: Type.ARRAY, items: { type: Type.STRING } },
                layout: { type: Type.STRING, enum: Object.values(LayoutType) },
                imagePrompt: { type: Type.STRING },
                accentText: { type: Type.STRING }
              },
              required: ["title", "subtitle", "body", "layout", "imagePrompt"]
            }
          }
        },
        required: ["themeColor", "cards"]
      }
    }
  });

  return JSON.parse(response.text.trim());
}

export async function generateCardImage(prompt: string): Promise<string> {
  const model = "gemini-2.5-flash-image";
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [{ text: `${prompt} -- Cinematic lighting, 4k, artistic, high quality, background photography, no text.` }]
    },
    config: {
      imageConfig: { aspectRatio: "9:16" }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("图片生成失败");
}
