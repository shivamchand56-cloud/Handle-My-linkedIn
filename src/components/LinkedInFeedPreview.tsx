import React, { useState } from 'react';
import { 
  ThumbsUp, 
  MessageSquare, 
  Repeat2, 
  Send, 
  MoreHorizontal, 
  Globe, 
  Copy, 
  Check, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Eye, 
  Flame, 
  TrendingUp, 
  ChevronRight,
  Edit3,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GeneratedPost } from '../types';

interface LinkedInFeedPreviewProps {
  post: GeneratedPost;
  onUpdateContent?: (newContent: string) => void;
  onOpenCarouselModal?: () => void;
  onImprovePost?: (goal: string) => void;
  isImproving?: boolean;
}

export const LinkedInFeedPreview: React.FC<LinkedInFeedPreviewProps> = ({
  post,
  onUpdateContent,
  onOpenCarouselModal,
  onImprovePost,
  isImproving = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(post.content);
  const [selectedReaction, setSelectedReaction] = useState<'like' | 'celebrate' | 'support' | 'love' | 'insightful' | 'funny' | null>(null);
  const [reactionCount, setReactionCount] = useState(142);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  // Sync state when post updates
  React.useEffect(() => {
    setEditableContent(post.content);
  }, [post.content]);

  const handleCopy = () => {
    const fullText = `${editableContent}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0A66C2', '#057642', '#378FE9'],
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onUpdateContent) {
      onUpdateContent(editableContent);
    }
  };

  const handleReaction = (type: 'like' | 'celebrate' | 'support' | 'love' | 'insightful' | 'funny') => {
    if (selectedReaction === type) {
      setSelectedReaction(null);
      setReactionCount((prev) => prev - 1);
    } else {
      if (!selectedReaction) setReactionCount((prev) => prev + 1);
      setSelectedReaction(type);
    }
    setShowReactionPicker(false);
  };

  // Measure hook length
  const charCount = editableContent.length;
  const wordCount = editableContent.trim().split(/\s+/).length;
  const isOptimalLength = charCount >= 800 && charCount <= 2200;

  // Split lines for "see more" simulation
  const lines = editableContent.split('\n');
  const previewLines = lines.slice(0, 3).join('\n');

  return (
    <div className="space-y-4">
      {/* Top Preview Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-[#EBEBEB] shadow-2xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-[#191919] uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#0077B5]" />
            <span>Feed Preview</span>
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            isOptimalLength ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {charCount} chars • {wordCount} words
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Viewport toggle */}
          <div className="flex items-center bg-[#F3F2EF] p-0.5 rounded border border-[#EBEBEB]">
            <button
              id="view-desktop-btn"
              onClick={() => setIsMobileView(false)}
              className={`p-1 rounded text-xs flex items-center gap-1 font-medium transition ${
                !isMobileView ? 'bg-white shadow-2xs text-[#0077B5]' : 'text-[#666666] hover:text-[#191919]'
              }`}
              title="Desktop Feed View"
            >
              <Monitor className="w-3 h-3" />
              <span className="hidden sm:inline text-[11px]">Desktop</span>
            </button>
            <button
              id="view-mobile-btn"
              onClick={() => setIsMobileView(true)}
              className={`p-1 rounded text-xs flex items-center gap-1 font-medium transition ${
                isMobileView ? 'bg-white shadow-2xs text-[#0077B5]' : 'text-[#666666] hover:text-[#191919]'
              }`}
              title="Mobile Feed View"
            >
              <Smartphone className="w-3 h-3" />
              <span className="hidden sm:inline text-[11px]">Mobile</span>
            </button>
          </div>

          {/* Edit Toggle */}
          <button
            id="edit-post-toggle"
            onClick={() => {
              if (isEditing) handleSaveEdit();
              else setIsEditing(true);
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 transition ${
              isEditing
                ? 'bg-[#057642] text-white border-[#057642]'
                : 'bg-white text-[#191919] border-[#EBEBEB] hover:bg-[#F3F2EF]'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span className="text-[11px]">{isEditing ? 'Save' : 'Edit'}</span>
          </button>

          {/* Copy Button */}
          <button
            id="copy-linkedin-post-btn"
            onClick={handleCopy}
            className="px-3.5 py-1 bg-[#0077B5] hover:bg-[#004182] text-white rounded-full text-xs font-bold transition flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied!' : 'Copy Post'}</span>
          </button>
        </div>
      </div>

      {/* Main Feed Card Wrapper */}
      <div className={`mx-auto transition-all ${isMobileView ? 'max-w-[400px]' : 'w-full'}`}>
        <div className="bg-white border border-[#EBEBEB] rounded-lg shadow-2xs overflow-hidden text-[#191919]">
          {/* Post Header: Author, Headline, Timestamp */}
          <div className="p-3 pb-2 flex items-start justify-between">
            <div className="flex items-start space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-[#D9E2EF] text-gray-700 font-bold text-sm flex items-center justify-center border border-gray-200 shrink-0">
                {post.authorProfile?.name ? post.authorProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'JS'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1">
                  <h3 className="font-bold text-xs sm:text-sm text-[#191919] hover:text-[#0077B5] cursor-pointer hover:underline truncate">
                    {post.authorProfile?.name || 'Jordan Smith'}
                  </h3>
                  <span className="text-[11px] text-[#666666] font-normal">• 1st</span>
                </div>
                <p className="text-[11px] text-[#666666] line-clamp-1 leading-tight mt-0.5">
                  {post.authorProfile?.headline || `${post.domainName} Lead | Authority Cohort`}
                </p>
                <div className="flex items-center space-x-1 text-[10px] text-[#888888] mt-0.5">
                  <span>Just now</span>
                  <span>•</span>
                  <Globe className="w-2.5 h-2.5 text-[#888888]" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-[#666666]">
              <button className="p-1 hover:bg-[#F3F2EF] rounded-full transition" title="More options">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Post Body Content */}
          <div className="px-3.5 py-2 text-xs sm:text-sm text-[#191919] leading-relaxed whitespace-pre-line font-normal selection:bg-[#D0E5FA]">
            {isEditing ? (
              <textarea
                id="inline-post-editor"
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                rows={12}
                className="w-full p-2.5 text-xs bg-[#FAF9F7] border border-[#0077B5] rounded font-sans focus:outline-none leading-relaxed"
              />
            ) : (
              <div>
                {isExpanded ? (
                  <div>{editableContent}</div>
                ) : (
                  <div>
                    <span>{previewLines}</span>
                    {lines.length > 3 && (
                      <button
                        onClick={() => setIsExpanded(true)}
                        className="text-[#666666] hover:text-[#0077B5] hover:underline font-semibold ml-1 inline-block"
                      >
                        …see more
                      </button>
                    )}
                  </div>
                )}

                {/* Hashtags */}
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-[#0077B5] font-medium">
                  {post.hashtags.map((tag, idx) => (
                    <span key={idx} className="hover:underline cursor-pointer">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Attached Visual Asset Card (Infographic / Carousel / Chart) */}
          {post.visualSuggestion && (
            <div className="mx-3 mb-2.5 border border-[#EBEBEB] rounded overflow-hidden bg-[#FAF9F7]">
              <div className="p-2.5 bg-gray-50 border-b border-[#EBEBEB] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-[#0077B5] text-white px-1.5 py-0.5 rounded">
                    {post.visualSuggestion.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-[#191919] truncate max-w-[240px]">
                    {post.visualSuggestion.title}
                  </span>
                </div>
                {post.visualSuggestion.carouselSlides && post.visualSuggestion.carouselSlides.length > 0 && (
                  <button
                    onClick={onOpenCarouselModal}
                    className="text-[11px] text-[#0077B5] font-bold hover:underline flex items-center gap-1"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>View Slides ({post.visualSuggestion.carouselSlides.length})</span>
                  </button>
                )}
              </div>

              <div className="p-3 space-y-1.5">
                <p className="text-xs text-[#444444] leading-relaxed italic">
                  💡 <strong className="text-[#191919]">Visual Direction:</strong> {post.visualSuggestion.description}
                </p>
                <div className="bg-white p-2 rounded border border-[#EBEBEB] text-[10px] text-[#666666]">
                  <span className="font-semibold text-[#191919]">AI Image / Designer Prompt: </span>
                  <code className="text-[#0077B5] select-all font-mono">{post.visualSuggestion.aiImagePrompt}</code>
                </div>
              </div>
            </div>
          )}

          {/* Social Stats: Reactions & Comments */}
          <div className="px-3.5 py-1.5 border-t border-[#EBEBEB] flex items-center justify-between text-[11px] text-[#666666]">
            <div className="flex items-center space-x-1.5">
              <div className="flex -space-x-1">
                <span className="w-3.5 h-3.5 rounded-full bg-[#0077B5] text-white flex items-center justify-center text-[8px]">👍</span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#057642] text-white flex items-center justify-center text-[8px]">💡</span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#D9381E] text-white flex items-center justify-center text-[8px]">❤️</span>
              </div>
              <span className="font-medium text-[#666666] hover:text-[#0077B5] hover:underline cursor-pointer">
                {reactionCount}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px]">
              <span className="hover:text-[#0077B5] hover:underline cursor-pointer">48 comments</span>
              <span>•</span>
              <span className="hover:text-[#0077B5] hover:underline cursor-pointer">19 reposts</span>
            </div>
          </div>

          {/* Action Buttons: Like, Comment, Repost, Send */}
          <div className="relative px-1 py-1 border-t border-[#EBEBEB] grid grid-cols-4 gap-0.5 text-xs font-semibold text-[#666666]">
            {/* Reaction Hover Picker */}
            {showReactionPicker && (
              <div 
                className="absolute -top-10 left-2 bg-white border border-[#EBEBEB] rounded-full shadow-md p-1 flex items-center space-x-1.5 z-30"
                onMouseLeave={() => setShowReactionPicker(false)}
              >
                <button onClick={() => handleReaction('like')} className="hover:scale-125 transition text-base" title="Like">👍</button>
                <button onClick={() => handleReaction('celebrate')} className="hover:scale-125 transition text-base" title="Celebrate">👏</button>
                <button onClick={() => handleReaction('support')} className="hover:scale-125 transition text-base" title="Support">🤝</button>
                <button onClick={() => handleReaction('love')} className="hover:scale-125 transition text-base" title="Love">❤️</button>
                <button onClick={() => handleReaction('insightful')} className="hover:scale-125 transition text-base" title="Insightful">💡</button>
                <button onClick={() => handleReaction('funny')} className="hover:scale-125 transition text-base" title="Funny">😂</button>
              </div>
            )}

            <button
              onClick={() => handleReaction('like')}
              onMouseEnter={() => setShowReactionPicker(true)}
              className={`flex items-center justify-center space-x-1 py-2 rounded hover:bg-[#F3F2EF] transition ${
                selectedReaction ? 'text-[#0077B5]' : 'text-[#666666]'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${selectedReaction ? 'fill-[#0077B5]' : ''}`} />
              <span className="capitalize text-[11px]">{selectedReaction || 'Like'}</span>
            </button>

            <button className="flex items-center justify-center space-x-1 py-2 rounded hover:bg-[#F3F2EF] transition text-[#666666]">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-[11px]">Comment</span>
            </button>

            <button className="flex items-center justify-center space-x-1 py-2 rounded hover:bg-[#F3F2EF] transition text-[#666666]">
              <Repeat2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">Repost</span>
            </button>

            <button className="flex items-center justify-center space-x-1 py-2 rounded hover:bg-[#F3F2EF] transition text-[#666666]">
              <Send className="w-3.5 h-3.5" />
              <span className="text-[11px]">Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alternative Viral Hooks Bar */}
      {post.alternativeHooks && post.alternativeHooks.length > 0 && (
        <div className="bg-white border border-[#EBEBEB] rounded-lg p-3 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold text-[#191919] uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#D9381E]" />
              <span>Alternative Viral Hooks (Click to swap)</span>
            </h4>
            <span className="text-[10px] text-[#666666]">A/B test opening 2 lines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {post.alternativeHooks.map((altHook, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const restOfPost = editableContent.split('\n\n').slice(1).join('\n\n');
                  const updated = `${altHook}\n\n${restOfPost}`;
                  setEditableContent(updated);
                  if (onUpdateContent) onUpdateContent(updated);
                }}
                className="text-left p-2 bg-[#FAF9F7] hover:bg-[#EDF3F8] border border-[#EBEBEB] hover:border-[#0077B5] rounded text-xs text-[#191919] transition group"
              >
                <div className="flex items-start space-x-1.5">
                  <span className="text-[9px] font-bold text-[#0077B5] bg-white px-1 py-0.5 rounded border border-[#EBEBEB] shrink-0">
                    #{idx + 1}
                  </span>
                  <p className="text-[11px] text-[#191919] group-hover:text-[#0077B5] line-clamp-2 leading-snug">
                    {altHook}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Post Polisher Quick Actions */}
      <div className="bg-[#FAF9F7] border border-[#EBEBEB] rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-[#191919]">
          <Sparkles className="w-3.5 h-3.5 text-[#0077B5]" />
          <span className="text-[11px]">AI Post Boosters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onImprovePost && onImprovePost('Make opening hook 3x more contrarian and curiosity-inducing')}
            disabled={isImproving}
            className="px-2 py-0.5 bg-white hover:bg-[#EDF3F8] border border-[#EBEBEB] hover:border-[#0077B5] text-[11px] font-medium text-[#191919] rounded transition disabled:opacity-50"
          >
            🔥 Stronger Hook
          </button>
          <button
            onClick={() => onImprovePost && onImprovePost('Shorten sentences, maximize mobile whitespace and add punchy bullet points')}
            disabled={isImproving}
            className="px-2 py-0.5 bg-white hover:bg-[#EDF3F8] border border-[#EBEBEB] hover:border-[#0077B5] text-[11px] font-medium text-[#191919] rounded transition disabled:opacity-50"
          >
            📱 Mobile Skim
          </button>
          <button
            onClick={() => onImprovePost && onImprovePost('Add specific insider domain data metrics, ROI benchmarks, and framework acronyms')}
            disabled={isImproving}
            className="px-2 py-0.5 bg-white hover:bg-[#EDF3F8] border border-[#EBEBEB] hover:border-[#0077B5] text-[11px] font-medium text-[#191919] rounded transition disabled:opacity-50"
          >
            📊 Add Metrics
          </button>
        </div>
      </div>
    </div>
  );
};
