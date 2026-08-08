import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, ArrowRight, ArrowLeft, Upload, Activity } from 'lucide-react';
import { Button } from '../ui/button';

export default function OnboardingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Kavach AI',
      desc: 'Kavach AI is a production-grade digital forensics and multi-modal fraud scanner. Let’s take a 30-second tour of our core workspaces.',
      icon: Shield
    },
    {
      title: 'Multimodal Upload Workspace',
      desc: 'Drag and drop video, audio, images, or PDFs in the Upload Zone. You can also paste suspect text or phishing links directly. The engine auto-detects formats and coordinates the right analysis nodes.',
      icon: Upload
    },
    {
      title: 'Deep Diagnostics & Connected Evidence',
      desc: 'View Error Level Analysis (ELA) compression heatmaps, SyncNet audio-video timeline drifts, and verify claims against official RBI/SEBI databases. Check the Connected Evidence map to see how threats correlate.',
      icon: Activity
    }
  ];

  if (!isOpen) return null;

  const ActiveIcon = steps[step].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-[#0d111a] border border-white/10 rounded-2xl p-6 shadow-2xl relative flex flex-col gap-5 text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/40 hover:text-white bg-transparent border-none cursor-pointer p-1"
        >
          <X size={16} />
        </button>

        {/* Header step counter */}
        <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-wider">
          <span>Onboarding Tour</span>
          <span>Step {step + 1} of {steps.length}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#3b82f6] transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#3b82f6]/10 text-[#3b82f6]">
            <ActiveIcon size={20} className="animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {steps[step].title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-white/70 leading-relaxed font-medium min-h-[70px]">
          {steps[step].desc}
        </p>

        {/* Navigation Actions */}
        <div className="flex justify-between items-center mt-2">
          {step > 0 ? (
            <Button
              onClick={() => setStep(step - 1)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <ArrowLeft size={12} />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              variant="default"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight size={12} />
            </Button>
          ) : (
            <Button
              onClick={onClose}
              variant="destructive"
              size="sm"
            >
              <span>Finish Tour</span>
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
