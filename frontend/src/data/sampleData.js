// Sample data for development and fallback when backend is unavailable

export const sampleProjects = [
  {
    _id: 'proj-1',
    name: 'E-Commerce Platform Redesign',
    title: 'E-Commerce Platform Redesign',
    description: 'Complete redesign of the online shopping experience with modern UI/UX principles and improved checkout flow',
    status: 'in progress',
    dueDate: '2025-01-15',
    color: '#667eea',
    members: [
      { _id: 'user-1', username: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Frontend Developer' },
      { _id: 'user-2', username: 'Michael Rodriguez', email: 'michael.r@example.com', role: 'UI/UX Designer' },
    ],
    tasks: [
      { _id: 'task-1', title: 'Design homepage mockup', status: 'completed', dueDate: '2025-12-10' },
      { _id: 'task-2', title: 'Implement product catalog', status: 'in progress', dueDate: '2025-12-20' },
      { _id: 'task-3', title: 'Setup payment gateway', status: 'pending', dueDate: '2025-12-28' },
      { _id: 'task-4', title: 'User authentication', status: 'completed', dueDate: '2025-12-08' },
    ],
    createdAt: '2025-11-15T10:00:00Z',
  },
  {
    _id: 'proj-2',
    name: 'Mobile App Development',
    title: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android with cross-platform features and real-time synchronization',
    status: 'active',
    dueDate: '2025-02-28',
    color: '#764ba2',
    members: [
      { _id: 'user-3', username: 'Emily Thompson', email: 'emily.t@example.com', role: 'Mobile Developer' },
      { _id: 'user-4', username: 'David Kim', email: 'david.kim@example.com', role: 'Backend Engineer' },
    ],
    tasks: [
      { _id: 'task-5', title: 'Setup React Native project', status: 'completed', dueDate: '2025-11-25' },
      { _id: 'task-6', title: 'Design app navigation', status: 'in progress', dueDate: '2025-12-18' },
      { _id: 'task-7', title: 'Implement offline mode', status: 'pending', dueDate: '2025-12-30' },
      { _id: 'task-8', title: 'API integration', status: 'in progress', dueDate: '2025-12-22' },
    ],
    createdAt: '2025-11-20T14:30:00Z',
  },
  {
    _id: 'proj-3',
    name: 'Learning Management System',
    title: 'Learning Management System',
    description: 'Educational platform with course management, video streaming, quizzes, and progress tracking for students',
    status: 'completed',
    dueDate: '2025-12-15',
    color: '#10b981',
    members: [
      { _id: 'user-1', username: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Frontend Developer' },
      { _id: 'user-5', username: 'Alex Johnson', email: 'alex.j@example.com', role: 'Full Stack Developer' },
    ],
    tasks: [
      { _id: 'task-9', title: 'Course content upload', status: 'completed', dueDate: '2025-12-01' },
      { _id: 'task-10', title: 'Student dashboard', status: 'completed', dueDate: '2025-12-05' },
      { _id: 'task-11', title: 'Quiz engine', status: 'completed', dueDate: '2025-12-10' },
      { _id: 'task-12', title: 'Certificate generation', status: 'completed', dueDate: '2025-12-12' },
    ],
    createdAt: '2025-10-01T09:00:00Z',
  },
  {
    _id: 'proj-4',
    name: 'Analytics Dashboard',
    title: 'Analytics Dashboard',
    description: 'Real-time data visualization dashboard with customizable widgets and advanced reporting features',
    status: 'in progress',
    dueDate: '2025-03-20',
    color: '#f59e0b',
    members: [
      { _id: 'user-4', username: 'David Kim', email: 'david.kim@example.com', role: 'Backend Engineer' },
      { _id: 'user-6', username: 'Lisa Wang', email: 'lisa.w@example.com', role: 'Data Analyst' },
    ],
    tasks: [
      { _id: 'task-13', title: 'Database schema design', status: 'completed', dueDate: '2025-11-30' },
      { _id: 'task-14', title: 'Chart component library', status: 'in progress', dueDate: '2025-12-20' },
      { _id: 'task-15', title: 'Export functionality', status: 'pending', dueDate: '2026-01-10' },
      { _id: 'task-16', title: 'User permissions', status: 'in progress', dueDate: '2025-12-25' },
    ],
    createdAt: '2025-11-10T11:00:00Z',
  },
  {
    _id: 'proj-5',
    name: 'Social Media Integration',
    title: 'Social Media Integration',
    description: 'Multi-platform social media management tool with scheduling, analytics, and engagement tracking',
    status: 'pending',
    dueDate: '2025-04-15',
    color: '#ef4444',
    members: [
      { _id: 'user-2', username: 'Michael Rodriguez', email: 'michael.r@example.com', role: 'UI/UX Designer' },
      { _id: 'user-7', username: 'James Miller', email: 'james.m@example.com', role: 'DevOps Engineer' },
    ],
    tasks: [
      { _id: 'task-17', title: 'API research', status: 'completed', dueDate: '2025-12-05' },
      { _id: 'task-18', title: 'OAuth implementation', status: 'pending', dueDate: '2025-12-30' },
      { _id: 'task-19', title: 'Content scheduler', status: 'pending', dueDate: '2026-01-15' },
      { _id: 'task-20', title: 'Analytics pipeline', status: 'pending', dueDate: '2026-01-20' },
    ],
    createdAt: '2025-11-28T16:00:00Z',
  },
  {
    _id: 'proj-6',
    name: 'Customer Support Portal',
    title: 'Customer Support Portal',
    description: 'Comprehensive ticketing system with live chat, knowledge base, and automated response features',
    status: 'active',
    dueDate: '2025-02-10',
    color: '#06b6d4',
    members: [
      { _id: 'user-3', username: 'Emily Thompson', email: 'emily.t@example.com', role: 'Full Stack Developer' },
      { _id: 'user-8', username: 'Robert Brown', email: 'robert.b@example.com', role: 'QA Engineer' },
    ],
    tasks: [
      { _id: 'task-21', title: 'Ticket system backend', status: 'completed', dueDate: '2025-12-01' },
      { _id: 'task-22', title: 'Live chat widget', status: 'in progress', dueDate: '2025-12-19' },
      { _id: 'task-23', title: 'Knowledge base CMS', status: 'in progress', dueDate: '2025-12-27' },
      { _id: 'task-24', title: 'Email notifications', status: 'pending', dueDate: '2026-01-05' },
    ],
    createdAt: '2025-11-05T13:30:00Z',
  },
]

export const sampleResumes = [
  {
    _id: 'resume-1',
    id: 'resume-1',
    candidateName: 'Alexander Bennett',
    email: 'alex.bennett@email.com',
    phone: '+1 (555) 123-4567',
    company: 'Google',
    jobRole: 'Senior Frontend Developer',
    status: 'selected',
    jobUrl: 'https://careers.google.com/jobs/frontend-developer',
    jobDescription: 'Looking for an experienced frontend developer to lead our web application team. Must have expertise in React, TypeScript, and modern CSS frameworks. 8+ years experience required.',
    notes: 'Great company culture. Team of 15 developers. Remote-friendly position. Mountain View, CA. $150k-180k salary range.',
    experience: '10 years in full-stack web development. Led teams of 5+ developers. Expert in React, Vue, Angular.',
    skills: ['React', 'TypeScript', 'CSS3', 'Node.js', 'AWS', 'Docker', 'Agile'],
    resumeFilename: 'Bennett_Alexander_Frontend.pdf',
    cvFilename: 'CoverLetter_TechCorp.pdf',
    selectionReasons: 'Strong technical interview performance. Portfolio with 5+ production projects impressed the hiring manager. Perfect culture fit with team values.',
    offerSalary: '$165,000 - $175,000',
    startDate: '2026-01-15',
    createdAt: '2025-11-20T10:30:00Z',
    appliedDate: '2025-11-20',
  },
  {
    _id: 'resume-2',
    id: 'resume-2',
    candidateName: 'Maria Gonzalez',
    email: 'maria.gonzalez@email.com',
    phone: '+1 (555) 234-5678',
    company: 'Stripe',
    jobRole: 'Full Stack Engineer',
    status: 'pending',
    jobUrl: 'https://stripe.com/careers/fullstack',
    jobDescription: 'Join our fast-paced team as a full stack engineer. Work with Node.js, React, PostgreSQL, and AWS. Equity offered. 5+ years experience required.',
    notes: 'Leading payments platform. Series E funded. Exciting product in fintech space. High growth potential. 20% equity vesting over 4 years. San Francisco, CA.',
    experience: '7 years building scalable web applications. Worked at 2 startups (Series A & B). Strong in backend architecture.',
    skills: ['Node.js', 'React', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Linux'],
    resumeFilename: 'Gonzalez_Maria_FullStack.pdf',
    cvFilename: null,
    interviewDate: '2025-12-18T14:00:00Z',
    expectedResponse: '2025-12-22',
    createdAt: '2025-12-01T14:15:00Z',
    appliedDate: '2025-12-01',
  },
  {
    _id: 'resume-3',
    id: 'resume-3',
    candidateName: 'James Chen',
    email: 'james.chen@email.com',
    phone: '+1 (555) 345-6789',
    company: 'Apple',
    jobRole: 'UI/UX Designer',
    status: 'rejected',
    jobUrl: 'https://apple.com/jobs/ux-designer',
    jobDescription: 'Creative UI/UX designer needed for enterprise software projects. Figma and Adobe XD expertise required. 6+ years experience.',
    notes: 'Competitive salary. Hybrid work model (3 days office). Cupertino, CA. Strong portfolio required. $130k-160k.',
    experience: '8 years in digital design. Previously at Google and Adobe. 50+ published design systems.',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping', 'Interaction Design'],
    resumeFilename: 'Chen_James_UXDesigner.pdf',
    cvFilename: 'Portfolio_ChenJames.pdf',
    rejectionReasons: 'Position filled internally by promoted designer. Strong candidate - encouraged to apply for future senior design role opening in Q2 2026.',
    rejectionDate: '2025-11-28',
    createdAt: '2025-11-15T09:00:00Z',
    appliedDate: '2025-11-15',
  },
  {
    _id: 'resume-4',
    id: 'resume-4',
    candidateName: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+1 (555) 456-7890',
    company: 'Amazon Web Services (AWS)',
    jobRole: 'DevOps Engineer',
    status: 'pending',
    jobUrl: 'https://aws.amazon.com/careers/devops',
    jobDescription: 'DevOps engineer to manage our cloud infrastructure. Experience with Kubernetes, Docker, and CI/CD pipelines essential. 7+ years required.',
    notes: 'Focus on AWS infrastructure and Terraform. On-call rotation required. Great benefits package. Seattle, WA. $140k-160k.',
    experience: '9 years managing infrastructure. 3 years Kubernetes specialist. Led migration of 100+ microservices to cloud.',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'Jenkins', 'GitLab CI', 'Prometheus', 'Linux'],
    resumeFilename: 'Patel_Priya_DevOps.pdf',
    cvFilename: 'CoverLetter_CloudScale.pdf',
    interviewDate: '2025-12-20T10:00:00Z',
    expectedResponse: '2025-12-24',
    createdAt: '2025-12-05T11:45:00Z',
    appliedDate: '2025-12-05',
  },
  {
    _id: 'resume-5',
    id: 'resume-5',
    candidateName: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1 (555) 567-8901',
    company: 'Spotify',
    jobRole: 'Product Manager',
    status: 'selected',
    jobUrl: 'https://spotify.com/careers/pm-position',
    jobDescription: 'Product Manager to drive our audio platform roadmap. Experience with agile methodologies and customer research required. 5+ years PM experience.',
    notes: 'Leading music streaming platform. 500M+ users worldwide. Strong product-market fit. Stockholm, Sweden + NYC office. $180k-220k + 0.5-1% equity.',
    experience: '8 years product management. 4 years at Slack. Led product teams through Series B funding. Track record: 3 successful product launches.',
    skills: ['Product Strategy', 'Roadmapping', 'User Research', 'Data Analysis', 'Agile', 'Analytics', 'Leadership'],
    resumeFilename: 'Wilson_Sarah_PM.pdf',
    cvFilename: null,
    selectionReasons: 'Excellent product sense demonstrated in case study. 4 years at Slack shows proven SaaS expertise. Strong leadership and communication skills.',
    offerSalary: '$200,000 - $210,000',
    equity: '0.75%',
    startDate: '2026-02-01',
    createdAt: '2025-11-25T16:20:00Z',
    appliedDate: '2025-11-25',
  },
  {
    _id: 'resume-6',
    id: 'resume-6',
    candidateName: 'Dr. Raj Krishnan',
    email: 'raj.krishnan@email.com',
    phone: '+1 (555) 678-9012',
    company: 'OpenAI',
    jobRole: 'Machine Learning Engineer',
    status: 'pending',
    jobUrl: 'https://openai.com/careers/ml-engineer',
    jobDescription: 'ML Engineer to develop and deploy machine learning models for our AI products. Python, TensorFlow, and cloud ML platforms experience needed. PhD or 5+ years research.',
    notes: 'Working on cutting-edge LLM and AI projects. Published research team. PhD preferred but not required. San Francisco, CA. $160k-190k.',
    experience: 'PhD in Machine Learning from Stanford. 6 years industry experience at OpenAI and DeepMind. 12 published papers. 5+ ML models in production.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'MLOps', 'Google Cloud', 'Research'],
    publications: [
      'Transformer Architecture Optimization (NeurIPS 2024)',
      'Efficient Attention Mechanisms (ICML 2023)',
      'Language Model Interpretability (ACL 2023)',
    ],
    resumeFilename: 'Krishnan_Raj_ML_Engineer.pdf',
    cvFilename: 'Research_Papers_Summary.pdf',
    interviewDate: '2025-12-28T15:00:00Z',
    expectedResponse: '2026-01-10',
    createdAt: '2025-12-10T13:00:00Z',
    appliedDate: '2025-12-10',
  },
]

// Helper function to get sample data with localStorage sync
export function getSampleProjects() {
  try {
    const stored = localStorage.getItem('sample_projects')
    if (stored) {
      return JSON.parse(stored)
    }
    localStorage.setItem('sample_projects', JSON.stringify(sampleProjects))
    return sampleProjects
  } catch {
    return sampleProjects
  }
}

export function getSampleResumes() {
  try {
    const stored = localStorage.getItem('resume_vault')
    if (stored) {
      return JSON.parse(stored)
    }
    localStorage.setItem('resume_vault', JSON.stringify(sampleResumes))
    return sampleResumes
  } catch {
    return sampleResumes
  }
}

// Sample AI Courses
export const sampleCourses = [
  {
    _id: 'course-1',
    id: 'course-1',
    title: 'Master Machine Learning with Python',
    description: 'Comprehensive guide to machine learning from fundamentals to advanced techniques. Learn supervised and unsupervised learning with real-world projects.',
    instructor: 'Dr. Andrew Ng',
    instructorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=andrew',
    category: 'Machine Learning',
    level: 'Beginner to Advanced',
    rating: 4.8,
    reviews: 2847,
    price: 99,
    isPremium: true,
    image: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Machine+Learning+Python',
    duration: '40 hours',
    students: 15420,
    modules: 12,
    lessons: 156,
    description_long: 'Master the fundamentals and advanced concepts of Machine Learning. This course covers Python libraries like TensorFlow, Keras, and Scikit-learn with hands-on projects.',
    tags: ['AI', 'Python', 'TensorFlow', 'Data Science'],
    createdAt: '2025-01-15',
  },
  {
    _id: 'course-2',
    id: 'course-2',
    title: 'Generative AI: Prompt Engineering Mastery',
    description: 'Learn advanced prompt engineering techniques for ChatGPT, Claude, and other LLMs. Create powerful AI applications with effective prompting strategies.',
    instructor: 'Sarah Chen',
    instructorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    category: 'Generative AI',
    level: 'Intermediate',
    rating: 4.9,
    reviews: 3521,
    price: 79,
    isPremium: true,
    image: 'https://via.placeholder.com/400x300/f093fb/ffffff?text=Generative+AI+Prompting',
    duration: '24 hours',
    students: 8923,
    modules: 8,
    lessons: 92,
    description_long: 'Master the art and science of prompt engineering. Learn how to craft effective prompts that maximize AI output quality and consistency.',
    tags: ['GPT', 'Prompt Engineering', 'LLM', 'Generative AI'],
    createdAt: '2025-02-20',
  },
  {
    _id: 'course-3',
    id: 'course-3',
    title: 'Deep Learning Specialization',
    description: 'Advanced deep learning course covering neural networks, CNNs, RNNs, transformers, and modern architectures. Includes computer vision and NLP projects.',
    instructor: 'Prof. Yann LeCun',
    instructorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yann',
    category: 'Deep Learning',
    level: 'Advanced',
    rating: 4.7,
    reviews: 1923,
    price: 149,
    isPremium: true,
    image: 'https://via.placeholder.com/400x300/4facfe/ffffff?text=Deep+Learning',
    duration: '60 hours',
    students: 5234,
    modules: 16,
    lessons: 198,
    description_long: 'Deep dive into neural networks and deep learning architectures. Build models from scratch and understand the mathematics behind modern AI.',
    tags: ['Deep Learning', 'Neural Networks', 'PyTorch', 'Computer Vision'],
    createdAt: '2025-03-10',
  },
  {
    _id: 'course-4',
    id: 'course-4',
    title: 'Natural Language Processing (NLP) Essentials',
    description: 'Master NLP techniques including text preprocessing, tokenization, transformers, and language models. Build chatbots and text analysis applications.',
    instructor: 'Alex Kumar',
    instructorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    category: 'NLP',
    level: 'Intermediate',
    rating: 4.6,
    reviews: 2341,
    price: 89,
    isPremium: true,
    image: 'https://via.placeholder.com/400x300/43e97b/ffffff?text=NLP+Essentials',
    duration: '32 hours',
    students: 6789,
    modules: 10,
    lessons: 124,
    description_long: 'Learn to process and understand human language using cutting-edge NLP techniques and transformer models.',
    tags: ['NLP', 'BERT', 'Transformers', 'Text Analysis'],
    createdAt: '2025-02-05',
  },
  {
    _id: 'course-5',
    id: 'course-5',
    title: 'Computer Vision for AI Applications',
    description: 'Complete guide to computer vision using OpenCV and deep learning. Image classification, object detection, segmentation, and face recognition projects.',
    instructor: 'Emma Roberts',
    instructorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    category: 'Computer Vision',
    level: 'Intermediate to Advanced',
    rating: 4.8,
    reviews: 2056,
    price: 109,
    isPremium: true,
    image: 'https://via.placeholder.com/400x300/fa709a/ffffff?text=Computer+Vision',
    duration: '48 hours',
    students: 7234,
    modules: 14,
    lessons: 167,
    description_long: 'Explore the world of computer vision. Build applications that can see, understand, and analyze images like humans.',
    tags: ['Computer Vision', 'OpenCV', 'Image Processing', 'Object Detection'],
    createdAt: '2025-01-28',
  },
  {
    _id: 'course-6',
    id: 'course-6',
    title: 'Building AI Products: End-to-End Development',
    description: 'Learn to build, deploy, and scale AI products. From data collection to model deployment, cloud infrastructure, and MLOps best practices.',
    instructor: 'Michael Zhang',
    instructorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    category: 'AI Engineering',
    level: 'Advanced',
    rating: 4.7,
    reviews: 1567,
    price: 129,
    isPremium: true,
    image: 'https://via.placeholder.com/400x300/30cfd0/ffffff?text=AI+Products',
    duration: '56 hours',
    students: 4123,
    modules: 15,
    lessons: 180,
    description_long: 'Master the complete pipeline of building production-ready AI applications from concept to deployment.',
    tags: ['MLOps', 'Deployment', 'Production', 'AI Engineering'],
    createdAt: '2025-03-05',
  },
  {
    _id: 'course-7',
    id: 'course-7',
    title: 'AI Fundamentals: Start Your AI Journey',
    description: 'Perfect beginner course to understand AI basics, machine learning concepts, and how to get started with Python and data science.',
    instructor: 'Lisa Wong',
    instructorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    category: 'AI Fundamentals',
    level: 'Beginner',
    rating: 4.9,
    reviews: 5234,
    price: 49,
    isPremium: false,
    image: 'https://via.placeholder.com/400x300/fed6e3/ffffff?text=AI+Fundamentals',
    duration: '16 hours',
    students: 12456,
    modules: 6,
    lessons: 78,
    description_long: 'Start your artificial intelligence journey with this comprehensive beginner-friendly course covering all fundamental concepts.',
    tags: ['Beginner', 'AI Basics', 'Python', 'Free'],
    createdAt: '2025-03-01',
  },
  {
    _id: 'course-8',
    id: 'course-8',
    title: 'Reinforcement Learning: From Theory to Practice',
    description: 'Advanced course on reinforcement learning algorithms, Q-learning, policy gradients, and building autonomous agents for games and robotics.',
    instructor: 'David Park',
    instructorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    category: 'Reinforcement Learning',
    level: 'Advanced',
    rating: 4.6,
    reviews: 892,
    price: 119,
    isPremium: true,
    image: 'https://via.placeholder.com/400x300/a8edea/ffffff?text=Reinforcement+Learning',
    duration: '44 hours',
    students: 3421,
    modules: 12,
    lessons: 142,
    description_long: 'Master the principles and practice of reinforcement learning to build intelligent agents.',
    tags: ['Reinforcement Learning', 'Agents', 'Q-Learning', 'Robotics'],
    createdAt: '2025-02-14',
  },
]

export const getSampleCourses = () => {
  try {
    const stored = localStorage.getItem('ai_courses')
    if (stored) {
      return JSON.parse(stored)
    }
    localStorage.setItem('ai_courses', JSON.stringify(sampleCourses))
    return sampleCourses
  } catch {
    return sampleCourses
  }
}

// User Enrolled Courses (for progress tracking)
export const sampleEnrolledCourses = [
  {
    _id: 'enrolled-1',
    courseId: 'course-1',
    courseName: 'Master Machine Learning with Python',
    instructor: 'Dr. Andrew Ng',
    enrolledDate: '2025-11-01',
    completionPercentage: 65,
    currentModule: 8,
    totalModules: 12,
    currentLesson: 102,
    totalLessons: 156,
    lastAccessedDate: '2025-12-14',
    certificateEarned: false,
    notes: 'Great course! Learning a lot about neural networks.',
    bookmarkedLessons: ['lesson-45', 'lesson-67', 'lesson-89'],
  },
  {
    _id: 'enrolled-2',
    courseId: 'course-2',
    courseName: 'Generative AI: Prompt Engineering Mastery',
    instructor: 'Sarah Chen',
    enrolledDate: '2025-11-15',
    completionPercentage: 92,
    currentModule: 8,
    totalModules: 8,
    currentLesson: 88,
    totalLessons: 92,
    lastAccessedDate: '2025-12-15',
    certificateEarned: false,
    notes: 'Almost complete! Amazing insights on prompt optimization.',
    bookmarkedLessons: ['lesson-12', 'lesson-34'],
  },
  {
    _id: 'enrolled-3',
    courseId: 'course-4',
    courseName: 'Natural Language Processing (NLP) Essentials',
    instructor: 'Alex Kumar',
    enrolledDate: '2025-10-20',
    completionPercentage: 45,
    currentModule: 5,
    totalModules: 10,
    currentLesson: 56,
    totalLessons: 124,
    lastAccessedDate: '2025-12-13',
    certificateEarned: false,
    notes: 'Building a sentiment analysis project as assignment.',
    bookmarkedLessons: ['lesson-8', 'lesson-23', 'lesson-41'],
  },
  {
    _id: 'enrolled-4',
    courseId: 'course-7',
    courseName: 'AI Fundamentals: Start Your AI Journey',
    instructor: 'Lisa Wong',
    enrolledDate: '2025-12-01',
    completionPercentage: 28,
    currentModule: 2,
    totalModules: 6,
    currentLesson: 22,
    totalLessons: 78,
    lastAccessedDate: '2025-12-14',
    certificateEarned: false,
    notes: 'Great foundation course! Solidifying my AI basics.',
    bookmarkedLessons: [],
  },
]

export const getEnrolledCourses = () => {
  try {
    const stored = localStorage.getItem('enrolled_courses')
    if (stored) {
      return JSON.parse(stored)
    }
    localStorage.setItem('enrolled_courses', JSON.stringify(sampleEnrolledCourses))
    return sampleEnrolledCourses
  } catch {
    return sampleEnrolledCourses
  }
}

// Generate course from prompt using AI-like logic
export const generateCourseFromPrompt = (prompt) => {
  const courseId = `generated-${Date.now()}`
  
  // Extract keywords from prompt
  const keywords = prompt.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  
  const categoryMap = {
    'machine learning': 'Machine Learning',
    'deep learning': 'Deep Learning',
    'nlp': 'NLP',
    'vision': 'Computer Vision',
    'computer': 'Computer Vision',
    'reinforcement': 'Reinforcement Learning',
    'generative': 'Generative AI',
    'prompt': 'Generative AI',
    'llm': 'Generative AI',
    'engineering': 'AI Engineering',
    'devops': 'AI Engineering',
  }

  const instructors = ['Dr. Alex Johnson', 'Prof. Maria Garcia', 'Michael Chen', 'Sarah Williams', 'David Kumar', 'Emma Thompson']
  const randomInstructor = instructors[Math.floor(Math.random() * instructors.length)]

  let category = 'AI Fundamentals'
  for (const [key, value] of Object.entries(categoryMap)) {
    if (keywords.some(w => w.includes(key))) {
      category = value
      break
    }
  }

  const levels = ['Beginner', 'Intermediate', 'Advanced']
  const level = keywords.includes('advanced') ? 'Advanced' : keywords.includes('intermediate') ? 'Intermediate' : 'Beginner'

  const modules = keywords.includes('advanced') ? 16 : keywords.includes('intermediate') ? 10 : 6
  const lessons = modules * (keywords.includes('advanced') ? 12 : 10)
  const hours = Math.round(lessons / 2)
  const price = keywords.includes('free') ? 0 : keywords.includes('premium') ? Math.floor(Math.random() * 50) + 100 : Math.floor(Math.random() * 50) + 50

  const tags = keywords.slice(0, 4).map(k => k.charAt(0).toUpperCase() + k.slice(1))

  const colors = ['667eea', 'f093fb', '4facfe', '43e97b', 'fa709a', '30cfd0', 'a8edea', 'fed6e3']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const image = `https://via.placeholder.com/400x300/${randomColor}/ffffff?text=${encodeURIComponent(prompt)}`

  const newCourse = {
    _id: courseId,
    id: courseId,
    title: prompt.charAt(0).toUpperCase() + prompt.slice(1),
    description: `Master ${prompt.toLowerCase()}. This comprehensive course covers all essential concepts with practical, real-world projects and hands-on learning.`,
    instructor: randomInstructor,
    instructorImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomInstructor.replace(/\s/g, '')}`,
    category: category,
    level: level,
    rating: (Math.random() * 0.4 + 4.5).toFixed(1),
    reviews: Math.floor(Math.random() * 3000) + 500,
    price: price,
    isPremium: price > 0,
    image: image,
    duration: `${hours} hours`,
    students: Math.floor(Math.random() * 10000) + 1000,
    modules: modules,
    lessons: lessons,
    description_long: `Comprehensive course on ${prompt.toLowerCase()}. Learn from industry experts and work on real-world projects. Gain practical skills and knowledge from fundamentals to advanced concepts.`,
    tags: tags,
    createdAt: new Date().toISOString().split('T')[0],
    isGenerated: true,
  }

  return newCourse
}

// Get all courses (sample + generated)
export const getAllCourses = () => {
  const allCourses = getSampleCourses()
  const generatedCourses = getGeneratedCourses()
  return [...allCourses, ...generatedCourses]
}

// Get generated courses from localStorage
export const getGeneratedCourses = () => {
  try {
    const stored = localStorage.getItem('generated_courses')
    if (stored) {
      return JSON.parse(stored)
    }
    return []
  } catch {
    return []
  }
}

// Save a generated course
export const saveGeneratedCourse = (course) => {
  try {
    const generatedCourses = getGeneratedCourses()
    generatedCourses.push(course)
    localStorage.setItem('generated_courses', JSON.stringify(generatedCourses))
    return course
  } catch (error) {
    console.error('Failed to save generated course:', error)
    return null
  }
}
