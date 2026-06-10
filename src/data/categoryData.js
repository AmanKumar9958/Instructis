import { Trophy, Brain, Code, Compass } from 'lucide-react';

/**
 * Platform learning categories.
 * Each category represents a major section of the platform.
 */
const categoryData = [
  {
    id: 'competitive-exams',
    slug: 'competitive-exams',
    title: 'Competitive Exams',
    description: 'Crack JEE, NEET, UPSC, CAT, GATE, SSC, and more with expert mentors, structured programs, and exam-grade mock tests.',
    icon: Trophy,
    gradient: 'from-brand-purple to-accent-indigo',
    bgColor: 'bg-purple-50',
    stats: [
      { label: 'Exams', value: '10+' },
      { label: 'Students', value: '50K+' },
      { label: 'Success Rate', value: '94%' }
    ],
    isLaunched: true
  },
  {
    id: 'ai-ml',
    slug: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Master artificial intelligence and machine learning from foundations to deployment with project-based, mentor-led programs.',
    icon: Brain,
    gradient: 'from-accent-blue to-accent-cyan',
    bgColor: 'bg-blue-50',
    stats: [
      { label: 'Courses', value: '12+' },
      { label: 'Projects', value: '30+' },
      { label: 'Avg Salary', value: '₹18L' }
    ],
    isLaunched: true
  },
  {
    id: 'coding',
    slug: 'coding',
    title: 'Coding & Programming',
    description: 'Learn programming from scratch or level up your skills with DSA, web development, system design, and competitive coding.',
    icon: Code,
    gradient: 'from-accent-emerald to-accent-cyan',
    bgColor: 'bg-emerald-50',
    stats: [
      { label: 'Languages', value: '8+' },
      { label: 'Problems', value: '500+' },
      { label: 'Placed', value: '2K+' }
    ],
    isLaunched: true
  },
  {
    id: 'careers',
    slug: 'careers',
    title: 'Career Paths',
    description: 'Explore guided career paths across technology, government services, management, and more with mentorship and placement support.',
    icon: Compass,
    gradient: 'from-brand-orange to-accent-amber',
    bgColor: 'bg-orange-50',
    stats: [
      { label: 'Paths', value: '15+' },
      { label: 'Mentors', value: '100+' },
      { label: 'Companies', value: '200+' }
    ],
    isLaunched: true
  }
];

export default categoryData;
