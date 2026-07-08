/**
 * Milestone 7 learning content seeds (publication-quality reference material).
 * Consumed by scripts/build-learning-m7.js — dev-only.
 */

const resources = [
  {
    id: 'adobe-aem-docs',
    title: 'Adobe Experience Manager product documentation',
    url: 'https://experienceleague.adobe.com/docs/experience-manager.html',
    type: 'official-docs'
  },
  {
    id: 'adobe-aem-cloud',
    title: 'AEM as a Cloud Service overview',
    url: 'https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/overview/introduction.html',
    type: 'official-docs'
  },
  { id: 'adobe-eds', title: 'Edge Delivery Services documentation', url: 'https://www.aem.live/docs/', type: 'official-docs' },
  {
    id: 'adobe-htl-spec',
    title: 'HTL specification',
    url: 'https://experienceleague.adobe.com/docs/experience-manager-htl/using/overview.html',
    type: 'official-docs'
  },
  { id: 'adobe-sling', title: 'Apache Sling documentation', url: 'https://sling.apache.org/documentation.html', type: 'official-docs' },
  {
    id: 'adobe-dispatcher',
    title: 'Dispatcher configuration reference',
    url: 'https://experienceleague.adobe.com/docs/experience-manager-dispatcher/using/dispatcher.html',
    type: 'official-docs'
  },
  {
    id: 'adobe-core-components',
    title: 'AEM Core Components',
    url: 'https://experienceleague.adobe.com/docs/experience-manager-core-components/using/introduction.html',
    type: 'official-docs'
  },
  {
    id: 'adobe-aep',
    title: 'Adobe Experience Platform overview',
    url: 'https://experienceleague.adobe.com/docs/experience-platform.html',
    type: 'official-docs'
  },
  {
    id: 'adobe-graphql',
    title: 'AEM GraphQL persisted queries',
    url: 'https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/headless/setup-graphql.html',
    type: 'official-docs'
  },
  {
    id: 'adobe-dev-tools',
    title: 'AEM Developer Tools & local SDK',
    url: 'https://experienceleague.adobe.com/docs/experience-manager-65/content/implementing/developing/introduction/the-basics.html',
    type: 'official-docs'
  },
  {
    id: 'wknd-tutorial',
    title: 'WKND Developer Tutorial',
    url: 'https://experienceleague.adobe.com/docs/experience-manager-learn/getting-started-wknd-tutorial-develop/overview.html',
    type: 'course'
  },
  {
    id: 'adobe-target-docs',
    title: 'Adobe Target documentation',
    url: 'https://experienceleague.adobe.com/docs/target/using/target.html',
    type: 'official-docs'
  }
];

