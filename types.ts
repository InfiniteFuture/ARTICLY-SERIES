
export enum ArticleStyle {
  MODERN = 'modern',
  ELEGANT = 'elegant',
  MINIMAL = 'minimal',
  VIBRANT = 'vibrant',
  DARK = 'dark'
}

export enum LayoutType {
  HERO = 'hero',       // 大标题，视觉冲击
  STORY = 'story',     // 侧重正文阅读
  SPLIT = 'split',     // 图文对半或对角
  QUOTE = 'quote',     // 金句居中
  LIST = 'list'        // 列表/要点
}

export interface ArticleCardContent {
  title: string;
  subtitle: string;
  body: string[];
  imagePrompt: string;
  layout: LayoutType;
  accentText?: string;
}

export interface GeneratedArticleSeries {
  cards: ArticleCardContent[];
  imageUrls: string[];
  style: ArticleStyle;
  themeColor: string;
}

export interface AppState {
  isGenerating: boolean;
  error: string | null;
  series: GeneratedArticleSeries | null;
  status: string;
}
