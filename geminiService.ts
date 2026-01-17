
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
    你是一位顶尖的视觉叙事专家。你的任务是将用户输入拆解为一组“三部曲”叙事海报。
    输出必须是严格的 JSON 格式。
    
    核心内容准则：
    1. 叙事节奏：[01 起始 - 建立意境], [02 展开 - 叙述核心], [03 终章 - 升华感悟]。
    2. 标题约束：title 必须是单行文本，严禁包含任何换行符 (\\n) 或回车。标题要简短、有力、具备冲击力。
    3. 视觉感知：
       - 根据风格(${style})生成英文 imagePrompt。
       - 必须包含：Cinematic photography, minimalism, intentional negative space for typography.
       - 预测 isDarkBackground：如果你预期的背景偏暗，设为 true；偏亮则设为 false。这至关重要，将决定文字的对比度排版。
    4. 主题色：提供一个与内容情感契合的十六进制 themeColor。
    
    JSON 结构示例：
    {
      "themeColor": "#xxxxxx",
      "cards": [
        { 
          "title": "单行标题禁止换行", 
          "subtitle": "副标题可以略长", 
          "body": ["段落一", "段落二"], 
          "layout": "hero", 
          "imagePrompt": "...", 
          "accentText": "关键词",
          "isDarkBackground": true 
        }
      ]
    }
  `;

  const prompt = `用户内容：${userInput}。选定风格：${style}。请按三部曲逻辑生成，确保标题不换行。`;
  
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
                accentText: { type: Type.STRING },
                isDarkBackground: { type: Type.BOOLEAN }
              },
              required: ["title", "subtitle", "body", "layout", "imagePrompt", "isDarkBackground"]
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
      parts: [{ text: `${prompt} -- Cinematic lighting, 4k, professional photography, high-end commercial style, clean background, negative space for text.` }]
    },
    config: {
      imageConfig: { aspectRatio: "9:16" }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("图像生成引擎暂不可用");
}
