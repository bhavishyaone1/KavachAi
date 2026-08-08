import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Loader2, 
  CheckCircle2, 
  Circle, 
  Fingerprint, 
  Activity 
} from 'lucide-react';

export default function AnalysisProgress({ 
  modalityType, 
  onComplete,
  isScanning,
  hasResult 
}) {
  const [currentStep, setCurrentStep] = useState(0);

  // Define steps per modality type
  const getSteps = () => {
    const baseSteps = [
      { id: 'prep', label: 'Preparing evidence logs' },
      { id: 'inspect', label: 'Inspecting media containers' }
    ];

    if (modalityType === 'audio') {
      return [
        baseSteps[0],
        baseSteps[1],
        { id: 'audio_auth', label: 'Inspecting vocoder flat pitch variance' },
        { id: 'synth_aud', label: 'Scanning voice Spoof probability' },
        { id: 'extract_txt', label: 'Extracting speech credentials & phone tags' },
        { id: 'risk_calc', label: 'Calculating fused threat indices' }
      ];
    }
    
    if (modalityType === 'image') {
      return [
        baseSteps[0],
        baseSteps[1],
        { id: 'vis_auth', label: 'Running Error Level Analysis (ELA)' },
        { id: 'pixel_manip', label: 'Checking pixel manipulation borders' },
        { id: 'ai_img', label: 'Scanning synthetic face generation' },
        { id: 'qr_url', label: 'Inspecting URL homographs & UPI QR payloads' },
        { id: 'rag_claims', label: 'Cross-matching claims via SEBI/RBI database' },
        { id: 'risk_calc', label: 'Calculating fused threat indices' }
      ];
    }

    if (modalityType === 'video') {
      return [
        baseSteps[0],
        baseSteps[1],
        { id: 'vis_auth', label: 'Running Error Level Analysis (ELA)' },
        { id: 'synth_aud', label: 'Scanning voice Spoof probability' },
        { id: 'lipsync', label: 'Measuring SyncNet audio-to-video timeline drift' },
        { id: 'qr_url', label: 'Inspecting URL homographs & UPI QR payloads' },
        { id: 'rag_claims', label: 'Cross-matching claims via SEBI/RBI database' },
        { id: 'risk_calc', label: 'Calculating fused threat indices' }
      ];
    }

    if (modalityType === 'document') {
      return [
        baseSteps[0],
        baseSteps[1],
        { id: 'extract_txt', label: 'Extracting PDF layout text & link tags' },
        { id: 'email_headers', label: 'Verifying email Display-Name & Reply-To headers' },
        { id: 'qr_url', label: 'Inspecting URL homographs & UPI QR payloads' },
        { id: 'rag_claims', label: 'Cross-matching claims via SEBI/RBI database' },
        { id: 'risk_calc', label: 'Calculating fused threat indices' }
      ];
    }

    // Default: text or url
    return [
      baseSteps[0],
      { id: 'extract_txt', label: 'Scanners checking Hinglish urgent vocabulary' },
      { id: 'qr_url', label: 'Inspecting URL homographs & UPI QR payloads' },
      { id: 'rag_claims', label: 'Cross-matching claims via SEBI/RBI database' },
      { id: 'risk_calc', label: 'Calculating fused threat indices' }
    ];
  };

  const steps = getSteps();

  const hasResultRef = useRef(hasResult);
  
  useEffect(() => {
    hasResultRef.current = hasResult;
  }, [hasResult]);

  useEffect(() => {
    if (!isScanning) {
      setCurrentStep(0);
      return;
    }

    const intervalTime = 300 + Math.random() * 200; // fast but readable sequence
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          if (hasResultRef.current) {
            clearInterval(timer);
            if (onComplete) onComplete();
          }
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isScanning, steps.length, onComplete]);

  if (!isScanning) return null;

  return (
    <div className="w-full bg-[#0d111a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
      {/* Conic sweep radar effect */}
      <div className="absolute right-6 top-6 w-16 h-16 rounded-full border border-white/5 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 radar-sweep" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity size={18} className="text-[#3b82f6]/60 animate-pulse" />
        </div>
      </div>

      <div>
        <span className="text-[#3b82f6] font-bold text-xs uppercase tracking-widest block mb-1">
          Forensic Inspection
        </span>
        <h3 className="text-base font-bold text-white tracking-wide">
          Running Multimodal Pipelines
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;
          
          return (
            <div 
              key={step.id} 
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                isActive ? 'opacity-100' : isDone ? 'opacity-70' : 'opacity-30'
              }`}
            >
              {isDone ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              ) : isActive ? (
                <Loader2 size={16} className="text-[#3b82f6] animate-spin shrink-0" />
              ) : (
                <Circle size={16} className="text-white/20 shrink-0" />
              )}
              
              <span className={`text-xs ${isActive ? 'text-white font-medium' : 'text-white/70'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
