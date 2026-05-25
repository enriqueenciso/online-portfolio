export interface TimelineEntry {
  company: string;
  role: string;
  dateRange: string;
  logo?: string;
  summary?: string;
  collapsed?: boolean;
  techStack?: string[];
  achievements?: string[];
}

export interface SkillCategory {
  name: string;
  tier1: string[];
  tier2: string[];
}

export interface Education {
  institution: string;
  degree: string;
  dateRange: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  year: number;
}

export interface PortfolioConfig {
  hero: {
    name: string;
    title: string;
  };
  photo?: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  bio: string;
  skillCategories: SkillCategory[];
  education: Education;
  certificates: Certificate[];
  timeline: TimelineEntry[];
}

export const config: PortfolioConfig = {
  hero: {
    name: 'Enrique Enciso',
    title: 'Software Engineer',
  },
  photo: 'assets/photo.jpg',
  location: 'Mexico',
  email: 'enriquejaviere@gmail.com',
  github: 'https://github.com/enriqueenciso',
  linkedin: 'https://linkedin.com/in/enriqueenciso',
  bio: '',
  skillCategories: [],
  education: { institution: '', degree: '', dateRange: '' },
  certificates: [],
  timeline: [
    {
      company: 'Backbase',
      role: 'Senior Software Engineer',
      dateRange: 'Aug 2025 – Present',
      summary:
        'Leading front-end engineers at Backbase LATAM, establishing standards and AI-assisted development workflows.',
      achievements: [
        'Leader of the front-end team, establishing standards, methodologies, and guidelines.',
        'Collaborated with Backend teams, Core, Software Architects, and Business Analysts to discover, organize, and prioritize tasks.',
        'Created and triaged over 200 tasks, focusing on small, well-defined units for fast developer pickup.',
        'PR management, GitHub Actions, and repository handling using Angular 18 and AI-assisted development workflows.',
      ],
      techStack: ['Angular 18', 'TypeScript', 'GitHub Actions', 'AI-assisted development'],
    },
    {
      company: 'Kunai / WEX',
      role: 'Senior Software Engineer',
      dateRange: 'Mar 2023 – Jun 2025',
      summary:
        'Co-led front-end development for WEX, owning component libraries and client branding.',
      achievements: [
        'Co-developed features and components with UI/UX and Backend teams.',
        'Proposed and implemented generic, reusable components and utilities to reduce redundancy.',
        'Maintained and refactored custom UI component libraries — achieved 40%+ reduction in bug introduction and 75% improvement in code reliability.',
        'Built reusable Angular 14 components, integrated GraphQL APIs, managed application state for dynamic content rendering.',
      ],
      techStack: ['Angular 14', 'TypeScript', 'SCSS', 'GraphQL'],
    },
    {
      company: 'The Ksquare Group / CBRE',
      role: 'Senior Software Engineer',
      dateRange: 'Mar 2021 – Dec 2022',
      summary:
        'Enhanced Angular components and drove performance improvements for a global public-facing application at CBRE.',
      achievements: [
        'Partnered with UX/UI teams to develop and refactor Angular components for a live production system.',
        'Upgraded Angular versions to maintain long-term application performance and support.',
        'Boosted application performance by 10% through bug fixes and flow optimizations.',
        'Maintained 80%+ test coverage across new and existing repositories.',
      ],
      techStack: ['Angular', 'TypeScript', 'SCSS', 'Jest', 'Jasmine'],
    },
    {
      company: 'EPAM Systems',
      role: 'Senior Software Engineer',
      dateRange: 'Sep 2019 – Mar 2021',
      summary:
        'Led UI modernisation and performance optimisation for data-intensive mobile applications, including an AngularJS→React migration.',
      achievements: [
        'Led UI modernisation and performance optimisation for a data-intensive mobile application.',
        'Migrated a legacy AngularJS application to React, enhancing cross-platform support.',
        'Developed a high-performance data-loading strategy, achieving under 3 seconds initial load time.',
        'Implemented unit testing practices to ensure long-term stability.',
      ],
      techStack: ['React', 'AngularJS', 'HTML5', 'Responsive Web Design'],
    },
    {
      company: 'Softtek / HP',
      role: 'Full-Stack Developer',
      dateRange: 'Jan 2019 – Aug 2019',
      summary:
        'Built enterprise Angular + Node.js application components for HP, translating business workflows into scalable UI.',
      achievements: [
        'Contributed to an enterprise-grade application using Angular and Node.js.',
        'Collaborated with stakeholders to translate business workflows into scalable UI components.',
        'Optimised backend integrations and database queries for enhanced responsiveness.',
      ],
      techStack: ['Angular', 'Node.js', 'HTML5', 'Responsive Web Design'],
    },
    {
      company: 'IBM',
      role: 'Full-Stack Developer',
      dateRange: 'Feb 2016 – Oct 2018',
      summary:
        'Managed front-end development and release processes for a client-facing product under tight deadlines at IBM.',
      achievements: [
        'Managed front-end development and release processes for a client with tight deadlines.',
        'Developed content and performed server maintenance using HTML5, CSS3, Angular 2, and PHP.',
        'Collaborated with cross-functional teams to adapt to changing requirements.',
      ],
      techStack: ['Angular 2', 'HTML5', 'CSS3', 'PHP'],
    },
    {
      company: 'Sistema Chiapaneco de Radio, Televisión y Cinematografía',
      role: 'Software Developer & IT Support',
      dateRange: 'Apr 2014 – Sep 2015',
      summary:
        'Developed process automation software and provided IT support for a state media organisation.',
      achievements: [
        'Developed software to automate processes within the organisation.',
        'Provided IT support to various departments.',
      ],
      techStack: ['HTML', 'Responsive Web Design'],
      collapsed: true,
    },
    {
      company: 'Universidad Politécnica de Chiapas',
      role: 'Software Developer & Researcher',
      dateRange: 'Jan 2013 – Dec 2013',
      summary:
        'Research project to certify and validate physical documents using Java, encryption, and pattern recognition.',
      achievements: [
        'Research project to certify and validate documents, distinguishing originals from copies.',
        'Applied Java, data encryption, signal processing, photography, and pattern recognition.',
      ],
      techStack: ['Java'],
      collapsed: true,
    },
  ],
};
