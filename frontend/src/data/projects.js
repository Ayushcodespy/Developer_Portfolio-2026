export const projects = [
  {
    id: 'ai-faq-chatbot',
    title: 'AI FAQ Chatbot',
    subtitle: 'RAG Based AI Application',
    description: 'Built a full-stack AI chatbot with a responsive ReactJS frontend and Python/FastAPI backend integrated with PostgreSQL for semantic document retrieval.',
    technologies: ['Python', 'FastAPI', 'ReactJS', 'PostgreSQL', 'VectorDB'],
    keyPoints: [
      'Retrieval-Augmented Generation (RAG)',
      'Semantic document retrieval',
      'REST APIs',
      'Context-aware responses',
      'Modular backend architecture',
      'API performance optimization',
      'Testing and debugging'
    ],
    category: 'ai-rag',
    positioning: 'AI / Backend / Full Stack',
    github: 'https://github.com/Ayushcodespy/FAQ-Chatbot-MPOnline.git',
    liveDemo: null,
    featured: true,
    visualType: 'ai-chatbot',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop'
  },
  {
    id: 'green-grains',
    title: 'Green & Grains Grocery Platform',
    subtitle: 'Full-Stack Grocery Platform',
    description: 'Built a full-stack grocery platform with JWT authentication, role-based access control, PostgreSQL-backed REST APIs, inventory management, order processing, and an admin dashboard.',
    technologies: ['FastAPI', 'React', 'Flutter', 'PostgreSQL'],
    keyPoints: [
      'FastAPI backend',
      'React interface',
      'Flutter application',
      'PostgreSQL',
      'JWT authentication',
      'Role-based access control',
      'Inventory management',
      'Order processing',
      'Admin dashboard',
      'Real-time data handling'
    ],
    category: 'full-stack',
    positioning: 'Full Stack / E-Commerce / Backend',
    github: null,
    liveDemo: null,
    featured: false,
    visualType: 'grocery-platform',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop'
  },
  {
    id: 'agro-trade-portal',
    title: 'Agro-Trade Portal',
    subtitle: 'Inventory & Billing Management System',
    description: 'Developed a Django-based inventory and billing management system with secure authentication, CRUD operations, dashboards, inventory tracking, sales monitoring, and centralized business records.',
    technologies: ['Django', 'SQL'],
    keyPoints: [
      'Django',
      'SQL',
      'Authentication',
      'CRUD operations',
      'Inventory management',
      'Billing',
      'Sales monitoring',
      'Dashboard',
      'Centralized business records',
      'Workflow automation'
    ],
    category: 'django',
    positioning: 'Django / Business Application / Database',
    github: null,
    liveDemo: null,
    featured: false,
    visualType: 'inventory-dashboard',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'
  }
]

export const projectCategories = [
  { id: 'all', label: 'All' },
  { id: 'ai-rag', label: 'AI / RAG' },
  { id: 'full-stack', label: 'Full Stack' },
  { id: 'backend', label: 'Backend' },
  { id: 'django', label: 'Django' }
]
