import React, { useState } from 'react';
import { 
  Sliders, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Palette, 
  Image as ImageIcon,
  Share2,
  FileText
} from 'lucide-react';
import { CarouselSlide, VisualSuggestion } from '../types';

interface VisualCarouselGeneratorProps {
  visualSuggestion?: VisualSuggestion;
  domainName?: string;
  authorName?: string;
  authorHeadline?: string;
  topic?: string;
}

type CarouselTheme = 'linkedin_blue' | 'slate_dark' | 'charcoal_minimal' | 'emerald_pro' | 'clean_white';

export const VisualCarouselGenerator: React.FC<VisualCarouselGeneratorProps> = ({
  visualSuggestion,
  domainName = 'Industry Track',
  authorName = 'Jordan Smith',
  authorHeadline = 'Cohort Thought Leader',
  topic,
}) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [theme, setTheme] = useState<CarouselTheme>('linkedin_blue');
  const [copiedSlides, setCopiedSlides] = useState(false);

  if (!visualSuggestion) {
    return (
      <div className="p-8 text-center bg-white border border-[#E0DFDC] rounded-lg">
        <Sliders className="w-8 h-8 text-[#666666] mx-auto mb-2 opacity-50" />
        <p className="text-sm font-semibold text-[#191919]">No visual assets generated yet.</p>
        <p className="text-xs text-[#666666] mt-1">Generate a post to view carousel slides and visual prompts.</p>
      </div>
    );
  }

  // Fallback slides if none provided
  const slides: CarouselSlide[] = visualSuggestion.carouselSlides && visualSuggestion.carouselSlides.length > 0
    ? visualSuggestion.carouselSlides
    : [
        {
          slideNumber: 1,
          headline: visualSuggestion.title || `${domainName} Master Framework`,
          body: visualSuggestion.description,
          takeaway: 'Swipe to see the full tactical breakdown ➔'
        },
        {
          slideNumber: 2,
          headline: '1. The Core Misconception',
          body: 'Most operators focus on symptoms rather than the root operational constraint. Here is the true dynamic.',
          takeaway: 'Key insight: Solve the bottleneck first.'
        },
        {
          slideNumber: 3,
          headline: '2. The Actionable Blueprint',
          body: 'Step 1: Audit current throughput.\nStep 2: Remove redundant approval gates.\nStep 3: Establish clear feedback loops.',
          takeaway: 'Execution velocity determines outcomes.'
        },
        {
          slideNumber: 4,
          headline: 'Summary & Next Steps',
          body: 'Bookmark this post and install this system with your team this week.',
          takeaway: 'Follow for weekly deep-dives.'
        }
      ];

  const currentSlide = slides[currentSlideIdx] || slides[0];

  const getThemeClasses = (t: CarouselTheme) => {
    switch (t) {
      case 'linkedin_blue':
        return {
          bg: 'bg-gradient-to-br from-[#0A66C2] to-[#004182]',
          text: 'text-white',
          subtitle: 'text-blue-100',
          accentBadge: 'bg-white/20 text-white border border-white/30',
          takeawayBg: 'bg-white/10 text-white border-t border-white/20',
          headerBorder: 'border-white/20',
        };
      case 'slate_dark':
        return {
          bg: 'bg-gradient-to-br from-[#1E293B] to-[#0F172A]',
          text: 'text-white',
          subtitle: 'text-slate-300',
          accentBadge: 'bg-slate-700/60 text-slate-200 border border-slate-600',
          takeawayBg: 'bg-slate-800/80 text-slate-200 border-t border-slate-700',
          headerBorder: 'border-slate-700',
        };
      case 'emerald_pro':
        return {
          bg: 'bg-gradient-to-br from-[#064E3B] to-[#022C22]',
          text: 'text-white',
          subtitle: 'text-emerald-100',
          accentBadge: 'bg-emerald-800/60 text-emerald-200 border border-emerald-600',
          takeawayBg: 'bg-emerald-950/60 text-emerald-100 border-t border-emerald-800',
          headerBorder: 'border-emerald-800',
        };
      case 'charcoal_minimal':
        return {
          bg: 'bg-gradient-to-br from-[#18181B] to-[#09090B]',
          text: 'text-white',
          subtitle: 'text-zinc-400',
          accentBadge: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
          takeawayBg: 'bg-zinc-900 text-zinc-300 border-t border-zinc-800',
          headerBorder: 'border-zinc-800',
        };
      case 'clean_white':
      default:
        return {
          bg: 'bg-white',
          text: 'text-[#191919]',
          subtitle: 'text-[#666666]',
          accentBadge: 'bg-[#EBF4FD] text-[#0A66C2] border border-[#D0E5FA]',
          takeawayBg: 'bg-[#F8F9FA] text-[#191919] border-t border-[#E0DFDC]',
          headerBorder: 'border-[#E0DFDC]',
        };
    }
  };

  const themeStyle = getThemeClasses(theme);

  const handleCopySlideContent = () => {
    const formatted = slides.map((s) => `[SLIDE ${s.slideNumber}]\n${s.headline}\n\n${s.body}\n\nTakeaway: ${s.takeaway || ''}\n---`).join('\n\n');
    navigator.clipboard.writeText(formatted);
    setCopiedSlides(true);
    setTimeout(() => setCopiedSlides(false), 2000);
  };

  return (
    <div className="bg-white border border-[#E0DFDC] rounded-lg shadow-sm overflow-hidden space-y-4 p-4">
      {/* Header & Theme Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E0DFDC] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#0A66C2] text-white px-2 py-0.5 rounded">
              {visualSuggestion.type.toUpperCase()}
            </span>
            <h3 className="text-sm font-bold text-[#191919]">{visualSuggestion.title}</h3>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Aspect Ratio: <strong className="text-[#191919]">{visualSuggestion.recommendedAspectRatio}</strong> (Ideal for LinkedIn Document swipe retention)
          </p>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#666666] flex items-center gap-1">
            <Palette className="w-3.5 h-3.5" /> Theme:
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setTheme('linkedin_blue')}
              className={`w-6 h-6 rounded-full bg-[#0A66C2] border-2 transition ${theme === 'linkedin_blue' ? 'border-black ring-2 ring-[#0A66C2]' : 'border-white'}`}
              title="LinkedIn Blue"
            />
            <button
              onClick={() => setTheme('slate_dark')}
              className={`w-6 h-6 rounded-full bg-[#1E293B] border-2 transition ${theme === 'slate_dark' ? 'border-black ring-2 ring-slate-700]' : 'border-white'}`}
              title="Slate Dark"
            />
            <button
              onClick={() => setTheme('emerald_pro')}
              className={`w-6 h-6 rounded-full bg-[#064E3B] border-2 transition ${theme === 'emerald_pro' ? 'border-black ring-2 ring-emerald-700' : 'border-white'}`}
              title="Emerald Pro"
            />
            <button
              onClick={() => setTheme('charcoal_minimal')}
              className={`w-6 h-6 rounded-full bg-[#18181B] border-2 transition ${theme === 'charcoal_minimal' ? 'border-black ring-2 ring-zinc-700' : 'border-white'}`}
              title="Charcoal Minimal"
            />
            <button
              onClick={() => setTheme('clean_white')}
              className={`w-6 h-6 rounded-full bg-[#FFFFFF] border-2 border-[#CCCCCC] transition ${theme === 'clean_white' ? 'border-black ring-2 ring-blue-400' : ''}`}
              title="Clean White"
            />
          </div>
        </div>
      </div>

      {/* Interactive Live Slide Card Container */}
      <div className="relative max-w-md mx-auto aspect-[4/5] sm:aspect-[1/1] rounded-xl shadow-md overflow-hidden flex flex-col justify-between transition-all duration-300 border border-[#E0DFDC]">
        <div className={`w-full h-full p-6 flex flex-col justify-between ${themeStyle.bg} ${themeStyle.text}`}>
          {/* Slide Top Metadata */}
          <div className={`flex items-center justify-between border-b ${themeStyle.headerBorder} pb-3`}>
            <div className="flex items-center space-x-2">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${themeStyle.accentBadge}`}>
                {domainName}
              </span>
            </div>
            <span className="text-xs font-mono font-bold opacity-80">
              {currentSlide.slideNumber} / {slides.length}
            </span>
          </div>

          {/* Slide Main Content */}
          <div className="my-auto space-y-3 py-4">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight">
              {currentSlide.headline}
            </h2>
            <div className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${themeStyle.subtitle}`}>
              {currentSlide.body}
            </div>
          </div>

          {/* Slide Footer / Takeaway & Author Tag */}
          <div className="space-y-3 pt-2">
            {currentSlide.takeaway && (
              <div className={`p-2.5 rounded-md text-xs font-semibold ${themeStyle.takeawayBg}`}>
                💡 {currentSlide.takeaway}
              </div>
            )}
            <div className="flex items-center justify-between text-[11px] opacity-75">
              <span className="font-semibold">{authorName}</span>
              <span>Swipe ➔</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation & Export Bar */}
      <div className="flex items-center justify-between max-w-md mx-auto pt-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentSlideIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIdx === 0}
            className="p-2 rounded-full border border-[#E0DFDC] bg-white hover:bg-[#F3F2EF] disabled:opacity-40 transition"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 text-[#191919]" />
          </button>
          <span className="text-xs font-semibold text-[#666666]">
            Slide {currentSlideIdx + 1} of {slides.length}
          </span>
          <button
            onClick={() => setCurrentSlideIdx((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlideIdx === slides.length - 1}
            className="p-2 rounded-full border border-[#E0DFDC] bg-white hover:bg-[#F3F2EF] disabled:opacity-40 transition"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4 text-[#191919]" />
          </button>
        </div>

        <button
          onClick={handleCopySlideContent}
          className="px-3 py-1.5 bg-[#F3F2EF] hover:bg-[#E8E7E3] text-[#191919] border border-[#E0DFDC] rounded-full text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
        >
          {copiedSlides ? <Check className="w-3.5 h-3.5 text-[#057642]" /> : <Copy className="w-3.5 h-3.5 text-[#666666]" />}
          <span>{copiedSlides ? 'All Slides Copied!' : 'Copy Slide Text (Canva/PPT)'}</span>
        </button>
      </div>
    </div>
  );
};