const technologies = [
  {
    id: 'aem-sites',
    name: 'AEM Sites',
    category: 'CMS',
    difficulty: 'Intermediate',
    summary: 'Enterprise web content management: pages, templates, components, and multi-site authoring.',
    prerequisites: [],
    resourceIds: ['adobe-aem-docs', 'wknd-tutorial']
  },
  {
    id: 'aem-assets',
    name: 'AEM Assets',
    category: 'DAM',
    difficulty: 'Intermediate',
    summary: 'Digital asset management, metadata schemas, renditions, and brand portals.',
    prerequisites: ['aem-sites'],
    resourceIds: ['adobe-aem-docs']
  },
  {
    id: 'aem-forms',
    name: 'AEM Forms',
    category: 'Forms',
    difficulty: 'Advanced',
    summary: 'Adaptive forms, document services, and workflow-driven capture experiences.',
    prerequisites: ['aem-sites'],
    resourceIds: ['adobe-aem-docs']
  },
  {
    id: 'aem-cloud',
    name: 'AEM as a Cloud Service',
    category: 'Platform',
    difficulty: 'Advanced',
    summary: 'Cloud-native AEM: rapid release cadence, Cloud Manager pipelines, and immutable containers.',
    prerequisites: ['aem-sites'],
    resourceIds: ['adobe-aem-cloud']
  },
  {
    id: 'sling',
    name: 'Apache Sling',
    category: 'Framework',
    difficulty: 'Intermediate',
    summary: 'RESTful resource-oriented framework underpinning AEM request processing and scripts.',
    prerequisites: [],
    resourceIds: ['adobe-sling']
  },
  {
    id: 'osgi',
    name: 'OSGi',
    category: 'Framework',
    difficulty: 'Intermediate',
    summary: 'Modular Java services in AEM: bundles, configurations, and lifecycle management.',
    prerequisites: ['sling'],
    resourceIds: ['adobe-aem-docs']
  },
  {
    id: 'htl',
    name: 'HTL (Sightly)',
    category: 'Templating',
    difficulty: 'Beginner',
    summary: 'HTML Template Language for secure, readable AEM component markup.',
    prerequisites: ['aem-sites'],
    resourceIds: ['adobe-htl-spec']
  },
  {
    id: 'core-components',
    name: 'AEM Core Components',
    category: 'Components',
    difficulty: 'Beginner',
    summary: 'Adobe-maintained component library with accessibility and Cloud Service compatibility.',
    prerequisites: ['htl', 'aem-sites'],
    resourceIds: ['adobe-core-components']
  },
  {
    id: 'dispatcher',
    name: 'AEM Dispatcher',
    category: 'Caching',
    difficulty: 'Intermediate',
    summary: 'Apache-based caching and security filter in front of AEM publish tiers.',
    prerequisites: ['aem-sites'],
    resourceIds: ['adobe-dispatcher']
  },
  {
    id: 'edge-delivery',
    name: 'Edge Delivery Services',
    category: 'Edge',
    difficulty: 'Advanced',
    summary: 'Document-based authoring with edge-delivered pages and high Core Web Vitals scores.',
    prerequisites: ['aem-sites'],
    resourceIds: ['adobe-eds']
  },
  {
    id: 'universal-editor',
    name: 'Universal Editor',
    category: 'Authoring',
    difficulty: 'Advanced',
    summary: 'Visual in-context editing across headless and hybrid experiences.',
    prerequisites: ['aem-cloud'],
    resourceIds: ['adobe-aem-cloud']
  },
  {
    id: 'graphql-aem',
    name: 'AEM GraphQL',
    category: 'Headless',
    difficulty: 'Advanced',
    summary: 'Persisted GraphQL endpoints over Content Fragments for SPA and native apps.',
    prerequisites: ['aem-sites', 'aem-cloud'],
    resourceIds: ['adobe-graphql']
  },
  {
    id: 'content-fragments',
    name: 'Content Fragments',
    category: 'Headless',
    difficulty: 'Intermediate',
    summary: 'Structured, channel-agnostic content models for headless delivery.',
    prerequisites: ['aem-sites'],
    resourceIds: ['adobe-aem-docs']
  },
  {
    id: 'aep',
    name: 'Adobe Experience Platform',
    category: 'Data',
    difficulty: 'Advanced',
    summary: 'Real-time customer profiles, identity, and activation across Experience Cloud.',
    prerequisites: [],
    resourceIds: ['adobe-aep']
  },
  {
    id: 'java-aem',
    name: 'Java for AEM',
    category: 'Language',
    difficulty: 'Intermediate',
    summary: 'Sling Models, servlets, schedulers, and service users in AEM back-end code.',
    prerequisites: ['osgi'],
    resourceIds: ['adobe-dev-tools', 'wknd-tutorial']
  }
];

