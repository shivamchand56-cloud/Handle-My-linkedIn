import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  Filter, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Sliders, 
  FileSpreadsheet, 
  FileText,
  Share2,
  Edit3,
  Mic,
  TrendingUp,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampaignCalendar, CampaignDayPlan, CampaignDuration, DomainType, ExperienceLevel, GeneratedPost } from '../types';
import { DOMAINS_DATA } from '../data/domains';
import { VoiceInputButton } from './VoiceInputButton';
import { fetchJsonSafely, synthesizeFallbackCampaign } from '../utils/apiClient';

interface CampaignPlannerProps {
  selectedDomain: DomainType;
  customDomainName: string;
  selectedLevel: ExperienceLevel;
  authorName: string;
  authorHeadline: string;
  onOpenInFeedPreview: (post: GeneratedPost) => void;
}

export const CampaignPlanner: React.FC<CampaignPlannerProps> = ({
  selectedDomain,
  customDomainName,
  selectedLevel,
  authorName,
  authorHeadline,
  onOpenInFeedPreview,
}) => {
  const [duration, setDuration] = useState<CampaignDuration>(30);
  const [postsPerWeek, setPostsPerWeek] = useState(5);
  const [targetOutcome, setTargetOutcome] = useState('Position as a top-tier domain authority, attract high-value inbound opportunities and cohort followers');
  const [personalStory, setPersonalStory] = useState('');
  const [keywordFocus, setKeywordFocus] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [campaign, setCampaign] = useState<CampaignCalendar | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters & State
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedDayIdx, setCopiedDayIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const currentDomainMeta = DOMAINS_DATA.find((d) => d.id === selectedDomain);
  const domainDisplayName = selectedDomain === 'custom' && customDomainName ? customDomainName : currentDomainMeta?.name || 'Your Domain';

  const handleGenerateCampaign = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const fallbackCampaign = synthesizeFallbackCampaign({
      domain: selectedDomain,
      customDomainName,
      durationDays: duration,
      postsPerWeek,
      experienceLevel: selectedLevel,
      targetOutcome,
      personalStoryOrBlueprint: personalStory,
      keywordFocus,
    });

    try {
      const data = await fetchJsonSafely<{ success: boolean; data: CampaignCalendar }>(
        '/api/generate-campaign',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain: selectedDomain,
            customDomainName,
            durationDays: duration,
            postsPerWeek,
            experienceLevel: selectedLevel,
            targetOutcome,
            personalStoryOrBlueprint: personalStory,
            keywordFocus,
            authorName,
            authorHeadline,
          }),
        },
        { success: true, data: fallbackCampaign }
      );

      const campaignData = data.data || fallbackCampaign;
      setCampaign(campaignData);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#0A66C2', '#057642', '#378FE9'],
      });
    } catch (err: any) {
      console.warn('Recovered with fallback campaign:', err);
      setCampaign(fallbackCampaign);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyDayPost = (day: CampaignDayPlan, idx: number) => {
    const fullText = `${day.fullPost}\n\n${day.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedDayIdx(idx);
    setTimeout(() => setCopiedDayIdx(null), 2000);
  };

  const handleExportCSV = () => {
    if (!campaign) return;
    const headers = ['Day', 'Week', 'Date', 'Pillar', 'Title', 'Hook', 'Full Post', 'Hashtags', 'CTA', 'Visual Recommendation', 'Algorithm Tip', 'Best Time', 'Status'];
    const rows = campaign.days.map((d) => [
      d.day,
      d.week,
      d.dateStr || '',
      `"${d.pillar.replace(/"/g, '""')}"`,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.hook.replace(/"/g, '""')}"`,
      `"${d.fullPost.replace(/"/g, '""')}"`,
      `"${d.hashtags.join(' ')}"`,
      `"${d.callToAction.replace(/"/g, '""')}"`,
      `"${d.visualRecommendation.replace(/"/g, '""')}"`,
      `"${d.algorithmTip.replace(/"/g, '""')}"`,
      `"${d.bestTime}"`,
      d.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${campaign.domain}_${campaign.durationDays}day_linkedin_campaign.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportMarkdown = () => {
    if (!campaign) return;
    let md = `# ${campaign.title}\n\n`;
    md += `**Domain:** ${campaign.domainName} | **Duration:** ${campaign.durationDays} Days | **Level:** ${campaign.experienceLevel}\n\n`;
    md += `**Target Outcome:** ${campaign.targetOutcome}\n\n---\n\n`;

    md += `## Weekly Themes\n`;
    campaign.weeklyThemes.forEach((w) => {
      md += `### Week ${w.week}: ${w.theme}\n*Objective:* ${w.objective}\n\n`;
    });

    md += `---\n\n## Content Calendar & Posts\n\n`;
    campaign.days.forEach((d) => {
      md += `### Day ${d.day} (Week ${d.week}) - ${d.title}\n`;
      md += `**Pillar:** ${d.pillar} | **Best Time:** ${d.bestTime}\n\n`;
      md += `**Hook:**\n> ${d.hook}\n\n`;
      md += `**Post Body:**\n\n${d.fullPost}\n\n`;
      md += `**Hashtags:** ${d.hashtags.join(' ')}\n\n`;
      md += `**Visual Asset:** ${d.visualRecommendation}\n\n`;
      md += `**Algorithm Strategy:** ${d.algorithmTip}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${campaign.domain}_${campaign.durationDays}day_linkedin_plan.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenDayInFeed = (day: CampaignDayPlan) => {
    const post: GeneratedPost = {
      id: `camp_post_${day.day}`,
      domain: selectedDomain,
      domainName: domainDisplayName,
      experienceLevel: selectedLevel,
      formatType: day.formatType,
      tone: 'sharp_analytical',
      topic: day.title,
      hook: day.hook,
      content: day.fullPost,
      hashtags: day.hashtags,
      callToAction: day.callToAction,
      visualSuggestion: {
        type: day.formatType === 'carousel_slide_deck' ? 'carousel' : 'infographic',
        title: day.title,
        description: day.visualRecommendation,
        aiImagePrompt: `Clean, modern LinkedIn graphic about ${day.title} for ${domainDisplayName}`,
        recommendedAspectRatio: '4:5',
      },
      algorithmAdvice: {
        bestTimeToPost: day.bestTime,
        bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
        dwellTimeStrategy: 'Slide-through hooks and high-contrast spacing.',
        goldenFirstHourTips: [
          'Reply to initial 5 comments with substantive questions',
          'Share link in 1st comment or profile bio',
        ],
        viralMultiplierAction: 'Encourage bookmarking or cohort reshares.',
        hookScore: 9.2,
        readabilityScore: 9.0,
        overallViralityIndex: 8.8,
        reasons: ['Structured line breaks', 'High authority domain depth', 'Clear engagement CTA'],
      },
      alternativeHooks: [day.hook],
      createdAt: new Date().toISOString(),
      authorProfile: {
        name: authorName,
        headline: authorHeadline,
      },
    };

    onOpenInFeedPreview(post);
  };

  // Filtered days
  const filteredDays = campaign?.days.filter((d) => {
    const matchesWeek = selectedWeekFilter === 'all' || d.week === selectedWeekFilter;
    const matchesSearch = searchQuery === '' ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.pillar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hook.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWeek && matchesSearch;
  }) || [];

  return (
    <div className="space-y-5">
      {/* COHORT CADENCE & CAMPAIGN TOUCHPOINT TRACKER */}
      <div className="bg-white border border-[#D0DFEB] rounded-xl p-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#0077B5] text-white rounded-md">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-[#191919] uppercase tracking-wider">
                Cohort Cadence & Publishing Activity Matrix
              </h3>
              <p className="text-[11px] text-[#666666]">
                30 / 60 / 90-Day touchpoints mapped for {domainDisplayName}
              </p>
            </div>
          </div>
          <span className="text-[11px] bg-[#EBF4FD] text-[#0077B5] font-bold px-2 py-0.5 rounded-full border border-[#D0E5FA]">
            Active Sprint: {postsPerWeek} posts / week
          </span>
        </div>

        {/* 28-day visual matrix */}
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1 text-center mb-2">
          {Array.from({ length: 28 }).map((_, i) => {
            const isDone = [0, 2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25].includes(i);
            const isToday = i === 19;
            return (
              <div
                key={i}
                className={`h-6 rounded flex items-center justify-center text-[10px] font-bold transition ${
                  isDone 
                    ? 'bg-[#0077B5] text-white' 
                    : isToday 
                    ? 'bg-[#78C5E7] text-white ring-2 ring-[#0077B5]' 
                    : 'bg-[#F3F2EF] text-[#888888]'
                }`}
                title={`Day ${i + 1}`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center text-[11px] text-[#666666] pt-2 border-t border-[#EBEBEB]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0077B5]" /> Target Pace: <strong>{postsPerWeek} posts / wk</strong>
          </span>
          <span className="text-[#057642] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> High Algorithm Momentum
          </span>
        </div>
      </div>

      {/* 1. CAMPAIGN SETUP CARD */}
      <div className="bg-white border border-[#D0DFEB] rounded-xl shadow-2xs p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBEBEB] pb-3">
          <div>
            <h2 className="text-sm font-black text-[#191919] flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#0077B5]" />
              <span>30 / 60 / 90-Day LinkedIn Authority Sprint Builder</span>
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Domain: <strong className="text-[#0077B5]">{domainDisplayName}</strong> • Experience Level: <strong className="capitalize">{selectedLevel}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateCampaign}
            disabled={isLoading}
            className="px-4 py-2 bg-[#0077B5] hover:bg-[#004182] disabled:opacity-50 text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Architecting Sprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ 1-Click Fast {duration}-Day Sprint</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Duration Selector */}
          <div>
            <label className="block text-[10px] font-bold text-[#666666] mb-1 uppercase tracking-wider">
              1. Campaign Duration
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[30, 60, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d as CampaignDuration)}
                  className={`py-1.5 rounded font-bold text-xs border transition ${
                    duration === d
                      ? 'bg-[#0077B5] text-white border-[#0077B5] shadow-2xs'
                      : 'bg-[#F8F9FA] text-[#333333] border-[#E0DFDC] hover:bg-white'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          {/* Posting Cadence */}
          <div>
            <label className="block text-[10px] font-bold text-[#666666] mb-1 uppercase tracking-wider">
              2. Weekly Frequency
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { count: 3, label: '3x/wk' },
                { count: 5, label: '5x/wk' },
                { count: 7, label: '7x/wk' },
              ].map((f) => (
                <button
                  key={f.count}
                  type="button"
                  onClick={() => setPostsPerWeek(f.count)}
                  className={`py-1.5 rounded font-bold text-xs border transition text-center ${
                    postsPerWeek === f.count
                      ? 'bg-[#0077B5] text-white border-[#0077B5] shadow-2xs'
                      : 'bg-[#F8F9FA] text-[#333333] border-[#E0DFDC] hover:bg-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Authority Outcome */}
          <div>
            <label className="block text-[10px] font-bold text-[#666666] mb-1 uppercase tracking-wider">
              3. Target Authority Outcome
            </label>
            <select
              value={targetOutcome}
              onChange={(e) => setTargetOutcome(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#F8F9FA] border border-[#E0DFDC] rounded focus:outline-none focus:border-[#0077B5] text-[#191919]"
            >
              <option value="Position as top domain authority and get inbound consulting / speaking requests">
                Inbound Consulting & Client Inquiries
              </option>
              <option value="Get recruited by tier-1 VCs / executive search firms / top startups">
                Career Transition & Executive Recruiter Attraction
              </option>
              <option value="Build a loyal cohort following of 10,000+ industry practitioners">
                Cohort Community Building & Newsletter Growth
              </option>
              <option value="Launch a new product / cohort course / advisory service">
                Launch & Monetization Pre-Heating
              </option>
            </select>
          </div>
        </div>

        {/* User Story / Personal War Stories Input with Voice Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider">
                Career War Stories or Frameworks (Optional):
              </label>
              <VoiceInputButton
                onTranscript={(text) => {
                  setPersonalStory(prev => prev ? `${prev} ${text}` : text);
                }}
                size="sm"
                title="Dictate stories or experience"
              />
            </div>
            <textarea
              rows={2}
              value={personalStory}
              onChange={(e) => setPersonalStory(e.target.value)}
              placeholder="e.g. 'I managed a $50M supply chain transition, audited 30 VC term sheets, built an async operating memo for 200 engineers...'"
              className="w-full p-2 text-xs bg-white border border-[#E0DFDC] rounded-lg focus:border-[#0077B5] focus:outline-none text-[#191919]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider">
                Specific Keywords or Strategic Themes:
              </label>
              <VoiceInputButton
                onTranscript={(text) => {
                  setKeywordFocus(prev => prev ? `${prev} ${text}` : text);
                }}
                size="sm"
                title="Dictate focus keywords"
              />
            </div>
            <textarea
              rows={2}
              value={keywordFocus}
              onChange={(e) => setKeywordFocus(e.target.value)}
              placeholder="e.g. Dark social attribution, Span of control, Liquidation preferences, 3PL hidden fees, NIL sports IP..."
              className="w-full p-2 text-xs bg-white border border-[#E0DFDC] rounded-lg focus:border-[#0077B5] focus:outline-none text-[#191919]"
            />
          </div>
        </div>

        {/* Generate Campaign Button */}
        <div className="pt-2">
          <button
            id="generate-campaign-btn"
            type="button"
            disabled={isLoading}
            onClick={handleGenerateCampaign}
            className="w-full py-3 bg-[#0077B5] hover:bg-[#004182] disabled:opacity-50 text-white rounded-lg font-bold text-xs tracking-wide transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Architecting {duration}-Day LinkedIn Sprint Calendar...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Build Complete {duration}-Day Thought Leadership Calendar</span>
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-[#FCE8E6] text-[#C5221F] text-xs rounded border border-[#FAD2CF]">
            {errorMessage}
          </div>
        )}
      </div>

      {/* 2. GENERATED CAMPAIGN DASHBOARD */}
      {campaign && (
        <div className="space-y-4">
          {/* Top Bar: Campaign Header & Exports */}
          <div className="bg-white border border-[#D0DFEB] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0077B5] text-white px-2 py-0.5 rounded">
                Active Campaign Plan
              </span>
              <h3 className="text-sm font-bold text-[#191919] mt-1">{campaign.title}</h3>
              <p className="text-xs text-[#666666]">
                {campaign.durationDays} Days • {campaign.days.length} Post Blueprints • {campaign.weeklyThemes.length} Thematic Phases
              </p>
            </div>

            {/* Export Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-[#F3F2EF] hover:bg-[#E8E7E3] text-[#191919] rounded-md text-xs font-semibold border border-[#E0DFDC] flex items-center gap-1.5 transition cursor-pointer"
                title="Export as CSV for Google Sheets / Notion"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#057642]" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleExportMarkdown}
                className="px-3 py-1.5 bg-[#F3F2EF] hover:bg-[#E8E7E3] text-[#191919] rounded-md text-xs font-semibold border border-[#E0DFDC] flex items-center gap-1.5 transition cursor-pointer"
                title="Export as Markdown"
              >
                <FileText className="w-3.5 h-3.5 text-[#0077B5]" />
                <span>Export Markdown</span>
              </button>
            </div>
          </div>

          {/* Weekly Thematic Progression Matrix */}
          <div className="bg-white border border-[#D0DFEB] rounded-xl p-4 space-y-3 shadow-2xs">
            <h4 className="text-xs font-bold text-[#191919] uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#D9381E]" />
              <span>Weekly Thematic Progression Architecture</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {campaign.weeklyThemes.map((w) => (
                <div
                  key={w.week}
                  onClick={() => setSelectedWeekFilter(selectedWeekFilter === w.week ? 'all' : w.week)}
                  className={`p-3 rounded-lg border transition cursor-pointer ${
                    selectedWeekFilter === w.week
                      ? 'bg-[#EBF4FD] border-[#0077B5] ring-1 ring-[#0077B5]'
                      : 'bg-[#F9F9F8] border-[#E0DFDC] hover:border-[#0077B5]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#0077B5] uppercase">
                      Week {w.week}
                    </span>
                    {selectedWeekFilter === w.week && (
                      <span className="text-[9px] bg-[#0077B5] text-white px-1.5 py-0.2 rounded font-bold">
                        Filtered
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#191919] leading-tight mb-1">{w.theme}</p>
                  <p className="text-[11px] text-[#666666] leading-snug">{w.objective}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Week Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#666666]">Filter Week:</span>
              <button
                onClick={() => setSelectedWeekFilter('all')}
                className={`px-2.5 py-1 text-xs rounded font-medium border transition ${
                  selectedWeekFilter === 'all'
                    ? 'bg-[#0077B5] text-white border-[#0077B5]'
                    : 'bg-white text-[#555555] border-[#E0DFDC]'
                }`}
              >
                All Days ({campaign.days.length})
              </button>
              {campaign.weeklyThemes.map((w) => (
                <button
                  key={w.week}
                  onClick={() => setSelectedWeekFilter(w.week)}
                  className={`px-2 py-1 text-xs rounded font-medium border transition ${
                    selectedWeekFilter === w.week
                      ? 'bg-[#0077B5] text-white border-[#0077B5]'
                      : 'bg-white text-[#555555] border-[#E0DFDC]'
                  }`}
                >
                  W{w.week}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#666666]">
              Showing <strong>{filteredDays.length}</strong> of {campaign.days.length} days
            </div>
          </div>

          {/* Day Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredDays.map((day, idx) => (
              <div
                key={day.day}
                className="bg-white border border-[#D0DFEB] rounded-xl p-4 shadow-2xs space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0077B5] text-white text-xs font-bold flex items-center justify-center">
                        {day.day}
                      </span>
                      <span className="text-xs font-bold text-[#191919]">{day.dateStr}</span>
                    </div>
                    <span className="text-[10px] bg-[#EBF4FD] text-[#0077B5] px-2 py-0.5 rounded font-bold">
                      {day.pillar}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-[#191919] line-clamp-1">{day.title}</h5>
                    <p className="text-[11px] text-[#555555] italic line-clamp-2 mt-0.5">
                      "{day.hook}"
                    </p>
                  </div>

                  <div className="bg-[#F8F9FA] p-2 rounded text-[11px] text-[#444444] line-clamp-3 leading-snug border border-[#EBEBEB]">
                    {day.fullPost}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EBEBEB] flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#666666] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#0077B5]" /> {day.bestTime}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyDayPost(day, idx)}
                      className="px-2.5 py-1 bg-[#F3F2EF] hover:bg-[#EBEBEB] text-[#191919] text-[11px] font-bold rounded border border-[#E0DFDC] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedDayIdx === idx ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedDayIdx === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => handleOpenDayInFeed(day)}
                      className="px-2.5 py-1 bg-[#0077B5] hover:bg-[#004182] text-white text-[11px] font-bold rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
