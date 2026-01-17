
import React from 'react';
import { ArticleCardContent, ArticleStyle, LayoutType } from '../types';

interface CardProps {
  content: ArticleCardContent;
  imageUrl: string;
  style: ArticleStyle;
  themeColor: string;
  index: number;
  id?: string;
}

const ArticleCard: React.FC<CardProps> = ({ content, imageUrl, style, themeColor, index, id }) => {
  const isDark = style === ArticleStyle.DARK || style === ArticleStyle.VIBRANT;
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  
  // 布局特定样式
  const getLayoutClasses = (layout: LayoutType) => {
    switch (layout) {
      case LayoutType.HERO:
        return "justify-center text-center p-12";
      case LayoutType.QUOTE:
        return "justify-center items-center text-center p-16";
      case LayoutType.SPLIT:
        return "justify-end p-10 bg-gradient-to-t from-black/60 via-transparent to-transparent";
      case LayoutType.STORY:
      default:
        return "justify-start p-10";
    }
  };

  return (
    <div 
      id={id}
      className="relative shadow-2xl overflow-hidden rounded-3xl bg-slate-100 mb-8"
      style={{ width: '450px', height: '800px', flexShrink: 0 }}
    >
      <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="背景" crossOrigin="anonymous" />
      
      {/* 遮罩层 */}
      <div className={`absolute inset-0 flex flex-col ${getLayoutClasses(content.layout)} ${textColor} bg-black/20`}>
        {/* 装饰性数字 */}
        <div className="absolute top-8 left-8 text-6xl font-black opacity-10 italic select-none">
          0{index + 1}
        </div>

        <div className="relative z-10 space-y-6">
          <header className="space-y-2">
            <h2 className={`font-black tracking-tight leading-tight ${content.layout === LayoutType.HERO ? 'text-5xl' : 'text-4xl'}`}>
              {content.title}
            </h2>
            <p className="text-xl font-medium opacity-80 serif-zh italic">{content.subtitle}</p>
          </header>

          {content.layout !== LayoutType.QUOTE && (
            <div className="space-y-4">
              {content.body.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed font-light opacity-95">
                  {p}
                </p>
              ))}
            </div>
          )}

          {content.accentText && (
            <div className="inline-block px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md border border-white/20">
              {content.accentText}
            </div>
          )}

          {content.layout === LayoutType.QUOTE && (
            <div className="relative py-8">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 text-6xl opacity-20 font-serif">“</div>
               <p className="text-2xl font-bold leading-loose px-4">{content.body[0]}</p>
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-6xl opacity-20 font-serif translate-y-4">”</div>
            </div>
          )}
        </div>

        <footer className="absolute bottom-8 left-10 right-10 flex justify-between items-center text-[10px] tracking-widest opacity-40 font-bold uppercase">
          <span>{index === 0 ? "START" : index === 1 ? "PROCESS" : "FINALE"}</span>
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === index ? 'bg-current' : 'bg-current/20'}`}></div>
            ))}
          </div>
          <span>ARTICLY SERIES</span>
        </footer>
      </div>
    </div>
  );
};

export default ArticleCard;
