import React, { useState } from 'react';
import { Film, Play, AlertCircle } from 'lucide-react';

export default function MediaTimeline({ 
  timestamps = [], 
  frames = [] 
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (timestamps.length === 0) return null;

  // Mock duration and marker alignments
  const videoDuration = "0:30";
  
  // Map timestamps to approximate percentages
  const getMarkerPosition = (index, total) => {
    if (total <= 1) return 50;
    return 15 + (index / (total - 1)) * 70; // spread markers between 15% and 85%
  };

  const getEventName = (t) => {
    const val = t.toLowerCase();
    if (val.includes('sync') || val.includes('drift')) return 'A/V Sync Drift';
    if (val.includes('qr')) return 'QR Payeed Target';
    return 'Face Landmark Anomaly';
  };

  return (
    <div className="w-full bg-[#0d111a]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col gap-6 hover:border-[#3b82f6]/30 transition-all duration-300">
      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
        <Film size={16} className="text-[#3b82f6]" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          SyncNet Video Anomaly Timeline
        </span>
      </div>

      {/* Main Track Bar */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="relative w-full h-1.5 bg-white/10 rounded-full my-6">
          {/* Start and end text */}
          <span className="absolute -left-1 -bottom-6 text-[10px] text-white/40 font-mono font-bold">
            0:00
          </span>
          <span className="absolute -right-1 -bottom-6 text-[10px] text-white/40 font-mono font-bold">
            {videoDuration}
          </span>

          {/* Timeline markers */}
          {timestamps.map((t, idx) => {
            const pos = getMarkerPosition(idx, timestamps.length);
            const isSelected = selectedEvent === idx;
            const eventName = getEventName(t);
            const frameNum = frames[idx] || `Frame ${Math.floor(25 + idx * 40)}`;

            return (
              <div
                key={idx}
                className="absolute -top-1.5 -translate-x-1/2 group cursor-pointer"
                style={{ left: `${pos}%` }}
                onClick={() => setSelectedEvent(isSelected ? null : idx)}
              >
                {/* Pulsing indicator marker */}
                <div 
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isSelected 
                      ? 'bg-rose-500 scale-125 shadow-[0_0_12px_rgba(244,63,94,0.6)]' 
                      : 'bg-[#3b82f6] group-hover:bg-rose-400 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                  }`}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>

                {/* Hover tooltip */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black border border-white/10 text-[9px] font-bold py-1 px-2.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 tracking-wide text-white uppercase">
                  {eventName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected event metadata report card */}
      {selectedEvent !== null && (
        <div className="bg-[#0f1422] p-4 rounded-xl border border-rose-500/20 text-left flex gap-3 items-start animate-fade-in">
          <AlertCircle className="text-rose-500 w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {getEventName(timestamps[selectedEvent])}
              </span>
              <span className="text-[10px] font-mono text-rose-400 font-bold">
                {timestamps[selectedEvent]}
              </span>
            </div>
            <p className="text-[11px] text-white/60 mt-1 leading-normal font-medium">
              Forensic indicator triggered: anomaly detected at {frames[selectedEvent] || "staged video frame bounds"}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
