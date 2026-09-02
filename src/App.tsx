/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ImmediatePostBuilder } from './components/ImmediatePostBuilder';
import { CampaignPlanner } from './components/CampaignPlanner';
import { DomainIntelligenceView } from './components/DomainIntelligenceView';
import { AlgorithmPlaybookView } from './components/AlgorithmPlaybookView';
import { AuthorProfileModal } from './components/AuthorProfileModal';
import { DomainType, ExperienceLevel, GeneratedPost } from './types';
import { DOMAINS_DATA } from './data/domains';
import { 
  Zap, 
  Clock, 
  TrendingUp, 
  Flame, 
  Users, 
  Award,
  ChevronRight,
  ExternalLink,
  Sliders,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Search,
  BookOpen,
  Calendar
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'immediate' | 'campaign' | 'algorithm' | 'domains'>('immediate');
  const [selectedDomain, setSelectedDomain] = useState<DomainType>('product');
  const [customDomainName, setCustomDomainName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>('expert');
  const [searchQuery, setSearchQuery] = useState('');

  // Author Profile Details
  const [authorName, setAuthorName] = useState('Jordan Smith');
  const [authorHeadline, setAuthorHeadline] = useState('Cohort #12 • Emerging VC & Tech Operator');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Cross-tab interaction
  const [injectedTopic, setInjectedTopic] = useState<string | null>(null);
  const [injectedStory, setInjectedStory] = useState<string | null>(null);

  const currentDomainMeta = DOMAINS_DATA.find((d) => d.id === selectedDomain);
  const domainDisplayName = selectedDomain === 'custom' && customDomainName ? customDomainName : currentDomainMeta?.name || 'Domain';

  // Search Results filtering
  const matchingDomains = useMemo(() => {
    if (!searchQuery.trim()) return DOMAINS_DATA;
    const q = searchQuery.toLowerCase();
    return DOMAINS_DATA.filter((d) =>
      d.name.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q) ||
      d.corePillars.some(p => p.toLowerCase().includes(q)) ||
      d.unseenFacts.some(f => f.toLowerCase().includes(q)) ||
      d.trendingHooks.some(h => h.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleSelectDomainForPost = (domain: DomainType, topicTitle?: string, promptSnippet?: string) => {
    setSelectedDomain(domain);
    if (topicTitle) setInjectedTopic(topicTitle);
    if (promptSnippet) setInjectedStory(promptSnippet);
    setActiveTab('immediate');
  };

  const handleOpenInFeedPreview = (post: GeneratedPost) => {
    setSelectedDomain(post.domain);
    setInjectedTopic(post.topic);
    setInjectedStory(post.content);
    setActiveTab('immediate');
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] font-sans text-[#191919] flex flex-col antialiased">
      {/* 1. Sleek Modern Header with Segmented Touchpoints */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        authorName={authorName}
        authorHeadline={authorHeadline}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentDomainName={domainDisplayName}
        currentLevel={selectedLevel}
      />

      {/* 2. Search Results Announcement if filtering */}
      {searchQuery && (
        <div className="bg-[#EBF4FD] border-b border-[#D0E5FA] px-4 py-2 text-xs text-[#0077B5] font-medium flex items-center justify-between max-w-7xl mx-auto w-full">
          <span>
            Search query "{searchQuery}" matches {matchingDomains.length} domain tracks.
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#191919] hover:underline text-xs font-bold"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* 3. Main 12-Column Grid Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT ASIDE: Profile Card & Top Domains Quick Switcher (3 cols on lg) */}
          <aside className="lg:col-span-3 space-y-4">
            {/* BOLD VALUE PROPOSITION & PROMOTIONAL CARD (Replacing confusing profile box) */}
            <div className="bg-gradient-to-br from-[#004182] via-[#0077B5] to-[#0A66C2] rounded-xl p-4 text-white shadow-md space-y-3 relative overflow-hidden border border-[#005582]">
              {/* Subtle background glow element */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-white/20 text-[10px] font-extrabold uppercase tracking-wider rounded-full backdrop-blur-xs text-white">
                  ⚡ Autonomous PR Engine
                </span>
                <span className="text-[10px] text-blue-100 font-medium ml-auto">1-Click Viral</span>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-black leading-tight tracking-tight text-white">
                  We are here to handle your LinkedIn.
                </h2>
                <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                  <strong>Problem while posting?</strong> Use our best AI bots to turn your LinkedIn into a non-stop <strong>PR machine</strong>.
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-xs space-y-1.5 border border-white/15 text-[11px] leading-snug text-blue-50">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-300 shrink-0" />
                  <span>Post seamlessly across:</span>
                </p>
                <ul className="space-y-1 pl-5 list-disc text-blue-100 text-[11px]">
                  <li>Your specific domain authority</li>
                  <li>Observations throughout your day</li>
                  <li>Target high-intent keywords & topics</li>
                </ul>
              </div>

              <div className="pt-1">
                <p className="text-[11px] font-bold text-yellow-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-300 shrink-0" />
                  <span>Turn everything into a LinkedIn post with 1 click.</span>
                </p>
                <p className="text-[11px] font-medium italic text-blue-100 mt-0.5">
                  "Your Persona, Our Speed — A Viral LinkedIn Post."
                </p>
              </div>

              {/* Author signature settings link */}
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px]">
                <span className="text-blue-200 truncate">
                  Posting as: <strong className="text-white">{authorName}</strong>
                </span>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-2 py-0.5 bg-white/20 hover:bg-white/30 text-white rounded text-[10px] font-bold transition shrink-0 cursor-pointer"
                >
                  Edit Name / Bio
                </button>
              </div>
            </div>

            {/* Top Domains Navigation Card */}
            <div className="bg-white rounded-lg border border-[#EBEBEB] p-3 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                  Cohort Domain Tracks
                </p>
                <span className="text-[10px] text-[#0077B5] font-semibold">{matchingDomains.length} Tracks</span>
              </div>
              <div className="space-y-1.5">
                {matchingDomains.map((domain) => {
                  const isSelected = selectedDomain === domain.id;
                  return (
                    <button
                      key={domain.id}
                      onClick={() => setSelectedDomain(domain.id)}
                      className={`w-full text-left flex items-center justify-between text-xs p-2 rounded transition font-medium ${
                        isSelected
                          ? 'bg-[#F3F2EF] font-bold text-[#191919] border-l-4 border-[#0077B5] shadow-2xs'
                          : 'text-[#555555] hover:bg-[#F8F9FA] hover:text-[#191919]'
                      }`}
                    >
                      <span className="truncate">{domain.shortTitle}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#0077B5] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Domain Trigger */}
              <div className="mt-2.5 pt-2 border-t border-[#EBEBEB]">
                <button
                  onClick={() => setSelectedDomain('custom')}
                  className={`w-full text-left text-xs p-1.5 rounded transition ${
                    selectedDomain === 'custom'
                      ? 'bg-[#F3F2EF] font-bold text-[#0077B5] border-l-4 border-[#0077B5]'
                      : 'text-[#666666] hover:bg-[#F8F9FA]'
                  }`}
                >
                  + Custom / Other Vertical
                </button>
                {selectedDomain === 'custom' && (
                  <input
                    type="text"
                    value={customDomainName}
                    onChange={(e) => setCustomDomainName(e.target.value)}
                    placeholder="e.g. AI Product Management..."
                    className="mt-1.5 w-full px-2.5 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#0077B5] outline-none"
                  />
                )}
              </div>
            </div>

            {/* 5-Step PR Machine Workflow Guide */}
            <div className="bg-white rounded-lg border border-[#EBEBEB] p-3 shadow-2xs space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#0077B5]" />
                <span>How the AI PR Engine Works</span>
              </p>
              <div className="space-y-1.5 text-[11px] text-[#555555]">
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#EBF4FD] text-[#0077B5] font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span><strong>Select Track</strong>: {domainDisplayName}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#EBF4FD] text-[#0077B5] font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span><strong>Set Blueprint & Voice</strong></span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#EBF4FD] text-[#0077B5] font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span><strong>Input keywords / raw notes</strong></span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#0077B5] text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span><strong>AI processes & suggests 5 best viral hooks</strong></span>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CENTER CONTENT (6 cols when right sidebar is shown, or 9 cols for wide views) */}
          <main className={`${activeTab === 'immediate' ? 'lg:col-span-6' : 'lg:col-span-9'} space-y-4`}>
            {/* Dynamic View Display */}
            {activeTab === 'immediate' && (
              <ImmediatePostBuilder
                key={`${selectedDomain}-${selectedLevel}-${injectedTopic}`}
                selectedDomain={selectedDomain}
                customDomainName={customDomainName}
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
                authorName={authorName}
                authorHeadline={authorHeadline}
                injectedTopic={injectedTopic}
                injectedStory={injectedStory}
              />
            )}

            {activeTab === 'campaign' && (
              <CampaignPlanner
                selectedDomain={selectedDomain}
                customDomainName={customDomainName}
                selectedLevel={selectedLevel}
                authorName={authorName}
                authorHeadline={authorHeadline}
                onOpenInFeedPreview={handleOpenInFeedPreview}
              />
            )}

            {activeTab === 'domains' && (
              <DomainIntelligenceView
                onSelectDomainForPost={handleSelectDomainForPost}
              />
            )}

            {activeTab === 'algorithm' && (
              <AlgorithmPlaybookView />
            )}
          </main>

          {/* RIGHT ASIDE: Algorithm Rules (3 cols on lg, shown in 'immediate' tab) */}
          {activeTab === 'immediate' && (
            <aside className="lg:col-span-3 space-y-4">
              {/* Algorithm Insights Card */}
              <div className="bg-white rounded-xl border border-[#D0DFEB] p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-2.5">
                  <div>
                    <p className="text-xs font-bold text-[#191919] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0077B5]" />
                      <span>2026 Algorithm Rules</span>
                    </p>
                    <p className="text-[10px] text-[#666666]">Engineered for maximum reach</p>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200">
                    Live
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2.5 text-xs">
                    <div className="bg-orange-50 border border-orange-200 p-1.5 rounded-md text-orange-600 shrink-0 mt-0.5">
                      <Flame className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#191919]">2-Line Hook Rule</p>
                      <p className="text-[11px] text-[#666666] leading-snug mt-0.5">
                        First 140 chars decide the "see more" click-through rate.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 text-xs">
                    <div className="bg-blue-50 border border-blue-200 p-1.5 rounded-md text-blue-600 shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#191919]">Dwell Time Multiplier</p>
                      <p className="text-[11px] text-[#666666] leading-snug mt-0.5">
                        Clean line breaks & skimmable pacing double dwell time.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 text-xs">
                    <div className="bg-green-50 border border-green-200 p-1.5 rounded-md text-green-600 shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#191919]">Golden First Hour</p>
                      <p className="text-[11px] text-[#666666] leading-snug mt-0.5">
                        Engage with the first 5 comment replies in under 30 minutes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Campaign CTA */}
                <div className="pt-2 border-t border-[#EBEBEB]">
                  <button
                    onClick={() => setActiveTab('campaign')}
                    className="w-full py-2 bg-[#F3F2EF] hover:bg-[#EBF4FD] text-[#0077B5] text-xs font-bold rounded-lg border border-[#D0E5FA] transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Open 30/60/90-Day Sprint & Tracker ➔</span>
                  </button>
                </div>
              </div>
            </aside>
          )}

        </div>
      </div>

      {/* Profile Edit Modal */}
      <AuthorProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        authorName={authorName}
        setAuthorName={setAuthorName}
        authorHeadline={authorHeadline}
        setAuthorHeadline={setAuthorHeadline}
      />
    </div>
  );
}
