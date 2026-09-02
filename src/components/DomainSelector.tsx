import React from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  DollarSign, 
  Layers, 
  Trophy, 
  Users, 
  Boxes,
  Sparkles, 
  Check, 
  ChevronRight,
  Info,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { DOMAINS_DATA, EXPERIENCE_LEVELS } from '../data/domains';
import { DomainType, ExperienceLevel } from '../types';

interface DomainSelectorProps {
  selectedDomain: DomainType;
  setSelectedDomain: (d: DomainType) => void;
  customDomainName: string;
  setCustomDomainName: (name: string) => void;
  selectedLevel: ExperienceLevel;
  setSelectedLevel: (lvl: ExperienceLevel) => void;
  onSelectQuickHook?: (hook: string) => void;
  onSelectUnseenFact?: (fact: string) => void;
}

const getDomainIcon = (iconName: string) => {
  switch (iconName) {
    case 'Boxes': return <Boxes className="w-5 h-5 text-[#4F46E5]" />;
    case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-[#0A66C2]" />;
    case 'Briefcase': return <Briefcase className="w-5 h-5 text-[#057642]" />;
    case 'DollarSign': return <DollarSign className="w-5 h-5 text-[#6B21A8]" />;
    case 'Layers': return <Layers className="w-5 h-5 text-[#B45309]" />;
    case 'Trophy': return <Trophy className="w-5 h-5 text-[#EA580C]" />;
    case 'Users': return <Users className="w-5 h-5 text-[#0284C7]" />;
    default: return <Sparkles className="w-5 h-5 text-[#0A66C2]" />;
  }
};

export const DomainSelector: React.FC<DomainSelectorProps> = ({
  selectedDomain,
  setSelectedDomain,
  customDomainName,
  setCustomDomainName,
  selectedLevel,
  setSelectedLevel,
  onSelectQuickHook,
  onSelectUnseenFact,
}) => {
  const currentDomainMeta = DOMAINS_DATA.find((d) => d.id === selectedDomain);

  return (
    <div className="space-y-6">
      {/* 1. DOMAIN SELECTION GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-[#191919] flex items-center gap-2">
              <span>Step 1: Choose Your Domain Track</span>
              <span className="text-xs font-normal text-[#666666] bg-[#F3F2EF] px-2 py-0.5 rounded-full">
                7 Specialist Verticals + Custom
              </span>
            </h2>
            <p className="text-xs text-[#666666]">
              Engineered with unseen facts, contrarian takes, and specialized vocabulary for each industry.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {DOMAINS_DATA.map((domain) => {
            const isSelected = selectedDomain === domain.id;
            return (
              <button
                key={domain.id}
                id={`domain-card-${domain.id}`}
                onClick={() => setSelectedDomain(domain.id)}
                className={`relative p-3 rounded-lg text-left transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#EBF4FD] border-[#0A66C2] shadow-sm ring-1 ring-[#0A66C2]'
                    : 'bg-white border-[#E0DFDC] hover:border-[#B2B0A8] hover:bg-[#F9F9F8]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 rounded-md bg-white border border-[#E0DFDC] shadow-2xs">
                      {getDomainIcon(domain.iconName)}
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-[#191919] leading-snug">
                    {domain.shortTitle}
                  </h3>
                </div>
                <p className="text-[11px] text-[#666666] line-clamp-2 mt-1 leading-tight">
                  {domain.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Custom Domain Input Toggle */}
        <div className="mt-2.5 flex items-center gap-3">
          <button
            id="domain-card-custom"
            onClick={() => setSelectedDomain('custom')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition ${
              selectedDomain === 'custom'
                ? 'bg-[#EBF4FD] border-[#0A66C2] text-[#0A66C2]'
                : 'bg-white border-[#E0DFDC] text-[#666666] hover:bg-[#F3F2EF]'
            }`}
          >
            + Other / Custom Domain
          </button>
          {selectedDomain === 'custom' && (
            <input
              id="custom-domain-name-input"
              type="text"
              value={customDomainName}
              onChange={(e) => setCustomDomainName(e.target.value)}
              placeholder="e.g. AI Product Management, Biotech, Cybersecurity..."
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#0A66C2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
            />
          )}
        </div>
      </div>

      {/* 2. EXPERIENCE LEVEL SELECTOR */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-[#191919] flex items-center gap-2">
            <span>Step 2: Experience & Past Background Level</span>
          </h2>
          <span className="text-xs text-[#666666]">
            Shapes voice tone, vocabulary depth, and storytelling posture
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EXPERIENCE_LEVELS.map((level) => {
            const isSelected = selectedLevel === level.id;
            return (
              <button
                key={level.id}
                id={`level-card-${level.id}`}
                onClick={() => setSelectedLevel(level.id)}
                className={`p-3.5 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-[#EBF4FD] border-[#0A66C2] shadow-sm ring-1 ring-[#0A66C2]'
                    : 'bg-white border-[#E0DFDC] hover:border-[#B2B0A8] hover:bg-[#F9F9F8]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-[#0A66C2] text-white' : 'bg-[#F3F2EF] text-[#666666]'
                  }`}>
                    {level.badge}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-[#0A66C2] stroke-[2.5]" />}
                </div>
                <h4 className="text-sm font-bold text-[#191919]">{level.title}</h4>
                <p className="text-xs text-[#666666] mt-1 line-clamp-2 leading-relaxed">
                  {level.description}
                </p>
                <div className="mt-2.5 pt-2 border-t border-[#E0DFDC] text-[11px] text-[#0A66C2] font-medium italic truncate">
                  "{level.exampleHook}"
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DOMAIN INTELLIGENCE QUICK TABS (Unseen facts & Proven hooks) */}
      {currentDomainMeta && (
        <div className="bg-[#F8F9FA] border border-[#E0DFDC] rounded-lg p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#191919]">
              <Lightbulb className="w-4 h-4 text-[#B45309]" />
              <span>{currentDomainMeta.name} — Unseen Industry Insights & Proven Hooks</span>
            </div>
            <span className="text-[11px] text-[#666666]">Click any item to inject into your prompt</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Unseen Facts */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
                Unseen Facts & Contrarian Realities:
              </p>
              <div className="space-y-1.5">
                {currentDomainMeta.unseenFacts.slice(0, 2).map((fact, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectUnseenFact && onSelectUnseenFact(fact)}
                    className="w-full text-left p-2 bg-white hover:bg-[#EBF4FD] border border-[#E0DFDC] hover:border-[#0A66C2] rounded text-xs text-[#191919] transition group flex items-start space-x-2"
                  >
                    <span className="text-[#0A66C2] font-bold">•</span>
                    <span className="flex-1 group-hover:text-[#0A66C2]">{fact}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Hooks */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
                High-Converting Hook Blueprints:
              </p>
              <div className="space-y-1.5">
                {currentDomainMeta.trendingHooks.slice(0, 2).map((hook, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectQuickHook && onSelectQuickHook(hook)}
                    className="w-full text-left p-2 bg-white hover:bg-[#EBF4FD] border border-[#E0DFDC] hover:border-[#0A66C2] rounded text-xs text-[#191919] transition group flex items-start space-x-2"
                  >
                    <span className="text-[#057642] font-bold">↳</span>
                    <span className="flex-1 group-hover:text-[#0A66C2] font-medium">"{hook}"</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
