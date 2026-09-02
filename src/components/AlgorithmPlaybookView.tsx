import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Eye, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  MessageSquare,
  Share2,
  Lightbulb
} from 'lucide-react';
import { LINKEDIN_ALGORITHM_PLAYBOOK } from '../data/domains';

export const AlgorithmPlaybookView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E0DFDC] rounded-lg p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#EBF4FD] text-[#0A66C2] rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#191919]">
              The LinkedIn 2026 Algorithm & Viral Playbook
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Deconstructed mechanics on how LinkedIn rewards domain authority, dwell time, and comment depth.
            </p>
          </div>
        </div>
      </div>

      {/* Best Posting Time Matrix */}
      <div className="bg-white border border-[#E0DFDC] rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-[#E0DFDC] pb-3">
          <Clock className="w-4 h-4 text-[#0A66C2]" />
          <h3 className="text-sm font-bold text-[#191919] uppercase tracking-wider">
            Optimal Posting Windows by Domain & Professional Audience
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LINKEDIN_ALGORITHM_PLAYBOOK.postingTimeMatrix.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[#F8F9FA] border border-[#E0DFDC] rounded-lg space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-[#0A66C2] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#E0DFDC]">
                  {item.domain}
                </span>
                <div className="mt-2 text-xs font-bold text-[#191919]">
                  ⏰ {item.bestTime}
                </div>
              </div>
              <p className="text-[11px] text-[#666666] leading-relaxed pt-2 border-t border-[#EAEAEA]">
                {item.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Core Dwell Time & Distribution Factors */}
      <div className="bg-white border border-[#E0DFDC] rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-[#E0DFDC] pb-3">
          <Eye className="w-4 h-4 text-[#057642]" />
          <h3 className="text-sm font-bold text-[#191919] uppercase tracking-wider">
            The 6 Golden Algorithm Levers (How to Maximize Organic Reach)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LINKEDIN_ALGORITHM_PLAYBOOK.dwellTimeFactors.map((factor, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border border-[#E0DFDC] rounded-lg space-y-2 shadow-2xs hover:border-[#0A66C2] transition"
            >
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                <h4 className="text-xs font-bold text-[#191919]">{factor.title}</h4>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed pl-7">
                {factor.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* The 4-Step Viral Post Anatomy Framework */}
      <div className="bg-[#F8F9FA] border border-[#E0DFDC] rounded-lg p-5 space-y-4">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-[#D9381E]" />
          <h3 className="text-sm font-bold text-[#191919] uppercase tracking-wider">
            The 4-Part Thought Leadership Post Anatomy
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-lg border border-[#E0DFDC] space-y-1.5 shadow-2xs">
            <span className="text-[10px] font-bold text-[#D9381E] uppercase tracking-wider">Part 1 (Lines 1-2)</span>
            <h5 className="text-xs font-bold text-[#191919]">The Tension Hook</h5>
            <p className="text-xs text-[#666666] leading-relaxed">
              Creates curiosity or challenges common consensus before the mobile "…see more" truncation.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-[#E0DFDC] space-y-1.5 shadow-2xs">
            <span className="text-[10px] font-bold text-[#0A66C2] uppercase tracking-wider">Part 2 (Lines 3-6)</span>
            <h5 className="text-xs font-bold text-[#191919]">The Reframe / Context</h5>
            <p className="text-xs text-[#666666] leading-relaxed">
              Explains why conventional wisdom is flawed using hard domain realities and unseen facts.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-[#E0DFDC] space-y-1.5 shadow-2xs">
            <span className="text-[10px] font-bold text-[#057642] uppercase tracking-wider">Part 3 (Lines 7-15)</span>
            <h5 className="text-xs font-bold text-[#191919]">The Actionable Blueprint</h5>
            <p className="text-xs text-[#666666] leading-relaxed">
              Numbered steps or bullet points that the reader can screenshot, save, or test tomorrow at work.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-[#E0DFDC] space-y-1.5 shadow-2xs">
            <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider">Part 4 (Ending)</span>
            <h5 className="text-xs font-bold text-[#191919]">The Comment Igniter</h5>
            <p className="text-xs text-[#666666] leading-relaxed">
              Specific, non-generic question that invites peers and cohort operators to share their perspective.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
