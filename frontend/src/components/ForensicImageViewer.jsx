import React, { useState } from 'react';
import { Eye, Sliders } from 'lucide-react';

export default function ForensicImageViewer({ 
  originalFile, 
  elaBase64 
}) {
  const [viewMode, setViewMode] = useState('heatmap'); // 'original' | 'heatmap' | 'overlay'
  const [overlayOpacity, setOverlayOpacity] = useState(50); // 0 to 100

  if (!elaBase64) return null;

  // Create Object URL for the uploaded file
  const originalUrl = originalFile ? URL.createObjectURL(originalFile) : "";
  const heatmapUrl = `data:image/jpeg;base64,${elaBase64}`;

  return (
    <div className="w-full bg-[#0d111a]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col gap-6 hover:border-[#3b82f6]/30 transition-all duration-300">
      <div className="flex justify-between items-center pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-[#3b82f6] animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Image Forensic Viewer
          </span>
        </div>

        {/* View Mode Selectors */}
        <div className="flex bg-white/[0.02] p-1 rounded-lg border border-white/5">
          {[
            { id: 'original', label: 'Original' },
            { id: 'heatmap', label: 'Heatmap' },
            { id: 'overlay', label: 'Overlay' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border-none cursor-pointer ${
                viewMode === mode.id
                  ? 'bg-white text-black'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="relative w-full aspect-video max-h-[300px] bg-black/50 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
        {viewMode === 'original' && (
          <img src={originalUrl} alt="Original" className="h-full object-contain" />
        )}
        
        {viewMode === 'heatmap' && (
          <img src={heatmapUrl} alt="ELA Heatmap" className="h-full object-contain" />
        )}

        {viewMode === 'overlay' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Base original image */}
            <img 
              src={originalUrl} 
              alt="Original Base" 
              className="absolute h-full object-contain z-0" 
            />
            {/* Heatmap overlay image */}
            <img 
              src={heatmapUrl} 
              alt="ELA Heatmap Overlay" 
              className="absolute h-full object-contain z-10 mix-blend-screen pointer-events-none"
              style={{ opacity: overlayOpacity / 100 }}
            />
          </div>
        )}
      </div>
      
      {/* Machine Learning Forensic Identification Grid */}
      {scanResult && (
        <div className="grid grid-cols-2 gap-4 bg-black/20 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-left">
          <div className="flex flex-col gap-1">
            <span className="text-white/40 uppercase font-bold tracking-wider">Visual ML Classifier</span>
            <span className="text-[#3b82f6] font-bold">ELA Random Forest Model</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white/40 uppercase font-bold tracking-wider">Identified Faces Count</span>
            <span className="text-white font-bold">{scanResult["Faces Detected"] || 0}</span>
          </div>
          <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
            <span className="text-white/40 uppercase font-bold tracking-wider">Average ELA Difference</span>
            <span className="text-white font-bold">{scanResult["Average ELA Difference"]?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
            <span className="text-white/40 uppercase font-bold tracking-wider">ELA Block Standard Deviation</span>
            <span className={`font-bold ${scanResult["ELA Standard Deviation"] > 4.0 ? 'text-rose-400 font-extrabold animate-pulse' : 'text-emerald-400'}`}>
              {scanResult["ELA Standard Deviation"]?.toFixed(4) || "0.0000"}
            </span>
          </div>
        </div>
      )}

      {/* Interactive Overlay Opacity Slider */}
      {viewMode === 'overlay' && (
        <div className="flex flex-col gap-2 bg-[#0f1422] p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={12} className="text-[#3b82f6]" />
              <span>Glint Opacity</span>
            </span>
            <span className="text-xs font-bold font-mono text-[#3b82f6]">
              {overlayOpacity}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
          />
          <span className="text-[9px] text-white/30 italic mt-1 leading-normal">
            Slide to cross-fade between photographic lighting boundaries and compressed pixel splice coordinates.
          </span>
        </div>
      )}
    </div>
  );
}
