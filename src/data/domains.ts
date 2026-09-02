import { DomainMeta, ExperienceLevel, PostFormatType, PostTone } from '../types';

export const DOMAINS_DATA: DomainMeta[] = [
  {
    id: 'product',
    name: 'Product Management, Strategy & UX',
    shortTitle: 'Product (PM & UX)',
    tagline: 'Outcome roadmaps, PLG time-to-value, north star metric alignment, PRD teardowns & retention loops',
    iconName: 'Boxes',
    color: 'indigo',
    corePillars: [
      'Feature Factory Trap vs Outcome-Driven Roadmaps',
      'Product-Led Growth (PLG) & Time-to-Value (TTV) Acceleration',
      'North Star Metrics & Leading Input vs Lagging Output KPIs',
      'User Retention Cohort Decay & Churn Diagnostics',
      '1-Page PRD Architecture & Cross-Functional Engineering Alignment',
      'AI UX Patterns, Copilots & Context-Aware Workflows'
    ],
    unseenFacts: [
      'Over 64% of features built in enterprise software are rarely or never used by end users (Pendo Benchmark).',
      'Decreasing Time-to-Value (TTV) during user onboarding by just 15 minutes increases Day-30 retention by up to 28%.',
      'The "Loudest Customer Fallacy": Building custom features requested by your top 2 enterprise accounts often damages product-market fit for the next 100 customers.',
      'High-performing Product Teams spend 40% of their discovery cycles invalidating assumptions before writing a single line of code.',
      'Leading input metrics (e.g. weekly collaborative canvas edits) predict 12-month net revenue retention 4x better than CSAT scores.'
    ],
    trendingHooks: [
      '64% of product features shipped never get used. Here is how top 1% PMs stop building in the dark:',
      'We killed our most requested feature after auditing 10,000 user sessions. Here is the contrarian data why:',
      'The 1-page PRD format that replaced 40-page Jira specs and doubled our engineering ship velocity:',
      'Product-Led Growth is not a pricing model—it’s an onboarding physics problem. Here is the 4-step framework:',
      'If your product team is measured on "features shipped" instead of "metric moved", you are running a feature factory:'
    ],
    sampleTopics: [
      {
        title: 'How to escape the Feature Factory: The Outcome-Driven Roadmap framework',
        type: 'contrarian_take',
        promptSnippet: 'Break down why tracking velocity and feature count kills product quality, and how to transition to metric-driven outcome bets.'
      },
      {
        title: 'The 1-page PRD memo: How to align Eng, Design, and GTM in 15 minutes',
        type: 'actionable_framework',
        promptSnippet: 'Step-by-step 1-page product requirement document template focusing on problem statement, non-goals, user friction, and success metrics.'
      },
      {
        title: 'Why your activation rate drops after signup (and how to fix Time-to-Value)',
        type: 'teardown_case_study',
        promptSnippet: 'Case study auditing user onboarding drop-off, removing cognitive drag, and engineering an instant "Aha!" moment.'
      },
      {
        title: 'Input Metrics vs Output Metrics: Why focusing on ARR blinds product teams',
        type: 'data_insight',
        promptSnippet: 'Explain why lagging output metrics cannot be managed directly and how leading input metrics drive compounding product growth.'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing & Growth Strategy',
    shortTitle: 'Marketing',
    tagline: 'Brand moats, acquisition economics, organic growth loops & conversion psych',
    iconName: 'TrendingUp',
    color: 'blue',
    corePillars: [
      'CAC to LTV Economics & Attribution Reality',
      'Brand Moat vs Performance Trap',
      'Dark Social & Word of Mouth Loops',
      'Buyer Psychology & Frictionless Funnels',
      'Category Creation vs Category Capture'
    ],
    unseenFacts: [
      'Over 74% of B2B purchase journeys happen in "Dark Social" (Slack groups, DMs, podcasts) before a lead ever fills out a CRM form.',
      'The "Performance Trap": Brands spending >75% of budget on direct-response ads see customer acquisition costs rise by 40-70% year-over-year without brand equity.',
      'Cognitive load in landing page headers reduces demo conversions by 31% for every additional conceptual idea packed above the fold.',
      'Zero-click content on LinkedIn generates 3.2x higher qualified profile clicks than posts with external links in the body.'
    ],
    trendingHooks: [
      'Stop running ads until you can answer this single 6-word question:',
      'We audited $4.2M in marketing spend last quarter. 82% of it was wasted on this vanity metric:',
      'The best marketers don’t sell products. They sell a new identity. Here is the 4-step framework:',
      'Most B2B companies are playing 2019 marketing in 2026. Here is what changed:'
    ],
    sampleTopics: [
      {
        title: 'Why performance marketing is hitting a ceiling in 2026',
        type: 'contrarian_take',
        promptSnippet: 'Explain why pure performance marketing without organic brand presence fails, and outline the 60/40 Brand-to-Demand allocation model.'
      },
      {
        title: 'The exact 5-stage B2B dark social attribution playbook',
        type: 'step_by_step_blueprint',
        promptSnippet: 'Provide a blueprint on tracking and leveraging dark social channels (podcasts, private communities, LinkedIn influence).'
      },
      {
        title: 'How we reduced CAC by 42% by killing our gated whitepapers',
        type: 'teardown_case_study',
        promptSnippet: 'Case study breaking down un-gating content to accelerate pipeline velocity and build high intent.'
      }
    ]
  },
  {
    id: 'founders_office',
    name: 'Founders Office & Chief of Staff',
    shortTitle: 'Founders Office / CoS',
    tagline: 'Executive decision velocity, resource allocation, OKR orchestration & scaling chaos',
    iconName: 'Briefcase',
    color: 'emerald',
    corePillars: [
      'Executive Decision Architecture & Velocity',
      'Cross-functional Chaos Containment',
      'Board Deck Strategy & Investor Updates',
      'Strategic Resource & Capital Prioritization',
      '0-to-1 Incubation within Growth-stage Companies'
    ],
    unseenFacts: [
      '80% of a Chief of Staff’s leverage comes from filtering the bottom 90% of meetings out of the CEO’s calendar before they occur.',
      'A one-day delay in executive decision turnaround at 50-person scale compounds into a 3-week delivery slip across sprint teams.',
      'The most lethal failure mode of Founder’s Office is becoming a glorified executive assistant instead of an operational surrogate with decision authority.',
      'Top-tier CoS professionals use a "Two-Way Door vs One-Way Door" memo format to cut executive meeting time by 60%.'
    ],
    trendingHooks: [
      'The Chief of Staff role is the most misunderstood job in tech. Here is what I actually do all week:',
      'If your CEO is attending more than 12 hours of internal meetings per week, your company has an operational bug:',
      'I analyzed 50 Board Decks from Series A to Series C. The winning ones all follow this 5-slide cadence:',
      'How to resolve high-stakes conflict between Product and Sales in under 30 minutes (Founder’s Office Playbook):'
    ],
    sampleTopics: [
      {
        title: 'The Operating Cadence Memo that eliminated 8 hours of executive syncs',
        type: 'actionable_framework',
        promptSnippet: 'Walk through the asynchronous executive update framework used by elite Chiefs of Staff.'
      },
      {
        title: 'How to manage up: Guiding a visionary founder without slowing down velocity',
        type: 'personal_war_story',
        promptSnippet: 'Share principles for managing high-energy visionary founders, handling rapid context switches, and maintaining alignment.'
      },
      {
        title: 'The 30-60-90 day survival blueprint for a new Chief of Staff',
        type: 'step_by_step_blueprint',
        promptSnippet: 'Detailed roadmap for building trust, auditing internal bottlenecks, and earning operational mandate.'
      }
    ]
  },
  {
    id: 'finance_vc_ib',
    name: 'Finance — VC & Investment Banking',
    shortTitle: 'Finance (VC & IB)',
    tagline: 'Cap table architecture, deal dynamics, valuation multiples, LP relations & M&A mechanics',
    iconName: 'DollarSign',
    color: 'indigo',
    corePillars: [
      'Unit Economics & Burn Multiple Teardowns',
      'Venture Capital Term Sheet Nuances & Liquidation Traps',
      'M&A Valuation Multiples & Quality of Earnings (QoE)',
      'LBO Bridge Models & Capital Structure Design',
      'LP Sentiment & Private Capital Market Cycles'
    ],
    unseenFacts: [
      'Participating preferred shares with 2x liquidation preferences can wipe out common shareholders even in an exit above last-round valuation.',
      'Over 60% of VC returns in top quartile funds are generated by just 1 or 2 outlier portfolio investments (Power Law distribution).',
      'In Investment Banking M&A, the biggest deal killer is not EBITDA discrepancy, but unaddressed customer concentration risk in QoE reports.',
      'Burn Multiple (Net Burn / Net New ARR) < 1.0x separates elite capital-efficient software businesses from companies destined for flat/down rounds.'
    ],
    trendingHooks: [
      'A founder showed me a term sheet that looked like a $40M valuation win. It was actually a financial landmine:',
      'If your Burn Multiple is above 1.8x in today’s capital climate, you aren’t investing in growth—you’re burning equity:',
      'The 7 line-items every VC analyst scrutinizes in the first 90 seconds of opening a financial model:',
      'Investment Banking taught me how deals really get closed. Here are 4 negotiation levers they don’t teach in business school:'
    ],
    sampleTopics: [
      {
        title: 'Demystifying the Waterfall: How liquidation preferences actually pay out',
        type: 'teardown_case_study',
        promptSnippet: 'Break down a real exit scenario with 1x non-participating vs 2x participating preferred shares and what founders take home.'
      },
      {
        title: 'The 5 financial metrics that determine your valuation multiple in 2026',
        type: 'data_insight',
        promptSnippet: 'Analysis of rule of 40, net revenue retention (NRR), gross margin profile, and payback period.'
      },
      {
        title: 'How to build an investment thesis from scratch in a contrarian niche',
        type: 'step_by_step_blueprint',
        promptSnippet: 'Framework used by VC associates and principals to source non-consensus high-conviction deals.'
      }
    ]
  },
  {
    id: 'operations_supply_chain',
    name: 'Operations & Supply Chain',
    shortTitle: 'Ops & Supply Chain',
    tagline: 'Bullwhip effect, logistics resilience, inventory turns, 3PL contracts & warehouse automation',
    iconName: 'Layers',
    color: 'amber',
    corePillars: [
      'Inventory Optimization & Working Capital Velocity',
      'The Bullwhip Effect & Demand Forecasting Glitches',
      '3PL vs In-House Fulfillment Unit Economics',
      'Nearshoring & Dual-Sourcing Risk Architecture',
      'Warehouse Automation & Bottleneck Diagnostics (Theory of Constraints)'
    ],
    unseenFacts: [
      'A 5% reduction in supply chain lead times can unlock up to 25% in freed-up working capital across high-SKU operations.',
      'The Bullwhip Effect: A 5% fluctuation in consumer retail demand typically amplifies into a 40% swing at raw material tier-3 suppliers.',
      'Hidden 3PL "accessorial fees" (carton sorting, pallet shrink-wrap, peak surcharges) silently erode 8-14% of gross product margins.',
      'Applying Goldratt’s Theory of Constraints to fulfillment centers increases line throughput by 30% without buying additional machinery.'
    ],
    trendingHooks: [
      'Most supply chain disasters don’t start at the port. They start inside this innocent-looking Excel spreadsheet:',
      'We audited a $30M direct-to-consumer brand’s 3PL invoice. We discovered $180k in hidden fees they paid for 2 years straight:',
      'Just-in-Time (JIT) manufacturing is dead. Here is the "Just-in-Case" resilience framework replacing it:',
      'If you have more than 90 days of inventory sitting in your warehouse, your working capital is slowly bleeding:'
    ],
    sampleTopics: [
      {
        title: 'The 3PL master contract negotiation checklist: 8 traps to strike out',
        type: 'actionable_framework',
        promptSnippet: 'Provide a tactical checklist for vetting 3PL providers, SLAs, inventory shrinkage allowances, and fuel surcharges.'
      },
      {
        title: 'How we solved a 4-week warehouse bottleneck using the Theory of Constraints',
        type: 'teardown_case_study',
        promptSnippet: 'Case study identifying the single constraint in a packing line to boost daily shipments by 45%.'
      },
      {
        title: 'How to calculate your true Inventory Carrying Cost (beyond storage rent)',
        type: 'step_by_step_blueprint',
        promptSnippet: 'Breakdown of opportunity cost, obsolescence, insurance, and handling costs for operations leaders.'
      }
    ]
  },
  {
    id: 'sports_management',
    name: 'Sports Management & Athletics Business',
    shortTitle: 'Sports Management',
    tagline: 'Athlete IP monetization, NIL ecosystems, franchise valuation multiples & fan unit economics',
    iconName: 'Trophy',
    color: 'orange',
    corePillars: [
      'NIL (Name, Image, Likeness) Contract Architecture',
      'Sports Franchise Valuation & Private Equity Inflows',
      'Direct-to-Consumer Streaming & Broadcast Rights Shifts',
      'Stadium Real Estate & Mixed-Use District Economics',
      'Athlete Brand Venturing & Equity Deal Structuring'
    ],
    unseenFacts: [
      'Over 60% of modern sports franchise valuation growth over the last decade has been driven by real estate surrounding the venue, not ticket sales.',
      'Top collegiate NIL athletes are now operating multi-member LLCs with equity earn-outs, shifting the talent agency model forever.',
      'Tier-1 sports rights are the final fortress keeping live streaming bundles together, commanding 3x ad CPMs compared to scripted entertainment.',
      'Fan lifetime value (LTV) increases by 240% when a fan attends their first live game before the age of 12.'
    ],
    trendingHooks: [
      'The biggest revenue driver for modern sports teams is no longer ticket sales. It is this unexpected real estate play:',
      'Why private equity is pouring billions into sports franchises (and the hidden risks nobody is talking about):',
      'I broke down how an elite athlete structured a $5M endorsement deal into 40% equity. The math is brilliant:',
      'The death of regional sports networks is accelerating. Here is who will own sports media by 2028:'
    ],
    sampleTopics: [
      {
        title: 'How modern sports teams build real estate districts to 10x franchise value',
        type: 'teardown_case_study',
        promptSnippet: 'Teardown of stadium-anchored mixed-use developments (The Battery Atlanta, SoFi Hollywood Park).'
      },
      {
        title: 'The Athlete IP Playbook: Transitioning from paid influencer to equity co-founder',
        type: 'step_by_step_blueprint',
        promptSnippet: 'Strategic guide for sports managers structuring long-term athlete cap table participations.'
      },
      {
        title: 'Why European Football club ownership is a financial nightmare vs US franchise models',
        type: 'contrarian_take',
        promptSnippet: 'Compare the closed-league revenue-sharing franchise model against relegation risk and player wage inflation in Europe.'
      }
    ]
  },
  {
    id: 'hr_org_structure',
    name: 'HR, People Ops & Org Structure',
    shortTitle: 'HR & Org Structure',
    tagline: 'Span of control, compensation transparency, talent density, async culture & retention engineering',
    iconName: 'Users',
    color: 'purple',
    corePillars: [
      'Span of Control & Flatter Org Design Architecture',
      'Talent Density vs Headcount Empire Building',
      'Pay Transparency, Equity Bands & Compensation Psychology',
      'Asynchronous Work Architecture & Knowledge Base Discipline',
      'Performance Management without Meaningless 40-Page Reviews'
    ],
    unseenFacts: [
      'Organizations with managerial spans of control under 1:4 suffer from 3x higher inter-departmental communication latency.',
      'Pay transparency laws have led to a 22% narrowing of gender wage gaps, but increased voluntary turnover among top 5% individual contributors if merit bands aren’t strictly defined.',
      'The "Peter Principle" costs tech companies an estimated $1.2M per mis-promoted engineering or sales director in team attrition.',
      'Replacing annual performance reviews with bi-weekly 15-minute calibration check-ins boosts employee retention by 28%.'
    ],
    trendingHooks: [
      'Most companies don’t have a culture problem. They have a 1:3 manager-to-report ratio problem:',
      'Why we scrapped our 360-degree annual performance reviews and replaced them with a 2-question fortnightly memo:',
      'The "Empire Builder" manager trap: How middle managers accidentally destroy company margins to look important:',
      'How to design salary bands that high-performers respect (without causing internal civil war when made public):'
    ],
    sampleTopics: [
      {
        title: 'The Span of Control audit: How to remove 2 layers of management in 60 days',
        type: 'actionable_framework',
        promptSnippet: 'Framework for evaluating managerial ratios, IC autonomy, and removing approval bottlenecks.'
      },
      {
        title: 'How to build an asynchronous onboarding engine that gets new hires productive on Day 3',
        type: 'step_by_step_blueprint',
        promptSnippet: 'Blueprint for handbook-first documentation, shadowing templates, and first-week win projects.'
      },
      {
        title: 'Talent Density over Headcount: Why a team of 4 A-players beats a bloated team of 15',
        type: 'contrarian_take',
        promptSnippet: 'Contrarian analysis of headcount as a vanity metric vs revenue-per-employee and autonomous decision-making.'
      }
    ]
  }
];

export const EXPERIENCE_LEVELS: {
  id: ExperienceLevel;
  title: string;
  badge: string;
  description: string;
  toneStyle: string;
  focusMessage: string;
  exampleHook: string;
}[] = [
  {
    id: 'rookie',
    title: 'Rookie / First-Time Poster',
    badge: 'Beginner Friendly',
    description: 'Starting out, transparent learner, asking insightful questions, documenting foundational lessons with curiosity.',
    toneStyle: 'Relatable, humble, curious, documenting the journey, asking for cohort perspective.',
    focusMessage: 'Build credibility through honesty, genuine curiosity, and documenting key "aha" moments as you learn.',
    exampleHook: 'I just transitioned into [Domain]. Here are 3 things they never taught us in school that blew my mind:'
  },
  {
    id: 'amateur',
    title: 'Amateur / Rising Practitioner',
    badge: 'Hands-on Operator',
    description: '1-3 years in the trenches, testing frameworks, running real experiments, sharing live tactical lessons and checklists.',
    toneStyle: 'Practical, experiment-driven, actionable, data-backed observations from daily work.',
    focusMessage: 'Share what worked vs what failed in real projects to build reputation as a reliable, hands-on doer.',
    exampleHook: 'We tested 3 different workflows for [Problem] last month. 2 failed miserably, but 1 increased speed by 40%:'
  },
  {
    id: 'expert',
    title: 'Expert / Domain Lead',
    badge: 'Strategic Authority',
    description: '4-8+ years of depth, developing proprietary playbooks, deconstructing industry trends, teaching systems thinking.',
    toneStyle: 'Authoritative, sharp, analytical, framework-heavy, high pattern recognition.',
    focusMessage: 'Establish thought leadership by breaking complex domain mechanics down into clear 2x2 matrices and checklists.',
    exampleHook: 'After analyzing 40+ [Domain] setups over 5 years, here is the exact 4-part operating framework I install on Day 1:'
  },
  {
    id: 'professional',
    title: 'Professional / Industry Veteran',
    badge: 'Executive / Insider',
    description: 'Senior Director, VP, Partner or Founder level. Unfiltered war stories, macro-economic shifts, contrarian truths, boardroom dynamics.',
    toneStyle: 'Sophisticated, visionary, contrarian, boardroom-tested, strategic capital & talent allocation perspective.',
    focusMessage: 'Provide unmatched high-altitude clarity, calling out industry sacred cows and sharing high-stakes lessons.',
    exampleHook: 'The biggest lie told in [Domain] boardrooms today is [Common Myth]. Here is the cold, uncomfortable math why:'
  }
];

export const POST_FORMATS: {
  id: PostFormatType;
  title: string;
  shortDesc: string;
  icon: string;
  recommendedVisual: string;
}[] = [
  {
    id: 'contrarian_take',
    title: 'Contrarian Take / Myth Buster',
    shortDesc: 'Challenge common industry advice with logical proof and better alternatives.',
    icon: 'Flame',
    recommendedVisual: 'Bold statement text card or side-by-side "Conventional vs Reality" comparison.'
  },
  {
    id: 'teardown_case_study',
    title: 'Teardown / Deep Case Study',
    shortDesc: 'Deconstruct a specific company, deal, campaign, or operational breakdown with exact numbers.',
    icon: 'Search',
    recommendedVisual: 'Annotated screenshot, flow diagram, or multi-slide carousel teardown.'
  },
  {
    id: 'step_by_step_blueprint',
    title: 'Step-by-Step Tactical Blueprint',
    shortDesc: 'Actionable 1-2-3-4 system that someone can execute immediately in their own job.',
    icon: 'ListChecks',
    recommendedVisual: 'Numbered process diagram or downloadable cheat-sheet graphic.'
  },
  {
    id: 'personal_war_story',
    title: 'Personal War Story & Lesson',
    shortDesc: 'A vulnerable high-stakes mistake, obstacle, or turning point with universal takeaways.',
    icon: 'BookOpen',
    recommendedVisual: 'Authentic candid workplace photo or clean quote card.'
  },
  {
    id: 'actionable_framework',
    title: '2x2 Matrix / Decision Framework',
    shortDesc: 'A mental model that simplifies high-stakes choices for executives and teams.',
    icon: 'Grid',
    recommendedVisual: '2x2 quadrant matrix or decision-tree flowchart.'
  },
  {
    id: 'carousel_slide_deck',
    title: 'Multi-Slide Carousel Script',
    shortDesc: 'Slide-by-slide visual storytelling engineered for maximum LinkedIn dwell time & PDF downloads.',
    icon: 'Sliders',
    recommendedVisual: '6-8 slide high-contrast carousel PDF.'
  },
  {
    id: 'data_insight',
    title: 'Data Benchmark & Unseen Fact',
    shortDesc: 'Surprising industry data points, benchmark metrics, and what they mean for the future.',
    icon: 'BarChart2',
    recommendedVisual: 'High-contrast clean bar/line chart or single standout stat callout card.'
  }
];

export const POST_TONES: { id: PostTone; title: string; desc: string }[] = [
  {
    id: 'sharp_analytical',
    title: 'Sharp & Analytical',
    desc: 'Crisp, data-dense, structured with clean bullet points and zero fluff.'
  },
  {
    id: 'conversational_story',
    title: 'Conversational & Story-Driven',
    desc: 'Engaging, narrative rhythm, relatable dialogue, warm tone.'
  },
  {
    id: 'bold_provocative',
    title: 'Bold & Provocative',
    desc: 'Punchy one-liners, contrarian stakes, wakes up the LinkedIn feed.'
  },
  {
    id: 'executive_authoritative',
    title: 'Executive & Boardroom',
    desc: 'Strategic, calm, high-altitude insights tailored for C-suite peers.'
  },
  {
    id: 'vulnerable_authentic',
    title: 'Vulnerable & Transparent',
    desc: 'Shares real mistakes, unglamorous truths, and genuine reflections.'
  },
  {
    id: 'tactical_teacher',
    title: 'Tactical Mentor & Teacher',
    desc: 'Encouraging, step-by-step guidance designed to empower cohort members.'
  }
];

export const LINKEDIN_ALGORITHM_PLAYBOOK = {
  dwellTimeFactors: [
    { title: 'The 2-Line "See More" Rule', desc: 'The first 120-140 characters determine 90% of click-throughs. If users do not tap "…see more", LinkedIn penalizes the post distribution within 15 minutes.' },
    { title: 'Slide Carousels (PDF Documents)', desc: 'Carousels average 3.2x higher dwell time because users spend 15-45 seconds swiping through slides, triggering LinkedIn’s high-quality content multiplier.' },
    { title: 'The Golden 60-Minute Window', desc: 'The algorithm evaluates the velocity of meaningful comments (>5 words) in the first 60 minutes after publishing. Reply to every comment within 10-15 minutes with a follow-up question.' },
    { title: 'Outbound Links Penalty', desc: 'Never put outbound links directly in the main post text. Either place them in the 1st pinned comment, or use the "link in my profile / bio" pattern, or edit the link in 10 minutes after posting.' },
    { title: 'Optimal Text Formatting', desc: 'Break paragraphs into 1-2 lines maximum. Use whitespace rhythm. Avoid dense walls of text on mobile screens.' },
    { title: 'Strategic Hashtags', desc: 'Use 3-5 relevant, niche-specific hashtags at the very bottom. Over 6 hashtags flags spam filters.' }
  ],
  postingTimeMatrix: [
    { domain: 'Finance & VC / IB', bestTime: '07:30 AM – 09:00 AM (Tue, Wed, Thu)', rationale: 'Morning market prep and commute before deal calls begin.' },
    { domain: 'Founders Office & CoS', bestTime: '08:00 AM – 10:30 AM (Mon, Tue, Thu)', rationale: 'Executives review high-level strategic posts during morning planning blocks.' },
    { domain: 'Marketing & Growth', bestTime: '11:30 AM – 01:30 PM (Tue, Wed, Thu)', rationale: 'Marketers browse during lunch breaks and afternoon strategy brainstorming.' },
    { domain: 'Operations & Supply Chain', bestTime: '06:30 AM – 08:30 AM (Mon, Wed, Fri)', rationale: 'Early risers who check operational digests before shift start and warehouse handoffs.' },
    { domain: 'HR & Org Structure', bestTime: '09:00 AM – 11:30 AM (Tue, Thu)', rationale: 'People leaders review leadership and culture content during morning recruiting blocks.' },
    { domain: 'Sports Management', bestTime: '12:00 PM – 03:00 PM (Wed, Thu, Sun)', rationale: 'Midday and weekend game-cycle peaks when sports business news breaks.' }
  ]
};