const glossary = [
  {
    id: 'aem',
    term: 'Adobe Experience Manager (AEM)',
    definition:
      'Enterprise content management system for websites, assets, forms, and headless content. Core product in the Adobe Experience Cloud for digital experience engineering.',
    relatedTerms: ['dxp', 'aem-cloud'],
    chapterId: 'core-skills'
  },
  {
    id: 'dxp',
    term: 'Digital Experience Platform (DXP)',
    definition:
      'Integrated suite of products (CMS, DAM, analytics, personalization) used to design and deliver customer experiences across channels.',
    relatedTerms: ['aem', 'aep'],
    chapterId: null
  },
  {
    id: 'aem-cloud',
    term: 'AEM as a Cloud Service (AEMaaCS)',
    definition:
      'Cloud-hosted AEM with continuous delivery, auto-scaling, and Adobe-managed infrastructure. Replaces self-hosted 6.5 for new programs.',
    relatedTerms: ['cloud-manager', 'dispatcher'],
    chapterId: 'learning-roadmap'
  },
  {
    id: 'cloud-manager',
    term: 'Cloud Manager',
    definition: 'Adobe pipeline tool for building, deploying, and monitoring AEM Cloud Service environments (dev, stage, prod).',
    relatedTerms: ['aem-cloud'],
    chapterId: null
  },
  {
    id: 'sling',
    term: 'Apache Sling',
    definition: 'RESTful OSGi framework AEM uses to map URLs to resources and scripts (JCR nodes).',
    relatedTerms: ['osgi', 'jcr'],
    chapterId: 'core-skills'
  },
  {
    id: 'osgi',
    term: 'OSGi',
    definition: 'Java module system for AEM bundles: services, components, and configuration with hot deploy semantics.',
    relatedTerms: ['sling'],
    chapterId: 'core-skills'
  },
  {
    id: 'jcr',
    term: 'JCR (Java Content Repository)',
    definition: 'Hierarchical content store (Apache Jackrabbit Oak in AEM) holding pages, assets, and configurations.',
    relatedTerms: ['sling'],
    chapterId: null
  },
  {
    id: 'htl',
    term: 'HTL (HTML Template Language)',
    definition: 'AEM templating language (formerly Sightly) that separates presentation from logic with automatic XSS context.',
    relatedTerms: ['core-components'],
    chapterId: 'core-skills'
  },
  {
    id: 'core-components',
    term: 'Core Components',
    definition: 'Adobe-supported AEM component library with versioning, accessibility, and Cloud Service compatibility.',
    relatedTerms: ['htl'],
    chapterId: 'core-skills'
  },
  {
    id: 'dispatcher',
    term: 'Dispatcher',
    definition: 'Caching reverse proxy and security filter in front of AEM publish; invalidation and filter rules are critical ops skills.',
    relatedTerms: ['cdn', 'aem-cloud'],
    chapterId: 'core-skills'
  },
  {
    id: 'cdn',
    term: 'CDN',
    definition: 'Content delivery network caching static and dynamic edge responses; pairs with Dispatcher and EDS.',
    relatedTerms: ['dispatcher', 'eds'],
    chapterId: null
  },
  {
    id: 'eds',
    term: 'Edge Delivery Services (EDS)',
    definition: 'Adobe edge architecture for ultra-fast sites using document-based authoring and automated performance optimization.',
    relatedTerms: ['universal-editor'],
    chapterId: 'learning-roadmap'
  },
  {
    id: 'universal-editor',
    term: 'Universal Editor',
    definition: 'Cross-surface visual editor connecting AEM content to any front-end experience.',
    relatedTerms: ['eds', 'headless'],
    chapterId: 'learning-roadmap'
  },
  {
    id: 'headless',
    term: 'Headless CMS',
    definition: 'Content authored in AEM and delivered via APIs (GraphQL, Content Fragments) to SPAs and native apps.',
    relatedTerms: ['content-fragments', 'graphql-aem'],
    chapterId: 'learning-roadmap'
  },
  {
    id: 'content-fragments',
    term: 'Content Fragment',
    definition: 'Structured, channel-neutral content unit with defined models and variations for headless use.',
    relatedTerms: ['experience-fragments', 'graphql-aem'],
    chapterId: null
  },
  {
    id: 'experience-fragments',
    term: 'Experience Fragment',
    definition: 'Reusable experience block combining layout and content for consistent omnichannel delivery.',
    relatedTerms: ['content-fragments'],
    chapterId: null
  },
  {
    id: 'graphql-aem',
    term: 'AEM GraphQL',
    definition: 'Persisted GraphQL API layer over Content Fragment models for efficient headless queries.',
    relatedTerms: ['headless', 'content-fragments'],
    chapterId: 'learning-roadmap'
  },
  {
    id: 'aep',
    term: 'Adobe Experience Platform (AEP)',
    definition: 'Real-time customer data platform unifying profiles, segments, and activation across Adobe solutions.',
    relatedTerms: ['dxp', 'cdp'],
    chapterId: 'learning-roadmap'
  },
  {
    id: 'cdp',
    term: 'Customer Data Platform',
    definition: 'System of record for first-party customer data used in personalization and analytics.',
    relatedTerms: ['aep'],
    chapterId: null
  },
  {
    id: 'target',
    term: 'Adobe Target',
    definition: 'A/B testing and personalization engine integrated with AEM and Analytics.',
    relatedTerms: ['analytics'],
    chapterId: null
  },
  {
    id: 'analytics',
    term: 'Adobe Analytics',
    definition: 'Digital analytics product measuring content and conversion performance on AEM sites.',
    relatedTerms: ['target'],
    chapterId: null
  },
  {
    id: 'msm',
    term: 'Multi Site Manager (MSM)',
    definition: 'AEM feature to roll out blueprint sites to regional/live copies with inheritance controls.',
    relatedTerms: ['aem-sites'],
    chapterId: null
  },
  {
    id: 'live-copy',
    term: 'Live Copy',
    definition: 'Site hierarchy synchronized from a blueprint with configurable inheritance of content and components.',
    relatedTerms: ['msm'],
    chapterId: null
  },
  {
    id: 'cq-wcm',
    term: 'WCM (Web Content Management)',
    definition: 'Traditional page-centric authoring in AEM Sites as opposed to headless fragment delivery.',
    relatedTerms: ['aem-sites'],
    chapterId: null
  },
  {
    id: 'dam',
    term: 'DAM (Digital Asset Management)',
    definition: 'AEM Assets capability for storing, transforming, and governing rich media.',
    relatedTerms: ['aem-assets'],
    chapterId: null
  },
  {
    id: 'aem-assets',
    term: 'AEM Assets',
    definition: 'Adobe DAM product within AEM for images, video, metadata, and brand portals.',
    relatedTerms: ['dam'],
    chapterId: 'core-skills'
  },
  {
    id: 'gcc',
    term: 'Global Capability Center (GCC)',
    definition: 'Enterprise captive center (often in India) building digital platforms for the parent company.',
    relatedTerms: [],
    chapterId: 'career-strategy'
  },
  {
    id: 'sling-model',
    term: 'Sling Model',
    definition: 'Java annotation-driven API adapting request resources for HTL and JSON exporters.',
    relatedTerms: ['htl', 'java-aem'],
    chapterId: null
  },
  {
    id: 'service-user',
    term: 'Service User',
    definition: 'Dedicated JCR system user for OSGi services performing repository operations with least privilege.',
    relatedTerms: ['osgi'],
    chapterId: null
  },
  {
    id: 'indexer',
    term: 'Oak Index',
    definition: 'Lucene or property index definition in Oak/JCR affecting query performance in AEM.',
    relatedTerms: ['jcr'],
    chapterId: null
  }
];

