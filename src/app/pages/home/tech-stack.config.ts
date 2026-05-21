export interface TechIcon {
  label: string;
  color: string;
  iconUrl: string;
}

const DEVICON = (name: string, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;

export const TECH_STACK_CONFIG: TechIcon[] = [
  { label: 'Angular', color: '#DD0031', iconUrl: DEVICON('angular') },
  { label: 'TypeScript', color: '#3178C6', iconUrl: DEVICON('typescript') },
  { label: 'JavaScript', color: '#F7DF1E', iconUrl: DEVICON('javascript') },
  { label: 'React', color: '#61DAFB', iconUrl: DEVICON('react') },
  { label: 'Node.js', color: '#339933', iconUrl: DEVICON('nodejs') },
  { label: 'RxJS', color: '#B7178C', iconUrl: DEVICON('rxjs') },
  { label: 'Git', color: '#F05032', iconUrl: DEVICON('git') },
  { label: 'GitHub', color: '#aaaaaa', iconUrl: DEVICON('github') },
  { label: 'PostgreSQL', color: '#336791', iconUrl: DEVICON('postgresql') },
  { label: 'MySQL', color: '#4479A1', iconUrl: DEVICON('mysql') },
  { label: 'MongoDB', color: '#47A248', iconUrl: DEVICON('mongodb') },
  { label: 'Docker', color: '#2496ED', iconUrl: DEVICON('docker') },
  { label: 'AWS', color: '#FF9900', iconUrl: DEVICON('amazonwebservices', 'plain-wordmark') },
  { label: 'Tailwind', color: '#06B6D4', iconUrl: DEVICON('tailwindcss') },
  { label: 'NestJS', color: '#E0234E', iconUrl: DEVICON('nestjs') },
  { label: 'Next.js', color: '#888888', iconUrl: DEVICON('nextjs') },
  { label: 'GraphQL', color: '#E10098', iconUrl: DEVICON('graphql', 'plain') },
  { label: 'Playwright', color: '#2EAD33', iconUrl: DEVICON('playwright') },
  { label: 'Vitest', color: '#FCC72B', iconUrl: DEVICON('vitest') },
  { label: 'Jest', color: '#C21325', iconUrl: DEVICON('jest', 'plain') },
  { label: 'Vite', color: '#646CFF', iconUrl: DEVICON('vite') },
  { label: 'Redis', color: '#DC382D', iconUrl: DEVICON('redis') },
  { label: 'Java', color: '#ED8B00', iconUrl: DEVICON('java') },
  { label: 'Claude', color: '#CC785C', iconUrl: 'assets/icons/claude.svg' },
  { label: 'Cursor', color: '#7c8cff', iconUrl: 'assets/icons/cursor.svg' },
];
