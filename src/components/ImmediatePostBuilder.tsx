import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Flame, 
  HelpCircle, 
  Layers, 
  BookOpen, 
  Sliders, 
  Grid, 
  Search, 
  ListChecks, 
  BarChart2, 
  Wand2, 
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Eye,
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Target
} from 'lucide-react';
import { POST_FORMATS, POST_TONES, DOMAINS_DATA } from '../data/domains';
import { DomainType, ExperienceLevel, GeneratedPost, PostFormatType, PostTone } from '../types';
import { LinkedInFeedPreview } from './LinkedInFeedPreview';
import { AlgorithmScorecard } from './AlgorithmScorecard';
import { VisualCarouselGenerator } from './VisualCarouselGenerator';
import { VoiceInputButton } from './VoiceInputButton';
import { fetchJsonSafely, synthesizeFallbackHooks, synthesizeFallbackPost } from '../utils/apiClient';

interface ImmediatePostBuilderProps {
  selectedDomain: DomainType;
  customDomainName: string;
  selectedLevel: ExperienceLevel;
  setSelectedLevel?: (lvl: ExperienceLevel) => void;
  authorName: string;
  authorHeadline: string;
  injectedTopic?: string | null;
  injectedStory?: string | null;
}

const HOOK_ANGLE_TAGS = [
  { label: 'Contrarian Take', icon: '⚡', desc: 'Debunks common industry myth' },
  { label: 'Hard Data Audit', icon: '📊', desc: 'Metrics & audited operator reality' },
  { label: 'Curiosity Gap', icon: '💡', desc: 'What top 1% practitioners do' },
  { label: '4-Step Framework', icon: '🛠️', desc: 'Tactical execution blueprint' },
  { label: 'Trench Observation', icon: '📖', desc: 'Real experience from daily notes' },
];

