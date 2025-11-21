import React, { useState, useRef, useEffect } from 'react';
import { UserInput } from '../types';
import { Upload, Link, Type, Image as ImageIcon, Video, X } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (input: UserInput) => void;
  isAnalyzing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoLink, setVideoLink] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Global Paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              setImage(file);
              const url = URL.createObjectURL(file);
              setImageUrl(url);
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const clearImage = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent triggering click on container
    setImage(null);
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!text && !image && !videoLink) return;
    onAnalyze({ text, image, imageUrl, videoLink });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-12 transition-all duration-500 ease-in-out">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-mag-black uppercase">
            解构 <span className="text-2xl md:text-4xl font-normal text-gray-400">DECODE</span>
          </h1>
          <p className="text-lg font-serif italic text-gray-500">
            多模态深度解读器
          </p>
        </div>

        {/* Input Container */}
        <div className="bg-white border-2 border-mag-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative">
          
          {/* Text Input */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 text-mag-accent">
              <Type size={16} />
              <span>核心概念 / 想法</span>
            </label>
            <textarea
              className="w-full bg-mag-paper border border-gray-300 p-4 text-lg font-serif focus:outline-none focus:border-mag-black transition-colors min-h-[120px] resize-none"
              placeholder="输入关键词、概念或任何混乱的想法..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Image Input */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 text-mag-accent">
                <ImageIcon size={16} />
                <span>视觉语境</span>
              </label>
              
              {!imageUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`w-full h-32 bg-mag-paper border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden
                    ${isDragging 
                      ? 'border-mag-accent bg-mag-accent/5 scale-[1.02]' 
                      : 'border-gray-400 hover:bg-gray-100 hover:border-mag-black'
                    }`}
                >
                  <Upload 
                    className={`mb-2 transition-colors ${isDragging ? 'text-mag-accent' : 'text-gray-400 group-hover:text-mag-black'}`} 
                    size={24} 
                  />
                  <span className={`text-sm font-sans transition-colors ${isDragging ? 'text-mag-accent font-bold' : 'text-gray-500'}`}>
                    {isDragging ? '松开以添加图片' : '点击上传 / 拖拽 / Ctrl+V 粘贴'}
                  </span>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative w-full h-32 bg-black flex items-center justify-center overflow-hidden group border-2 border-mag-black">
                  <img src={imageUrl} alt="Preview" className="h-full object-contain opacity-80" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <button 
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-mag-accent hover:text-white transition-colors z-10"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Video Input */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 text-mag-accent">
                <Video size={16} />
                <span>视频链接 (可选)</span>
              </label>
              <div className="flex items-center bg-mag-paper border border-gray-300 p-3 h-32">
                <Link className="text-gray-400 mr-2 flex-shrink-0" size={20} />
                <textarea
                  className="w-full bg-transparent focus:outline-none font-mono text-sm h-full resize-none pt-1"
                  placeholder="在此粘贴 URL..."
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing || (!text && !image && !videoLink)}
            className={`w-full py-4 text-xl font-black uppercase tracking-widest border-2 border-black transition-all transform duration-200 
              ${isAnalyzing 
                ? 'bg-gray-100 text-gray-400 cursor-wait border-gray-200 shadow-none' 
                : 'bg-mag-black text-white shadow-[4px_4px_0px_0px_rgba(255,51,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,51,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] active:shadow-none active:translate-y-[4px] active:translate-x-[4px]'
              }`}
          >
            {isAnalyzing ? '正在解构...' : '深度解读'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputSection;