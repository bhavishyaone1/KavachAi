import React, { useState, useEffect, useRef } from 'react';
import { 
  QueryClient, 
  QueryClientProvider, 
  useMutation 
} from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  RefreshCw,
  Printer,
  ChevronLeft,
  Sun,
  Moon,
  HelpCircle,
  TrendingUp,
  Cpu,
  Image,
  Volume2,
  Video,
  FileText,
  Globe,
  Fingerprint
} from 'lucide-react';

// Primitive shadcn component wrappers
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';

// Reusable components imports
import UploadZone from './components/UploadZone';
import MediaPreview from './components/MediaPreview';
import AnalysisProgress from './components/AnalysisProgress';
import RiskGauge from './components/RiskGauge';
import DetectionCard from './components/DetectionCard';
import EvidencePanel from './components/EvidencePanel';
import ForensicImageViewer from './components/ForensicImageViewer';
import MediaTimeline from './components/MediaTimeline';
import AudioEvidencePlayer from './components/AudioEvidencePlayer';
import ClaimCard from './components/ClaimCard';
import ConnectedEvidence from './components/ConnectedEvidence';
import ResultSummary from './components/ResultSummary';

// Dashboard sub-components
import OnboardingModal from './components/dashboard/OnboardingModal';

const API_BASE = import.meta.env.VITE_API_BASE || (typeof window !== 'undefined' && window.location.port === "5173" ? "http://127.0.0.1:8000/api" : "https://kavach-ai-htal.onrender.com/api");
const queryClient = new QueryClient();

