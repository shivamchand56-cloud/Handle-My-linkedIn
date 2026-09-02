import React, { useState } from 'react';
import { 
  Compass, 
  TrendingUp, 
  Briefcase, 
  DollarSign, 
  Layers, 
  Trophy, 
  Users, 
  Sparkles, 
  Copy, 
  Check, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { DOMAINS_DATA } from '../data/domains';
import { DomainType } from '../types';

interface DomainIntelligenceViewProps {
  onSelectDomainForPost: (domain: DomainType, topicTitle?: string, promptSnippet?: string) => void;
}

export const DomainIntelligenceView: React.FC<DomainIntelligenceViewProps> = ({
  onSelectDomainForPost,
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<DomainType>('product');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const selectedDomain = DOMAINS_DATA.find((d) => d.id === selectedDomainId) || DOMAINS_DATA[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E0DFDC] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#EBF4FD] text-[#0077B5] rounded-lg">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#191919]">
                Domain Intelligence & Unseen Insights Vault
              </h2>
              <p className="text-xs text-[#666666]">
                Curated research, counter-intuitive data points, and proven hooks across 7 executive verticals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {DOMAINS_DATA.map((d) => {
          const isSelected = selectedDomainId === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDomainId(d.id)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#0077B5] text-white border-[#0077B5] shadow-xs'
                  : 'bg-white text-[#191919] border-[#E0DFDC] hover:bg-[#F9F9F8]'
              }`}
            >
              <span className="text-xs font-bold truncate">{d.shortTitle}</span>
              <span className={`text-[10px] truncate mt-1 ${isSelected ? 'text-blue-100' : 'text-[#666666]'}`}>
                {d.unseenFacts.length} unseen facts
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Domain Detailed Deep Dive Card */}
      <div className="bg-white border border-[#E0DFDC] rounded-lg p-6 space-y-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E0DFDC] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EBF4FD] text-[#0A66C2] px-2.5 py-1 rounded-full border border-[#D0E5FA]">
              Domain Deep Dive
            </span>
            <h3 className="text-lg font-bold text-[#191919] mt-1.5">{selectedDomain.name}</h3>
            <p className="text-xs text-[#666666] mt-0.5">{selectedDomain.tagline}</p>
          </div>

          <button
            onClick={() => onSelectDomainForPost(selectedDomain.id)}
            className="px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold rounded-full transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>Write a Post for this Domain</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. Core Authority Pillars */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#191919] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#057642]" />
            <span>Core Domain Authority Pillars</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedDomain.corePillars.map((pillar, idx) => (
              <span
                key={idx}
                className="bg-[#F8F9FA] border border-[#E0DFDC] px-3 py-1.5 rounded-md text-xs font-semibold text-[#191919]"
              >
                {pillar}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Unseen Facts & Contrarian Market Realities */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#191919] uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-[#B45309]" />
            <span>Unseen Facts & Contrarian Industry Realities</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDomain.unseenFacts.map((fact, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#FFFDF5] border border-[#FEEFC3] text-xs text-[#333333] space-y-2 flex flex-col justify-between"
              >
                <p className="leading-relaxed font-normal">
                  <strong className="text-[#B45309] font-bold">• Fact #{idx + 1}: </strong>
                  {fact}
                </p>
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => handleCopy(fact)}
                    className="text-[11px] text-[#0A66C2] font-semibold hover:underline flex items-center gap-1"
                  >
                    {copiedText === fact ? <Check className="w-3 h-3 text-[#057642]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedText === fact ? 'Copied' : 'Copy Fact'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Proven Hook Blueprints */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#191919] uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#D9381E]" />
            <span>Proven 2-Line Hook Blueprints</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDomain.trendingHooks.map((hook, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#F8F9FA] border border-[#E0DFDC] text-xs text-[#191919] space-y-2 flex flex-col justify-between"
              >
                <p className="font-semibold italic text-[#191919] leading-relaxed">
                  "{hook}"
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-[#EAEAEA]">
                  <span className="text-[10px] text-[#666666]">Tested for high click-through</span>
                  <button
                    onClick={() => handleCopy(hook)}
                    className="text-[11px] text-[#0A66C2] font-semibold hover:underline flex items-center gap-1"
                  >
                    {copiedText === hook ? <Check className="w-3 h-3 text-[#057642]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedText === hook ? 'Copied' : 'Copy Hook'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Ready-to-Generate Topics */}
        <div className="space-y-3 pt-2 border-t border-[#E0DFDC]">
          <h4 className="text-xs font-bold text-[#191919] uppercase tracking-wider">
            Ready-to-Deploy Topic Frameworks:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {selectedDomain.sampleTopics.map((sample, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-white border border-[#E0DFDC] space-y-2 flex flex-col justify-between shadow-2xs hover:border-[#0A66C2] transition"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#0A66C2] bg-[#EBF4FD] px-2 py-0.5 rounded">
                    {sample.type.replace('_', ' ')}
                  </span>
                  <h5 className="text-xs font-bold text-[#191919] mt-1.5 line-clamp-2">{sample.title}</h5>
                  <p className="text-[11px] text-[#666666] mt-1 line-clamp-3 leading-relaxed">{sample.promptSnippet}</p>
                </div>

                <button
                  onClick={() => onSelectDomainForPost(selectedDomain.id, sample.title, sample.promptSnippet)}
                  className="w-full mt-2 py-1.5 bg-[#F3F2EF] hover:bg-[#EBF4FD] text-[#0A66C2] text-xs font-bold rounded-md transition flex items-center justify-center gap-1"
                >
                  <span>Build Post with AI ➔</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
