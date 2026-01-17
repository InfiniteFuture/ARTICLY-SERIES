
export enum ArticleStyle {
  MODERN = 'modern',
  ELEGANT = 'elegant',
  MINIMAL = 'minimal',
  VIBRANT = 'vibrant',
  DARK = 'dark'
}

export enum LayoutType {
  HERO = 'hero',       
  STORY = 'story',     
  SPLIT = 'split',     
  QUOTE = 'quote',     
  LIST = 'list'        
}

export interface ArticleCardContent {
  title: string;
  subtitle: string;
  body: string[];
  imagePrompt: string;
  layout: LayoutType;
  accentText?: string;
  isDarkBackground: boolean;
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
