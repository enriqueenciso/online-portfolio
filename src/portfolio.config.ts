import { isDevMode } from '@angular/core';

export interface PreviewTimelineEntry {
  company: string;
  role: string;
  dateRange: string;
  logo?: string;
  techStack?: string[];
}

export interface FullTimelineEntry {
  company: string;
  role: string;
  dateRange: string;
  achievements: string[];
}

export interface PortfolioConfig {
  hero: {
    name: string;
    title: string;
  };
  preview: {
    photo?: string;
    location: string;
    github: string;
    linkedin: string;
    skills: string[];
    timeline: PreviewTimelineEntry[];
  };
  full: {
    email: string;
    timeline: FullTimelineEntry[];
  };
}

export const config: PortfolioConfig = {
  hero: {
    name: 'Enrique Enciso',
    title: 'Software Engineer',
  },
  preview: {
    photo: 'assets/photo.jpg',
    location: 'Mexico',
    github: 'https://github.com/enriqueenciso',
    linkedin: 'https://linkedin.com/in/enriqueenciso',
    skills: [
      'Angular',
      'Angular CLI',
      'React',
      'TypeScript',
      'JavaScript',
      'Git',
      'GitHub',
      'Node.js',
      'RxJS',
      'Claude',
      'Cursor',
      'Playwright',
      'Visual Studio Code',
      'CSS',
      'Sass',
      'HTML',
      'PostgreSQL',
      'MySQL',
      'Selenium',
      'Windows',
      'Linux',
      'macOS',
      'Next.js',
      'Tailwind',
      'AWS',
      'Docker',
      'Java',
      'Spring Boot',
      'Bootstrap',
      'PrimeNG',
      'Angular Material',
      'Jasmine',
      'Karma',
      'NestJS',
      'Express.js',
      'Zod',
      'MongoDB',
      'Redis',
      'GraphQL',
      'GitHub Actions',
      'Vercel',
      'Jest',
      'Vitest',
      'Webpack',
      'Vite',
    ],
    timeline: [
      {
        company: 'Enciso Systems',
        role: 'Full-Stack Software Engineer',
        dateRange: '2022 – present',
        techStack: ['Angular', 'NestJS', 'TypeScript', 'PostgreSQL', 'Docker'],
      },
      {
        company: 'Freelance',
        role: 'Software Engineer',
        dateRange: '2020 – 2022',
        techStack: ['Angular', 'React', 'Node.js', 'MySQL'],
      },
    ],
  },
  full: {
    email: 'enriquejaviere@gmail.com',
    timeline: [
      {
        company: 'Enciso Systems',
        role: 'Full-Stack Software Engineer',
        dateRange: '2022 – present',
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
        achievements: [
          'Delivered 10+ client projects including SPAs, e-commerce platforms, and internal tools.',
          'Built RESTful APIs with Node.js/Express serving up to 50k daily active users.',
          'Introduced automated test suites (Playwright, Jest) where none existed, achieving 80%+ coverage.',
        ],
      },
    ],
  },
};

if (isDevMode()) {
  const previewKeys = new Set(config.preview.timeline.map((e) => `${e.company}||${e.role}`));
  for (const entry of config.full.timeline) {
    const key = `${entry.company}||${entry.role}`;
    if (!previewKeys.has(key)) {
      console.warn(
        `[PortfolioConfig] full.timeline entry "${entry.role} @ ${entry.company}" has no matching preview.timeline entry.`,
      );
    }
  }
}
