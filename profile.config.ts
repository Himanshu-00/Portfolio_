// profile.config.ts

const CONFIG = {
  github: {
    username: 'Himanshu-00',
  },

  // GitHub projects tile: shows your OWN repos that you have starred on GitHub,
  // most recently starred first. Star a repo to feature it, unstar to hide it.
  projects: {
    display: true,
    header: 'GitHub Projects',
    limit: 4, // 4 fills the 2x2 tile
  },

  seo: {
    title: 'Portfolio of Himanshu Vinchurkar',
    description: '',
    imageURL: '',
  },

  social: {
    linkedin: 'himanshu-vinchurkar-9b414322b',
    email: 'himanshuvinchurkar1387@gmail.com',
  },

  resume: {
    // Empty fileUrl hides the Resume tile.
    fileUrl:
      'https://drive.google.com/file/d/1edyVICh2rfbVz3AnPuUiO7CU4av-UdOp/view?usp=sharing',
  },

  skills: [
    'Python',
    'NumPy',
    'Pandas',
    'Matplotlib',
    'Seaborn',
    'Scikit-learn',
    'TensorFlow',
    'PyTorch',
    'Keras',
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing (NLP)',
    'Computer Vision',
    'Model Evaluation & Tuning',
    'Feature Engineering',
    'SQL',
    'PostgreSQL',
    'Git',
    'Docker',
    'REST APIs',
    'ML Model Deployment',
    'AWS / GCP (Basics)',
    'Jupyter Notebook',
  ],

  certifications: [
    {
      name: 'Oracle Cloud Infrastructure Data Science',
      body: 'Oracle',
      year: 'Oct 2025',
      link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=AA6817A71872B653DAAED6FEFA5560F06687989B013E7E2C8C6B34697F852793',
    },
    {
      name: 'Custom Models, Layers, and Loss Functions with TensorFlow',
      body: 'DeepLearning.AI',
      year: 'Mar 2024',
      link: 'https://www.coursera.org/account/accomplishments/certificate/DNJXA6346787',
    },
  ],

  educations: [
    {
      institution: 'Monash University',
      degree: 'Master of Data Science',
      from: '2026',
      to: '2027(Expected)',
    },
    {
      institution: 'University of Mumbai',
      degree: 'Computer Science & Engineering(AI & ML)',
      from: '2020',
      to: '2024',
    },
  ],

  googleAnalytics: {
    id: '', // GA4 tag id G-XXXXXXXXXX
  },

  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: { id: '', snippetVersion: 6 },

  enablePWA: true,

  // Shows the "Open to internships" pill on the profile tile. Set to false to hide it.
  openToInternships: true,

  // "Currently working on" tile. Up to 3 items look best.
  // Optional per item: description, tags, link, progress (0-100) + status,
  // or start/end dates (+ terms) to have progress worked out automatically.
  currentlyWorkingOn: [
    {
      type: 'Project',
      title: 'Semantic Spotlight Island',
      description:
        'A context-aware Spotlight that understands what your files contain, so you can find them by describing them instead of remembering their names.',
      // What you're doing on it right now + the date you last changed this line.
      now: 'Building the first working prototype',
      updated: '2026-09-26',
    },
    {
      type: 'Study',
      title: 'Master of Data Science, Monash',
      description:
        'Statistical modelling, big-data processing and ML at scale.',
      // Progress + "Semester X of 4" update automatically from these dates.
      start: '2026-01-01',
      end: '2027-12-31',
      terms: 4,
    },
  ],
};

export default CONFIG;
