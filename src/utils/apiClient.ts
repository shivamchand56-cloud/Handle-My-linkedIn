import { GeneratedPost, CampaignCalendar, CampaignDayPlan, DomainType, ExperienceLevel, PostFormatType, PostTone } from '../types';
import { DOMAINS_DATA } from '../data/domains';

export function synthesizeFallbackHooks(params: {
  domain: string;
  customDomainName?: string;
  formatType?: string;
  tone?: string;
  experienceLevel?: string;
  topicOrKeyword?: string;
  personalStoryOrBlueprint?: string;
}): string[] {
  const domainLabel = params.customDomainName || params.domain || 'Industry';
  const keyword = params.topicOrKeyword?.trim() || `${domainLabel} Strategy`;
  const rawStory = params.personalStoryOrBlueprint?.trim() || '';
  const levelLabel = params.experienceLevel === 'rookie' ? 'emerging' : 'top 1%';

  // Extract key numbers/metrics if present
  const numberMatch = rawStory.match(/(\$?\d+[\d,.]*%?|\d+\s*(?:days?|hours?|weeks?|months?|users?|teams?|deals?|leads?))/i);
  const metricHighlight = numberMatch ? numberMatch[0] : null;

  // Clean first phrase
  const cleanSnippet = rawStory
    ? rawStory.replace(/^(i|we|my team|yesterday|today|during|in)\s+/i, '').split(/[\n.]/)[0].trim().slice(0, 65)
    : '';

  const hooks: string[] = [];

  // 1. Contrarian Reality
  hooks.push(
    `Most people in ${domainLabel} get "${keyword}" completely backward.\n\nHere is what ${levelLabel} operators actually do differently:`
  );

  // 2. Observation / Metric Audit Hook
  if (metricHighlight && cleanSnippet) {
    hooks.push(
      `We noticed ${metricHighlight} during a recent ${keyword} audit (${cleanSnippet}).\n\nHere is the unseen breakdown most teams miss:`
    );
  } else if (cleanSnippet) {
    hooks.push(
      `Real lesson from the trenches: "${cleanSnippet}..."\n\nWhy this changes how we think about ${keyword}:`
    );
  } else {
    hooks.push(
      `We audited "${keyword}" across fast-scaling teams.\n\n82% of operators are bleeding efficiency right at this specific step:`
    );
  }

  // 3. The 2026 Contrarian Shift
  hooks.push(
    `The contrarian truth about "${keyword}" in 2026:\n\n(That most ${domainLabel} leaders won't admit publicly)`
  );

  // 4. Actionable Framework Hook
  hooks.push(
    `If you only implement ONE execution framework for "${keyword}" this quarter:\n\nMake it this 4-step battle-tested blueprint:`
  );

  // 5. Hard Truth / Mistake Warning
  if (cleanSnippet) {
    hooks.push(
      `Stop making this costly ${keyword} mistake: "${cleanSnippet}".\n\nHere is the 3-part fix we deployed:`
    );
  } else {
    hooks.push(
      `Why 9 out of 10 ${domainLabel} teams fail at "${keyword}":\n\nAnd the simple operating framework that fixes it:`
    );
  }

  return hooks;
}

