
import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Wand2, Download, AlertCircle, RefreshCw, Layers, Plus, ChevronRight } from 'lucide-react';
import { ArticleStyle, AppState, GeneratedArticleSeries } from './types';
import { generateSeriesContent, generateCardImage } from './geminiService';
import ArticleCard from './components/ArticlePreview';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ArticleStyle>(ArticleStyle.MODERN);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [state, setState] = useState<AppState>({
    isGenerating: false,
    error: null,
    series: null,
    status: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const styleLabels: Record<ArticleStyle, string> = {
    [ArticleStyle.MODERN]: '现代简约',
    [ArticleStyle.ELEGANT]: '雅致古韵',
    [ArticleStyle.MINIMAL]: '极简纯白',
    [ArticleStyle.VIBRANT]: '潮流色彩',
    [ArticleStyle.DARK]: '高级暗调'
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!userInput && !selectedImage) {
      setState(prev => ({ ...prev, error: "请输入内容或上传图片。" }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null, status: 'AI 正在深度拆解叙事结构...' }));

    try {
      const base64Image = selectedImage?.split(',')[1];
      const { cards, themeColor } = await generateSeriesContent(userInput, selectedStyle, base64Image);
      
      const imageUrls: string[] = [];
      for (let i = 0; i < cards.length; i++) {
        setState(prev => ({ ...prev, status: `正在构思第 ${i + 1}/3 章视觉背景...` }));
        const url = await generateCardImage(cards[i].imagePrompt);
        imageUrls.push(url);
      }
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        status: '',
        series: { cards, imageUrls, style: selectedStyle, themeColor }
      }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: "生成失败，请重试。",
        status: ''
      }));
    }
  };

  const downloadCard = async (index: number) => {
    const element = document.getElementById(`card-capture-${index}`);
    if (!element) return;
    
    try {
      const canvas = await (window as any).html2canvas(element, {
        useCORS: true,
        scale: 2,
        width: 450,
        height: 800,
      });
      
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `灵感叙事-第${index+1}章-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      console.error("下载失败", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col md:flex-row text-slate-900">
      {/* Sidebar */}
      <div className="w-full md:w-[400px] bg-white border-r border-slate-200 p-8 flex flex-col h-screen sticky top-0 overflow-y-auto z-10">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Layers size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight italic">ARTICLY SERIES</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Visual Narrative Engine</p>
          </div>
        </div>

        <div className="space-y-8 flex-grow">
          <section className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">核心主题</label>
            <textarea
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-sm leading-relaxed"
              placeholder="一段文字、一个梦境、或者一个故事的开头..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </section>

          <section className="space-y-3">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest">灵感源图 (可选)</label>
             <div 
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center hover:bg-indigo-50/50 hover:border-indigo-200 transition-all overflow-hidden"
            >
              {selectedImage ? (
                <img src={selectedImage} className="w-full h-full object-cover opacity-50" />
              ) : (
                <div className="flex items-center gap-2 text-slate-400">
                  <Plus size={18} />
                  <span className="text-xs font-bold">点击上传图片</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          </section>

          <section className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">叙事影调</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(ArticleStyle).map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                    selectedStyle === style 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  {styleLabels[style]}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 space-y-4">
          {state.error && <p className="text-xs text-rose-500 font-bold">{state.error}</p>}
          <button
            onClick={handleGenerate}
            disabled={state.isGenerating}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-white transition-all shadow-xl ${
              state.isGenerating ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {state.isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Wand2 size={20} />}
            {state.isGenerating ? state.status : '生成系列画报'}
          </button>
        </div>
      </div>

      {/* Main Preview */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-12">
        {!state.series && !state.isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
             <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-indigo-600 rotate-12">
               <Layers size={32} />
             </div>
             <h2 className="text-2xl font-black">叙事引擎已就绪</h2>
             <p className="text-slate-400 text-sm font-medium">我们将为你的一次输入生成三张具备起承转合逻辑的视觉画报。</p>
          </div>
        )}

        {state.isGenerating && (
          <div className="h-full flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-black text-indigo-900">{state.status}</p>
          </div>
        )}

        {state.series && !state.isGenerating && (
          <div className="flex flex-col items-center gap-12 max-w-2xl mx-auto py-12">
            {state.series.cards.map((card, idx) => (
              <div key={idx} className="group relative animate-in fade-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
                <ArticleCard 
                  id={`card-capture-${idx}`}
                  content={card} 
                  imageUrl={state.series!.imageUrls[idx]} 
                  style={state.series!.style}
                  themeColor={state.series!.themeColor}
                  index={idx}
                />
                <button 
                  onClick={() => downloadCard(idx)}
                  className="absolute -right-16 top-0 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all scale-0 group-hover:scale-100"
                  title="下载单张"
                >
                  <Download size={20} />
                </button>
              </div>
            ))}
            
            <div className="fixed bottom-8 right-8 flex gap-4">
              <button 
                onClick={() => [0,1,2].forEach(i => downloadCard(i))}
                className="px-8 py-4 bg-slate-900 text-white rounded-full shadow-2xl font-black flex items-center gap-3 hover:scale-105 transition-all"
              >
                <Download size={20} />
                下载全部系列图
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