export const ImmediatePostBuilder: React.FC<ImmediatePostBuilderProps> = ({
  selectedDomain,
  customDomainName,
  selectedLevel,
  setSelectedLevel,
  authorName,
  authorHeadline,
  injectedTopic,
  injectedStory,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<PostFormatType>('contrarian_take');
  const [selectedTone, setSelectedTone] = useState<PostTone>('sharp_analytical');
  const [topicOrKeyword, setTopicOrKeyword] = useState(injectedTopic || '');
  const [personalStory, setPersonalStory] = useState(injectedStory || '');
  const [targetAudience, setTargetAudience] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [customHooks, setCustomHooks] = useState<string[]>([]);
  const [selectedHookIndex, setSelectedHookIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'feed' | 'carousel' | 'algorithm'>('feed');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const currentDomainMeta = DOMAINS_DATA.find((d) => d.id === selectedDomain);
  const domainDisplayName = selectedDomain === 'custom' && customDomainName ? customDomainName : currentDomainMeta?.name || 'Your Domain';

  // Sync injected values when explicitly provided from external click
  useEffect(() => {
    if (injectedTopic) {
      setTopicOrKeyword(injectedTopic);
    }
  }, [injectedTopic]);

  useEffect(() => {
    if (injectedStory) {
      setPersonalStory(injectedStory);
    }
  }, [injectedStory]);

  const handleGeneratePost = async (customTopic?: string, customStory?: string, formatOverride?: PostFormatType) => {
    setIsLoading(true);
    setErrorMessage(null);

    const topicToUse = customTopic || topicOrKeyword || (currentDomainMeta?.sampleTopics[0]?.title || 'Key industry frameworks and lessons');
    const storyToUse = customStory || personalStory;
    const formatToUse = formatOverride || selectedFormat;

    const fallbackPost = synthesizeFallbackPost({
      domain: selectedDomain,
      customDomainName,
      experienceLevel: selectedLevel,
      formatType: formatToUse,
      tone: selectedTone,
      topicOrKeyword: topicToUse,
      personalStoryOrBlueprint: storyToUse,
      authorName,
      authorHeadline,
    });

    try {
      const data = await fetchJsonSafely<{ success: boolean; data: GeneratedPost }>(
        '/api/generate-post',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain: selectedDomain,
            customDomainName,
            experienceLevel: selectedLevel,
            formatType: formatToUse,
            tone: selectedTone,
            topicOrKeyword: topicToUse,
            personalStoryOrBlueprint: storyToUse,
            targetAudience,
            authorName,
            authorHeadline,
          }),
        },
        { success: true, data: fallbackPost }
      );

      const postData = data.data || fallbackPost;
      setGeneratedPost(postData);

      if (postData.alternativeHooks && postData.alternativeHooks.length > 0) {
        setCustomHooks(postData.alternativeHooks);
        setSelectedHookIndex(0);
      } else {
        const hooks = synthesizeFallbackHooks({
          domain: currentDomainMeta?.shortTitle || 'Industry',
          customDomainName,
          formatType: formatToUse,
          tone: selectedTone,
          experienceLevel: selectedLevel,
          topicOrKeyword: topicToUse,
          personalStoryOrBlueprint: storyToUse,
        });
        setCustomHooks(hooks);
        setSelectedHookIndex(0);
      }

      // Smooth scroll to hooks & preview box
      setTimeout(() => {
        const previewEl = document.getElementById('hooks-and-post-preview');
        if (previewEl) {
          previewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } catch (err: any) {
      console.warn('Recovered with domain smart post fallback:', err);
      setGeneratedPost(fallbackPost);
      setCustomHooks(fallbackPost.alternativeHooks);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchCustomHooksOnly = async () => {
    setIsGeneratingHooks(true);
    setErrorMessage(null);

    const topicToUse = topicOrKeyword || (currentDomainMeta?.sampleTopics[0]?.title || 'Key industry lessons');
    const storyToUse = personalStory;

    const fallbackHooks = synthesizeFallbackHooks({
      domain: currentDomainMeta?.shortTitle || 'Industry',
      customDomainName,
      formatType: selectedFormat,
      tone: selectedTone,
      experienceLevel: selectedLevel,
      topicOrKeyword: topicToUse,
      personalStoryOrBlueprint: storyToUse,
    });

    try {
      const data = await fetchJsonSafely<{ success: boolean; hooks: string[] }>(
        '/api/generate-hooks',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain: selectedDomain,
            customDomainName,
            experienceLevel: selectedLevel,
            formatType: selectedFormat,
            tone: selectedTone,
            topicOrKeyword: topicToUse,
            personalStoryOrBlueprint: storyToUse,
          }),
        },
        { success: true, hooks: fallbackHooks }
      );

      const resolvedHooks = data.hooks && data.hooks.length > 0 ? data.hooks : fallbackHooks;
      setCustomHooks(resolvedHooks);
      setSelectedHookIndex(0);

      // If post exists, swap the first hook in
      if (generatedPost && resolvedHooks[0]) {
        applyHookToPost(resolvedHooks[0]);
      }
    } catch (err: any) {
      console.warn('Recovered with fallback hooks:', err);
      setCustomHooks(fallbackHooks);
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  const applyHookToPost = (newHook: string, index?: number) => {
    if (typeof index === 'number') {
      setSelectedHookIndex(index);
    }
    if (!generatedPost) return;

    const oldHook = generatedPost.hook || '';
    const oldContent = generatedPost.content || '';

    let newContent = '';
    if (oldHook && oldContent.includes(oldHook)) {
      newContent = oldContent.replace(oldHook, newHook);
    } else {
      // Fallback: replace up to first double newline
      const parts = oldContent.split('\n\n');
      parts[0] = newHook;
      newContent = parts.join('\n\n');
    }

    setGeneratedPost({
      ...generatedPost,
      hook: newHook,
      content: newContent,
    });
  };

  const handleImprovePost = async (goal: string) => {
    if (!generatedPost) return;
    setIsImproving(true);

    const lines = (generatedPost.content || '').split('\n').filter((l: string) => l.trim().length > 0);
    const firstLine = lines[0] || 'The contrarian truth most operators overlook:';
    const fallbackImprovedHook = firstLine.endsWith(':') ? firstLine : `${firstLine}\n\nMost teams learn this the hard way:`;
    const spacedContent = lines.map((l: string) => l.startsWith('•') || l.startsWith('-') || /^\d+\./.test(l) ? l : `${l}\n`).join('\n');

    const fallbackImproved = {
      success: true,
      data: {
        revisedContent: `${fallbackImprovedHook}\n\n${spacedContent}\n\nWhat is your take on this? Let's discuss in the comments below. 👇`,
        revisedHook: fallbackImprovedHook.split('\n')[0],
        changesMade: [
          'Enhanced curiosity in first 2 lines',
          'Maximized whitespace for mobile feed scanning',
          'Structured key points with high-contrast bullet pacing',
          'Added conversational comment trigger',
        ],
        estimatedViralityBoost: '+35% Reach Potential',
        algorithmNotes: 'Optimized for <140 char see-more retention and mobile dwell time.',
      },
    };

    try {
      const data = await fetchJsonSafely<{ success: boolean; data: any }>(
        '/api/improve-post',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentContent: generatedPost.content,
            goal,
            domain: domainDisplayName,
            experienceLevel: selectedLevel,
          }),
        },
        fallbackImproved
      );

      if (data && data.data) {
        setGeneratedPost((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            content: data.data.revisedContent,
            hook: data.data.revisedHook || prev.hook,
          };
        });
      }
    } catch (err) {
      console.warn('Error improving post, applied fallback polish:', err);
    } finally {
      setIsImproving(false);
    }
  };

  const handleApplySampleTopic = (sample: { title: string; type: PostFormatType; promptSnippet: string }) => {
    setTopicOrKeyword(sample.title);
    setSelectedFormat(sample.type);
    setPersonalStory(sample.promptSnippet);
    handleGeneratePost(sample.title, sample.promptSnippet, sample.type);
  };

  const handleQuickCopy = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(`${generatedPost.content}\n\n${generatedPost.hashtags.join(' ')}`);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 1. CLEAN WIREFRAME STEP-BY-STEP GENERATION CARD */}
      <div className="bg-white rounded-xl border border-[#D0DFEB] p-4 sm:p-5 shadow-2xs space-y-4">
        
        {/* Step Header */}
        <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-3">
          <div>
            <h2 className="text-sm font-black text-[#191919] flex items-center gap-1.5 tracking-tight">
              <Sparkles className="w-4 h-4 text-[#0077B5]" />
              <span>Handle My LinkedIn — Autonomous Post Engine</span>
            </h2>
            <p className="text-[11px] text-[#666666] mt-0.5">
              Active Track: <strong className="text-[#0077B5]">{domainDisplayName}</strong> • Step-by-step authority post builder
            </p>
          </div>
          <span className="hidden sm:inline-flex px-2 py-0.5 bg-[#EBF4FD] text-[#0077B5] font-bold text-[10px] rounded-full border border-[#D0E5FA]">
            2026 Ghostwriter
          </span>
        </div>

        {/* STEP 1: Authority & Voice Framework */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
            <span className="text-xs font-bold text-[#191919]">Select Format, Tone & Authority</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Format Blueprint */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                Post Blueprint
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as PostFormatType)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#F8F9FA] border border-[#E0DFDC] rounded focus:border-[#0077B5] focus:bg-white outline-none text-[#191919] font-medium"
              >
                {POST_FORMATS.map((fmt) => (
                  <option key={fmt.id} value={fmt.id}>
                    {fmt.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice & Tone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                Voice & Tone
              </label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value as PostTone)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#F8F9FA] border border-[#E0DFDC] rounded focus:border-[#0077B5] focus:bg-white outline-none text-[#191919] font-medium"
              >
                {POST_TONES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Authority Posture */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                Authority Posture
              </label>
              <div className="grid grid-cols-2 gap-1">
                {(['rookie', 'expert'] as ExperienceLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel && setSelectedLevel(lvl)}
                    className={`py-1.5 text-center text-xs font-bold rounded border transition ${
                      selectedLevel === lvl
                        ? 'bg-[#0077B5] text-white border-[#0077B5] shadow-2xs'
                        : 'bg-[#F8F9FA] text-[#555555] border-[#E0DFDC] hover:bg-white'
                    }`}
                  >
                    {lvl === 'rookie' ? 'Learner / Rookie' : 'Proven Operator'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2: Keyword / Trend & Daily Observations */}
        <div className="space-y-3 pt-2 border-t border-[#EBEBEB]">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
            <span className="text-xs font-bold text-[#191919]">Target Keyword & Daily Observations</span>
          </div>

          {/* Topic / Keyword input (Clean, no mic) */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
              Target Keyword, Concept, or Trend
            </label>
            <input
              type="text"
              value={topicOrKeyword}
              onChange={(e) => setTopicOrKeyword(e.target.value)}
              placeholder={currentDomainMeta?.sampleTopics[0]?.title ? `e.g. ${currentDomainMeta.sampleTopics[0].title}` : "e.g. PLG time-to-value, feature factory trap, CAC economics..."}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E0DFDC] rounded-lg focus:border-[#0077B5] focus:ring-1 focus:ring-[#0077B5] outline-none text-[#191919] placeholder:text-gray-400 placeholder:font-normal transition shadow-2xs"
            />
          </div>

          {/* Observations / Raw Notes input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666]">
                Daily Observations, Raw Notes & Meeting Takeaways
              </label>
              <span className="text-[10px] text-[#666666] font-normal">
                {personalStory.length > 0 ? `${personalStory.length} chars` : 'Optional context'}
              </span>
            </div>
            
            <textarea
              id="daily-observations-dialogue"
              rows={3}
              value={personalStory}
              onChange={(e) => setPersonalStory(e.target.value)}
              placeholder="Type or dictate raw notes: 'Meeting today showed 40% churn was due to onboarding complexity', 'Tested async standups across 3 engineering pods'..."
              className="w-full p-2.5 text-xs bg-white border border-[#E0DFDC] rounded-lg focus:border-[#0077B5] focus:ring-1 focus:ring-[#0077B5] outline-none text-[#191919] placeholder:text-gray-400 placeholder:font-normal transition resize-y"
            />

            {/* MIC BUTTON DIRECTLY UNDER OBSERVATION DIALOGUE BOX */}
            <div className="pt-0.5 flex items-center justify-between">
              <VoiceInputButton
                variant="pill"
                label="Dictate Audio Observation"
                onTranscript={(text) => {
                  setPersonalStory(prev => prev ? `${prev} ${text}` : text);
                }}
                className="w-full sm:w-auto"
              />
              {personalStory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPersonalStory('')}
                  className="text-[11px] text-[#666666] hover:text-red-600 transition cursor-pointer px-1.5 py-0.5"
                >
                  Clear notes
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Topic Ideas */}
        {currentDomainMeta && currentDomainMeta.sampleTopics.length > 0 && (
          <div className="pt-1.5 border-t border-[#EBEBEB] flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1 mr-1">
              <Lightbulb className="w-3 h-3 text-[#B45309]" />
              <span>Quick Prompts:</span>
            </span>
            {currentDomainMeta.sampleTopics.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySampleTopic(sample)}
                className="px-2 py-0.5 rounded bg-[#FAF9F7] hover:bg-[#0077B5] hover:text-white text-[#555555] border border-[#E0DFDC] text-[10px] font-medium transition text-left line-clamp-1 cursor-pointer"
              >
                {sample.title}
              </button>
            ))}
          </div>
        )}

        {/* STEP 3: BIG PROMINENT GENERATE BUTTON ("Big show button as generate") */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => handleGeneratePost()}
            disabled={isLoading || isGeneratingHooks}
            className="w-full py-3.5 bg-[#0077B5] hover:bg-[#004182] disabled:opacity-50 text-white rounded-lg text-sm font-black tracking-wide transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating High-Converting Post...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>⚡ Generate High-Converting LinkedIn Post</span>
              </>
            )}
          </button>
        </div>

        {/* Error Message if any */}
        {errorMessage && (
          <div className="p-2.5 bg-red-50 text-red-600 text-xs rounded border border-red-200">
            {errorMessage}
          </div>
        )}
      </div>

      {/* 2. LOADING STATE */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-[#D0DFEB] p-6 shadow-2xs space-y-3 text-center">
          <div className="w-8 h-8 border-3 border-[#0077B5] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#191919]">
            Generating instant LinkedIn post for {domainDisplayName}...
          </p>
          <p className="text-[11px] text-[#666666]">
            Structuring 2-line curiosity hook, whitespace formatting, and mobile engagement triggers.
          </p>
        </div>
      )}

      {/* 3. POST PREVIEW CONTAINER WITH SUGGESTED HOOKS PLACED DIRECTLY ABOVE THE POST BOX */}
      {generatedPost && !isLoading && (
        <div id="hooks-and-post-preview" className="space-y-3">

          {/* SUGGESTED HOOKS DECK: PLACED DIRECTLY ABOVE THE LINKEDIN POST BOX */}
          {customHooks.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-[#0077B5] p-3.5 sm:p-4 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EBEBEB] pb-2">
                <div>
                  <h3 className="text-xs font-extrabold text-[#191919] flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#0077B5]" />
                    <span>5 High-Converting Hook Variations (Click to swap into post)</span>
                  </h3>
                  <p className="text-[11px] text-[#666666]">
                    Select any angle below to instantly replace the top line of your post.
                  </p>
                </div>
                <button
                  onClick={handleFetchCustomHooksOnly}
                  disabled={isGeneratingHooks}
                  className="text-[11px] text-[#0077B5] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isGeneratingHooks ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingHooks ? 'Refreshing...' : 'Regenerate Hooks'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {customHooks.map((hookText, idx) => {
                  const meta = HOOK_ANGLE_TAGS[idx] || { label: `Angle #${idx + 1}`, icon: '🎯', desc: 'Viral variation' };
                  const isSelected = selectedHookIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => applyHookToPost(hookText, idx)}
                      className={`p-2.5 rounded-lg border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-[#EBF4FD] border-[#0077B5] ring-1 ring-[#0077B5]'
                          : 'bg-[#FAF9F7] border-[#EBEBEB] hover:bg-white hover:border-[#0077B5]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{meta.icon}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0077B5]">
                            {meta.label}
                          </span>
                          <span className="text-[10px] text-gray-500">• {meta.desc}</span>
                          {isSelected && (
                            <span className="px-1.5 py-0.2 bg-[#0077B5] text-white text-[9px] font-bold rounded-full ml-1">
                              Active in Post
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-[#191919] leading-snug">
                          "{hookText}"
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          applyHookToPost(hookText, idx);
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded transition shrink-0 self-start sm:self-center ${
                          isSelected
                            ? 'bg-[#0077B5] text-white'
                            : 'bg-white border border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5] hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ Active' : 'Use Hook'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Action Navigation Toolbar */}
          <div className="bg-white border border-[#EBEBEB] rounded-lg p-2 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveView('feed')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeView === 'feed'
                    ? 'bg-[#0077B5] text-white shadow-2xs'
                    : 'text-[#555555] hover:bg-[#F3F2EF]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Feed Preview & Editor</span>
              </button>

              <button
                onClick={() => setActiveView('carousel')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeView === 'carousel'
                    ? 'bg-[#0077B5] text-white shadow-2xs'
                    : 'text-[#555555] hover:bg-[#F3F2EF]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Carousel Slides</span>
              </button>

              <button
                onClick={() => setActiveView('algorithm')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
                  activeView === 'algorithm'
                    ? 'bg-[#0077B5] text-white shadow-2xs'
                    : 'text-[#555555] hover:bg-[#F3F2EF]'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Virality Score ({generatedPost.algorithmAdvice.overallViralityIndex}/10)</span>
              </button>
            </div>

            <button
              onClick={handleQuickCopy}
              className="px-3 py-1.5 bg-[#057642] hover:bg-[#046237] text-white rounded text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
            >
              {copiedNotification ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNotification ? 'Copied to Clipboard!' : 'Copy for LinkedIn'}</span>
            </button>
          </div>

          {/* Tab View 1: Live LinkedIn Feed Simulation */}
          {activeView === 'feed' && (
            <LinkedInFeedPreview
              post={generatedPost}
              onUpdateContent={(newContent) => {
                setGeneratedPost({ ...generatedPost, content: newContent });
              }}
              onSwapHook={(newHook) => {
                applyHookToPost(newHook);
              }}
              onImprove={handleImprovePost}
              isImproving={isImproving}
            />
          )}

          {/* Tab View 2: Visual Carousel Slide Deck Generator */}
          {activeView === 'carousel' && (
            <VisualCarouselGenerator
              visualSuggestion={generatedPost.visualSuggestion}
              authorName={authorName}
              authorHeadline={authorHeadline}
              topic={generatedPost.topic}
            />
          )}

          {/* Tab View 3: Algorithm Virality Audit */}
          {activeView === 'algorithm' && (
            <AlgorithmScorecard
              advice={generatedPost.algorithmAdvice}
              postLength={generatedPost.content.length}
            />
          )}
        </div>
      )}
    </div>
  );
};