export function synthesizeFallbackPost(params: {
  domain: DomainType;
  customDomainName?: string;
  experienceLevel: ExperienceLevel;
  formatType: PostFormatType;
  tone: PostTone;
  topicOrKeyword?: string;
  personalStoryOrBlueprint?: string;
  authorName?: string;
  authorHeadline?: string;
}): GeneratedPost {
  const domainMeta = DOMAINS_DATA.find((d) => d.id === params.domain);
  const resolvedDomain = params.domain === 'custom' && params.customDomainName ? params.customDomainName : domainMeta?.name || 'Your Domain';
  const shortTitle = domainMeta?.shortTitle || resolvedDomain;
  const rawTopic = params.topicOrKeyword?.trim();
  const rawStory = params.personalStoryOrBlueprint?.trim();
  const topic = rawTopic || domainMeta?.sampleTopics[0]?.title || `${shortTitle} Operating Blueprint`;

  const hooks = synthesizeFallbackHooks({
    domain: shortTitle,
    customDomainName: params.customDomainName,
    formatType: params.formatType,
    tone: params.tone,
    experienceLevel: params.experienceLevel,
    topicOrKeyword: topic,
    personalStoryOrBlueprint: rawStory,
  });

  const selectedHook = hooks[1] || hooks[0];

  let observationNarrative = '';
  if (rawStory) {
    observationNarrative = `Recently in the field, we observed something critical:

"${rawStory}"

When you look beneath the surface, this isn't an isolated incident. It's a symptom of how ${topic} is traditionally managed.`;
  } else {
    observationNarrative = `Most teams approach ${topic} with outdated playbooks.

They add more complexity, hire more headcount, and track vanity metrics—while the core leverage point remains untouched.`;
  }

  const pillar1 = `1. **The Diagnostic Audit**: Before adding resources, map where the friction actually lives. 80% of waste in ${topic} happens in unmeasured handoffs.`;
  const pillar2 = `2. **Focus on Leading Inputs**: Stop obsessing over lagging results. Track daily and weekly execution inputs that directly predict outcomes.`;
  const pillar3 = `3. **Async Operating Cadence**: Replace multi-person status meetings with concise, documented decision memos. Decision velocity is your true competitive moat.`;
  const pillar4 = `4. **Ruthless Simplification**: High-performing ${shortTitle} operators strip away low-value activities every 30 days.`;

  const takeaway = `Authority isn't built by posting generic theory. It's built by sharing the real numbers, the hard lessons from the trenches, and the systems that actually compound in production.`;

  const cta = rawStory 
    ? `Have you seen similar patterns with ${topic}? How is your team handling this right now? Drop your thoughts below. 💬`
    : `What is your biggest contrarian rule for ${topic}? Let's discuss below. 💬`;

  const content = `${selectedHook}

${observationNarrative}

Here is the exact framework we use to turn this around:

${pillar1}

${pillar2}

${pillar3}

${pillar4}

${takeaway}

${cta}`;

  const tags = [
    `#${shortTitle.replace(/[^a-zA-Z0-9]/g, '')}`,
    `#${topic.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20)}`,
    '#Leadership',
    '#Operations',
    '#Strategy2026'
  ].filter(t => t.length > 2);

  return {
    id: 'post_' + Date.now(),
    domain: params.domain,
    domainName: resolvedDomain,
    experienceLevel: params.experienceLevel,
    formatType: params.formatType,
    tone: params.tone,
    topic,
    hook: selectedHook,
    content,
    callToAction: cta,
    hashtags: tags,
    visualSuggestion: {
      type: 'carousel',
      title: `${topic} — Executive Breakdown`,
      description: `A high-contrast 5-slide visual carousel breaking down key takeaways for ${resolvedDomain}.`,
      aiImagePrompt: `Minimalist executive presentation slide on ${topic}, sleek editorial typography, crisp slate background`,
      recommendedAspectRatio: '1:1',
      carouselSlides: [
        {
          slideNumber: 1,
          headline: selectedHook.split('\n')[0].slice(0, 50),
          body: `Why conventional ${shortTitle} playbooks around "${topic}" are obsolete in 2026.`,
          takeaway: 'Swipe to see the 4-step framework ➔',
        },
        {
          slideNumber: 2,
          headline: 'The Trench Observation',
          body: rawStory ? rawStory.slice(0, 110) : `Auditing ${topic}: 80% of waste occurs in unmeasured friction points.`,
          takeaway: 'Diagnose the bottleneck before scaling.',
        },
        {
          slideNumber: 3,
          headline: 'Step 1: Input Metrics & Audits',
          body: 'Shift focus from lagging results to leading operational inputs.',
          takeaway: 'Calibrate the engine.',
        },
        {
          slideNumber: 4,
          headline: 'Step 2: Operating Cadence',
          body: 'Documented async decisions beat chaotic firefighting every single time.',
          takeaway: 'Systematize the baseline.',
        },
        {
          slideNumber: 5,
          headline: 'Summary & Core Takeaway',
          body: takeaway.slice(0, 120),
          takeaway: 'Save this post & share with your team 📌',
        },
      ],
    },
    algorithmAdvice: {
      bestTimeToPost: '08:15 AM - 09:30 AM (Author Timezone)',
      bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
      dwellTimeStrategy: '2-line hook before see-more fold + multi-slide visual forces >45s average dwell time.',
      goldenFirstHourTips: [
        'Reply to every comment within the first 45 minutes to trigger the algorithm multiplier.',
        'Never put external links in the main body (keep in first comment or pinned resource).',
        'Use high-contrast bullet spacing to maximize mobile viewport engagement.'
      ],
      viralMultiplierAction: 'Pin a conversation-starter comment asking a binary or high-opinion question.',
      hookScore: 9.7,
      readabilityScore: 9.8,
      overallViralityIndex: 9.6,
      reasons: [
        'Curiosity-driven 2-line hook before the mobile "see more" cutoff',
        'Deep narrative anchor using real-world trench observation',
        'Generous mobile line breaks and bullet spacing',
        'High-intent conversational question triggering peer comments'
      ],
    },
    alternativeHooks: hooks,
    createdAt: new Date().toISOString(),
    authorProfile: {
      name: params.authorName || 'Jordan Smith',
      headline: params.authorHeadline || `${resolvedDomain} Specialist | Cohort Member`,
    },
  };
}

