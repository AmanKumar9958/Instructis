/**
 * FAQ data organized by page/section key.
 * Components pull the relevant FAQs by key.
 */
const faqData = {
  homepage: [
    {
      question: 'What is Instructis?',
      answer: 'Instructis is a comprehensive learning platform offering structured programs for competitive exams (JEE, NEET, UPSC, CAT, GATE, SSC, and more), AI & Machine Learning, Coding & Programming, and guided career paths. We combine expert mentorship with technology to deliver personalised learning experiences.'
    },
    {
      question: 'Which competitive exams does Instructis cover?',
      answer: 'We offer preparation programs for JEE (Main & Advanced), NEET UG, UPSC Civil Services, SSC (CGL, CHSL, MTS), Banking (IBPS, SBI), CAT, GATE, CUET, CLAT, and NDA. Each exam has a dedicated program with expert faculty and exam-specific mock tests.'
    },
    {
      question: 'How are the courses structured?',
      answer: 'Each program follows a structured roadmap — from foundational concepts to exam-level mastery. You get live sessions, recorded lectures, practice sets, mock tests, and one-on-one mentoring. The pace is personalised to your learning speed.'
    },
    {
      question: 'Can I try a free session before enrolling?',
      answer: 'Yes! You can book a free doubt session through the form on our homepage. Our mentors will help you understand the program structure and answer any questions about your preparation.'
    },
    {
      question: 'Do you offer offline coaching as well?',
      answer: 'Yes, Instructis has offline centers across India. Visit our Centers page to find the nearest location. We also offer hybrid programs combining online and offline learning.'
    },
    {
      question: 'What makes Instructis different from other platforms?',
      answer: 'Unlike generic video platforms, Instructis provides personalised learning paths, one-on-one mentoring, and structured programs designed by exam toppers and industry experts. Our focus is on consistent progress, not just content delivery.'
    }
  ],

  partner: [
    {
      question: 'What types of partnerships does Instructis offer?',
      answer: 'We offer four partnership models: Content Partner (create courses/content), Institute Partner (integrate our programs into your coaching center), Corporate Partner (employee upskilling programs), and Technology Partner (build EdTech solutions together).'
    },
    {
      question: 'How do I become a partner?',
      answer: 'Fill out the partnership inquiry form on our Partner page. Our partnerships team will review your application and reach out within 48 hours to discuss collaboration opportunities.'
    },
    {
      question: 'What are the benefits of partnering with Instructis?',
      answer: 'Partners get access to our technology platform, a growing student base of 50K+ learners, co-branding opportunities, revenue sharing models, and dedicated partnership support.'
    },
    {
      question: 'Is there a minimum commitment required?',
      answer: 'Partnership terms are flexible and depend on the collaboration model. We work with partners of all sizes — from individual educators to large institutions.'
    },
    {
      question: 'Can coaching institutes integrate Instructis programs?',
      answer: 'Absolutely. Our Institute Partner program is designed specifically for coaching centers looking to enhance their offerings with our technology, content, and assessment tools.'
    }
  ],

  aiMl: [
    {
      question: 'Do I need a math background to learn AI/ML?',
      answer: 'Our program starts with a Mathematics Foundations module covering linear algebra, calculus, and statistics. While prior math knowledge helps, it\'s not required — we build from the ground up.'
    },
    {
      question: 'Which programming language is used?',
      answer: 'We primarily use Python, along with frameworks like PyTorch, TensorFlow, Scikit-learn, and Hugging Face. You\'ll learn Python basics in the first module if you\'re new to programming.'
    },
    {
      question: 'Will I get to build real projects?',
      answer: 'Yes — you\'ll build 5+ portfolio-ready projects including a recommendation system, image classifier, NLP chatbot, and a complete ML pipeline. These projects are designed to showcase your skills to employers.'
    },
    {
      question: 'What career opportunities are available after completing the program?',
      answer: 'Graduates typically pursue roles like ML Engineer, Data Scientist, AI Research Engineer, NLP Engineer, Computer Vision Engineer, or Data Analyst at companies across tech, finance, healthcare, and more.'
    },
    {
      question: 'How long does it take to complete the full AI/ML program?',
      answer: 'The complete roadmap takes approximately 32 weeks (8 months) if followed full-time. Part-time learners typically complete it in 10-12 months. Individual courses can be taken independently.'
    }
  ],

  coding: [
    {
      question: 'I\'m a complete beginner. Can I start with this program?',
      answer: 'Absolutely! Our Programming Fundamentals course is designed for complete beginners. You\'ll learn programming concepts from scratch with hands-on exercises and mentoring support.'
    },
    {
      question: 'Which programming languages will I learn?',
      answer: 'Our core courses cover Python and JavaScript. For DSA, you can choose Python, Java, or C++. Advanced courses cover additional languages and frameworks based on the specialization.'
    },
    {
      question: 'How does the placement support work?',
      answer: 'Once you complete the core program, our placement cell helps with resume building, mock interviews (both technical and behavioral), and connects you with hiring partners. We have 200+ partner companies actively hiring from our pool.'
    },
    {
      question: 'Can I take individual courses instead of the full roadmap?',
      answer: 'Yes, each course is self-contained and can be taken independently. However, following the full roadmap gives you the most comprehensive preparation and better placement outcomes.'
    },
    {
      question: 'What if I get stuck on a problem?',
      answer: 'You get access to mentor doubt sessions, a peer community, and detailed solution walkthroughs. Our mentors are available for one-on-one help when you need it.'
    }
  ]
};

export default faqData;
