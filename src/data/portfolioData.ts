import { Project, SkillCategory, AcademicMilestone, Credential } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'nero-ai-assistant',
    facetIndex: 1,
    title: 'Nero — AI-Powered Desktop Assistant',
    category: 'Systems, OS Automation & Generative AI',
    tagline: 'Decoupled architectural engine with floating transparent frosted-glass GUI and OS-level automation.',
    techStack: [
      'Python',
      'PyQt6',
      'Windows UI Automation API',
      'Speech Pipelines (STT/TTS)',
      'Intent Classification',
      'Entity Extraction'
    ],
    description:
      'A modular Windows AI assistant featuring a floating, transparent frosted-glass GUI. Engineered decoupled architectural engines for contextual dialogue, intent classification, and entity extraction. Leveraged Windows UI Automation API for dynamic interactive element inspection and OS-level operations without hardcoded paths.',
    architectureHighlights: [
      'Decoupled multi-threaded asynchronous architecture separating GUI rendering, speech capture, and intent pipeline',
      'Windows UI Automation API integration providing deep tree-walking inspection for dynamic controls across third-party win32/UWP apps',
      'Local + cloud hybrid speech pipeline with ultra-low latency speech-to-text (STT) and expressive text-to-speech (TTS)',
      'Intent classifier resolving structured parameter payloads to invoke atomic system actions, window management, and workspace presets'
    ],
    metrics: [
      { label: 'Latency', value: '<180ms' },
      { label: 'Automation Coverage', value: '100% Win32' },
      { label: 'Memory Footprint', value: '42 MB' }
    ],
    actionLabel: 'View Architecture & Code',
    codeSnippet: `# Nero UI Automation Inspector & Event Dispatcher
from PyQt6.QtCore import QThread, pyqtSignal
import pywinauto
from pywinauto import Desktop

class AutomationEngine(QThread):
    element_identified = pyqtSignal(dict)
    
    def inspect_active_window(self, target_pattern: str):
        desktop = Desktop(backend="uia")
        top_window = desktop.active()
        
        # Walk accessible tree without static coordinate dependencies
        for elem in top_window.descendants():
            if target_pattern.lower() in (elem.window_text() or "").lower():
                metadata = {
                    "control_type": elem.element_info.control_type,
                    "handle": elem.handle,
                    "bounds": elem.rectangle(),
                    "invokable": hasattr(elem, "invoke")
                }
                self.element_identified.emit(metadata)
                return elem
        return None`
  },
  {
    id: 'sales-intelligence-dashboard',
    facetIndex: 2,
    title: 'Enterprise Sales Intelligence & Diagnostic Dashboard',
    category: 'Business Analytics & Data Engineering',
    tagline: 'Multi-dimensional visual analytics uncovering recurring revenue trends & actionable KPI diagnostic tracking.',
    techStack: [
      'Tableau',
      'Data Wrangling',
      'Statistical Analysis',
      'KPI Engineering',
      'MySQL',
      'Python (Pandas)'
    ],
    description:
      'Multi-dimensional visual analytics system uncovering recurring revenue trends across product segments and geographical territories. Built dynamic interactive dashboards with choropleth maps, multi-tier filtering, and actionable KPI diagnostic tracking.',
    architectureHighlights: [
      'Engineered normalized relational schemas in MySQL feeding high-throughput analytical query views',
      'Constructed Level-of-Detail (LOD) expressions and weighted variance calculations for customer lifetime value (LTV)',
      'Multi-tier interactive choropleth maps linking geographical territories to cohort margin diagnostics',
      'Automated pipeline scripts in Pandas for outlier removal, schema alignment, and metric aggregation'
    ],
    metrics: [
      { label: 'Diagnostic Queries', value: '50+ KPIs' },
      { label: 'Territory Granularity', value: 'Global & Regional' },
      { label: 'Data Processing Speed', value: '1.2M rows/s' }
    ],
    actionLabel: 'Launch Dashboard & Specs',
    codeSnippet: `-- Revenue Cohort Variance & Diagnostics View
WITH MonthlySegmentMetrics AS (
  SELECT 
    DATE_FORMAT(order_date, '%Y-%m') AS sales_period,
    region_id,
    product_category,
    SUM(sale_amount) AS gross_revenue,
    SUM(sale_amount - unit_cost * quantity) AS gross_margin,
    COUNT(DISTINCT customer_id) AS active_accounts
  FROM enterprise_orders
  GROUP BY 1, 2, 3
)
SELECT 
  sales_period,
  product_category,
  gross_revenue,
  gross_margin,
  ROUND((gross_margin / NULLIF(gross_revenue, 0)) * 100, 2) AS margin_percentage,
  LAG(gross_revenue, 1) OVER (PARTITION BY product_category ORDER BY sales_period) AS prev_period_rev
FROM MonthlySegmentMetrics;`
  },
  {
    id: 'algorithmic-systems-core',
    facetIndex: 3,
    title: 'Algorithmic Systems & Data Processing Core',
    category: 'Applied Machine Learning & Computational Architecture',
    tagline: 'High-performance computational pipelines and algorithmic problem-solving architecture.',
    techStack: [
      'Python',
      'C',
      'SQL',
      'Pandas',
      'NumPy',
      'Applied ML',
      'Vectorization'
    ],
    description:
      'High-performance computational pipelines and algorithmic problem-solving architecture optimized for low-latency processing, structured data pipelines, and modular integration.',
    architectureHighlights: [
      'Zero-copy vector calculations using NumPy and SIMD extensions for high-frequency matrix operations',
      'Low-overhead C utility libraries linked via foreign function interface (ctypes) for core numerical routines',
      'Modular ML feature transformer pipeline with schema validation and automated cache invalidation',
      'Robust error-boundary propagation ensuring 99.99% processing uptime during data ingestion spikes'
    ],
    metrics: [
      { label: 'Execution Speedup', value: '14.8x over naive' },
      { label: 'Algorithmic Efficiency', value: 'O(N log N)' },
      { label: 'Concurrent Streams', value: '128 workers' }
    ],
    actionLabel: 'Explore Technical Specs',
    codeSnippet: `# Vectorized Feature Projection & Matrix Invariant Engine
import numpy as np

def fast_tensor_projection(features: np.ndarray, projection_weights: np.ndarray) -> np.ndarray:
    """
    Computes normalized subspace projection with vectorized batch norm.
    Zero allocations in primary calculation loop.
    """
    assert features.ndim == 2 and projection_weights.ndim == 2
    raw_dot = np.matmul(features, projection_weights)
    mean = np.mean(raw_dot, axis=0, keepdims=True)
    std = np.std(raw_dot, axis=0, keepdims=True) + 1e-8
    normalized = (raw_dot - mean) / std
    return np.maximum(0, normalized)  # Fast ReLU activation`
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Programming Languages',
    icon: 'Terminal',
    skills: ['Python', 'SQL', 'C', 'Java', 'HTML', 'CSS', 'JavaScript']
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    icon: 'Cpu',
    skills: [
      'Generative AI',
      'Prompt Engineering',
      'Applied ML',
      'AI Development',
      'STT (Speech-to-Text)',
      'TTS (Text-to-Speech)',
      'Intent Classification',
      'Entity Parsing',
      'AI Desktop Assistant Development'
    ]
  },
  {
    id: 'data-analytics',
    title: 'Data Science & Analytics',
    icon: 'BarChart2',
    skills: [
      'Pandas',
      'NumPy',
      'Seaborn',
      'Matplotlib',
      'Statistics',
      'Data Wrangling',
      'Data Analysis',
      'Data Visualization',
      'Tableau',
      'Power BI'
    ]
  },
  {
    id: 'databases-tools',
    title: 'Databases & Developer Tools',
    icon: 'Database',
    skills: ['MySQL', 'Git', 'GitHub', 'PyQt6']
  },
  {
    id: 'systems-engineering',
    title: 'Software & System Engineering',
    icon: 'Layers',
    skills: [
      'Windows Desktop App Development',
      'GUI Development',
      'UI Automation',
      'Windows UI Automation API',
      'Speech Pipelines',
      'Modular Architecture',
      'Dynamic UI Element Inspection'
    ]
  },
  {
    id: 'business-analytics',
    title: 'Business & Analytics',
    icon: 'TrendingUp',
    skills: [
      'Statistical Analysis',
      'Dashboard Development',
      'KPI Modeling',
      'Business Data Analysis',
      'Revenue Trend Analysis',
      'Performance Diagnostic Reporting'
    ]
  },
  {
    id: 'web-engineering',
    title: 'Web Engineering',
    icon: 'Globe',
    skills: [
      'Front-End Development',
      'HTML',
      'CSS',
      'JavaScript',
      'Full-Stack Architecture'
    ]
  },
  {
    id: 'cs-foundations',
    title: 'Computer Science Foundations',
    icon: 'ShieldCheck',
    skills: [
      'Algorithms',
      'Cybersecurity',
      'IT Support',
      'Database Engineering',
      'Project Management',
      'Essential Mathematics for Computer Science'
    ]
  }
];

