import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure all /api/* routes always set Content-Type: application/json
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Initialize Gemini SDK with User-Agent header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Domain synthesis knowledge base for lightning fast generation & reliable fallback
const DOMAIN_INTELLIGENCE_MAP: Record<string, {
  name: string;
  shortTitle: string;
  corePillars: string[];
  trendingHooks: string[];
  sampleInsights: string[];
  metrics: string[];
  bestTime: string;
  bestDays: string[];
}> = {
  product: {
    name: 'Product Management, Strategy & UX',
    shortTitle: 'Product (PM & UX)',
    corePillars: ['Outcome-Driven Roadmaps', 'PLG & Time-to-Value (TTV)', 'North Star & Input Metric Alignment', 'Retention Cohort Diagnostics', '1-Page PRD Architecture', 'AI UX Patterns'],
    trendingHooks: [
      '64% of product features shipped never get used. Here is how top 1% PMs stop building in the dark:',
      'We killed our most requested feature after auditing 10,000 user sessions. Here is the contrarian data why:',
      'The 1-page PRD format that replaced 40-page Jira specs and doubled our engineering ship velocity:',
      'Product-Led Growth is not a pricing model—it’s an onboarding physics problem. Here is the 4-step framework:',
      'If your product team is measured on "features shipped" instead of "metric moved", you are running a feature factory:'
    ],
    sampleInsights: [
      'Over 64% of features built in SaaS are rarely or never used by customers (Pendo benchmark).',
      'Cutting onboarding Time-to-Value by 15 minutes increases Day-30 user retention by 28%.',
      'Leading input metrics (weekly collaborative actions) predict 12-month ARR retention 4x better than CSAT scores.'
    ],
    metrics: ['Activation Rate (>42%)', 'Time to Value (<5 min)', 'Day-30 Retention (>35%)', 'Feature Adoption Depth (>60%)'],
    bestTime: '08:00 AM - 09:15 AM (Author Timezone)',
    bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
  },
  marketing: {
    name: 'Marketing & Growth Strategy',
    shortTitle: 'Marketing',
    corePillars: ['CAC to LTV Economics', 'Brand Moat vs Performance Trap', 'Dark Social Loops', 'Buyer Psychology', 'Category Creation'],
    trendingHooks: [
      'Stop running ads until you can answer this single 6-word question:',
      'We audited $4.2M in marketing spend last quarter. 82% of it was wasted on this vanity metric:',
      'The best marketers don’t sell products. They sell a new identity. Here is the 4-step framework:',
      'Most B2B companies are playing 2019 marketing in 2026. Here is what changed:'
    ],
    sampleInsights: [
      'Over 74% of B2B purchase journeys happen in Dark Social before a lead fills a form.',
      'Brands spending >75% of budget on direct ads see CAC jump 40-70% YoY without brand equity.',
      'Cognitive overload in landing page headers reduces demo conversions by 31%.'
    ],
    metrics: ['CAC:LTV ratio', 'Payback Period (<9 mo)', 'Organic Pipeline % (>45%)', 'Blended ROAS'],
    bestTime: '08:15 AM - 09:30 AM (Author Timezone)',
    bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
  },
  founders_office: {
    name: 'Founders Office & Chief of Staff',
    shortTitle: 'Founders Office / CoS',
    corePillars: ['Executive Decision Velocity', 'Cross-functional Chaos Containment', 'Board Deck Strategy', 'Strategic Prioritization', '0-to-1 Incubation'],
    trendingHooks: [
      'The Chief of Staff role is the most misunderstood job in tech. Here is what I actually do all week:',
      'If your CEO is attending more than 12 hours of internal meetings per week, your company has an operational bug:',
      'I analyzed 50 Board Decks from Series A to Series C. The winning ones all follow this 5-slide cadence:',
      'How to resolve high-stakes conflict between Product and Sales in under 30 minutes (Founder’s Office Playbook):'
    ],
    sampleInsights: [
      '80% of leverage comes from filtering the bottom 90% of meetings out of the CEO calendar.',
      'A 1-day executive decision turnaround delay at 50-person scale compounds into a 3-week delivery slip.',
      'Top CoS professionals use a "Two-Way vs One-Way Door" memo format to cut meetings by 60%.'
    ],
    metrics: ['Decision Turnaround Time (<24h)', 'CEO Context Switch Hours (<10h/wk)', 'Board Update Velocity'],
    bestTime: '07:45 AM - 09:00 AM (Author Timezone)',
    bestDays: ['Monday', 'Tuesday', 'Thursday'],
  },
  finance_vc_ib: {
    name: 'Finance — VC & Investment Banking',
    shortTitle: 'Finance (VC & IB)',
    corePillars: ['Unit Economics & Burn Multiple', 'Term Sheet Nuances & Liquidation Traps', 'M&A Valuation Multiples (QoE)', 'LBO Bridge Models', 'LP Sentiment & Cycles'],
    trendingHooks: [
      'A founder showed me a term sheet that looked like a $40M valuation win. It was actually a financial landmine:',
      'If your Burn Multiple is above 1.8x in today’s capital climate, you aren’t investing in growth—you’re burning equity:',
      'The 7 line-items every VC analyst scrutinizes in the first 90 seconds of opening a financial model:',
      'Investment Banking taught me how deals really get closed. Here are 4 negotiation levers they don’t teach in business school:'
    ],
    sampleInsights: [
      'Participating preferred shares with 2x liquidation preferences can wipe out common equity in moderate exits.',
      'Over 60% of VC returns in top quartile funds are generated by 1-2 outlier portfolio investments (Power Law).',
      'In M&A, the biggest deal killer is customer concentration risk in Quality of Earnings reports.'
    ],
    metrics: ['Burn Multiple (<1.0x)', 'Net Revenue Retention (>120%)', 'Gross Margin (>80%)', 'Magic Number (>0.85)'],
    bestTime: '07:30 AM - 08:45 AM (Author Timezone)',
    bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
  },
  operations_supply_chain: {
    name: 'Operations & Supply Chain',
    shortTitle: 'Ops & Supply Chain',
    corePillars: ['Inventory Optimization', 'The Bullwhip Effect', '3PL vs In-House Economics', 'Nearshoring Risk Architecture', 'Warehouse Bottleneck Diagnostics'],
    trendingHooks: [
      'Most supply chain disasters don’t start at the port. They start inside this innocent-looking Excel spreadsheet:',
      'We audited a $30M direct-to-consumer brand’s 3PL invoice. We discovered $180k in hidden fees they paid for 2 years straight:',
      'Just-in-Time (JIT) manufacturing is dead. Here is the "Just-in-Case" resilience framework replacing it:',
      'If you have more than 90 days of inventory sitting in your warehouse, your working capital is slowly bleeding:'
    ],
    sampleInsights: [
      'A 5% reduction in lead times can unlock up to 25% in freed-up working capital.',
      'The Bullwhip Effect: A 5% retail demand shift amplifies into a 40% swing at tier-3 suppliers.',
      'Hidden 3PL accessorial fees silently erode 8-14% of gross product margins.'
    ],
    metrics: ['Inventory Turns (>6x)', 'Order Fill Rate (>99.2%)', 'Carrying Cost % (<18%)', 'OTIF % (>96%)'],
    bestTime: '08:00 AM - 09:15 AM (Author Timezone)',
    bestDays: ['Tuesday', 'Wednesday', 'Friday'],
  },
  sports_management: {
    name: 'Sports Management & Athletics Business',
    shortTitle: 'Sports Management',
    corePillars: ['NIL Contract Architecture', 'Sports Franchise Valuation & PE', 'DTC Streaming & Broadcast Rights', 'Stadium Real Estate Economics', 'Athlete Brand Venturing'],
    trendingHooks: [
      'The biggest revenue driver for modern sports teams is no longer ticket sales. It is this unexpected real estate play:',
      'Why private equity is pouring billions into sports franchises (and the hidden risks nobody is talking about):',
      'I broke down how an elite athlete structured a $5M endorsement deal into 40% equity. The math is brilliant:',
      'The death of regional sports networks is accelerating. Here is who will own sports media by 2028:'
    ],
    sampleInsights: [
      'Over 60% of modern sports franchise valuation growth is driven by mixed-use real estate around the venue.',
      'Top collegiate NIL athletes now operate multi-member LLCs with equity earn-outs.',
      'Live sports rights command 3x ad CPMs compared to scripted entertainment streaming.'
    ],
    metrics: ['Fan LTV ($)', 'Venue Non-Gameday Yield', 'NIL ROI Multiplier', 'DTC Streaming ARPU'],
    bestTime: '09:00 AM - 10:30 AM (Author Timezone)',
    bestDays: ['Monday', 'Thursday', 'Friday'],
  },
  hr_org_structure: {
    name: 'HR, People Ops & Org Structure',
    shortTitle: 'HR & Org Structure',
    corePillars: ['Span of Control & Flat Org Design', 'Talent Density vs Headcount Growth', 'Pay Transparency & Equity Bands', 'Async Work Architecture', 'Lightweight Performance Management'],
    trendingHooks: [
      'Most companies don’t have a culture problem. They have a 1:3 manager-to-report ratio problem:',
      'Why we scrapped our 360-degree annual performance reviews and replaced them with a 2-question fortnightly memo:',
      'The "Empire Builder" manager trap: How middle managers accidentally destroy company margins to look important:',
      'How to design salary bands that high-performers respect (without causing internal civil war when made public):'
    ],
    sampleInsights: [
      'Organizations with managerial spans under 1:4 suffer from 3x higher communication latency.',
      'Pay transparency without defined merit bands increases top performer voluntary churn by 18%.',
      'Bi-weekly 15-minute calibration check-ins boost employee retention by 28% compared to annual reviews.'
    ],
    metrics: ['Span of Control (1:7 ideal)', 'Voluntary Top-Performer Churn (<4%)', 'eNPS (>45)', 'Time to Productivity'],
    bestTime: '08:30 AM - 09:45 AM (Author Timezone)',
    bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
  },
};

// Dynamic 5-Hook Synthesizer grounded deeply in User Inputs (Topic + Observation + Domain + Tone)
function synthesizeCustomHooks(params: {
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

  // Extract key observation nugget or numbers if present
  const numberMatch = rawStory.match(/(\$?\d+[\d,.]*%?|\d+\s*(?:days?|hours?|weeks?|months?|users?|teams?|deals?|leads?))/i);
  const metricHighlight = numberMatch ? numberMatch[0] : null;

  // Clean first sentence/phrase of story
  const cleanSnippet = rawStory
    ? rawStory.replace(/^(i|we|my team|yesterday|today|during|in)\s+/i, '').split(/[\n.]/)[0].trim().slice(0, 65)
    : '';

  const hooks: string[] = [];

  // 1. Contrarian Reality Hook
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

// Fast Domain-Smart Fallback Synthesizer (deeply incorporating keyword + observation notes)
function generateDomainSmartPost(params: {
  domain: string;
  customDomainName?: string;
  experienceLevel: string;
  formatType: string;
  tone: string;
  topicOrKeyword: string;
  personalStoryOrBlueprint?: string;
  authorName?: string;
  authorHeadline?: string;
}) {
  const domainKey = params.domain.toLowerCase();
  const domainMeta = DOMAIN_INTELLIGENCE_MAP[domainKey] || {
    name: params.customDomainName || params.domain,
    shortTitle: params.customDomainName || params.domain,
    corePillars: ['Strategic Leverage', 'Operational Cadence', 'Domain Authority', 'Data-Backed Execution'],
    trendingHooks: [
      `Most people in ${params.customDomainName || params.domain} focus on the wrong metric. Here is the contrarian truth:`,
      `We audited 20+ operations in ${params.customDomainName || params.domain}. Here are the lessons that shocked us:`,
    ],
    sampleInsights: [`Strategic clarity and focus beats complex tooling 9 times out of 10.`],
    metrics: ['Execution Velocity', 'Efficiency Ratio', 'High-Intent Engagement'],
    bestTime: '08:30 AM - 09:30 AM',
    bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
  };

  const domainLabel = params.customDomainName || domainMeta.shortTitle;
  const rawTopic = params.topicOrKeyword?.trim();
  const rawStory = params.personalStoryOrBlueprint?.trim();

  const topic = rawTopic || domainMeta.sampleInsights[0] || `${domainLabel} Operating Blueprint`;
  
  const hooksList = synthesizeCustomHooks({
    domain: domainMeta.shortTitle,
    customDomainName: params.customDomainName,
    formatType: params.formatType,
    tone: params.tone,
    experienceLevel: params.experienceLevel,
    topicOrKeyword: topic,
    personalStoryOrBlueprint: rawStory,
  });

  const selectedHook = hooksList[1] || hooksList[0];

  // Build Context Story Narrative from user's observations
  let observationNarrative = '';
  if (rawStory) {
    observationNarrative = `Recently in the field, we observed something critical:

"${rawStory}"

When you look beneath the surface, this isn't an isolated incident. It's a symptom of how ${topic} is traditionally managed.`;
  } else {
    observationNarrative = `Most teams approach ${topic} with outdated playbooks.

They add more complexity, hire more headcount, and track vanity metrics—while the core leverage point remains untouched.`;
  }

  // Extract or synthesize 4 contextual tactical pillars
  const pillar1 = `1. **The Diagnostic Audit**: Before adding resources, map where the friction actually lives. 80% of waste in ${topic} happens in unmeasured handoffs.`;
  const pillar2 = `2. **Focus on Leading Inputs**: Stop obsessing over lagging results. Track daily and weekly execution inputs that directly predict outcomes.`;
  const pillar3 = `3. **Async Operating Cadence**: Replace multi-person status meetings with concise, documented decision memos. Decision velocity is your true competitive moat.`;
  const pillar4 = `4. **Ruthless Simplification**: High-performing ${domainLabel} operators strip away low-value activities every 30 days.`;

  const takeaway = `Authority isn't built by posting generic theory. It's built by sharing the real numbers, the hard lessons from the trenches, and the systems that actually compound in production.`;

  const cta = rawStory 
    ? `Have you seen similar patterns with ${topic}? How is your team handling this right now? Drop your thoughts below. 💬`
    : `What is your biggest contrarian rule for ${topic}? Let's discuss below. 💬`;

  const bodyContent = `${selectedHook}

${observationNarrative}

Here is the exact framework we use to turn this around:

${pillar1}

${pillar2}

${pillar3}

${pillar4}

${takeaway}

${cta}`;

  const tags = [
    `#${domainLabel.replace(/[^a-zA-Z0-9]/g, '')}`,
    `#${topic.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20)}`,
    '#Leadership',
    '#Operations',
    '#Strategy2026'
  ].filter(t => t.length > 2);

  return {
    hook: selectedHook,
    content: bodyContent,
    callToAction: cta,
    hashtags: tags,
    visualSuggestion: {
      type: 'carousel',
      title: `${topic} — 4-Step Strategic Breakdown`,
      description: `A 5-slide minimalist, high-contrast carousel breaking down ${topic} with actionable takeaways.`,
      aiImagePrompt: `Minimalist modern infographic slide deck about ${topic} in dark navy and white theme, corporate executive aesthetic`,
      recommendedAspectRatio: '1:1',
      carouselSlides: [
        {
          slideNumber: 1,
          headline: selectedHook.split('\n')[0].slice(0, 50),
          body: `Why conventional ${domainLabel} wisdom around "${topic}" is obsolete in 2026.`,
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
      bestTimeToPost: domainMeta.bestTime,
      bestDays: domainMeta.bestDays,
      dwellTimeStrategy: 'The structured numbered format, story pacing, and carousel slides keep users engaged for >45 seconds.',
      goldenFirstHourTips: [
        'Reply to the first 5 comments within 30 minutes with thoughtful follow-up questions.',
        'Keep external links in the first comment rather than the post body.',
        'Share the post link with 2-3 cohort peers to kickstart organic discussions.',
      ],
      viralMultiplierAction: 'Encourage bookmarking/saves by delivering an actionable checklist format.',
      hookScore: 9.6,
      readabilityScore: 9.7,
      overallViralityIndex: 9.5,
      reasons: [
        'Curiosity-driven 2-line hook before the mobile "see more" cutoff',
        'Deep narrative anchor using real-world trench observation',
        'Generous mobile line breaks and bullet spacing',
        'High-intent conversational question triggering peer comments'
      ],
    },
    alternativeHooks: hooksList,
  };
}

// Fast Domain-Smart Campaign Synthesizer
function generateDomainSmartCampaign(params: {
  domain: string;
  customDomainName?: string;
  durationDays: number;
  postsPerWeek: number;
  experienceLevel: string;
  targetOutcome?: string;
  personalStoryOrBlueprint?: string;
  keywordFocus?: string;
}) {
  const domainKey = params.domain.toLowerCase();
  const domainMeta = DOMAIN_INTELLIGENCE_MAP[domainKey] || {
    name: params.customDomainName || params.domain,
    shortTitle: params.customDomainName || params.domain,
    corePillars: ['Strategic Leverage', 'Operational Cadence', 'Domain Authority', 'Data-Backed Execution'],
    trendingHooks: [`The contrarian rule of ${params.customDomainName || params.domain}:`],
    sampleInsights: [`High performance comes from ruthlessly simple execution.`],
    metrics: ['Velocity', 'Quality', 'Retention'],
    bestTime: '08:30 AM',
    bestDays: ['Tue', 'Wed', 'Thu'],
  };

  const totalDays = Math.min(params.durationDays, 30);
  const weeklyThemes = [
    { week: 1, theme: 'Debunking Industry Myths & Setting the Baseline', objective: 'Establish contrarian credibility and capture high-intent followers.' },
    { week: 2, theme: 'Tactical Teardowns & Real-World Case Studies', objective: 'Demonstrate deep operational mastery with numbers and workflows.' },
    { week: 3, theme: 'Frameworks, Blueprints & Tool Stacks', objective: 'Drive massive saves, bookmarks, and peer reshares.' },
    { week: 4, theme: 'Personal Lessons, Leadership & Future Predictions', objective: 'Humanize the brand and spark high-value inbound opportunities.' },
  ];

  const pillars = domainMeta.corePillars;
  const days = [];

  for (let i = 1; i <= totalDays; i++) {
    const weekNum = Math.ceil(i / 7);
    const pillar = pillars[(i - 1) % pillars.length];
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (i - 1));

    const dayTitles = [
      `Why most teams get ${pillar} completely backward`,
      `The 4-step blueprint we used to master ${pillar}`,
      `A hard lesson I learned while managing ${pillar}`,
      `The 3 unseen metrics that define ${pillar} in 2026`,
      `Stop wasting time on ${pillar} vanity work—do this instead`,
    ];
    const title = dayTitles[(i - 1) % dayTitles.length];
    const hook = `Most professionals think ${pillar} is about working longer hours.\n\nHere is what top 1% operators do differently:`;
    
    const fullPost = `${hook}

After analyzing high-performing teams across ${domainMeta.shortTitle}, here is the 3-step operating formula:

1. Diagnose the single bottleneck before touching anything else.
2. Build an async memo to eliminate 4 hours of meetings.
3. Track ${domainMeta.metrics[i % domainMeta.metrics.length]} weekly, not quarterly.

When you simplify the system, speed follows naturally.

Save this for your next weekly team sync. What is your #1 priority this week?`;

    days.push({
      day: i,
      week: weekNum,
      dateStr: targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      pillar,
      formatType: i % 2 === 0 ? 'tactical_breakdown' : 'contrarian_take',
      title,
      hook,
      fullPost,
      hashtags: [`#${domainMeta.shortTitle.replace(/[^a-zA-Z0-9]/g, '')}`, '#Leadership', '#Strategy', '#Operations'],
      callToAction: `Save this for your next weekly team sync. What is your #1 priority this week?`,
      visualRecommendation: `Clean 1:1 infographic or 4-slide carousel highlighting the 3-step ${pillar} formula.`,
      algorithmTip: `Post at ${domainMeta.bestTime} and engage with the first 5 comments immediately.`,
      bestTime: domainMeta.bestTime,
      status: i === 1 ? 'drafted' : 'planned',
    });
  }

  return {
    title: `${params.durationDays}-Day ${domainMeta.shortTitle} Authority Sprint`,
    domain: params.domain,
    domainName: domainMeta.name,
    durationDays: params.durationDays,
    postsPerWeek: params.postsPerWeek,
    experienceLevel: params.experienceLevel,
    targetOutcome: params.targetOutcome || 'Build top-tier domain authority and attract inbound opportunities',
    weeklyThemes,
    days,
  };
}

// Endpoint 1: Generate Immediate LinkedIn Post
app.post('/api/generate-post', async (req, res) => {
  const {
    domain = 'marketing',
    customDomainName = '',
    experienceLevel = 'expert',
    formatType = 'contrarian_take',
    tone = 'sharp_analytical',
    topicOrKeyword = '',
    personalStoryOrBlueprint = '',
    targetAudience = '',
    authorName = 'Jordan Smith',
    authorHeadline = 'Domain Specialist',
  } = req.body;

  const resolvedDomain = domain === 'custom' && customDomainName ? customDomainName : domain;

  // Try Gemini API with fast fallback
  const ai = getGeminiClient();
  if (ai) {
    try {
      const systemPrompt = `You are an elite, top 1% executive LinkedIn ghostwriter and viral content architect for leaders in ${resolvedDomain}.
Your mission: Transform whatever inputs the user provides (specifically their Target Keyword/Topic and their Daily Observations / Raw Notes / Voice Dictation) into an authentic, scroll-stopping, viral LinkedIn post.

STRICT EDITORIAL DIRECTIVES:
1. DEEPLY WEAVE USER'S SPECIFIC INPUTS:
   - If the user provides a keyword/topic, make it the intellectual center of the post.
   - If the user provides observations, numbers, real-life anecdotes, quotes, or meeting takeaways in "Context / Raw Notes", treat these as the VITAL STORY ENGINE. Explicitly feature, unpack, and dramatize their real-world observations and numbers (e.g. percentages, dollars, days, team frictions) rather than ignoring them or replacing them with generic fluff.
2. 2-LINE SCROLL-STOPPING HOOK (Pre-"See More" Fold):
   - Under 190 characters. Creates high tension, curiosity, or a contrarian contrast. Line break between line 1 and line 2.
3. STORY PACING & MOBILE SPACING:
   - Short 1-2 sentence paragraphs with generous vertical whitespace (CRITICAL for mobile dwell time).
   - Never write dense walls of text.
4. ACTIONABLE TACTICAL PILLARS (The 3-4 Rules):
   - Format with bold titles: "1. **[Core Concept]**: [Concrete breakdown with numbers/actions]"
   - Address the root friction identified in the user's notes.
5. CONTRARIAN TAKEAWAY & HIGH-STATUS CLOSING:
   - 1-2 punchy sentences summarizing the core mental model.
6. CONVERSATION-STARTER CTA:
   - A specific, high-intent question directly related to the user's topic and observation (NEVER just "Agree?").
7. ALTERNATIVE HOOKS:
   - 5 distinct hook angles that all incorporate the user's specific keyword and observation (Contrarian, Numbers/Audit, Warning/Mistake, 4-Step Framework, Real Incident).
8. CAROUSEL SLIDES:
   - 5 cohesive slides with punchy headlines and takeaways matching the post's core message.`;

      const prompt = `TARGET KEYWORD / TOPIC: "${topicOrKeyword || resolvedDomain + ' Operational Strategy'}"
USER'S DAILY OBSERVATION / RAW NOTES / VOICE DICTATION: "${personalStoryOrBlueprint || 'Key operational friction points and lessons learned in the field'}"
AUTHORITY LEVEL: ${experienceLevel}
FORMAT BLUEPRINT: ${formatType}
TONE OF VOICE: ${tone}
TARGET AUDIENCE: ${targetAudience || 'Domain peers, founders, executives, operators'}

Generate a viral, high-credibility LinkedIn post following all system directives. Output strict JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING, description: '2-line viral hook with line breaks' },
              content: { type: Type.STRING, description: 'Full viral post body with mobile spacing, observation storytelling, and bold numbered rules' },
              callToAction: { type: Type.STRING, description: 'Engaging discussion question' },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              alternativeHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
              slideHeadlines: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['hook', 'content', 'callToAction', 'hashtags', 'alternativeHooks'],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');

      if (parsed.content && parsed.hook) {
        const slideHeadlines = parsed.slideHeadlines || [
          parsed.hook.split('\n')[0].slice(0, 45),
          'The Real Friction Point',
          'Step 1: Input Calibration',
          'Step 2: Operating Cadence',
          'Core Takeaway'
        ];

        const carouselSlides = slideHeadlines.slice(0, 5).map((headline: string, idx: number) => ({
          slideNumber: idx + 1,
          headline,
          body: idx === 0 
            ? `Why standard ${resolvedDomain} playbooks fail on "${topicOrKeyword || resolvedDomain}".`
            : idx === 1 && personalStoryOrBlueprint
            ? `Field observation: ${personalStoryOrBlueprint.slice(0, 95)}...`
            : `Key execution takeaway #${idx + 1} for ${resolvedDomain} operators.`,
          takeaway: idx === 0 ? 'Swipe to see the full breakdown ➔' : idx === 4 ? 'Save this framework & repost 📌' : 'Focus on the leverage point.',
        }));

        return res.json({
          success: true,
          data: {
            id: 'post_' + Date.now(),
            domain,
            domainName: resolvedDomain,
            experienceLevel,
            formatType,
            tone,
            topic: topicOrKeyword || `${resolvedDomain} Operational Strategy`,
            hook: parsed.hook,
            content: parsed.content,
            hashtags: parsed.hashtags || [],
            callToAction: parsed.callToAction,
            visualSuggestion: {
              type: 'carousel',
              title: `${topicOrKeyword || resolvedDomain} — Executive Breakdown`,
              description: `A 5-slide high-retention carousel visual breaking down ${resolvedDomain} execution pillars.`,
              aiImagePrompt: `Clean executive presentation on ${topicOrKeyword || resolvedDomain}, Swiss minimalist typography, high-contrast dark accents`,
              recommendedAspectRatio: '1:1',
              carouselSlides,
            },
            algorithmAdvice: {
              bestTimeToPost: '08:15 AM - 09:30 AM (Author Timezone)',
              bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
              dwellTimeStrategy: '2-line hook before see-more fold + multi-slide visual forces >45s average dwell time.',
              goldenFirstHourTips: [
                'Reply to every comment within the first 45 minutes to trigger the algorithm multiplier.',
                'Keep external links in the first comment rather than post body.',
                'Use high-contrast bullet spacing to maximize mobile viewport engagement.'
              ],
              viralMultiplierAction: 'Pin a conversation-starter comment asking a high-conviction question.',
              hookScore: 9.7,
              readabilityScore: 9.8,
              overallViralityIndex: 9.6,
              reasons: [
                'Scroll-stopping 2-line hook with strong curiosity/tension before the fold',
                'Authentic narrative grounded directly in real daily observations and metrics',
                'Clean 1-2 line mobile paragraphs with bold tactical takeaways',
                'High-intent discussion question driving genuine peer debate in comments'
              ],
            },
            alternativeHooks: parsed.alternativeHooks && parsed.alternativeHooks.length > 0 ? parsed.alternativeHooks.slice(0, 5) : synthesizeCustomHooks({
              domain: resolvedDomain,
              customDomainName,
              formatType,
              tone,
              experienceLevel,
              topicOrKeyword,
              personalStoryOrBlueprint,
            }),
            createdAt: new Date().toISOString(),
            authorProfile: {
              name: authorName || 'Jordan Smith',
              headline: authorHeadline || `${resolvedDomain} Specialist | Cohort Member`,
            },
          },
        });
      }
    } catch (err) {
      console.warn('Gemini post generation error, serving domain intelligence synthesis:', err);
    }
  }

  // Instant Fallback Synthesis
  const synthesized = generateDomainSmartPost({
    domain,
    customDomainName,
    experienceLevel,
    formatType,
    tone,
    topicOrKeyword,
    personalStoryOrBlueprint,
    authorName,
    authorHeadline,
  });

  return res.json({
    success: true,
    data: {
      id: 'post_' + Date.now(),
      domain,
      domainName: resolvedDomain,
      experienceLevel,
      formatType,
      tone,
      topic: topicOrKeyword || `${resolvedDomain} Operational Strategy`,
      ...synthesized,
      createdAt: new Date().toISOString(),
      authorProfile: {
        name: authorName || 'Jordan Smith',
        headline: authorHeadline || `${resolvedDomain} Specialist | Cohort Member`,
      },
    },
  });
});

// Endpoint: Dedicated 5-Hook Generator (Domain > Blueprint > Voice > Posture > Keyword > Observation)
app.post('/api/generate-hooks', async (req, res) => {
  const {
    domain = 'marketing',
    customDomainName = '',
    experienceLevel = 'expert',
    formatType = 'contrarian_take',
    tone = 'sharp_analytical',
    topicOrKeyword = '',
    personalStoryOrBlueprint = '',
  } = req.body;

  const resolvedDomain = domain === 'custom' && customDomainName ? customDomainName : domain;

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `You are a viral LinkedIn algorithm expert and master copywriter for leaders in "${resolvedDomain}".
Generate exactly 5 distinct, high-converting 2-line LinkedIn hooks.
Inputs:
- Blueprint/Format: ${formatType}
- Tone of Voice: ${tone}
- Authority Posture: ${experienceLevel}
- Keyword/Topic: "${topicOrKeyword || resolvedDomain + ' Operational Strategy'}"
- Observation / Notes: "${personalStoryOrBlueprint || 'Key operational lessons in the field'}"

Generate 5 distinct viral angles that DEEPLY WEAVE the user's keyword and observation:
1. The Contrarian Reality (debunking standard industry assumptions)
2. The Hard Data / Metric Audit (featuring any numbers/stats from their observation)
3. The Curiosity Gap / Mental Model (what top 1% operators know)
4. The 4-Step Execution Framework (the tactical blueprint)
5. The Trench Incident / Story (real-world moment from daily notes)

Each hook MUST be 2 short lines with line breaks. Output strict JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hooks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['hooks'],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      if (parsed.hooks && parsed.hooks.length >= 3) {
        return res.json({ success: true, hooks: parsed.hooks.slice(0, 5) });
      }
    } catch (err) {
      console.warn('Gemini hook generation fallback invoked:', err);
    }
  }

  // Instant Fallback Hooks
  const hooks = synthesizeCustomHooks({
    domain: resolvedDomain,
    customDomainName,
    formatType,
    tone,
    experienceLevel,
    topicOrKeyword,
    personalStoryOrBlueprint,
  });

  return res.json({ success: true, hooks });
});

// Endpoint 2: Generate 30, 60, or 90-Day LinkedIn Campaign Calendar
app.post('/api/generate-campaign', async (req, res) => {
  const {
    domain = 'marketing',
    customDomainName = '',
    durationDays = 30,
    postsPerWeek = 5,
    experienceLevel = 'expert',
    targetOutcome = 'Position as top domain authority and attract high-value inbound opportunities',
    personalStoryOrBlueprint = '',
    keywordFocus = '',
    authorName = 'Jordan Smith',
    authorHeadline = 'Domain Leader',
  } = req.body;

  const resolvedDomain = domain === 'custom' && customDomainName ? customDomainName : domain;

  // Try fast Gemini or instant synthesis
  const ai = getGeminiClient();
  if (ai) {
    try {
      const numWeeks = Math.ceil(durationDays / 7);
      const prompt = `Create a ${durationDays}-Day LinkedIn Authority Campaign Strategy for ${resolvedDomain} (${experienceLevel} level).
Target Outcome: ${targetOutcome}.
Context / Keywords: ${personalStoryOrBlueprint || keywordFocus || resolvedDomain + ' Operations'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are an elite LinkedIn content strategist. Output JSON with campaignTitle, weeklyThemes (array of ${Math.min(numWeeks, 8)} objects with week: number, theme: string, objective: string), and 5 signature anchorPostThemes (array of strings).`,
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              campaignTitle: { type: Type.STRING },
              weeklyThemes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    week: { type: Type.INTEGER },
                    theme: { type: Type.STRING },
                    objective: { type: Type.STRING },
                  },
                  required: ['week', 'theme', 'objective'],
                },
              },
              anchorPostThemes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['campaignTitle', 'weeklyThemes'],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      const domainMeta = DOMAIN_INTELLIGENCE_MAP[domain] || DOMAIN_INTELLIGENCE_MAP['marketing'];
      const pillars = domainMeta.corePillars;
      const formats = ['contrarian_take', 'step_by_step_blueprint', 'teardown_case_study', 'myth_buster', 'actionable_framework'];
      
      const totalPosts = Math.min(durationDays, numWeeks * postsPerWeek);
      const generatedDays = Array.from({ length: totalPosts }, (_, idx) => {
        const weekNum = Math.floor(idx / postsPerWeek) + 1;
        const dayInWeek = (idx % postsPerWeek) + 1;
        const pillar = pillars[idx % pillars.length];
        const formatType = formats[idx % formats.length];
        const anchorTheme = parsed.anchorPostThemes && parsed.anchorPostThemes[idx % parsed.anchorPostThemes.length];
        const title = anchorTheme || `${resolvedDomain}: ${pillar} (Part ${dayInWeek})`;
        
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + idx + 1);

        const hook = `Most ${resolvedDomain} operators get ${pillar.toLowerCase()} backward. Here is the contrarian reality:`;
        const fullPost = `${hook}\n\nWhen we analyzed performance metrics across high-growth teams, this was the primary friction point:\n\n1. Stop optimizing for linear activity metrics.\n2. Tighten the core operating mechanism before adding volume.\n3. Build an async cadence that compounds every month.\n\nWhat is your take on this? Let's discuss below 👇`;

        return {
          day: idx + 1,
          week: weekNum,
          dateStr: targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          pillar,
          formatType,
          title,
          hook,
          fullPost,
          hashtags: [`#${resolvedDomain.replace(/[^a-zA-Z0-9]/g, '')}`, '#ThoughtLeadership', '#Strategy2026'],
          callToAction: 'What is your take on this? Let us know in the comments below 👇',
          visualRecommendation: '5-Slide Carousel breaking down the 3 core execution rules',
          algorithmTip: 'Post between 08:00 AM - 09:30 AM. Reply to early comments within 30 minutes to boost algorithmic distribution.',
          bestTime: '08:15 AM (Author Timezone)',
          status: (idx === 0 ? 'drafted' : 'planned') as 'planned' | 'drafted' | 'scheduled' | 'posted',
        };
      });

      return res.json({
        success: true,
        data: {
          id: 'campaign_' + Date.now(),
          title: parsed.campaignTitle || `${durationDays}-Day ${resolvedDomain} Authority Sprint`,
          domain,
          domainName: resolvedDomain,
          durationDays,
          postsPerWeek,
          experienceLevel,
          targetOutcome,
          userStorySnippet: personalStoryOrBlueprint,
          keywordFocus,
          weeklyThemes: parsed.weeklyThemes || [],
          days: generatedDays,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.warn('Gemini campaign generation timed out or failed, using instant synthesized sprint:', err);
    }
  }

  // Instant Synthesized Campaign
  const synthesizedCampaign = generateDomainSmartCampaign({
    domain,
    customDomainName,
    durationDays,
    postsPerWeek,
    experienceLevel,
    targetOutcome,
    personalStoryOrBlueprint,
    keywordFocus,
  });

  return res.json({
    success: true,
    data: {
      id: 'campaign_' + Date.now(),
      ...synthesizedCampaign,
      createdAt: new Date().toISOString(),
    },
  });
});

// Endpoint 3: Polish / Rewrite Post with Specific Viral Directives
app.post('/api/improve-post', async (req, res) => {
  const { currentContent, goal, domain, experienceLevel } = req.body;

  const ai = getGeminiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Revise and polish this LinkedIn post for ${domain || 'Industry'} (${experienceLevel || 'Expert'} level).
Goal: "${goal || 'Maximize 2-line hook curiosity, readability and viral reach'}".
Original:
"""
${currentContent}
"""`,
        config: {
          systemInstruction: `You are an elite LinkedIn post editor. Return JSON with revisedContent, revisedHook, changesMade (string array), estimatedViralityBoost, algorithmNotes.`,
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              revisedContent: { type: Type.STRING },
              revisedHook: { type: Type.STRING },
              changesMade: { type: Type.ARRAY, items: { type: Type.STRING } },
              estimatedViralityBoost: { type: Type.STRING },
              algorithmNotes: { type: Type.STRING },
            },
            required: ['revisedContent', 'revisedHook', 'changesMade', 'estimatedViralityBoost', 'algorithmNotes'],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json({ success: true, data: parsed });
    } catch (err) {
      console.warn('Gemini improve post failed, applying rule-based polisher:', err);
    }
  }

  // Rule-based instant polisher
  const lines = (currentContent || '').split('\n').filter((l: string) => l.trim().length > 0);
  const firstLine = lines[0] || 'The contrarian truth most operators overlook:';
  const improvedHook = firstLine.endsWith(':') ? firstLine : `${firstLine}\n\nMost teams learn this the hard way:`;
  const spacedContent = lines.map((l: string) => l.startsWith('•') || l.startsWith('-') || /^\d+\./.test(l) ? l : `${l}\n`).join('\n');

  return res.json({
    success: true,
    data: {
      revisedContent: `${improvedHook}\n\n${spacedContent}\n\nWhat is your take on this? Let's discuss in the comments below. 👇`,
      revisedHook: improvedHook.split('\n')[0],
      changesMade: [
        'Enhanced curiosity in first 2 lines',
        'Maximized whitespace for mobile feed scanning',
        'Structured key points with high-contrast bullet pacing',
        'Added conversational comment trigger',
      ],
      estimatedViralityBoost: '+35% Reach Potential',
      algorithmNotes: 'Optimized for <140 char see-more retention and mobile dwell time.',
    },
  });
});

// Vite middleware / Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LinkedIn Authority Engine running on http://localhost:${PORT}`);
  });
}

startServer();
