import React from 'react';
import { 
  X, 
  Play, 
  FileText, 
  Music, 
  Video, 
  Image, 
  Globe, 
  ShieldAlert 
} from 'lucide-react';

export default function MediaPreview({ 
  stagedFile, 
  stagedText, 
  stagedUrl, 
  onClear, 
  onAnalyze, 
  isScanning 
}) {
  
  // Format File Size
  const formatSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get File Category and Icon
  const getFileMeta = (file) => {
    const type = file.type;
    const name = file.name;
    const ext = name.split('.').pop().toLowerCase();

    if (type.startsWith('image/')) {
      return { category: 'Image', icon: Image, color: 'text-emerald-400' };
    }
    if (type.startsWith('video/')) {
      return { category: 'Video', icon: Video, color: 'text-rose-400' };
    }
    if (type.startsWith('audio/')) {
      return { category: 'Audio', icon: Music, color: 'text-blue-400' };
    }
    if (ext === 'pdf') {
      return { category: 'PDF Document', icon: FileText, color: 'text-amber-400' };
    }
    return { category: 'Document', icon: FileText, color: 'text-gray-400' };
  };

  let previewContent = null;
  let fileTitle = "";
  let fileSubtitle = "";

  if (stagedFile) {
    const meta = getFileMeta(stagedFile);
    const MetaIcon = meta.icon;
    fileTitle = stagedFile.name;
    fileSubtitle = `${meta.category} • ${formatSize(stagedFile.size)}`;

    // Create Local URL for previews
    const fileUrl = URL.createObjectURL(stagedFile);

    if (meta.category === 'Image') {
      previewContent = (
        <div className="w-full flex justify-center bg-black/40 rounded-xl overflow-hidden max-h-[220px] border border-white/5">
          <img src={fileUrl} alt="Preview" className="h-full max-h-[220px] object-contain" />
        </div>
      );
    } else if (meta.category === 'Video') {
      previewContent = (
        <div className="w-full flex justify-center bg-black/40 rounded-xl overflow-hidden max-h-[220px] border border-white/5">
          <video src={fileUrl} controls className="w-full max-h-[220px] object-contain" />
        </div>
      );
    } else if (meta.category === 'Audio') {
      previewContent = (
        <div className="w-full bg-[#0f1422] p-4 rounded-xl border border-white/5 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Music className="text-[#3b82f6]" size={20} />
            <span className="text-xs text-white/80 font-medium">Acoustic Signal Track</span>
          </div>
          <audio src={fileUrl} controls className="w-full mt-2" />
        </div>
      );
    } else {
      previewContent = (
        <div className="w-full bg-[#0f1422] p-6 rounded-xl border border-white/5 flex items-center justify-center gap-4">
          <FileText className={`${meta.color} w-10 h-10`} />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">Document Package</span>
            <span className="text-[10px] text-white/50">PDF metadata & text parsing staged</span>
          </div>
        </div>
      );
    }
  } else if (stagedText) {
    fileTitle = "Scam Language String";
    fileSubtitle = `Text Content • ${stagedText.length} characters`;
    previewContent = (
      <div className="w-full bg-[#0f1422] p-4 rounded-xl border border-white/5">
        <p className="text-xs text-white/80 italic font-mono leading-relaxed line-clamp-3">
          "{stagedText}"
        </p>
      </div>
    );
  } else if (stagedUrl) {
    let domain = stagedUrl;
    try {
      const parsed = new URL(stagedUrl);
      domain = parsed.hostname;
    } catch (_) {
      // ignore
    }
    fileTitle = stagedUrl;
    fileSubtitle = `Phishing Domain Check • Host: ${domain}`;
    previewContent = (
      <div className="w-full bg-[#0f1422] p-4 rounded-xl border border-white/5 flex items-center gap-3">
        <Globe className="text-[#3b82f6]" size={18} />
        <span className="text-xs text-white/70 font-semibold font-mono truncate">{domain}</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0d111a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col gap-6 relative">
      {/* Header Info */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1 pr-6 truncate">
          <h4 className="text-sm font-semibold text-white truncate tracking-wide">
            {fileTitle}
          </h4>
          <span className="text-xs text-white/50 font-medium">
            {fileSubtitle}
          </span>
        </div>
        <button 
          onClick={onClear}
          disabled={isScanning}
          className="text-white/40 hover:text-white bg-transparent border-none cursor-pointer p-1 rounded-md transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Media Preview Window */}
      {previewContent}

      {/* Analyze Trigger */}
      <button
        onClick={onAnalyze}
        disabled={isScanning}
        className="w-full bg-[#3b82f6] text-white font-sans font-bold text-xs py-3.5 rounded-xl hover:bg-[#2563eb] transition-all duration-300 border-none cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
      >
        <Play size={14} className="fill-current" />
        <span>ANALYZE EVIDENCE</span>
      </button>
    </div>
  );
}