const careerPaths = [
  {
    id: 'aem-ic-engineer',
    title: 'Individual Contributor — AEM Engineer',
    summary: 'Progress from component developer to senior platform engineer owning delivery pipelines and non-functional requirements.',
    milestones: [
      {
        title: 'Foundation',
        description: 'HTL, Core Components, basic Sling Models, author/publish topology.',
        technologyIds: ['htl', 'core-components', 'aem-sites']
      },
      {
        title: 'Platform depth',
        description: 'Dispatcher, caching, OSGi services, Cloud Manager pipelines.',
        technologyIds: ['dispatcher', 'osgi', 'aem-cloud']
      },
      {
        title: 'Senior scope',
        description: 'Headless fragments, GraphQL, performance budgets, cross-team technical leadership.',
        technologyIds: ['content-fragments', 'graphql-aem', 'edge-delivery']
      }
    ]
  },
  {
    id: 'aem-solution-architect',
    title: 'Solution / Platform Architect',
    summary: 'Shape multi-brand rollouts, integration patterns, and Experience Cloud alignment for enterprise programs.',
    milestones: [
      {
        title: 'Integration patterns',
        description: 'AEM ↔ Analytics, Target, AEP; identity and consent architecture.',
        technologyIds: ['aep', 'aem-sites']
      },
      {
        title: 'Scale & governance',
        description: 'MSM blueprints, content supply chain, CI/CD and environment strategy.',
        technologyIds: ['aem-cloud', 'dispatcher']
      },
      {
        title: 'Modern experience stack',
        description: 'EDS, Universal Editor, composable commerce and personalization at edge.',
        technologyIds: ['edge-delivery', 'universal-editor', 'graphql-aem']
      }
    ]
  }
];