export const ACADEMIC_MILESTONES: AcademicMilestone[] = [
  {
    year: '2024 – 2028',
    degree: 'B.Tech in Computer Science and Engineering (Core)',
    institution: 'VIT-AP University',
    location: 'Amaravati, Andhra Pradesh, India',
    status: 'Current Undergraduate Student',
    specialization: 'Core Computer Science & Engineering',
    highlights: [
      'Specialized focus on Systems Architecture, Algorithm Design, AI Engineering, and Enterprise Data Pipelines',
      'Active leadership in technology development, software architecture research, and machine intelligence projects',
      'Rigorous foundational laboratory training in Distributed Systems, Operating Systems, and Advanced Data Structures'
    ]
  },
  {
    year: '2022 – 2024',
    degree: 'Senior Secondary (Intermediate - MPC)',
    institution: 'Narayana Junior College',
    location: 'IIT JEE NEET Academy, India',
    status: 'Completed',
    specialization: 'Mathematics, Physics & Chemistry',
    highlights: [
      'Intensive training in analytical problem-solving, advanced calculus, linear algebra, and mechanics',
      'Top-tier competitive mathematics and scientific reasoning foundation for high-performance computing'
    ]
  },
  {
    year: '2022',
    degree: 'Secondary School Certificate (SSC - Class X)',
    institution: "Dr. KKR's Gowtham International School",
    location: 'India',
    status: 'Completed',
    specialization: 'CBSE / SSC Curriculum',
    highlights: [
      'Distinction in Mathematics and Physical Sciences',
      'Formative foundation in logical reasoning, computational basics, and academic discipline'
    ]
  }
];