export function synthesizeFallbackCampaign(params: {
  domain: DomainType;
  customDomainName?: string;
  durationDays: number;
  postsPerWeek: number;
  experienceLevel: ExperienceLevel;
  targetOutcome?: string;
  personalStoryOrBlueprint?: string;
  keywordFocus?: string;
}): CampaignCalendar {
  const domainMeta = DOMAINS_DATA.find((d) => d.id === params.domain);
  const resolvedDomain = params.domain === 'custom' && params.customDomainName ? params.customDomainName : domainMeta?.name || 'Your Domain';
  const shortTitle = domainMeta?.shortTitle || resolvedDomain;
  const numWeeks = Math.ceil(params.durationDays / 7);
  const totalPosts = Math.min(params.durationDays, numWeeks * params.postsPerWeek);

  const pillars = domainMeta?.corePillars || [
    'Strategic Foundation & Market Moat',
    'Tactical Execution & Metric Audit',
    'Unseen Levers & 2026 Shift',
    'Real World Operator Case Studies',
  ];

  const weeklyThemes = Array.from({ length: numWeeks }, (_, wIdx) => {
    const p = pillars[wIdx % pillars.length];
    return {
      week: wIdx + 1,
      theme: `Week ${wIdx + 1}: ${p}`,
      objective: `Build deep authority and high-engagement discussion around ${p.toLowerCase()}.`,
    };
  });

  const formats: PostFormatType[] = ['contrarian_take', 'step_by_step_blueprint', 'teardown_case_study', 'myth_buster', 'actionable_framework'];

  const days: CampaignDayPlan[] = Array.from({ length: totalPosts }, (_, idx) => {
    const weekNum = Math.floor(idx / params.postsPerWeek) + 1;
    const dayInWeek = (idx % params.postsPerWeek) + 1;
    const pillar = pillars[idx % pillars.length];
    const formatType = formats[idx % formats.length];

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + idx + 1);

    const title = `${shortTitle}: ${pillar} (Part ${dayInWeek})`;
    const hook = `Most ${shortTitle} leaders focus on the wrong 20% of ${pillar.toLowerCase()}. Here is what happens when you flip the model:`;
    const fullPost = `${hook}

When we audited operations across high-growth teams, this was the single biggest friction point.

3 Key Takeaways:
1. Simplify the core mechanism before scaling input volume.
2. Measure the leading indicators, not just delayed lagging metrics.
3. Build a repeatable cadence that compounds every single month.

What is your experience with this? Join the conversation below 👇`;

    return {
      day: idx + 1,
      week: weekNum,
      dateStr: targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      pillar,
      formatType,
      title,
      hook,
      fullPost,
      hashtags: [`#${shortTitle.replace(/[^a-zA-Z0-9]/g, '')}`, '#ThoughtLeadership', '#Strategy2026'],
      callToAction: 'What is your take? Let us know below 👇',
      visualRecommendation: '5-Slide Carousel breaking down the 3 core execution rules',
      algorithmTip: 'Post between 08:00 AM - 09:30 AM. Reply to early comments within 30 minutes to boost algorithmic distribution.',
      bestTime: '08:15 AM (Author Timezone)',
      status: (idx === 0 ? 'drafted' : 'planned') as 'planned' | 'drafted' | 'scheduled' | 'posted',
    };
  });

  return {
    id: 'campaign_' + Date.now(),
    title: `${params.durationDays}-Day ${resolvedDomain} Authority Sprint`,
    domain: params.domain,
    domainName: resolvedDomain,
    durationDays: params.durationDays as any,
    postsPerWeek: params.postsPerWeek,
    experienceLevel: params.experienceLevel,
    targetOutcome: params.targetOutcome || 'Establish top-of-mind domain authority and inbound reach',
    userStorySnippet: params.personalStoryOrBlueprint || '',
    keywordFocus: params.keywordFocus || '',
    weeklyThemes,
    days,
    createdAt: new Date().toISOString(),
  };
}

export async function fetchJsonSafely<T>(url: string, options: RequestInit, fallbackData: T): Promise<T> {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return data as T;
    }
    
    // If not JSON (e.g. HTML returned by Vite SPA fallback during restarts), read text safely and use fallback
    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      return parsed as T;
    } catch {
      console.warn(`[apiClient] Endpoint ${url} returned non-JSON response (${contentType || 'HTML'}). Seamlessly serving smart client fallback.`);
      return fallbackData;
    }
  } catch (err) {
    console.warn(`[apiClient] Network error on ${url}. Seamlessly serving smart client fallback:`, err);
    return fallbackData;
  }
}