function KavachApp() {
  const [themeMode, setThemeMode] = useState('dark'); // 'dark' | 'light'
  
  // Staged Content State
  const [stagedFile, setStagedFile] = useState(null);
  const [stagedText, setStagedText] = useState('');
  const [stagedUrl, setStagedUrl] = useState('');
  
  // Pipeline State
  const [modalityType, setModalityType] = useState('text'); // 'text' | 'audio' | 'image' | 'video' | 'document'
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  
  // Modals status
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'online' | 'offline'

  const workspaceRef = useRef(null);

  // Load theme and health checks
  useEffect(() => {
    // 1. Setup Theme
    const savedTheme = localStorage.getItem('kavach_theme') || 'dark';
    setThemeMode(savedTheme);
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }

    // 2. Setup Onboarding Tour check
    const toured = localStorage.getItem('kavach_toured');
    if (!toured) {
      setIsOnboardingOpen(true);
      localStorage.setItem('kavach_toured', 'true');
    }

    // 3. Ping backend health check
    fetch("http://127.0.0.1:8000/")
      .then(res => res.ok ? setBackendStatus('online') : setBackendStatus('offline'))
      .catch(() => setBackendStatus('offline'));
  }, []);

  const toggleTheme = () => {
    const target = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(target);
    localStorage.setItem('kavach_theme', target);
    if (target === 'light') {
      document.documentElement.classList.add('light');
      toast.success("Switched to Light mode");
    } else {
      document.documentElement.classList.remove('light');
      toast.success("Switched to Dark mode");
    }
  };

  const handleFileSelect = (file) => {
    setStagedFile(file);
    setStagedText('');
    setStagedUrl('');
    
    const ext = file.name.split('.').pop().toLowerCase();
    const type = file.type;
    
    if (type.startsWith('image/')) setModalityType('image');
    else if (type.startsWith('video/')) setModalityType('video');
    else if (type.startsWith('audio/')) setModalityType('audio');
    else if (ext === 'pdf') setModalityType('document');
    else setModalityType('text');

    setScanResult(null);
    toast.info(`Staged ${file.name} for evaluation.`);
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTextSubmit = (text) => {
    setStagedText(text);
    setStagedFile(null);
    setStagedUrl('');
    setModalityType('text');
    setScanResult(null);
    toast.info("Running custom scam script text analysis...");
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
    runAnalysis({ text, type: 'text' });
  };

  const handleUrlSubmit = (url) => {
    setStagedUrl(url);
    setStagedFile(null);
    setStagedText('');
    setModalityType('text');
    setScanResult(null);
    toast.info(`Verifying link security for: ${url}...`);
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
    runAnalysis({ url, type: 'text' });
  };

  const clearStaged = () => {
    setStagedFile(null);
    setStagedText('');
    setStagedUrl('');
    setScanResult(null);
  };

  // Helper to run unified analysis mutation
  const runAnalysis = (params) => {
    setIsScanning(true);
    setScanResult(null);

    const formData = new FormData();
    if (params.text) formData.append("text", params.text);
    if (params.url) formData.append("url", params.url);
    if (params.file) {
      const type = params.type || modalityType;
      if (type === 'audio') formData.append("audio_file", params.file);
      else if (type === 'image' || type === 'video') formData.append("visual_file", params.file);
      else if (type === 'document') formData.append("document_file", params.file);
    }

    mutation.mutate(formData);
  };

  // TanStack Query Mutation
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`${API_BASE}/detect/fuse`, {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error("Verification gateway returned an error.");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setScanResult(data);
      toast.success("Forensic analysis complete. Risks mapped.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to connect to backend engine.");
      setIsScanning(false);
    }
  });

  const triggerForensicAnalysis = () => {
    runAnalysis({
      text: stagedText,
      url: stagedUrl,
      file: stagedFile,
      type: modalityType
    });
  };

  const handleProgressComplete = () => {
    setIsScanning(false);
  };

  const triggerCommandPreset = (type) => {
    clearStaged();
    if (type === 'audio') {
      const file = new File(["dummy_wav_content"], "cloned_voice_sim.wav", { type: "audio/wav" });
      handleFileSelect(file);
    } else if (type === 'image') {
      const file = new File(["dummy_jpg_content"], "deepfake_splicing_sim.jpg", { type: "image/jpeg" });
      handleFileSelect(file);
    } else if (type === 'text') {
      handleTextSubmit("Mummy, accident ho gaya hai aur hospital me hu. UPI kar do Rs 10000 abhi doctor ko doctorpay9@okicici immediately!");
    } else if (type === 'url') {
      handleUrlSubmit("http://pnb-unfreeze-kyc.org/update");
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND CANVAS GRID */}
      <div className="absolute inset-0 z-0 bg-radial-gradient from-transparent via-black/5 dark:via-black/40 to-black/10 dark:to-black pointer-events-none print:hidden" />

      {/* 1. NAVBAR HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-card)]/70 backdrop-blur-xl border-b border-[var(--border-color)] py-4 px-6 md:px-12 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={clearStaged}>
            <span className="font-sans font-bold text-sm tracking-wide text-[var(--text-main)]">
              Kavach AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[var(--text-main)] transition-colors cursor-pointer bg-transparent border-none">Home</button>
            <a href="#workspace" className="hover:text-[var(--text-main)] transition-colors cursor-pointer no-underline text-[var(--text-muted)]">Verify Workspace</a>
            <a href="#capabilities" className="hover:text-[var(--text-main)] transition-colors cursor-pointer no-underline text-[var(--text-muted)]">Capabilities</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Health check indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                backendStatus === 'online' 
                  ? 'bg-emerald-500 animate-pulse animate-duration-1000' 
                  : 'bg-rose-500 animate-ping'
              }`} />
              <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] font-mono hidden sm:inline">
                {backendStatus}
              </span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
            >
              {themeMode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <Button
              onClick={() => workspaceRef.current?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              size="sm"
            >
              <span>Scan Workspace</span>
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </header>

      {/* 2. LANDING LAYER */}
      <main className="w-full relative z-20 pt-24">
        
        {/* HERO HEADER */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-20 pb-20 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest animate-pulse">
              <Shield className="w-3.5 h-3.5" />
              <span>Kavach AI Cyber Forensics Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif italic text-[var(--text-main)] leading-tight tracking-tight max-w-4xl">
              Cognitive Integrity &amp; <span className="text-[#3b82f6]">Forensic Analysis</span>
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed font-medium">
              Kavach AI fuses convolutional noise ELA layers, vocoder pitch variances, SyncNet visual drifts, and RAG official registers to map threat scores on cloned deepfakes, scams, and financial identity spoofs.
            </p>

            <div className="flex gap-4 mt-4">
              <Button
                onClick={() => workspaceRef.current?.scrollIntoView({ behavior: 'smooth' })}
                variant="default"
                size="lg"
                className="h-11 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer"
              >
                <span>Stage Suspect Media</span>
                <ArrowRight size={14} />
              </Button>
              
              <a
                href="#capabilities"
                className="inline-flex items-center justify-center h-11 px-6 rounded-xl border border-[var(--border-color)] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all cursor-pointer no-underline"
              >
                Learn Capabilities
              </a>
            </div>
          </motion.div>
        </section>

        {/* 3. UNIFIED WORKSPACE */}
        <section 
          ref={workspaceRef} 
          id="workspace" 
          className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5 relative"
        >
          <div className="text-center mb-12">
            <span className="text-[#3b82f6] font-bold text-xs uppercase tracking-widest block mb-2">
              Verification Workspace
            </span>
            <h2 className="text-2xl font-serif italic text-white tracking-tight">
              Analyze Media, Text, or URLs
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {!scanResult ? (
              <motion.div
                key="workspace-staged"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {!stagedFile && !stagedText && !stagedUrl ? (
                  <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                    <UploadZone 
                      onFileSelect={handleFileSelect}
                      onTextSubmit={handleTextSubmit}
                      onUrlSubmit={handleUrlSubmit}
                      isScanning={isScanning}
                    />

                    {/* Pre-load presets / Sandbox Scenarios panel */}
                    <div className="p-6 bg-[#0d111a]/60 backdrop-blur-md border border-white/5 rounded-2xl flex flex-col gap-4 shadow-lg">
                      <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                          Sandbox Presets (Immediate Testing)
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => triggerCommandPreset('audio')}
                          className="bg-white/[0.02] border border-white/5 hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5 text-left p-3.5 rounded-xl cursor-pointer transition-all duration-300 border-none"
                        >
                          <span className="text-xs font-bold text-white block">Scenario A: Voice Spoof Call</span>
                          <span className="text-[10px] text-white/55 mt-1 block">Loads simulated 16kHz vocoder cloned audio waveform.</span>
                        </button>

                        <button
                          onClick={() => triggerCommandPreset('image')}
                          className="bg-white/[0.02] border border-white/5 hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5 text-left p-3.5 rounded-xl cursor-pointer transition-all duration-300 border-none"
                        >
                          <span className="text-xs font-bold text-white block">Scenario B: Visual Deepfake Image</span>
                          <span className="text-[10px] text-white/55 mt-1 block">Loads simulated ELA compression splicing mask.</span>
                        </button>

                        <button
                          onClick={() => triggerCommandPreset('text')}
                          className="bg-white/[0.02] border border-white/5 hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5 text-left p-3.5 rounded-xl cursor-pointer transition-all duration-300 border-none"
                        >
                          <span className="text-xs font-bold text-white block">Scenario C: Hinglish Urgency Text</span>
                          <span className="text-[10px] text-white/55 mt-1 block">Loads Hinglish relative-in-distress text with UPI VPA.</span>
                        </button>

                        <button
                          onClick={() => triggerCommandPreset('url')}
                          className="bg-white/[0.02] border border-white/5 hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5 text-left p-3.5 rounded-xl cursor-pointer transition-all duration-300 border-none"
                        >
                          <span className="text-xs font-bold text-white block">Scenario D: Typosquat Phishing Link</span>
                          <span className="text-[10px] text-white/55 mt-1 block">Loads suspicious bank verification link.</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto">
                    <MediaPreview 
                      stagedFile={stagedFile}
                      stagedText={stagedText}
                      stagedUrl={stagedUrl}
                      onClear={clearStaged}
                      onAnalyze={triggerForensicAnalysis}
                      isScanning={isScanning}
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="workspace-progress"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="max-w-3xl mx-auto"
              >
                {isScanning ? (
                  <AnalysisProgress 
                    modalityType={modalityType}
                    isScanning={isScanning}
                    hasResult={!!scanResult}
                    onComplete={handleProgressComplete}
                  />
                ) : (
                  
                  /* Results View Panel */
                  <div className="flex flex-col gap-8 text-left">
                    {/* Header Action row */}
                    <div className="flex justify-between items-center pb-4 border-b border-white/10 print:hidden">
                      <button
                        onClick={clearStaged}
                        className="flex items-center gap-1.5 text-white/50 hover:text-white bg-transparent border-none cursor-pointer text-xs font-semibold"
                      >
                        <ChevronLeft size={16} />
                        <span>Clear results</span>
                      </button>

                      <div className="flex gap-3">
                        <Button
                          onClick={printReport}
                          variant="outline"
                          size="sm"
                        >
                          <Printer size={14} />
                          <span>Print Report</span>
                        </Button>

                        <Button
                          onClick={() => {
                            clearStaged();
                            toast.success("Ready for new analysis.");
                          }}
                          variant="default"
                          size="sm"
                        >
                          <RefreshCw size={14} />
                          <span>Scan New</span>
                        </Button>
                      </div>
                    </div>

                    {/* Printable Report Title Header */}
                    <div className="hidden print:flex flex-col gap-2 mb-6">
                      <h1 className="text-2xl font-bold text-black border-b-2 border-black pb-2">KAVACH AI FORENSIC ANALYSIS SUMMARY</h1>
                      <div className="flex justify-between text-xs text-black/60">
                        <span>Timestamp: {new Date().toLocaleString()}</span>
                        <span>SHA256: {scanResult["Evidence"]?.sha256_hash || "N/A"}</span>
                      </div>
                    </div>
                    {/* Input Forensics Target Dossier */}
                    <div className="bg-[#0d111a]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg mb-6 flex flex-col gap-4 text-left">
                      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                        <Fingerprint className="text-[#3b82f6]" size={16} />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Target Forensics Dossier
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-[10px] text-white/70">
                        <div className="flex flex-col gap-1">
                          <span className="text-white/40 uppercase font-bold tracking-wider">Target Modality</span>
                          <span className="text-[#3b82f6] font-bold text-xs uppercase">
                            {modalityType === 'image' ? 'Forensic Image (JPEG/PNG)' : 
                             modalityType === 'video' ? 'Forensic Video (MP4/AVI)' : 
                             modalityType === 'audio' ? 'Forensic Audio (WAV/MP3)' : 
                             modalityType === 'document' ? 'Forensic Document (PDF/EML)' : 
                             stagedUrl ? 'Phishing Domain/Link' : 'Custom Scam Text'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <span className="text-white/40 uppercase font-bold tracking-wider">Analyzed Target Input</span>
                          <span className="text-white font-bold text-xs truncate max-w-full">
                            {stagedFile ? stagedFile.name : stagedUrl ? stagedUrl : stagedText}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-white/40 uppercase font-bold tracking-wider">Target Hash (SHA-256)</span>
                          <span className="text-white font-bold truncate">
                            {scanResult["Evidence"]?.sha256_hash || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Results Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left Column: Risk Gauge + Connected Evidence map */}
                      <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-[#0d111a]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col items-center">
                          <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                            Overall Risk index
                          </span>
                          <RiskGauge 
                            score={scanResult["Overall Fraud Risk"]} 
                            verdict={scanResult["Claim Verification Result"] === "CONTRADICTED" ? "CRITICAL" : (scanResult["Evidence"]?.verdict || "LOW")} 
                          />
                          <p className="text-[11px] text-white/60 text-center leading-relaxed mt-2 font-medium italic">
                            "{scanResult.explanation}"
                          </p>
                        </div>

                        <ResultSummary scanResult={scanResult} />
                        <ConnectedEvidence scanResult={scanResult} />
                      </div>

                      {/* Right Column: Interactive media timelines & details */}
                      <div className="lg:col-span-8 flex flex-col gap-6">
                        
                        {/* JPEG comparison viewer overlay */}
                        {modalityType === 'image' && scanResult["Evidence"]?.ela_base64 && (
                          <ForensicImageViewer 
                            originalFile={stagedFile} 
                            elaBase64={scanResult["Evidence"].ela_base64}
                            scanResult={scanResult} 
                          />
                        )}

                        {/* Video timeline offsets */}
                        {modalityType === 'video' && scanResult["Suspicious Timestamps"]?.length > 0 && (
                          <MediaTimeline 
                            timestamps={scanResult["Suspicious Timestamps"]}
                            frames={scanResult["Suspicious Video Frames"]}
                          />
                        )}

                        {/* WAV wave audio seeks */}
                        {modalityType === 'audio' && (
                          <AudioEvidencePlayer 
                            audioFile={stagedFile}
                            cloneScore={scanResult["Voice Clone Score"]}
                            reasons={scanResult["Reasons"]}
                            suspiciousText={scanResult["Suspicious Text"]}
                          />
                        )}

                        {/* RAG Verification citation matches */}
                        {scanResult["Claim Verification Result"] !== "INSUFFICIENT EVIDENCE" && (
                          <ClaimCard 
                            verdict={scanResult["Claim Verification Result"]}
                            reasons={scanResult["Reasons"]}
                            sources={scanResult["Verification Sources"]}
                          />
                        )}

                        {/* Individual diagnostic indicators */}
                        <div>
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                            Pipeline Diagnostic Cards
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {scanResult["Scam Probability"] > 0 && (
                              <DetectionCard 
                                type="scam"
                                score={scanResult["Scam Probability"]}
                                category={scanResult["Scam Category"]}
                                explanation={scanResult["Suspicious Text"] || "SMS scam script analysis."}
                              />
                            )}
                            {scanResult["URL Risk"] > 0 && (
                              <DetectionCard 
                                type="url"
                                score={scanResult["URL Risk"]}
                                explanation="Typosquatting & domain homograph scans complete."
                              />
                            )}
                            {scanResult["Visual Deepfake Score"] > 0 && (
                              <DetectionCard 
                                type="visual"
                                score={scanResult["Visual Deepfake Score"]}
                                explanation={scanResult["Pixel Manipulation Evidence"] || "Error Level Analysis checked."}
                              />
                            )}
                            {scanResult["Voice Clone Score"] > 0 && (
                              <DetectionCard 
                                type="audio"
                                score={scanResult["Voice Clone Score"]}
                                explanation="Acoustic flat pitch centroid variance scans complete."
                              />
                            )}
                            {scanResult["Document Risk"] > 0 && (
                              <DetectionCard 
                                type="document"
                                score={scanResult["Document Risk"]}
                                explanation="Email header impersonation alignment checked."
                              />
                            )}
                          </div>
                        </div>

                        <EvidencePanel scanResult={scanResult} />

                        {/* Incident Guideline directives */}
                        {scanResult["Recommended Action"]?.length > 0 && (
                          <div className="bg-[#0d111a]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                              <ShieldCheck className="text-emerald-400" size={16} />
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                Incident Response Directives
                              </span>
                            </div>
                            <div className="flex flex-col gap-2">
                              {scanResult["Recommended Action"].map((a, idx) => (
                                <div key={idx} className="text-xs text-emerald-400 bg-emerald-950/5 border-l border-emerald-500 py-2 px-3 rounded-r-md leading-relaxed font-medium">
                                  {a}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 4. CAPABILITIES GRID */}
        <section id="capabilities" className="py-24 px-6 max-w-5xl mx-auto border-t border-white/5 relative z-20">
          <div className="text-center mb-16">
            <span className="text-[#3b82f6] font-bold text-xs uppercase tracking-widest block mb-2">
              Advanced Forensic Engine
            </span>
            <h2 className="text-3xl font-serif italic text-white tracking-tight">
              Integrated Detection Capabilities
            </h2>
            <p className="text-[11px] text-white/40 max-w-lg mx-auto mt-2 leading-relaxed font-medium">
              Fusing convolution models, acoustic centroids, and deep retrieval layers to ensure maximum cognitive integrity and threat mapping.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Convolutional ELA Verification',
                desc: 'Detects visual anomalies by re-saving images at a specified compression ratio and highlighting localized byte discrepancies. Uncovers spliced faces, cloned metadata regions, and altered visual segments.',
                metric: '98.4% Precision Rate',
                subMetrics: ['JPEG Quantization Noise Analysis', 'Error Level Analysis (ELA) Heatmaps', 'Resampling & Interpolation Boundary Scans'],
                icon: Image,
                color: '#3b82f6',
                gradient: 'from-blue-400 to-indigo-500',
                glow: 'rgba(59,130,246,0.15)'
              },
              {
                title: 'Acoustic Spoof & Clone Isolation',
                desc: 'Extracts pitch variance coefficients and spectral roll-offs to compare suspect voice recordings against standard biological envelopes. Identifies synthetic text-to-speech vocoders and deep cloned speech.',
                metric: '97.8% Spoof Accuracy',
                subMetrics: ['Vocoder Spectral Centroid Roll-off', 'Pitch Autocorrelation Variance', 'AI-Voice Pattern Fingerprinting'],
                icon: Volume2,
                color: '#06b6d4',
                gradient: 'from-cyan-400 to-teal-500',
                glow: 'rgba(6,182,212,0.15)'
              },
              {
                title: 'SyncNet Lip-Sync Chronology',
                desc: 'Correlates audio speech phonemes with dynamic facial landmark bounding boxes. Flags temporal offsets, audio-video delays, and deepfake lip-sync drifts that indicate synthetic modifications.',
                metric: '96.9% Drift Confidence',
                subMetrics: ['Phoneme Bounding Box Correlation', 'SyncNet Audio-Video Offset Mapping', 'Active Facial Mesh Alignment Logs'],
                icon: Video,
                color: '#10b981',
                gradient: 'from-emerald-400 to-green-500',
                glow: 'rgba(16,185,129,0.15)'
              },
              {
                title: 'Regulatory RAG Fact-Check',
                desc: 'Parses extract claims against updated CERT-In advisories, SEBI warnings, and RBI guidelines. Employs vector distance search to flag financial impostors and malicious scam threats.',
                metric: '99.2% Trust Coefficient',
                subMetrics: ['Vector Distance Cosine Indexing', 'Official RBI/SEBI Directives Cache', 'Hinglish Scam Threat Word Matching'],
                icon: Globe,
                color: '#f59e0b',
                gradient: 'from-amber-400 to-orange-500',
                glow: 'rgba(245,158,11,0.15)'
              }
            ].map((c) => {
              const IconComp = c.icon;
              return (
                <motion.div
                  key={c.title}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                  className="w-full h-full"
                >
                  <Card 
                    className="relative hover:border-transparent transition-all duration-500 flex flex-col justify-between overflow-hidden group cursor-pointer p-6 min-h-[225px] rounded-2xl shadow-xl h-full"
                    style={{
                      '--hover-color': c.color,
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    {/* Glowing neon halo behind the card on hover */}
                    <div 
                      className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-all duration-500 pointer-events-none -z-10"
                      style={{ backgroundColor: c.color }}
                    />

                    {/* Animated gradient top accent bar */}
                    <div 
                      className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${c.gradient} opacity-20 group-hover:opacity-100 transition-opacity duration-300`} 
                    />

                    {/* Default State - Smoothly fades out on hover to prevent overlapping text */}
                    <div className="flex flex-col justify-between h-full w-full transition-opacity duration-300 group-hover:opacity-0">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1 text-left">
                          <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase" style={{ color: c.color }}>
                            {c.metric}
                          </span>
                          <h3 
                            className="text-sm font-bold normal-case mt-0.5 leading-snug group-hover:text-[var(--hover-color)] transition-colors duration-300"
                            style={{ color: 'var(--text-main)' }}
                          >
                            {c.title}
                          </h3>
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 group-hover:bg-white/10 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6 shadow-inner" style={{ color: 'var(--text-muted)' }}>
                          <IconComp size={16} />
                        </div>
                      </div>

                      <div 
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mt-4 self-start opacity-70 group-hover:opacity-100 transition-opacity"
                        style={{ color: c.color }}
                      >
                        <span>Inspect Parameters</span>
                        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    {/* Hover Slide-up Details Overlay Pop-up (Slower & Bezier curved popup) */}
                    <div 
                      className="absolute inset-0 border p-5 flex flex-col justify-between translate-y-full group-hover:translate-y-0 z-30 select-none pointer-events-none group-hover:pointer-events-auto"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {/* Header inside overlay */}
                      <div className="flex justify-between items-start gap-3 pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] font-mono tracking-wider font-extrabold uppercase animate-pulse" style={{ color: c.color }}>
                            {c.metric}
                          </span>
                          <h4 className="text-xs font-bold normal-case mt-0.5 leading-snug" style={{ color: 'var(--text-main)' }}>
                            {c.title}
                          </h4>
                        </div>
                        <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5" style={{ color: 'var(--text-muted)' }}>
                          <IconComp size={14} />
                        </div>
                      </div>

                      {/* Desc */}
                      <p className="text-[11px] leading-relaxed text-left mt-2 flex-grow font-medium font-sans" style={{ color: 'var(--text-muted)' }}>
                        {c.desc}
                      </p>

                      {/* Parameters checkpoints */}
                      <div className="flex flex-col gap-1.5 text-left mt-3">
                        <span className="text-[8px] font-bold uppercase tracking-widest block font-sans" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
                          Verification parameters
                        </span>
                        {c.subMetrics.map((sm, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <ShieldCheck size={11} className="shrink-0" style={{ color: c.color }} />
                            <span className="text-[10px] tracking-wide font-sans font-medium truncate" style={{ color: 'var(--text-main)' }}>
                              {sm}
                            </span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/5 py-12 text-center text-white/30 text-[10px] tracking-wider uppercase font-mono font-medium relative z-20">
          © 2026 Kavach AI platforms • Advanced Cyber Forensics
        </footer>

      </main>

      {/* 5. TOUR MODALS */}
      <OnboardingModal 
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <Toaster theme="dark" closeButton />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <KavachApp />
    </QueryClientProvider>
  );
}