const interviews = [
  {
    id: 'int-aem-arch',
    question: 'Explain the AEM author vs publish architecture and typical deployment flow.',
    category: 'technical',
    difficulty: 'Intermediate',
    technologies: ['aem-sites'],
    guidance:
      'Cover content activation/replication, Dispatcher on publish, and separation of authoring from delivery. Mention Cloud Manager for cloud deployments.'
  },
  {
    id: 'int-dispatcher',
    question: 'How does the AEM Dispatcher cache and invalidate content?',
    category: 'technical',
    difficulty: 'Intermediate',
    technologies: ['dispatcher'],
    guidance: 'Discuss .stat files, TTL, invalidation requests from author, and filter rules. Note flush vs grace scenarios.'
  },
  {
    id: 'int-htl-xss',
    question: 'How does HTL help prevent XSS compared to JSP scriptlets?',
    category: 'technical',
    difficulty: 'Beginner',
    technologies: ['htl'],
    guidance: 'Explain automatic context-aware escaping and separation of logic into Sling Models.'
  },
  {
    id: 'int-sling-resolution',
    question: 'How does Sling resolve a URL to a resource?',
    category: 'technical',
    difficulty: 'Intermediate',
    technologies: ['sling'],
    guidance: 'Resource path, selectors, extension, and script matching. Optional: mention Sling Mappings.'
  },
  {
    id: 'int-osgi-config',
    question: 'What are OSGi configurations in AEM and how do run modes affect them?',
    category: 'technical',
    difficulty: 'Intermediate',
    technologies: ['osgi'],
    guidance: 'Factory configs, configAdmin, /apps vs /libs, and environment-specific run modes (author, publish, dev).'
  },
  {
    id: 'int-cloud-migration',
    question: 'What changes when migrating AEM 6.5 on-prem to AEM as a Cloud Service?',
    category: 'technical',
    difficulty: 'Advanced',
    technologies: ['aem-cloud'],
    guidance: 'Immutable container, no custom runmodes in crx-quickstart, BPA reports, removed APIs, pipeline-only deploys.'
  },
  {
    id: 'int-fragments',
    question: 'When would you use Content Fragments vs Experience Fragments?',
    category: 'technical',
    difficulty: 'Intermediate',
    technologies: ['content-fragments'],
    guidance: 'Fragments are structured data for headless; XF are layout-ready marketing experiences for channels.'
  },
  {
    id: 'int-graphql',
    question: 'Describe how persisted GraphQL queries work in AEM.',
    category: 'technical',
    difficulty: 'Advanced',
    technologies: ['graphql-aem'],
    guidance: 'CF models, persisted queries for caching/CDN, client apps vs ad-hoc queries in production.'
  },
  {
    id: 'int-eds',
    question: 'What is Edge Delivery Services and how does authoring differ from classic AEM Sites?',
    category: 'technical',
    difficulty: 'Advanced',
    technologies: ['edge-delivery'],
    guidance: 'Document/sheet-based authoring, performance at edge, integration with AEM for governance.'
  },
  {
    id: 'int-perf',
    question: 'How do you diagnose slow AEM pages in production?',
    category: 'technical',
    difficulty: 'Advanced',
    technologies: ['dispatcher', 'aem-sites'],
    guidance: 'Query performance (Oak indexes), Dispatcher cache hit ratio, component-level timing, Asset renditions.'
  },
  {
    id: 'int-java-service',
    question: 'How do you implement a secure background job in AEM?',
    category: 'technical',
    difficulty: 'Intermediate',
    technologies: ['java-aem', 'osgi'],
    guidance: 'Sling Scheduler or Job topics, service user mapping, error handling, idempotency.'
  },
  {
    id: 'int-behavior-star',
    question: 'Tell me about a time you unblocked a high-pressure production issue.',
    category: 'behavioral',
    difficulty: 'Intermediate',
    technologies: [],
    guidance: 'Use STAR: situation, task, action, result. Emphasize calm triage, communication, and post-incident learning.'
  },
  {
    id: 'int-behavior-conflict',
    question: 'Describe a disagreement with an architect or product owner and how you resolved it.',
    category: 'behavioral',
    difficulty: 'Intermediate',
    technologies: [],
    guidance: 'Focus on data, trade-offs, and alignment to customer impact — not winning the argument.'
  },
  {
    id: 'int-behavior-quality',
    question: 'How do you balance delivery speed with quality on an AEM program?',
    category: 'behavioral',
    difficulty: 'Intermediate',
    technologies: [],
    guidance: 'Automated tests, definition of done, incremental releases, tech debt visibility.'
  },
  {
    id: 'int-system-design-cms',
    question: 'Design a multi-country AEM site with shared components and local content.',
    category: 'system-design',
    difficulty: 'Advanced',
    technologies: ['aem-sites'],
    guidance: 'MSM blueprint/live copy, language copies, governance, translation connectors, rollout configs.'
  },
  {
    id: 'int-system-headless',
    question: 'How would you architect headless content for web and mobile from AEM?',
    category: 'system-design',
    difficulty: 'Advanced',
    technologies: ['graphql-aem', 'content-fragments'],
    guidance: 'CF models, GraphQL persisted queries, SPA/SSR front ends, caching strategy, preview.'
  },
  {
    id: 'int-aep-integration',
    question: 'How can AEM and AEP work together in a personalization use case?',
    category: 'technical',
    difficulty: 'Advanced',
    technologies: ['aep', 'aem-sites'],
    guidance: 'Edge data collection, Web SDK, segments, Target or AJO activation — stay high-level if not hands-on.'
  },
  {
    id: 'int-core-components',
    question: 'Why adopt Core Components instead of only custom components?',
    category: 'technical',
    difficulty: 'Beginner',
    technologies: ['core-components'],
    guidance: 'Maintenance, accessibility, upgrade path, Cloud Service compatibility, extension via overlay.'
  },
  {
    id: 'int-ci-cd',
    question: 'What belongs in an AEM Cloud Manager pipeline vs local development?',
    category: 'technical',
    difficulty: 'Intermediate',
    technologies: ['aem-cloud'],
    guidance: 'Code quality, unit tests, RDE for rapid dev, full pipeline for stage/prod with approval gates.'
  },
  {
    id: 'int-career-goal',
    question: 'Why AEM development instead of generic full-stack?',
    category: 'behavioral',
    difficulty: 'Beginner',
    technologies: [],
    guidance:
      'Tie to depth in AEM and CMS platforms, business impact of faster content delivery, and steady demand for AEM developers in India and globally.'
  }
];

