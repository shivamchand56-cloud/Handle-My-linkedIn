import React from 'react';
import { 
  Zap, 
  Clock, 
  Flame, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Share2, 
  Target, 
  Calendar
} from 'lucide-react';
import { AlgorithmAdvice } from '../types';

interface AlgorithmScorecardProps {
  algorithmAdvice?: AlgorithmAdvice;
  domainName: string;
}

export const AlgorithmScorecard: React.FC<AlgorithmScorecardProps> = ({
  algorithmAdvice,
  domainName,
}) => {
  if (!algorithmAdvice) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-[#057642] bg-[#E6F4EA] border-[#CEEAD6]';
    if (score >= 7.0) return 'text-[#0A66C2] bg-[#EBF4FD] border-[#D0E5FA]';
    return 'text-[#B45309] bg-[#FEF7E0] border-[#FEEFC3]';
  };

  return (
    <div className="bg-white border border-[#EBEBEB] rounded-lg shadow-2xs overflow-hidden p-3.5 space-y-3.5">
      <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-[#EDF3F8] text-[#0077B5] rounded">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#191919]">
              Algorithm & Virality Scorecard
            </h3>
            <p className="text-[10px] text-[#666666]">
              Real-time evaluation against 2026 distribution criteria
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
          <Zap className="w-3 h-3" /> High Reach
        </span>
      </div>

      {/* 3 Core Metric Badges */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 bg-[#FAF9F7] rounded border border-[#EBEBEB] text-center">
          <p className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider">Hook Score</p>
          <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
            <span className="text-lg font-bold text-[#0077B5]">{algorithmAdvice.hookScore}</span>
            <span className="text-[10px] text-[#666666]">/10</span>
          </div>
          <p className="text-[9px] text-[#666666]">2-Line Retention</p>
        </div>

        <div className="p-2.5 bg-[#FAF9F7] rounded border border-[#EBEBEB] text-center">
          <p className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider">Readability</p>
          <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
            <span className="text-lg font-bold text-[#057642]">{algorithmAdvice.readabilityScore}</span>
            <span className="text-[10px] text-[#666666]">/10</span>
          </div>
          <p className="text-[9px] text-[#666666]">Whitespace Index</p>
        </div>

        <div className="p-2.5 bg-[#FAF9F7] rounded border border-[#EBEBEB] text-center">
          <p className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider">Virality</p>
          <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
            <span className="text-lg font-bold text-[#D9381E]">{algorithmAdvice.overallViralityIndex}</span>
            <span className="text-[10px] text-[#666666]">/10</span>
          </div>
          <p className="text-[9px] text-[#666666]">Shareability</p>
        </div>
      </div>

      {/* Best Posting Time & Optimal Days */}
      <div className="bg-[#FAF9F7] border border-[#EBEBEB] rounded p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#0077B5] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Optimal Posting Window for {domainName}
          </span>
          <span className="text-[10px] text-[#666666]">Audience Peak</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white px-2.5 py-1 rounded border border-[#EBEBEB] text-xs font-bold text-[#191919]">
            ⏰ {algorithmAdvice.bestTimeToPost}
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-[#666666]">Best Days:</span>
            {algorithmAdvice.bestDays.map((day, idx) => (
              <span key={idx} className="bg-white px-1.5 py-0.5 rounded text-[11px] font-bold text-[#0077B5] border border-[#EBEBEB]">
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dwell Time Strategy & Viral Multiplier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="p-2.5 bg-[#FAF9F7] rounded border border-[#EBEBEB] space-y-1">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#191919]">
            <Eye className="w-3.5 h-3.5 text-[#057642]" />
            <span>Dwell Time Strategy</span>
          </div>
          <p className="text-[11px] text-[#555555] leading-relaxed">
            {algorithmAdvice.dwellTimeStrategy}
          </p>
        </div>

        <div className="p-2.5 bg-[#FAF9F7] rounded border border-[#EBEBEB] space-y-1">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#191919]">
            <Flame className="w-3.5 h-3.5 text-[#D9381E]" />
            <span>Viral Multiplier Action</span>
          </div>
          <p className="text-[11px] text-[#555555] leading-relaxed">
            {algorithmAdvice.viralMultiplierAction}
          </p>
        </div>
      </div>

      {/* Golden First 60 Minutes Checklist */}
      <div className="space-y-1.5 pt-1 border-t border-[#EBEBEB]">
        <h4 className="text-[11px] font-bold text-[#191919] uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#057642]" />
          <span>The Golden 60-Minute Checklist:</span>
        </h4>
        <div className="space-y-1">
          {algorithmAdvice.goldenFirstHourTips.map((tip, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-[11px] text-[#333333] bg-[#FAF9F7] p-1.5 rounded border border-[#EBEBEB]">
              <span className="w-3.5 h-3.5 rounded-full bg-[#057642] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-snug">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
