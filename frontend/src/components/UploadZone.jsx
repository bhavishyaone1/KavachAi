import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { z } from 'zod';
import { 
  Upload, 
  Link as LinkIcon, 
  FileText, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

// Zod Validation Schemas
const textSchema = z.string().min(5, "Scam script analysis requires at least 5 characters.");
const urlSchema = z.string().url("Please enter a valid absolute URL link starting with http:// or https://");

export default function UploadZone({ 
  onFileSelect, 
  onTextSubmit, 
  onUrlSubmit,
  isScanning 
}) {
  const [activeTab, setActiveTab] = useState('file');
  const [textVal, setTextVal] = useState('');
  const [urlVal, setUrlVal] = useState('');
  const [validationError, setValidationError] = useState('');

  // react-dropzone configuration
  const onDrop = (acceptedFiles) => {
    setValidationError('');
    if (acceptedFiles && acceptedFiles[0]) {
      onFileSelect(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 52428800, // 50MB
    multiple: false,
    disabled: isScanning
  });

  const handleTextAnalyze = () => {
    setValidationError('');
    const result = textSchema.safeParse(textVal);
    if (!result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }
    onTextSubmit(textVal);
  };

  const handleUrlAnalyze = () => {
    setValidationError('');
    const result = urlSchema.safeParse(urlVal);
    if (!result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }
    onUrlSubmit(urlVal);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Tabs list wrapper */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col gap-6">
        <div className="flex justify-center sm:justify-start">
          <TabsList>
            <TabsTrigger value="file">File Upload</TabsTrigger>
            <TabsTrigger value="text">Paste Text / SMS</TabsTrigger>
            <TabsTrigger value="url">Paste Link / URL</TabsTrigger>
          </TabsList>
        </div>

        {/* File Upload Panel */}
        <TabsContent value="file" className="outline-none">
          <div
            {...getRootProps()}
            className={`w-full min-h-[260px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
              isDragActive
                ? 'border-brand-blue bg-brand-blue/5'
                : 'border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.02]'
            }`}
          >
            <input {...getInputProps()} />
            
            <Upload className={`w-12 h-12 mb-4 text-[#3b82f6] transition-transform ${isDragActive ? '-translate-y-2' : ''}`} />
            
            <h3 className="text-sm font-semibold text-white tracking-wide mb-1">
              Drop anything suspicious here
            </h3>
            <p className="text-xs text-white/50 max-w-[280px] text-center leading-normal">
              Drag & drop Video, Audio, Image, PDF or click to browse files
            </p>
            
            <span className="text-[10px] text-white/30 mt-6 tracking-wider uppercase font-mono font-bold">
              Max file size 50MB • PNG, JPG, MP4, WAV, PDF
            </span>
          </div>
        </TabsContent>

        {/* Text Area Panel */}
        <TabsContent value="text" className="outline-none">
          <div className="w-full bg-[#0d111a]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-lg">
            <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
              Scam Language Scanner
            </label>
            <textarea
              className="w-full min-h-[140px] bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-white placeholder-white/30 focus:border-[#3b82f6]/50 focus:ring-4 focus:ring-[#3b82f6]/10 outline-none transition-all duration-300 resize-none font-medium leading-relaxed"
              placeholder="Paste suspicious SMS texts, urgent customer care alerts, lotteries, UPI requests, or relative-in-distress messages..."
              value={textVal}
              onChange={(e) => {
                setTextVal(e.target.value);
                setValidationError('');
              }}
            />
            
            {validationError && (
              <div className="flex items-center gap-2 text-rose-400 text-xs">
                <AlertCircle size={14} />
                <span>{validationError}</span>
              </div>
            )}

            <Button
              onClick={handleTextAnalyze}
              disabled={isScanning || !textVal.trim()}
              className="self-end"
            >
              <ShieldCheck size={14} />
              <span>Analyze Text</span>
            </Button>
          </div>
        </TabsContent>

        {/* URL Link Panel */}
        <TabsContent value="url" className="outline-none">
          <div className="w-full bg-[#0d111a]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-lg">
            <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
              Domain / Link Security
            </label>
            
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:border-[#3b82f6]/50 focus:ring-4 focus:ring-[#3b82f6]/10 outline-none transition-all duration-300 font-medium"
                  placeholder="Enter suspicious link starting with http:// or https://"
                  value={urlVal}
                  onChange={(e) => {
                    setUrlVal(e.target.value);
                    setValidationError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlAnalyze()}
                />
                <Button
                  onClick={handleUrlAnalyze}
                  disabled={isScanning || !urlVal.trim()}
                >
                  <ShieldCheck size={14} />
                  <span>Verify Link</span>
                </Button>
              </div>

              {validationError && (
                <div className="flex items-center gap-2 text-rose-400 text-xs">
                  <AlertCircle size={14} />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
