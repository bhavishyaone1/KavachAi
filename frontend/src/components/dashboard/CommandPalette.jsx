import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, History, Sparkles, Terminal } from 'lucide-react';

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  historyList = [], 
  onSelectHistory, 
  onTriggerPreset,
  onNavigate 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Command options list
  const actionsList = [
    { id: 'scan', label: 'Verify & Scan Platform', type: 'action', icon: Terminal, handler: () => onNavigate('workspace') },
    { id: 'logs', label: 'View Forensic Audit logs', type: 'action', icon: History, handler: () => onNavigate('history') },
    { id: 'preset_a', label: 'Simulate Voice Spoof Call (Preset)', type: 'preset', icon: Sparkles, handler: () => onTriggerPreset('audio') },
    { id: 'preset_b', label: 'Simulate Deepfake visual (Preset)', type: 'preset', icon: Sparkles, handler: () => onTriggerPreset('image') },
    { id: 'preset_c', label: 'Simulate Hinglish UPI Scam (Preset)', type: 'preset', icon: Sparkles, handler: () => onTriggerPreset('text') },
    { id: 'preset_d', label: 'Simulate Phishing Link (Preset)', type: 'preset', icon: Sparkles, handler: () => onTriggerPreset('url') }
  ];

  // Parse items
  const historyItems = historyList.map(h => ({
    id: h.id,
    label: `Reopen Session: ${h.label} (${h.score}% Risk)`,
    type: 'history',
    icon: History,
    handler: () => onSelectHistory(h)
  }));

  const allItems = [...actionsList, ...historyItems];

  // Filter items
  const filteredItems = allItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard navigation listeners
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].handler();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-[15vh]">
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: -10 }}
        className="w-full max-w-lg bg-[#0d111a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Search bar input wrapper */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
          <Search className="text-white/40" size={16} />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none text-xs text-white placeholder-white/30 outline-none font-medium"
            placeholder="Type a command or search logs (Ctrl+K)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <span className="text-[9px] font-bold bg-white/5 px-2 py-0.5 rounded text-white/30">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[300px] overflow-y-auto p-2 flex flex-col gap-1 scrollbar-none">
          {filteredItems.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const ItemIcon = item.icon;
            
            return (
              <div
                key={item.id}
                onClick={() => {
                  item.handler();
                  onClose();
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-white/5 text-white' 
                    : 'text-white/60 hover:bg-white/[0.02] hover:text-white'
                }`}
              >
                <ItemIcon size={14} className="shrink-0" />
                <span className="text-xs font-medium truncate flex-1">
                  {item.label}
                </span>
                
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-white/30 px-1.5 py-0.5 rounded bg-white/5 font-mono">
                  {item.type}
                </span>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="text-center text-white/40 text-xs py-8">
              No matching commands or session logs found.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
