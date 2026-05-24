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
      company: 'Enciso Systems',
      role: 'Full-Stack Software Engineer',
      dateRange: '2022 – present',
      techStack: ['Angular', 'NestJS', 'TypeScript', 'PostgreSQL', 'Docker'],
      achievements: [
        'Architected and built full-stack applications using Angular 21 + NestJS on a microservices backend.',
        'Reduced application bundle size by 35% through code-splitting and lazy-loading strategies.',
        'Implemented CI/CD pipelines with GitHub Actions, cutting deployment time from 30 minutes to under 5.',
        'Led migration from AngularJS to Angular 21 for a large legacy application with 0 regressions.',
      ],
    },
    {
      company: 'Freelance',
      role: 'Software Engineer',
      dateRange: '2020 – 2022',
      techStack: ['Angular', 'React', 'Node.js', 'MySQL'],
      achievements: [
        'Delivered 10+ client projects including SPAs, e-commerce platforms, and internal tools.',
        'Built RESTful APIs with Node.js/Express serving up to 50k daily active users.',
        'Introduced automated test suites (Playwright, Jest) where none existed, achieving 80%+ coverage.',
      ],
    },
  ],
};
