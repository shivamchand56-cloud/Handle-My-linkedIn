import React, { useState } from 'react';
import { User, X, Check, Sparkles } from 'lucide-react';

interface AuthorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorName: string;
  setAuthorName: (name: string) => void;
  authorHeadline: string;
  setAuthorHeadline: (headline: string) => void;
  domainName: string;
}

export const AuthorProfileModal: React.FC<AuthorProfileModalProps> = ({
  isOpen,
  onClose,
  authorName,
  setAuthorName,
  authorHeadline,
  setAuthorHeadline,
  domainName,
}) => {
  const [tempName, setTempName] = useState(authorName);
  const [tempHeadline, setTempHeadline] = useState(authorHeadline);

  if (!isOpen) return null;

  const handleSave = () => {
    setAuthorName(tempName || 'Domain Expert');
    setAuthorHeadline(tempHeadline || `${domainName} Specialist | Cohort Member`);
    onClose();
  };

  const presetHeadlines = [
    `${domainName} Strategy Lead | Ex-Big 4 | Cohort Member`,
    `Founder's Office & Strategy | Scaling 0 to 1 | Thought Leader`,
    `VP of Growth & Marketing | B2B Performance & Brand Architecture`,
    `Principal @ Early-Stage VC | Demystifying Deal Flow & Power Laws`,
    `VP Supply Chain & Operations | Logistics Resilience & 3PL Audits`,
    `Head of People & Org Design | Asynchronous Culture & Retention`,
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-[#E0DFDC] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#E0DFDC] pb-3">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-[#0A66C2]" />
            <h3 className="text-base font-bold text-[#191919]">Author Profile Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#666666] hover:bg-[#F3F2EF] rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#191919] mb-1">
              Your Name / Alias:
            </label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-[#CCCCCC] rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#191919] mb-1">
              LinkedIn Profile Headline:
            </label>
            <input
              type="text"
              value={tempHeadline}
              onChange={(e) => setTempHeadline(e.target.value)}
              placeholder="e.g. Chief of Staff | Scaling B2B SaaS | Cohort Fellow"
              className="w-full px-3 py-2 text-xs bg-[#F9F9F8] border border-[#CCCCCC] rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#666666] uppercase tracking-wider mb-1.5">
              Quick Preset Headlines:
            </label>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {presetHeadlines.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTempHeadline(preset)}
                  className="w-full text-left p-1.5 text-xs text-[#333333] hover:bg-[#EBF4FD] hover:text-[#0A66C2] rounded transition truncate"
                >
                  • {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E0DFDC]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#666666] hover:bg-[#F3F2EF] rounded-full transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold rounded-full transition flex items-center gap-1 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