const templates = [
  {
    id: 'resume-bullet-aem',
    title: 'Resume bullet — AEM delivery impact',
    category: 'resume',
    body: 'Delivered [feature/migration] on AEM as a Cloud Service for [brand/program], improving [metric: e.g. publish lead time / cache hit ratio / Core Web Vitals] by [X%] through [Dispatcher tuning / pipeline automation / component refactor].'
  },
  {
    id: 'resume-bullet-headless',
    title: 'Resume bullet — headless / GraphQL',
    category: 'resume',
    body: 'Implemented headless content APIs using AEM Content Fragments and persisted GraphQL queries, enabling [web/mobile] teams to ship [feature] without duplicate content entry.'
  },
  {
    id: 'star-production',
    title: 'STAR story frame — production incident',
    category: 'interview',
    body: 'Situation: [outage/symptom]. Task: [your role]. Action: [triage steps, collaboration, fix]. Result: [restored SLA, post-mortem, preventive change].'
  },
  {
    id: 'linkedin-summary',
    title: 'LinkedIn summary pattern — DXP engineer',
    category: 'branding',
    body: 'AEM Developer with hands-on experience in [Sites/Assets/Cloud Service] and [Dispatcher/headless/personalization]. Helped [product/marketing] teams ship faster, reliable content on Adobe Experience Cloud — background in [Java/frontend/platform] and [industry]. Open to AEM roles in [city/remote].'
  },
  {
    id: 'outreach-recruiter',
    title: 'Recruiter outreach — AEM roles',
    category: 'networking',
    body: 'Hi [Name], I am an AEM [level] engineer with experience in [Cloud Service / Dispatcher / headless]. I am exploring [company/sector] roles where Adobe Experience Manager is central to the stack. Open to a brief call if you are hiring for [team/location].'
  }
];

