export interface Project {
  id: string;
  facetIndex: number;
  title: string;
  category: string;
  tagline: string;
  techStack: string[];
  description: string;
  architectureHighlights: string[];
  metrics: { label: string; value: string }[];
  actionLabel: string;
  codeSnippet?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  skills: string[];
}

export interface AcademicMilestone {
  year: string;
  degree: string;
  institution: string;
  location: string;
  status: string;
  specialization?: string;
  highlights: string[];
}

export interface Credential {
  id: number;
  title: string;
  issuer: string;
  url?: string;
  certId?: string;
  date?: string;
  category: 'AI & ML' | 'Data & Analytics' | 'Computer Science' | 'Cloud & Systems';
}
