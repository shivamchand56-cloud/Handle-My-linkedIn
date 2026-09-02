export type DomainType =
  | 'product'
  | 'marketing'
  | 'founders_office'
  | 'finance_vc_ib'
  | 'operations_supply_chain'
  | 'sports_management'
  | 'hr_org_structure'
  | 'custom';

export type ExperienceLevel = 'rookie' | 'amateur' | 'expert' | 'professional';

export type CampaignDuration = 30 | 60 | 90;

export type PostFormatType =
  | 'contrarian_take'
  | 'teardown_case_study'
  | 'step_by_step_blueprint'
  | 'personal_war_story'
  | 'myth_buster'
  | 'actionable_framework'
  | 'carousel_slide_deck'
  | 'data_insight';

export type PostTone =
  | 'sharp_analytical'
  | 'conversational_story'
  | 'bold_provocative'
  | 'executive_authoritative'
  | 'vulnerable_authentic'
  | 'tactical_teacher';

export interface DomainMeta {
  id: DomainType;
  name: string;
  shortTitle: string;
  tagline: string;
  iconName: string;
  color: string;
  unseenFacts: string[];
  trendingHooks: string[];
  corePillars: string[];
  sampleTopics: { title: string; type: PostFormatType; promptSnippet: string }[];
}

export interface CarouselSlide {
  slideNumber: number;
  headline: string;
  body: string;
  bulletPoints?: string[];
  takeaway?: string;
}

export interface VisualSuggestion {
  type: 'carousel' | 'infographic' | 'matrix_chart' | 'photo_composition' | 'stat_callout';
  title: string;
  description: string;
  aiImagePrompt: string;
  recommendedAspectRatio: '1:1' | '4:5' | '16:9';
  carouselSlides?: CarouselSlide[];
}

export interface AlgorithmAdvice {
  bestTimeToPost: string;
  bestDays: string[];
  dwellTimeStrategy: string;
  goldenFirstHourTips: string[];
  viralMultiplierAction: string;
  hookScore: number;
  readabilityScore: number;
  overallViralityIndex: number;
  reasons: string[];
}

export interface GeneratedPost {
  id: string;
  domain: DomainType;
  domainName: string;
  experienceLevel: ExperienceLevel;
  formatType: PostFormatType;
  tone: PostTone;
  topic: string;
  hook: string;
  content: string;
  hashtags: string[];
  callToAction: string;
  visualSuggestion: VisualSuggestion;
  algorithmAdvice: AlgorithmAdvice;
  alternativeHooks: string[];
  createdAt: string;
  authorProfile?: {
    name: string;
    headline: string;
    avatarUrl?: string;
  };
}

export interface CampaignDayPlan {
  day: number;
  week: number;
  dateStr?: string;
  pillar: string;
  formatType: PostFormatType;
  title: string;
  hook: string;
  fullPost: string;
  hashtags: string[];
  callToAction: string;
  visualRecommendation: string;
  carouselPreview?: {
    slides: { title: string; content: string }[];
  };
  algorithmTip: string;
  bestTime: string;
  status: 'planned' | 'drafted' | 'scheduled' | 'posted';
}

export interface CampaignCalendar {
  id: string;
  title: string;
  domain: DomainType;
  domainName: string;
  durationDays: CampaignDuration;
  postsPerWeek: number;
  experienceLevel: ExperienceLevel;
  targetOutcome: string;
  userStorySnippet?: string;
  keywordFocus?: string;
  weeklyThemes: { week: number; theme: string; objective: string }[];
  days: CampaignDayPlan[];
  createdAt: string;
}

export interface GeneratePostRequest {
  domain: DomainType;
  customDomainName?: string;
  experienceLevel: ExperienceLevel;
  formatType: PostFormatType;
  tone: PostTone;
  topicOrKeyword: string;
  personalStoryOrBlueprint?: string;
  specificAngle?: string;
  targetAudience?: string;
  authorName?: string;
  authorHeadline?: string;
}

export interface GenerateCampaignRequest {
  domain: DomainType;
  customDomainName?: string;
  durationDays: CampaignDuration;
  postsPerWeek: number;
  experienceLevel: ExperienceLevel;
  targetOutcome: string;
  personalStoryOrBlueprint?: string;
  keywordFocus?: string;
  authorName?: string;
  authorHeadline?: string;
}