const roadmaps = [
  {
    id: 'aem-foundation',
    title: 'AEM foundation path',
    summary: 'Core AEM skills — architecture through component development.',
    steps: [
      {
        id: 'aem-architecture',
        title: 'AEM architecture fundamentals',
        status: 'in progress',
        description: 'Author/publish, JCR basics, replication, environments.',
        technologyIds: ['aem-sites'],
        resourceIds: ['adobe-aem-docs', 'wknd-tutorial'],
        estimatedHours: 12
      },
      {
        id: 'sling-htl',
        title: 'Sling, HTL, and component development',
        status: 'planned',
        description: 'Sling Models, HTL, Core Components extension.',
        technologyIds: ['sling', 'htl', 'core-components'],
        resourceIds: ['adobe-htl-spec', 'adobe-core-components'],
        estimatedHours: 20
      },
      {
        id: 'dispatcher-basics',
        title: 'Dispatcher and caching',
        status: 'planned',
        description: 'Filter rules, cache invalidation, troubleshooting.',
        technologyIds: ['dispatcher'],
        resourceIds: ['adobe-dispatcher'],
        estimatedHours: 10
      }
    ]
  },
  {
    id: 'cloud-eds',
    title: 'Cloud Service & Edge path',
    summary: 'Modern AEM delivery: Cloud Manager, headless fragments, GraphQL, and Edge Delivery Services.',
    steps: [
      {
        id: 'cloud-manager',
        title: 'AEM as a Cloud Service & pipelines',
        status: 'planned',
        description: 'Cloud Manager, RDE, code analyser, release cadence.',
        technologyIds: ['aem-cloud'],
        resourceIds: ['adobe-aem-cloud'],
        estimatedHours: 16
      },
      {
        id: 'headless-graphql',
        title: 'Headless content & GraphQL',
        status: 'planned',
        description: 'Content Fragment models and persisted queries.',
        technologyIds: ['content-fragments', 'graphql-aem'],
        resourceIds: ['adobe-graphql'],
        estimatedHours: 14
      },
      {
        id: 'edge-delivery',
        title: 'Edge Delivery Services',
        status: 'planned',
        description: 'Document-based authoring and edge performance patterns.',
        technologyIds: ['edge-delivery', 'universal-editor'],
        resourceIds: ['adobe-eds'],
        estimatedHours: 12
      }
    ]
  },
  {
    id: 'experience-platform',
    title: 'Experience Platform integration path',
    summary: 'Connect AEM to analytics, personalization, and customer data for measurable experience programs.',
    steps: [
      {
        id: 'analytics-target',
        title: 'Analytics & Target with AEM',
        status: 'planned',
        description: 'Tags, goals, A/B tests on AEM pages.',
        technologyIds: ['aem-sites'],
        resourceIds: ['adobe-target-docs'],
        estimatedHours: 10
      },
      {
        id: 'aep-basics',
        title: 'Adobe Experience Platform overview',
        status: 'planned',
        description: 'Profiles, schemas, and activation concepts.',
        technologyIds: ['aep'],
        resourceIds: ['adobe-aep'],
        estimatedHours: 12
      },
      {
        id: 'personalization-scale',
        title: 'Personalization at scale',
        status: 'planned',
        description: 'Content Fragments + segments; governance and performance.',
        technologyIds: ['content-fragments', 'aep'],
        resourceIds: ['adobe-aep', 'adobe-aem-docs'],
        estimatedHours: 14
      }
    ]
  }
];

module.exports = { resources, technologies, glossary, careerPaths, interviews, templates, roadmaps };