export const CREDENTIALS: Credential[] = [
  {
    id: 1,
    title: 'AI Professional Certificate',
    issuer: 'Google',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/7YSF4UN1TOL9',
    category: 'AI & ML'
  },
  {
    id: 2,
    title: 'Data Analytics Professional Certificate',
    issuer: 'Google',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/AZ0QVVCS6TDZ',
    category: 'Data & Analytics'
  },
  {
    id: 3,
    title: 'Algorithms Specialization',
    issuer: 'Stanford University',
    url: 'https://www.coursera.org/account/accomplishments/specialization/certificate/UK4BUTXA0FMM',
    category: 'Computer Science'
  },
  {
    id: 4,
    title: 'Generative AI Engineering Professional Certificate',
    issuer: 'IBM',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/052YFNDR6B68',
    category: 'AI & ML'
  },
  {
    id: 5,
    title: 'Full-Stack Web Development Specialization',
    issuer: 'University of London',
    url: 'https://www.coursera.org/account/accomplishments/specialization/certificate/IOMW6TWAYYRY',
    category: 'Computer Science'
  },
  {
    id: 6,
    title: 'Google Project Management Professional Certificate',
    issuer: 'Google',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/3M9DVTQHV3SX',
    category: 'Data & Analytics'
  },
  {
    id: 7,
    title: 'Google IT Support Professional Certificate',
    issuer: 'Google',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/RSWWQUMBB68X',
    category: 'Cloud & Systems'
  },
  {
    id: 8,
    title: 'HTML, CSS, and Javascript for Web Developers',
    issuer: 'Johns Hopkins University',
    url: 'https://www.coursera.org/account/accomplishments/records/html-css-javascript-for-web-developers',
    category: 'Computer Science'
  },
  {
    id: 9,
    title: 'Meta Database Engineer Professional Certificate',
    issuer: 'Meta',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/NQFGMPDW3S2U',
    category: 'Cloud & Systems'
  },
  {
    id: 10,
    title: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/DA2PL1YGLVG1',
    category: 'Cloud & Systems'
  },
  {
    id: 11,
    title: 'Essential Mathematics for Computer Science Specialization',
    issuer: 'University of London & Goldsmiths',
    url: 'https://www.coursera.org/account/accomplishments/specialization/certificate/0J5WIPQYDJEL',
    category: 'Computer Science'
  },
  {
    id: 12,
    title: 'Google Advanced Data Analytics Professional Certificate',
    issuer: 'Google',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/CU6ZBMSQF7JJ',
    category: 'Data & Analytics'
  },
  {
    id: 13,
    title: 'Microsoft Power BI Data Analyst Professional Certificate',
    issuer: 'Microsoft',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/GM9LHBRJEQXE',
    category: 'Data & Analytics'
  },
  {
    id: 14,
    title: 'IBM AI Developer Professional Certificate',
    issuer: 'IBM',
    url: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/TA2IE41GN13T',
    category: 'AI & ML'
  },
  {
    id: 15,
    title: 'Python for Everybody Specialization',
    issuer: 'University of Michigan',
    url: 'https://www.coursera.org/account/accomplishments/specialization/certificate/18BPSLXIG8LT',
    category: 'Computer Science'
  },
  {
    id: 16,
    title: 'Google AI Essentials Specialization',
    issuer: 'Google',
    url: 'https://www.coursera.org/account/accomplishments/specialization/certificate/43YQB4BQDI26',
    category: 'AI & ML'
  },
  {
    id: 17,
    title: 'Oracle Cloud Infrastructure Certified AI Foundations Associate (OCI 2026)',
    issuer: 'Oracle University',
    certId: '331098238OCI26AICFA',
    date: 'Certified: August 29, 2026',
    url: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=331098238OCI26AICFA',
    category: 'AI & ML'
  },
  {
    id: 18,
    title: 'Oracle Fusion AI Agent Studio Certified Foundations Associate - Rel 1',
    issuer: 'Oracle University',
    certId: '331098238OFAASOFA',
    date: 'Certified: September 01, 2026',
    url: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=331098238OFAASOFA',
    category: 'AI & ML'
  }
];

export const CONTACT_INFO = {
  name: 'Geetesh Gollapalli',
  role: 'Computer Science Engineer, AI Systems & Data Architect',
  email: 'geeteshgollapalli@gmail.com',
  phone: '+91 8465034492',
  location: 'Tandur, India',
  socials: {
    github: 'https://github.com/geeteshgollapalli',
    linkedin: 'https://linkedin.com/in/geeteshgollapalli',
    leetcode: 'https://leetcode.com/geeteshgollapalli'
  }
};
