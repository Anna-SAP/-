import React, { useRef, useEffect } from 'react';
import { AnalysisResult, UserInput } from '../types';
import { ArrowDownLeft, Quote, Lightbulb, Layers, Eye, Zap, AlignLeft, Languages } from 'lucide-react';

interface AnalysisViewProps {
  result: AnalysisResult;
  input: UserInput;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, input, onReset }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen pb-20 animate-fade-in">
      
      {/* Navigation / Reset */}
      <div className="sticky top-0 z-50 w-full bg-mag-paper/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="text-xs font-bold uppercase tracking-widest text-mag-black">
          第 01 期 &mdash; 第一性原理
        </div>
        <button 
          onClick={onReset}
          className="text-xs font-bold uppercase tracking-widest hover:text-mag-accent underline decoration-2 underline-offset-4"
        >
          新分析
        </button>
      </div>

      {/* Main Magazine Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* ORIGINAL INPUT SECTION (The Cause) */}
        {(input.text || input.videoLink) && (
          <div className="mb-12 border-b border-gray-300 pb-8">
            <div className="flex items-center gap-2 mb-4 text-gray-400">
               <AlignLeft size={16} />
               <span className="text-xs font-bold uppercase tracking-widest">原始输入 / The Cause</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Original Text */}
                {input.text && (
                  <div className={`md:col-span-${result.input_translation ? '6' : '12'}`}>
                      <div className="font-serif text-xl md:text-3xl text-gray-800 leading-relaxed relative pl-2 md:pl-0">
                        <span className="hidden md:inline absolute -left-6 top-0 text-gray-300 text-4xl font-serif leading-none">“</span>
                        {input.text}
                        <span className="hidden md:inline text-gray-300 text-4xl font-serif leading-none ml-1">”</span>
                      </div>
                  </div>
                )}

                {/* Translated Text (if exists) */}
                {result.input_translation && (
                  <div className="md:col-span-6 md:border-l md:border-gray-200 md:pl-8 mt-4 md:mt-0">
                      <div className="flex items-center gap-2 mb-2 text-mag-accent">
                         <Languages size={14} />
                         <span className="text-[10px] font-bold uppercase tracking-widest">信达雅 · 译</span>
                      </div>
                      <div className="font-sans text-lg md:text-2xl font-light text-gray-600 leading-relaxed">
                        {result.input_translation}
                      </div>
                  </div>
                )}
            </div>

            {input.videoLink && (
               <div className={`mt-4 flex items-center gap-2 text-sm font-mono text-gray-500 bg-gray-100 inline-flex px-3 py-2 border border-gray-200 ${!input.text ? 'ml-0' : ''}`}>
                  <span className="font-bold">VIDEO REF:</span>
                  <a href={input.videoLink} target="_blank" rel="noreferrer" className="underline hover:text-mag-accent break-all">
                    {input.videoLink}
                  </a>
               </div>
            )}
          </div>
        )}

        {/* TAKAHASHI HEADER SECTION */}
        <div className="mb-16 border-b-4 border-black pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-4">
            <span className="bg-mag-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
              洞察
            </span>
            <span className="text-gray-500 font-mono text-xs uppercase">
              {new Date().toLocaleDateString()} &bull; 深度解码
            </span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter text-mag-black mb-6 break-words hyphens-auto">
            {result.headline}
          </h1>
          <p className="text-xl md:text-3xl font-serif italic text-gray-600 max-w-3xl leading-relaxed">
            {result.subheadline}
          </p>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          
          {/* LEFT COLUMN: Visual & Emotional (4 cols) */}
          <div className="md:col-span-4 space-y-8">
            
            {/* User Image Display if available */}
            {input.imageUrl && (
               <div className="border-2 border-black p-2 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <img src={input.imageUrl} alt="Original Context" className="w-full h-auto grayscale contrast-125 hover:grayscale-0 transition-all duration-500" />
                  <div className="mt-2 text-xs font-mono text-gray-500 text-right">FIG 1.0: 原始素材</div>
               </div>
            )}

            {/* Emotional Atmosphere */}
            <div className="bg-mag-black text-white p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4 text-mag-accent">
                    <Eye size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">情绪氛围</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                    {result.emotional_atmosphere.keywords.map((k, i) => (
                        <span key={i} className="border border-white/30 px-2 py-1 text-xs font-mono uppercase hover:bg-white hover:text-black transition-colors cursor-default">
                            {k}
                        </span>
                    ))}
                </div>
                <p className="font-serif text-lg leading-relaxed opacity-90">
                    {result.emotional_atmosphere.description}
                </p>
            </div>

            {/* Structural Analysis */}
            <div className="border-t-2 border-black pt-6">
                 <div className="flex items-center gap-2 mb-4">
                    <Layers size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">结构分析</h3>
                </div>
                <ul className="space-y-4">
                    {result.structural_analysis.map((point, i) => (
                        <li key={i} className="flex gap-4 group">
                            <span className="font-black text-2xl text-gray-300 group-hover:text-mag-accent transition-colors">0{i+1}</span>
                            <p className="font-serif text-sm leading-relaxed pt-1">{point}</p>
                        </li>
                    ))}
                </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Conceptual & Narrative (8 cols) */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 content-start">
            
            {/* Core Concept - Spans 2 cols */}
            <div className="md:col-span-2 bg-mag-paper border border-gray-300 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-black text-white px-4 py-2 font-mono text-xs">
                    第一性原理
                </div>
                <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">
                    {result.core_concept.principle}
                </h2>
                <p className="text-lg md:text-xl font-serif leading-relaxed text-gray-800 border-l-4 border-mag-accent pl-6">
                    {result.core_concept.explanation}
                </p>
            </div>

            {/* Metaphor */}
            <div className="bg-white border-2 border-black p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                 <div className="mb-4">
                     <Quote className="text-mag-accent mb-2" size={32} />
                     <h3 className="font-bold uppercase tracking-widest text-xs text-gray-400">隐喻</h3>
                 </div>
                 <p className="text-lg font-medium leading-snug">
                     {result.metaphor}
                 </p>
            </div>

            {/* Counter Perspective */}
            <div className="bg-gray-100 p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                 <div className="mb-4">
                     <ArrowDownLeft className="text-gray-400 mb-2" size={32} />
                     <h3 className="font-bold uppercase tracking-widest text-xs text-gray-400">反向视角</h3>
                 </div>
                 <p className="text-sm font-serif italic leading-relaxed text-gray-600">
                     "{result.counter_perspective}"
                 </p>
            </div>

            {/* Narrative Arc - Spans 2 cols */}
            <div className="md:col-span-2 border-y border-gray-200 py-8">
                <h3 className="font-mono text-xs uppercase text-gray-400 mb-4 text-center">叙事演绎</h3>
                <div className="text-xl md:text-2xl font-serif text-center leading-relaxed max-w-3xl mx-auto">
                    {result.narrative_arc}
                </div>
            </div>
          </div>
        </div>

        {/* FOOTER SECTION: Scenarios & Creativity */}
        <div className="bg-mag-black text-mag-paper p-8 md:p-16 mb-20">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-white/20 pb-4">
                 <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                     应用场景
                 </h2>
                 <span className="font-mono text-mag-accent">未来情境</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Scenarios */}
                {result.scenarios.map((scenario, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Zap className="text-mag-accent" size={20} />
                            <h4 className="font-bold text-lg">{scenario.title}</h4>
                        </div>
                        <p className="font-serif text-gray-400 text-sm leading-relaxed">
                            {scenario.description}
                        </p>
                    </div>
                ))}

                {/* Visual Suggestions */}
                 <div className="md:col-span-1 border-l border-white/20 md:pl-8 space-y-4">
                     <div className="flex items-center gap-3 mb-2">
                        <Lightbulb className="text-yellow-400" size={20} />
                        <h4 className="font-bold text-lg">视觉建议</h4>
                     </div>
                     <ul className="space-y-3">
                        {result.visual_suggestions.map((sugg, i) => (
                            <li key={i} className="text-xs font-mono text-gray-500 border-b border-gray-800 pb-2">
                                > {sugg}
                            </li>
                        ))}
                     </ul>
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisView;