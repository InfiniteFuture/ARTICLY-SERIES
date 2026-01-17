
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
  const isDark = content.isDarkBackground;
  
  // 核心视觉策略：动态配色系统
  const getVisualConfig = () => {
    switch (style) {
      case ArticleStyle.ELEGANT:
        return {
          overlay: isDark ? "bg-black/50" : "bg-white/60 backdrop-blur-[2px]",
          titleFont: "serif-zh font-bold text-5xl tracking-tight break-keep",
          textColor: isDark ? "text-[#f8f5f0]" : "text-[#1a1a1a]",
          accentClass: isDark ? "bg-white/10 text-white/80" : "bg-black/5 text-black/60",
          decoration: "border-l-4 border-red-700/80 pl-6 my-8",
          containerPadding: "p-14"
        };
      case ArticleStyle.MODERN:
        return {
          overlay: isDark ? "bg-gradient-to-b from-black/80 via-black/20 to-transparent" : "bg-gradient-to-b from-white/90 via-white/40 to-transparent",
          titleFont: "font-black text-6xl tracking-tighter uppercase italic leading-none break-keep",
          textColor: isDark ? "text-white" : "text-slate-900",
          accentClass: "bg-indigo-600 text-white",
          decoration: "w-24 h-1.5 bg-current mb-8 shadow-[0_2px_10px_rgba(0,0,0,0.1)]",
          containerPadding: "p-12"
        };
      case ArticleStyle.MINIMAL:
        return {
          overlay: isDark ? "bg-black/40" : "bg-white/70",
          titleFont: "font-light text-4xl tracking-[0.4em] mb-4 break-keep uppercase",
          textColor: isDark ? "text-slate-100" : "text-slate-800",
          accentClass: "border border-current px-4 py-1",
          decoration: "w-full h-px bg-current/20 my-10",
          containerPadding: "p-16 text-center items-center"
        };
      case ArticleStyle.VIBRANT:
        return {
          overlay: "bg-indigo-900/10 mix-blend-multiply",
          titleFont: "font-black text-5xl -rotate-1 bg-white text-black px-6 py-3 inline-block shadow-2xl break-keep",
          textColor: "text-white",
          accentClass: "bg-yellow-400 text-black font-bold",
          decoration: "space-y-4",
          containerPadding: "p-10"
        };
      default:
        return {
          overlay: "bg-black/40",
          titleFont: "font-bold text-4xl break-keep",
          textColor: "text-white",
          accentClass: "bg-white/20",
          decoration: "w-12 h-1 bg-indigo-500 mb-6",
          containerPadding: "p-12"
        };
    }
  };

  const config = getVisualConfig();

  // 布局对齐逻辑
  const getLayoutAlignment = () => {
    if (content.layout === LayoutType.HERO) return "justify-center";
    if (content.layout === LayoutType.QUOTE) return "justify-center items-center text-center";
    return "justify-end pb-24";
  };

  return (
    <div 
      id={id}
      className="relative shadow-2xl overflow-hidden rounded-[3rem] bg-slate-300 mb-8 select-none"
      style={{ width: '450px', height: '800px', flexShrink: 0 }}
    >
      {/* Background with cross-fade effect placeholder */}
      <div className="absolute inset-0 bg-slate-200"></div>
      <img 
        src={imageUrl} 
        className="absolute inset-0 w-full h-full object-cover" 
        alt="背景图"
        crossOrigin="anonymous"
      />
      
      {/* Visibility Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${config.overlay}`}></div>

      {/* Content Canvas */}
      <div className={`absolute inset-0 flex flex-col ${getLayoutAlignment()} ${config.textColor} ${config.containerPadding} z-10`}>
        
        {/* Sequence Indicator */}
        <div className="absolute top-12 left-12 flex items-center gap-3 opacity-20 group">
          <span className="text-7xl font-black italic leading-none">0{index + 1}</span>
          <div className="h-px w-12 bg-current"></div>
        </div>

        <div className="relative w-full">
          <header className="mb-8">
            {style === ArticleStyle.MODERN && <div className={config.decoration}></div>}
            
            {/* Title with shadow for readability */}
            <h2 className={`${config.titleFont} drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] mb-4 whitespace-nowrap`}>
              {content.title}
            </h2>
            
            <p className={`text-2xl font-medium opacity-90 ${style === ArticleStyle.ELEGANT ? 'serif-zh' : 'tracking-tight'}`}>
              {content.subtitle}
            </p>
          </header>

          {content.layout !== LayoutType.QUOTE && (
            <div className={`space-y-5 ${style === ArticleStyle.ELEGANT ? config.decoration : ''}`}>
              {content.body.map((p, i) => (
                <p key={i} className={`text-xl leading-relaxed ${style === ArticleStyle.MODERN ? 'font-medium' : 'font-light'} opacity-95 text-balance`}>
                  {p}
                </p>
              ))}
            </div>
          )}

          {content.layout === LayoutType.QUOTE && (
            <div className="py-10 flex flex-col items-center">
               <span className="text-7xl opacity-20 font-serif leading-none h-10 italic">“</span>
               <p className="text-3xl font-bold leading-snug text-center px-2">{content.body[0]}</p>
               <span className="text-7xl opacity-20 font-serif leading-none h-10 rotate-180 italic">“</span>
            </div>
          )}

          {content.accentText && (
            <div className={`mt-10 inline-block px-6 py-2 rounded-full text-sm font-black tracking-[0.2em] uppercase backdrop-blur-sm border border-current/20 ${config.accentClass}`}>
              {content.accentText}
            </div>
          )}
        </div>

        {/* Global Footer */}
        <footer className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-[10px] tracking-[0.3em] font-black uppercase opacity-40">
          <div className="space-y-1">
            <p className="opacity-60">Visual Chapter</p>
            <p className="text-xs">0{index + 1} / 03</p>
          </div>
          <div className="text-right">
            <p>Articly AI Narrative</p>
            <p className="opacity-60 italic">Creation {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ArticleCard;
