import { Calculator, Stethoscope, Landmark, Shield, TrendingUp, Brain, Cpu, Scale, Swords, Globe } from 'lucide-react';

/**
 * Centralized exam configuration.
 * Adding a new exam = adding one object to this array.
 * All competitive exam pages pull from this data.
 */
const examData = [
  {
    id: 'jee',
    slug: 'jee',
    name: 'JEE Coaching for Main & Advanced',
    shortName: 'JEE',
    category: 'Engineering',
    tagline: 'Crack JEE Main & Advanced with structured learning and expert mentors.',
    description: 'Instructis helps you crack JEE Main and JEE Advanced with structured learning paths, daily practice, and mentor-led doubt sessions. Build strong fundamentals in Physics, Chemistry, and Mathematics with expert faculty and exam-grade problem solving.',
    icon: Calculator,
    color: '#FF6C37',
    highlights: [
      'Concept clarity with chapter-wise practice sets',
      'Full-length mock tests aligned with JEE patterns',
      'Personalised study plans for Class 11 and 12',
      'Mentor support to fix weak topics and speed',
      'Topic-wise worksheets and rank analytics',
      'Real exam pattern mock tests and AITS'
    ],
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    eligibility: 'Class 11 & 12 students (Science stream with PCM)',
    examPattern: {
      mode: 'Online (CBT)',
      duration: '3 hours (Main) / 3 hours per paper (Advanced)',
      sections: 'Physics, Chemistry, Mathematics',
      questions: '90 MCQs (Main) / Varies (Advanced)',
      marking: '+4 correct, -1 wrong (Main)'
    },
    preparationTips: [
      'Start with NCERT fundamentals before moving to advanced problems',
      'Practice previous year papers weekly starting from Day 1',
      'Focus on conceptual clarity over rote memorization',
      'Take full-length mock tests every weekend',
      'Maintain an error log and revise weak areas every week'
    ],
    ctaLabel: 'Book a free JEE doubt session',
    ctaLink: '/#book-session',
    isDetailed: true
  },
  {
    id: 'neet',
    slug: 'neet',
    name: 'NEET Coaching for NEET UG',
    shortName: 'NEET',
    category: 'Medical',
    tagline: 'Crack NEET UG with NCERT-first learning, concept clarity, and consistent practice.',
    description: 'Crack NEET UG with a study plan that prioritises NCERT, concept clarity, and consistent practice. Instructis NEET coaching covers Biology, Physics, and Chemistry with smart revision and exam-grade tests.',
    icon: Stethoscope,
    color: '#3B82F6',
    highlights: [
      'NCERT-focused notes with daily practice',
      'Topic-wise tests and full-length mock exams',
      'Personal mentoring to improve accuracy',
      'Revision sprints before exam season',
      'Biology mastery with clinical examples',
      'Detailed mock test solutions with analytics'
    ],
    subjects: ['Biology (Botany & Zoology)', 'Physics', 'Chemistry'],
    eligibility: 'Class 11 & 12 students (Science stream with Biology)',
    examPattern: {
      mode: 'Offline (Pen & Paper)',
      duration: '3 hours 20 minutes',
      sections: 'Physics, Chemistry, Botany, Zoology',
      questions: '200 MCQs (180 to attempt)',
      marking: '+4 correct, -1 wrong'
    },
    preparationTips: [
      'NCERT is your bible — read it line by line for Biology',
      'Solve NEET previous year papers to understand question patterns',
      'Focus on diagrams and flowcharts for Biology retention',
      'Practice numerical problems in Physics and Chemistry daily',
      'Take subject-wise tests before attempting full-length mocks'
    ],
    ctaLabel: 'Book a free NEET doubt session',
    ctaLink: '/#book-session',
    isDetailed: true
  },
  {
    id: 'upsc',
    slug: 'upsc',
    name: 'UPSC Civil Services Preparation',
    shortName: 'UPSC',
    category: 'Government',
    tagline: 'Structured preparation for India\'s most prestigious civil services examination.',
    description: 'Prepare for UPSC Civil Services with a comprehensive approach covering Prelims, Mains, and Interview. Our mentors guide you through current affairs, optional subjects, and answer writing practice.',
    icon: Landmark,
    color: '#10B981',
    highlights: [
      'Comprehensive coverage of Prelims and Mains syllabus',
      'Daily current affairs analysis and compilation',
      'Answer writing practice with feedback',
      'Optional subject guidance from specialists',
      'Mock interview preparation',
      'Study material curated by UPSC toppers'
    ],
    subjects: ['General Studies', 'CSAT', 'Optional Subject', 'Essay'],
    eligibility: 'Graduates from any recognized university',
    examPattern: {
      mode: 'Offline',
      duration: 'Prelims: 2 hours/paper, Mains: 3 hours/paper',
      sections: 'Prelims (2 papers), Mains (9 papers), Interview',
      questions: 'Prelims: 100 MCQs/paper, Mains: Descriptive',
      marking: 'Prelims: +2 correct, -0.66 wrong'
    },
    preparationTips: [
      'Build a strong foundation with NCERTs for all subjects',
      'Read newspaper daily and maintain current affairs notes',
      'Practice answer writing from Day 1 — structure matters',
      'Join a test series for regular self-assessment',
      'Choose your optional subject wisely based on interest and scoring potential'
    ],
    ctaLabel: 'Start UPSC preparation',
    ctaLink: '/#book-session',
    isDetailed: true
  },
  {
    id: 'ssc',
    slug: 'ssc',
    name: 'SSC Exam Preparation',
    shortName: 'SSC',
    category: 'Government',
    tagline: 'Crack SSC CGL, CHSL, MTS and other Staff Selection Commission exams.',
    description: 'Prepare for SSC exams with targeted coaching covering Quantitative Aptitude, English, Reasoning, and General Awareness. Practice with exam-pattern mocks and get mentoring support.',
    icon: Shield,
    color: '#F59E0B',
    highlights: [
      'Complete coverage of SSC CGL, CHSL, and MTS syllabus',
      'Quantitative Aptitude shortcut techniques',
      'English language and comprehension mastery',
      'Reasoning and General Intelligence practice',
      'Current affairs and GK capsules',
      'Previous year paper analysis and mock tests'
    ],
    subjects: ['Quantitative Aptitude', 'English Language', 'General Intelligence & Reasoning', 'General Awareness'],
    eligibility: 'Varies by exam — 10th/12th/Graduate',
    examPattern: {
      mode: 'Online (CBT)',
      duration: '1-2 hours per tier',
      sections: 'Tier I, II, III, IV (varies by exam)',
      questions: '100 MCQs (Tier I)',
      marking: '+2 correct, -0.50 wrong'
    },
    preparationTips: [
      'Master shortcut methods for Quantitative Aptitude',
      'Practice English grammar rules and vocabulary daily',
      'Solve reasoning puzzles and patterns every day',
      'Keep up with current affairs through monthly compilations',
      'Take full-length mocks in exam conditions weekly'
    ],
    ctaLabel: 'Start SSC preparation',
    ctaLink: '/#book-session',
    isDetailed: true
  },
  {
    id: 'banking',
    slug: 'banking',
    name: 'Banking Exam Preparation',
    shortName: 'Banking',
    category: 'Government',
    tagline: 'Prepare for IBPS PO, SBI PO, IBPS Clerk, and RBI exams.',
    description: 'Comprehensive banking exam preparation covering all IBPS and SBI exams. Focus on Quantitative Aptitude, Reasoning, English, and Banking Awareness with regular mock tests.',
    icon: TrendingUp,
    color: '#06B6D4',
    highlights: [
      'Complete syllabus coverage for IBPS PO, SBI PO, Clerk exams',
      'Data Interpretation and analysis shortcuts',
      'Banking and financial awareness modules',
      'Sectional and full-length mock tests',
      'Speed and accuracy improvement drills',
      'Interview preparation for final rounds'
    ],
    subjects: ['Quantitative Aptitude', 'Reasoning Ability', 'English Language', 'General/Banking Awareness', 'Computer Knowledge'],
    eligibility: 'Graduates from recognized university',
    examPattern: {
      mode: 'Online (CBT)',
      duration: '1-3 hours (varies by exam)',
      sections: 'Prelims + Mains + Interview',
      questions: '100 MCQs (Prelims)',
      marking: '+1 correct, -0.25 wrong'
    },
    preparationTips: [
      'Focus on speed — banking exams are time-intensive',
      'Master DI and data sufficiency for high scoring',
      'Read banking awareness and financial news regularly',
      'Practice sectional tests before full-length mocks',
      'Prepare for GD and Interview from the Mains stage itself'
    ],
    ctaLabel: 'Start Banking preparation',
    ctaLink: '/#book-session',
    isDetailed: true
  },
  {
    id: 'cat',
    slug: 'cat',
    name: 'CAT Exam Preparation',
    shortName: 'CAT',
    category: 'Management',
    tagline: 'Crack CAT and secure admission to top IIMs and B-Schools.',
    description: 'Prepare for CAT with focused coaching on Quantitative Ability, Verbal Ability, Data Interpretation, and Logical Reasoning. Our program builds speed, accuracy, and exam temperament.',
    icon: TrendingUp,
    color: '#6366F1',
    highlights: [
      'Comprehensive VARC, DILR, and QA preparation',
      'Reading comprehension strategies and practice',
      'Advanced logical reasoning and data interpretation',
      'Time management and test-taking strategies',
      'Mock CATs with detailed performance analysis',
      'IIM interview and GD preparation'
    ],
    subjects: ['Verbal Ability & Reading Comprehension', 'Data Interpretation & Logical Reasoning', 'Quantitative Ability'],
    eligibility: 'Graduates with minimum 50% (45% for reserved)',
    examPattern: {
      mode: 'Online (CBT)',
      duration: '2 hours',
      sections: 'VARC, DILR, QA (40 min each)',
      questions: '66 questions (22 per section)',
      marking: '+3 correct, -1 wrong (MCQ only)'
    },
    preparationTips: [
      'Read extensively — newspapers, magazines, editorials daily',
      'Practice at least 50 RC passages before the exam',
      'Master basic math concepts before attempting CAT-level problems',
      'Focus on DILR — it\'s the most unpredictable section',
      'Take at least 30 full-length mock CATs for conditioning'
    ],
    ctaLabel: 'Start CAT preparation',
    ctaLink: '/#book-session',
    isDetailed: true
  },
  {
    id: 'gate',
    slug: 'gate',
    name: 'GATE Exam Preparation',
    shortName: 'GATE',
    category: 'Engineering',
    tagline: 'Prepare for GATE and open doors to M.Tech, PSUs, and research opportunities.',
    description: 'Structured GATE preparation with in-depth subject coverage, problem-solving practice, and mock tests. Our faculty breaks down complex engineering concepts for better retention.',
    icon: Cpu,
    color: '#8134AF',
    highlights: [
      'Subject-wise in-depth concept coverage',
      'Previous year GATE paper solutions (20+ years)',
      'Topic-wise and full-length mock tests',
      'PSU preparation guidance alongside GATE',
      'Engineering Mathematics and Aptitude coverage',
      'Performance analytics and weak area identification'
    ],
    subjects: ['Core Engineering Subject', 'Engineering Mathematics', 'General Aptitude'],
    eligibility: 'B.E./B.Tech/B.Arch or equivalent graduates or final year students',
    examPattern: {
      mode: 'Online (CBT)',
      duration: '3 hours',
      sections: 'General Aptitude + Core Subject',
      questions: '65 questions (10 GA + 55 Subject)',
      marking: '+1/+2 correct, -1/3 or -2/3 wrong'
    },
    preparationTips: [
      'Focus on high-weightage topics in your branch',
      'Solve previous year papers — GATE repeats concepts',
      'Don\'t skip Engineering Mathematics — it\'s 15% of marks',
      'Practice numerical answer type questions for accuracy',
      'Take full-length mocks to build exam stamina'
    ],
    ctaLabel: 'Start GATE preparation',
    ctaLink: '/#book-session',
    isDetailed: true
  },
  {
    id: 'cuet',
    slug: 'cuet',
    name: 'CUET UG Preparation',
    shortName: 'CUET',
    category: 'Engineering',
    tagline: 'Crack CUET UG for admission to top Central Universities across India.',
    description: 'Comprehensive CUET preparation covering Language, Domain Subjects, and General Test. Our approach focuses on NCERT mastery, test-taking strategy, and regular practice.',
    icon: Brain,
    color: '#F43F5E',
    highlights: [
      'Complete coverage of all CUET sections',
      'NCERT-based domain subject preparation',
      'Language proficiency development',
      'General Test aptitude and reasoning',
      'University-specific cutoff guidance',
      'Regular mock tests with performance tracking'
    ],
    subjects: ['Languages', 'Domain Subjects', 'General Test'],
    eligibility: 'Class 12 pass or appearing',
    examPattern: {
      mode: 'Online (CBT)',
      duration: '45-60 min per section',
      sections: 'Section IA/IB (Languages), Section II (Domain), Section III (General)',
      questions: '40-50 per section',
      marking: '+5 correct, -1 wrong'
    },
    preparationTips: [
      'NCERT textbooks are the primary source — master them',
      'Practice reading comprehension for language sections',
      'Focus on domain subjects relevant to your desired course',
      'Attempt full-length mocks to manage time across sections',
      'Research university-specific requirements and cutoffs early'
    ],
    ctaLabel: 'Start CUET preparation',
    ctaLink: '/#book-session',
    isDetailed: true
  },
  {
    id: 'clat',
    slug: 'clat',
    name: 'CLAT Exam Preparation',
    shortName: 'CLAT',
    category: 'Law',
    tagline: 'Prepare for CLAT and secure admission to top National Law Universities.',
    description: 'Comprehensive CLAT preparation with focus on English, Current Affairs, Legal Reasoning, Logical Reasoning, and Quantitative Techniques. Build strong comprehension and analytical skills.',
    icon: Scale,
    color: '#10B981',
    highlights: [
      'Passage-based preparation aligned with new CLAT pattern',
      'Legal reasoning and legal awareness building',
      'Current affairs and GK comprehensive coverage',
      'English comprehension and vocabulary development',
      'Logical reasoning practice with diverse question types',
      'Full-length mock CLATs with detailed analysis'
    ],
    subjects: ['English Language', 'Current Affairs & GK', 'Legal Reasoning', 'Logical Reasoning', 'Quantitative Techniques'],
    eligibility: 'Class 12 pass or appearing (no minimum marks for General)',
    examPattern: {
      mode: 'Offline (Pen & Paper)',
      duration: '2 hours',
      sections: 'English, GK, Legal Reasoning, Logical Reasoning, Quantitative Techniques',
      questions: '150 MCQs',
      marking: '+1 correct, -0.25 wrong'
    },
    preparationTips: [
      'Read passages daily — CLAT is comprehension-heavy',
      'Follow legal news and landmark judgments regularly',
      'Build a strong vocabulary through reading editorials',
      'Practice logical reasoning puzzles and analytical questions',
      'Take full-length mocks to build reading speed and stamina'
    ],
    ctaLabel: 'Start CLAT preparation',
    ctaLink: '/#book-session',
    isDetailed: true
  },
  {
    id: 'nda',
    slug: 'nda',
    name: 'NDA Exam Preparation',
    shortName: 'NDA',
    category: 'Defence',
    tagline: 'Join India\'s prestigious defence forces through NDA entrance.',
    description: 'Prepare for NDA with a structured program covering Mathematics, General Ability, and SSB Interview. Build the knowledge, fitness, and temperament needed for a defence career.',
    icon: Swords,
    color: '#059669',
    highlights: [
      'Complete Mathematics and GAT syllabus coverage',
      'Science, History, Geography, and Current Affairs modules',
      'English grammar and comprehension mastery',
      'Previous year paper analysis and mock tests',
      'SSB interview preparation and personality development',
      'Physical fitness and group discussion guidance'
    ],
    subjects: ['Mathematics', 'General Ability Test (English, GK, Science, History, Geography)'],
    eligibility: 'Class 12 pass or appearing (16.5-19.5 years age, unmarried males)',
    examPattern: {
      mode: 'Offline (Pen & Paper)',
      duration: '2.5 hours per paper',
      sections: 'Paper I: Mathematics, Paper II: General Ability',
      questions: 'Paper I: 120 MCQs, Paper II: 150 MCQs',
      marking: '+2.5 correct, -0.83 wrong (Paper I)'
    },
    preparationTips: [
      'Start with NCERT Mathematics (Class 11 & 12)',
      'Read a quality newspaper daily for current affairs',
      'Focus on English grammar and vocabulary building',
      'Study Indian history and geography systematically',
      'Begin physical fitness preparation alongside academics'
    ],
    ctaLabel: 'Start NDA preparation',
    ctaLink: '/#book-session',
    isDetailed: true
  },
  {
    id: 'ielts',
    slug: 'ielts',
    name: 'IELTS Exam Preparation',
    shortName: 'IELTS',
    category: 'Study Abroad',
    tagline: 'Achieve your target band score in IELTS with expert guidance.',
    description: 'Comprehensive IELTS preparation covering Reading, Writing, Listening, and Speaking modules. Get personalized feedback, mock tests, and strategies to maximize your band score for global opportunities.',
    icon: Globe,
    color: '#E11D48',
    highlights: [
      'Extensive practice for Reading, Writing, Listening, and Speaking',
      'Personalized feedback on writing tasks and speaking interviews',
      'Vocabulary and grammar enhancement modules',
      'Full-length mock tests under real exam conditions',
      'Time management and question-solving strategies',
      'Guidance for both Academic and General Training modules'
    ],
    subjects: ['Reading', 'Writing', 'Listening', 'Speaking'],
    eligibility: 'Anyone looking to study, work, or migrate to an English-speaking country',
    examPattern: {
      mode: 'Paper-based or Computer-delivered',
      duration: '2 hours 45 minutes',
      sections: 'Listening (30 min), Reading (60 min), Writing (60 min), Speaking (11-14 min)',
      questions: 'Varies by section',
      marking: 'Band scale from 1 (Non-user) to 9 (Expert user)'
    },
    preparationTips: [
      'Immerse yourself in English daily (podcasts, news, movies)',
      'Practice skimming and scanning techniques for Reading',
      'Focus on coherence and vocabulary for Writing tasks',
      'Speak naturally and confidently in the Speaking test',
      'Take timed mock tests to build stamina and speed'
    ],
    whatYouLearn: [
      'Understand the complete IELTS test format and scoring criteria',
      'Master proven strategies for Listening, Reading, Writing, and Speaking modules',
      'Expand your vocabulary and grammatical range for a higher band score',
      'Enhance time management skills under actual test conditions'
    ],
    courseTypes: [
      'Academic IELTS Preparation',
      'General Training IELTS Preparation',
      'IELTS Life Skills',
      'UKVI IELTS Preparation'
    ],
    durationInfo: [
      { duration: '2–4 weeks', description: 'Intensive preparation' },
      { duration: '1–3 months', description: 'Regular preparation' },
      { duration: '3–6 months', description: 'For students who need to improve their English significantly' }
    ],
    ctaLabel: 'Start IELTS preparation',
    ctaLink: '/#book-session',
    isDetailed: true
  }
];

/**
 * Get all unique exam categories
 */
export const getExamCategories = () => {
  return [...new Set(examData.map(e => e.category))];
};

/**
 * Get exams filtered by category
 */
export const getExamsByCategory = (category) => {
  if (!category || category === 'All') return examData;
  return examData.filter(e => e.category === category);
};

/**
 * Get a single exam by slug
 */
export const getExamBySlug = (slug) => {
  return examData.find(e => e.slug === slug) || null;
};

export default examData;
