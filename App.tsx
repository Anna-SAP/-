import React, { useState } from 'react';
import { UserInput, AppState, AnalysisResult } from './types';
import InputSection from './components/InputSection';
import AnalysisView from './components/AnalysisView';
import { analyzeContent } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [inputData, setInputData] = useState<UserInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Convert File to Base64 helper
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async (input: UserInput) => {
    setInputData(input);
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);

    try {
      let imageBase64: string | null = null;
      if (input.image) {
        imageBase64 = await fileToBase64(input.image);
      }

      const result = await analyzeContent(input.text, imageBase64, input.videoLink);
      setAnalysisResult(result);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMsg("分析内容失败。请检查您的输入和 API Key。");
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setInputData(null);
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f4f0] text-[#1a1a1a] font-sans selection:bg-mag-accent selection:text-white">
      
      {/* Content Area */}
      <main className="w-full">
        {appState === AppState.IDLE && (
          <div className="min-h-screen flex items-center justify-center">
            <InputSection onAnalyze={handleAnalyze} isAnalyzing={false} />
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="flex flex-col items-center animate-pulse">
               <div className="mb-8 relative">
                 <div className="absolute inset-0 bg-mag-accent blur-xl opacity-20 rounded-full"></div>
                 <Loader2 className="w-16 h-16 text-mag-black animate-spin relative z-10" />
               </div>
               <h2 className="text-4xl font-black uppercase tracking-widest mb-4 text-center">
                 正在解构
               </h2>
               <div className="space-y-2 text-center font-mono text-sm text-gray-500">
                  <p>分析结构中...</p>
                  <p>寻找第一性原理...</p>
                  <p>提取情绪氛围...</p>
               </div>
            </div>
          </div>
        )}

        {appState === AppState.RESULT && analysisResult && inputData && (
          <AnalysisView 
            result={analysisResult} 
            input={inputData} 
            onReset={handleReset} 
          />
        )}

        {appState === AppState.ERROR && (
           <div className="min-h-screen flex flex-col items-center justify-center p-8">
             <div className="bg-white border-2 border-red-500 p-8 max-w-md text-center shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]">
                <h2 className="text-2xl font-black uppercase text-red-500 mb-4">系统错误</h2>
                <p className="font-serif mb-6">{errorMsg}</p>
                <button 
                  onClick={handleReset}
                  className="px-6 py-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800"
                >
                  重试
                </button>
             </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;