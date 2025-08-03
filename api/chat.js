// /api/chat.js - Enhanced Vercel Serverless Function with Advanced Portfolio Data
import axios from "axios";
import * as cheerio from "cheerio";

// Enhanced Portfolio Database - Comprehensive Information
const ENHANCED_PORTFOLIO_DATABASE = {
  personalInfo: {
    name: "Azriel Rosadi",
    title: "Fullstack Developer",
    location: "Jakarta, Indonesia",
    email: "azrlwebdev@gmail.com",
    portfolioUrl: "https://azrl-webdev.vercel.app",
    bio: "Seorang Fullstack Developer berpengalaman dengan passion dalam mengembangkan aplikasi web modern dan inovatif. Fokus pada kualitas, efisiensi, dan pengalaman pengguna yang optimal.",
    tagline: "Transforming Ideas into Digital Reality",
    yearsExperience: "2+",
    projectsCompleted: 25,
    clientRetentionRate: 90,
    responseTime: "< 24 jam",
    availability: "Open for freelance projects",
    timezone: "WIB (UTC+7)",
  },

  socialLinks: {
    github: "https://github.com/AzrielRosadi",
    linkedin: "https://www.linkedin.com/in/azriel-rosadi-aa2859343/",
    instagram: "https://www.instagram.com/azrlrsdi_/",
    email: "mailto:azrlwebdev@gmail.com",
  },

  counterStats: [
    { value: 0, suffix: "+", label: "Fresh Graduate", icon: "🎓" },
    { value: 4, suffix: "+", label: "Happy Clients", icon: "😊" },
    { value: 25, suffix: "+", label: "Completed Projects", icon: "🚀" },
    { value: 90, suffix: "%", label: "Client Retention Rate", icon: "⭐" },
  ],

  coreAbilities: [
    {
      title: "Quality Focus",
      description:
        "Memberikan hasil berkualitas tinggi dengan tetap memperhatikan setiap detail.",
      icon: "🎯",
      skills: ["Code Quality", "Testing", "Documentation", "Best Practices"],
    },
    {
      title: "Reliable Communication",
      description:
        "Menjaga Anda tetap mendapat informasi terkini pada setiap langkah untuk memastikan transparansi dan kejelasan.",
      icon: "💬",
      skills: [
        "Daily Updates",
        "Clear Documentation",
        "Responsive Communication",
        "Project Transparency",
      ],
    },
    {
      title: "On-Time Delivery",
      description:
        "Memastikan proyek selesai sesuai jadwal, dengan kualitas & perhatian terhadap detail.",
      icon: "⏰",
      skills: [
        "Project Management",
        "Time Estimation",
        "Milestone Tracking",
        "Quality Assurance",
      ],
    },
  ],

  technicalSkills: {
    frontend: [
      { name: "React", level: 90, experience: "2+ years", projects: 15 },
      { name: "Next.js", level: 85, experience: "1+ years", projects: 8 },
      { name: "TypeScript", level: 88, experience: "1.5+ years", projects: 12 },
      { name: "JavaScript", level: 92, experience: "2+ years", projects: 20 },
      { name: "TailwindCSS", level: 90, experience: "2+ years", projects: 18 },
      { name: "HTML5", level: 95, experience: "3+ years", projects: 25 },
      { name: "CSS3", level: 90, experience: "3+ years", projects: 25 },
      { name: "Sass/SCSS", level: 82, experience: "1+ years", projects: 8 },
    ],
    backend: [
      { name: "Node.js", level: 87, experience: "2+ years", projects: 12 },
      { name: "Express.js", level: 85, experience: "1.5+ years", projects: 10 },
      { name: "Laravel", level: 88, experience: "1+ years", projects: 6 },
      { name: "PHP", level: 85, experience: "1.5+ years", projects: 8 },
      { name: "Python", level: 80, experience: "1+ years", projects: 5 },
      { name: "Go", level: 70, experience: "6 months", projects: 2 },
    ],
    database: [
      { name: "PostgreSQL", level: 85, experience: "1+ years", projects: 8 },
      { name: "MySQL", level: 88, experience: "2+ years", projects: 12 },
      { name: "MongoDB", level: 82, experience: "1+ years", projects: 6 },
      { name: "Drizzle ORM", level: 80, experience: "6 months", projects: 4 },
    ],
    tools: [
      { name: "Git", level: 90, experience: "2+ years", projects: 25 },
      { name: "Docker", level: 75, experience: "6 months", projects: 3 },
      { name: "Vercel", level: 88, experience: "1+ years", projects: 15 },
      { name: "Unity", level: 85, experience: "1+ years", projects: 2 },
      { name: "Figma", level: 80, experience: "1+ years", projects: 10 },
      { name: "Postman", level: 85, experience: "1+ years", projects: 15 },
    ],
  },

  workExperience: [
    {
      id: 1,
      company: "Starspace Studio",
      position: "Front-End Developer Intern",
      period: "June 2025 - Present",
      duration: "Current",
      status: "current",
      type: "Internship",
      location: "Remote",
      companyInfo: {
        industry: "Technology Startup",
        size: "10-50 employees",
        website: "https://starspace.studio",
      },
      responsibilities: [
        "Mengembangkan antarmuka web interaktif dan responsif berdasarkan desain Figma",
        "Berpartisipasi dalam proyek nyata melalui program Mission Possible",
        "Kolaborasi lintas bidang dengan tim UI/UX dan Backend developers",
        "Update progres harian menggunakan ClickUp dan weekly meeting participation",
        "Sesi mentoring dengan profesional industri dan reverse mentorship",
        "Dokumentasi pembelajaran melalui #WeeklyWins dan knowledge sharing sessions",
      ],
      achievements: [
        "Menyelesaikan 5+ komponen UI kompleks dengan performa optimal",
        "Meningkatkan loading speed aplikasi sebesar 25%",
        "Berkontribusi dalam 3 proyek utama perusahaan",
        "Menerima feedback positif dari senior developers",
        "Aktif dalam program mentoring dan knowledge transfer",
      ],
      technologies: [
        "React",
        "TypeScript",
        "TailwindCSS",
        "Figma",
        "ClickUp",
        "Git",
      ],
      learnings: [
        "Advanced React patterns dan optimization techniques",
        "Professional workflow dengan tim development",
        "Industry best practices dan code review process",
        "Agile methodology dan project management",
      ],
    },
    {
      id: 2,
      company: "Liboyy Store",
      position: "Fullstack JavaScript Developer",
      period: "March 2025 - May 2025",
      duration: "3 months",
      status: "completed",
      type: "Freelance",
      location: "Remote",
      clientInfo: {
        industry: "E-commerce / Gaming",
        projectBudget: "Rp 15,000,000+",
        clientSatisfaction: "95%",
      },
      responsibilities: [
        "Membangun aplikasi web responsif menggunakan React dan Node.js",
        "Implementasi database PostgreSQL dengan Drizzle ORM",
        "Meningkatkan performa aplikasi dan user experience optimization",
        "Implementasi fitur berdasarkan feedback client dan user testing",
        "Code optimization dan comprehensive testing implementation",
      ],
      achievements: [
        "Platform top-up game dengan 500+ active users",
        "Real-time order tracking system dengan WebSocket integration",
        "Secure payment gateway integration dengan multiple providers",
        "95% client satisfaction rate dengan zero critical bugs",
        "Dashboard analytics untuk business intelligence",
      ],
      technologies: [
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Express.js",
        "Drizzle ORM",
        "WebSocket",
      ],
      projectMetrics: {
        users: "500+",
        transactions: "2000+",
        uptime: "99.9%",
        performance: "95/100 Lighthouse score",
      },
    },
    {
      id: 3,
      company: "Mbuutt Laundry",
      position: "Full Stack Laravel Developer",
      period: "Jan 2025 - Feb 2025",
      duration: "2 months",
      status: "completed",
      type: "Freelance",
      location: "Remote",
      clientInfo: {
        industry: "Service Industry",
        projectBudget: "Rp 8,000,000+",
        clientSatisfaction: "98%",
      },
      responsibilities: [
        "Memimpin pengembangan platform web Mbuutt Laundry sebagai solo Fullstack Developer",
        "Membangun seluruh arsitektur frontend dan backend secara independen",
        "Focus pada maintainable code dan scalable architecture",
        "Pengembangan reusable components dan modular system design",
      ],
      achievements: [
        "Complete laundry management system dengan automated workflow",
        "User-friendly admin dashboard dengan real-time analytics",
        "Automated order tracking system dengan SMS/WhatsApp integration",
        "Real-time financial reporting dan business intelligence dashboard",
        "Mobile-responsive design dengan offline capability",
      ],
      technologies: [
        "Laravel 11",
        "MySQL",
        "TailwindCSS",
        "Blade Template",
        "PHP",
        "Laravel Sanctum",
      ],
      projectMetrics: {
        orders: "1000+",
        revenue: "Rp 50,000,000+",
        efficiency: "+60%",
        customerSatisfaction: "4.8/5",
      },
    },
    {
      id: 4,
      company: "PT. Spektrum Kreasi Pratama",
      position: "Frontend Developer & Data Entry Specialist",
      period: "November 2023 - February 2024",
      duration: "4 months",
      status: "completed",
      type: "Full-time",
      location: "Jakarta, Indonesia",
      companyInfo: {
        industry: "Laboratory Equipment & Services",
        size: "50-100 employees",
        role: "Junior Developer",
      },
      responsibilities: [
        "Develop dan maintain user-facing features untuk laboratory inventory website",
        "Optimize web applications untuk maximum speed dan scalability",
        "Convert physical certificates ke digital format (PDF) dan database entry",
        "Collaborate dengan tim untuk improve workflow efficiency dan data accuracy",
      ],
      achievements: [
        "Improved website loading speed by 40% melalui code optimization",
        "Managed 1000+ data entries dengan 99% accuracy rate",
        "Implemented efficient inventory system yang reduce manual work 50%",
        "Received recognition untuk attention to detail dan reliability",
      ],
      technologies: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Microsoft Excel",
        "Adobe Acrobat",
        "Database Management",
      ],
      learnings: [
        "Production environment experience dan debugging skills",
        "Data management best practices dan quality assurance",
        "Team collaboration dan professional communication",
        "Understanding business requirements dan user needs",
      ],
    },
  ],

  portfolioProjects: [
    {
      id: 1,
      title: "Platform Top-up Game dan Layanan Sosial Media",
      shortDescription:
        "Comprehensive platform untuk gaming top-up dan social media services",
      fullDescription:
        "Platform terintegrasi yang menggabungkan layanan top-up game populer dengan social media marketing tools. Dibangun dengan arsitektur modern dan scalable untuk mendukung high-traffic operations.",
      category: "web",
      subcategory: "e-commerce",
      year: 2025,
      status: "completed",
      featured: true,
      complexity: "advanced",
      client: "Liboyy Store",
      duration: "3 months",
      teamSize: 1,
      role: "Lead Fullstack Developer",
      technologies: {
        frontend: [
          "React",
          "TypeScript",
          "TailwindCSS",
          "React Query",
          "Framer Motion",
        ],
        backend: ["Node.js", "Express.js", "Passport.js", "WebSocket"],
        database: ["PostgreSQL", "Drizzle ORM", "Redis"],
        deployment: ["Vercel", "Railway", "Cloudinary"],
        tools: ["Figma", "Postman", "Git", "GitHub Actions"],
      },
      features: [
        "Multi-game top-up system dengan automated processing",
        "Real-time order tracking dengan WebSocket integration",
        "Comprehensive admin dashboard dengan analytics",
        "Multi-payment gateway support (GoPay, OVO, DANA, Bank Transfer)",
        "Responsive design optimized untuk mobile dan desktop",
        "RESTful API dengan comprehensive documentation",
        "User authentication dengan JWT dan social login",
        "Automated email notifications dan SMS alerts",
      ],
      technicalHighlights: [
        "Server-side rendering untuk SEO optimization",
        "Database indexing untuk query performance optimization",
        "Redis caching untuk improved response times",
        "Error tracking dan logging system",
        "Automated testing dengan Jest dan Cypress",
        "CI/CD pipeline dengan GitHub Actions",
      ],
      metrics: {
        activeUsers: "500+",
        totalTransactions: "2,000+",
        uptime: "99.9%",
        averageResponseTime: "< 200ms",
        lighthouseScore: "95/100",
        userSatisfaction: "4.7/5",
        monthlyRevenue: "Rp 25,000,000+",
      },
      challenges: [
        "Handling concurrent transactions dengan race condition prevention",
        "Implementing secure payment processing dengan PCI compliance",
        "Real-time updates tanpa performance degradation",
        "Mobile optimization untuk various screen sizes",
      ],
      solutions: [
        "Database transactions dan row-level locking",
        "Third-party payment gateway integration dengan proper encryption",
        "WebSocket implementation dengan connection pooling",
        "Progressive Web App (PWA) features untuk mobile experience",
      ],
      images: [
        "/images/liboyneww.png",
        "/images/trackingliboy.png",
        "/images/detailliboyy.png",
        "/images/adminliboyy.png",
      ],
      liveUrl: "https://liboyy-store.vercel.app",
      githubUrl: "https://github.com/AzrielRosadi/LiboyyStore.ID",
      demoCredentials: {
        email: "demo@liboyy.com",
        password: "demo123",
      },
    },
    {
      id: 2,
      title: "System Laundry Berbasis Website",
      shortDescription: "Complete laundry management system dengan automation",
      fullDescription:
        "Sistem manajemen laundry yang comprehensive dengan fitur automation, real-time tracking, financial reporting, dan customer management. Didesain untuk meningkatkan efisiensi operasional dan customer experience.",
      category: "web",
      subcategory: "business-management",
      year: 2025,
      status: "completed",
      featured: true,
      complexity: "advanced",
      client: "Mbuutt Laundry",
      duration: "2 months",
      teamSize: 1,
      role: "Solo Fullstack Developer",
      technologies: {
        frontend: [
          "Blade Template Engine",
          "TailwindCSS",
          "Alpine.js",
          "Chart.js",
        ],
        backend: ["Laravel 11", "PHP 8.2", "Laravel Sanctum", "Laravel Breeze"],
        database: ["MySQL 8.0", "Laravel Migrations", "Eloquent ORM"],
        deployment: ["InfinityFree", "cPanel", "MySQL Database"],
        tools: ["VS Code", "Postman", "Git", "Figma"],
      },
      features: [
        "Complete order management dari pickup hingga delivery",
        "Real-time order tracking dengan status updates",
        "Automated inventory management dengan low-stock alerts",
        "Comprehensive financial reporting dengan profit analytics",
        "Multi-role user management (Owner, Admin, Staff, Customer)",
        "WhatsApp notification integration untuk updates",
        "Receipt printing system dengan barcode generation",
        "Customer loyalty program dengan points system",
      ],
      technicalHighlights: [
        "RESTful API architecture dengan proper authentication",
        "Database optimization dengan proper indexing",
        "Automated backup system untuk data protection",
        "Role-based access control dengan permission management",
        "PDF generation untuk receipts dan reports",
        "SMS/WhatsApp API integration untuk notifications",
      ],
      metrics: {
        ordersProcessed: "1,000+",
        revenueGenerated: "Rp 50,000,000+",
        efficiencyIncrease: "+60%",
        customerSatisfaction: "4.8/5",
        systemUptime: "99.5%",
        averageProcessingTime: "2 minutes",
        returnCustomers: "85%",
      },
      businessImpact: [
        "Reduced manual work by 70% through automation",
        "Improved customer satisfaction dengan real-time updates",
        "Increased revenue by 40% through better order management",
        "Enhanced decision making dengan detailed analytics",
      ],
      images: [
        "/images/MbuuttProject.png",
        "/images/strukmbuutt.png",
        "/images/adminmbuutt.png",
        "/images/editmbuutt.png",
        "/images/ownermbuutt.png",
      ],
      liveUrl: "https://mbuutt-laundry.infinityfreeapp.com/",
      githubUrl: "https://github.com/AzrielRosadi/Mbuutts-Laundry",
      demoCredentials: {
        admin: { email: "admin@mbuutt.com", password: "admin123" },
        customer: { email: "customer@mbuutt.com", password: "customer123" },
      },
    },
    {
      id: 3,
      title: "DOML AI Marketing Platform",
      shortDescription:
        "Modern landing page untuk AI-powered marketing platform",
      fullDescription:
        "Prototype landing page untuk DOML, sebuah konsep platform marketing berbasis Artificial Intelligence. Didesain untuk showcase vision, benefits, dan potential features kepada potential users, business partners, dan investors.",
      category: "web",
      subcategory: "landing-page",
      year: 2025,
      status: "completed",
      featured: true,
      complexity: "intermediate",
      client: "Personal Project / Portfolio",
      duration: "1 month",
      teamSize: 1,
      role: "Frontend Developer & UI Designer",
      technologies: {
        frontend: ["React 18", "TailwindCSS", "Framer Motion", "Lucide Icons"],
        styling: ["PostCSS", "Autoprefixer", "Custom CSS Animations"],
        deployment: ["Vercel", "GitHub Actions"],
        tools: ["Figma", "VS Code", "Git", "Chrome DevTools"],
      },
      features: [
        "Modern responsive design dengan mobile-first approach",
        "Smooth animations dan micro-interactions",
        "Interactive UI components dengan hover effects",
        "SEO optimized dengan proper meta tags",
        "Fast loading performance dengan code splitting",
        "Accessibility compliance (WCAG guidelines)",
        "Progressive Web App (PWA) capabilities",
        "Contact form dengan email integration",
      ],
      designHighlights: [
        "Clean dan minimalist design language",
        "Consistent color scheme dan typography",
        "Strategic use of white space untuk readability",
        "Visual hierarchy dengan proper contrast ratios",
        "Interactive elements dengan feedback animations",
        "Cross-browser compatibility testing",
      ],
      performanceMetrics: {
        lighthousePerformance: "98/100",
        lighthouseSEO: "95/100",
        lighthouseAccessibility: "100/100",
        lighthouseBestPractices: "92/100",
        firstContentfulPaint: "1.2s",
        largestContentfulPaint: "2.1s",
        cumulativeLayoutShift: "0.05",
      },
      seoOptimizations: [
        "Semantic HTML structure dengan proper heading hierarchy",
        "Meta descriptions dan Open Graph tags",
        "Schema markup untuk better search visibility",
        "Image optimization dengan lazy loading",
        "XML sitemap dan robots.txt configuration",
      ],
      images: ["/images/Frame 3.png"],
      liveUrl: "https://doml-azrl.vercel.app/",
      githubUrl: "https://github.com/AzrielRosadi/DOML-AZRL",
    },
    {
      id: 4,
      title: "Imaginify AI SaaS Platform",
      shortDescription:
        "AI-powered SaaS application dengan image processing capabilities",
      fullDescription:
        "Real Software-as-a-Service application dengan AI features dan comprehensive payment system. Platform ini mendemonstrasikan kemampuan dalam building scalable SaaS solutions dengan modern tech stack.",
      category: "ai",
      subcategory: "saas",
      year: 2025,
      status: "in-progress",
      featured: true,
      complexity: "advanced",
      client: "Personal Project",
      duration: "Ongoing",
      teamSize: 1,
      role: "Fullstack Developer",
      technologies: {
        frontend: [
          "Next.js 14",
          "React",
          "TypeScript",
          "TailwindCSS",
          "Shadcn/UI",
        ],
        backend: ["Next.js API Routes", "Node.js", "Webhooks"],
        database: ["MongoDB", "Mongoose ODM"],
        ai: ["Cloudinary AI", "OpenAI API", "Image Processing APIs"],
        payment: ["Stripe", "Webhooks", "Subscription Management"],
        auth: ["Clerk Authentication", "JWT", "OAuth"],
        deployment: ["Vercel", "MongoDB Atlas", "Cloudinary CDN"],
      },
      features: [
        "AI-powered image transformations (remove background, enhance, restore)",
        "Credit-based payment system dengan subscription tiers",
        "User authentication dengan social login options",
        "File upload dengan drag-and-drop interface",
        "Real-time processing status updates",
        "Download history dan image gallery",
        "Responsive dashboard dengan usage analytics",
      ],
      aiCapabilities: [
        "Background removal dengan high accuracy",
        "Image enhancement dan noise reduction",
        "Object detection dan smart cropping",
        "Color correction dan lighting adjustments",
        "Face detection dan enhancement",
        "Batch processing untuk multiple images",
      ],
      images: ["/images/imaginifynew.png"],
      githubUrl: "https://github.com/AzrielRosadi/AiSaas-Application",
      currentStatus: "Development Phase - MVP completion at 75%",
    },
    {
      id: 5,
      title: "Citra Negara School Website",
      shortDescription:
        "Official school website dengan modern design dan comprehensive information",
      fullDescription:
        "Website resmi untuk Citra Negara School dengan design modern, informasi lengkap tentang sekolah, program akademik, dan portal untuk siswa dan orang tua.",
      category: "web",
      subcategory: "institutional",
      year: 2024,
      status: "completed",
      featured: false,
      complexity: "intermediate",
      client: "Citra Negara School",
      duration: "2 months",
      teamSize: 3,
      role: "Frontend Developer",
      technologies: {
        frontend: ["HTML5", "CSS3", "JavaScript", "Sass"],
        backend: ["Go", "Gin Framework"],
        styling: ["Bootstrap", "Custom CSS"],
        tools: ["Git", "VS Code", "Figma"],
      },
      features: [
        "Modern responsive design untuk semua devices",
        "Comprehensive school information pages",
        "Academic programs showcase",
        "News dan announcements system",
        "Photo gallery dengan lightbox functionality",
        "Contact forms dengan validation",
        "SEO optimized content structure",
      ],
      images: ["/images/cnhome.png"],
      githubUrl: "https://github.com/ashfaa28/BackEnd_WebSekolahPBO-",
      teamCollaboration: "Worked dengan backend developer dan UI designer",
    },
    {
      id: 6,
      title: "Mechstrom: War Zone",
      shortDescription: "3D action game built dengan Unity Engine dan C#",
      fullDescription:
        "3D action game project yang dikembangkan menggunakan Unity Engine dan C#. Game ini menampilkan gameplay mechanics yang engaging dengan graphics yang menarik untuk pembelajaran game development.",
      category: "game",
      subcategory: "3d-action",
      year: 2024,
      status: "completed",
      featured: true,
      complexity: "advanced",
      client: "Personal Project",
      duration: "4 months",
      teamSize: 1,
      role: "Game Developer & Designer",
      technologies: {
        engine: ["Unity 2022.3 LTS", "C#", "Unity Physics"],
        graphics: ["Blender", "Photoshop", "Unity Shader Graph"],
        audio: ["Audacity", "Unity Audio Mixer"],
        tools: ["Visual Studio", "Git", "Unity Hub"],
      },
      gameFeatures: [
        "Third-person action gameplay dengan smooth controls",
        "Multiple weapons system dengan different mechanics",
        "Enemy AI dengan pathfinding dan combat behaviors",
        "Health dan ammunition management system",
        "Multiple levels dengan increasing difficulty",
        "Sound effects dan background music integration",
        "Particle effects untuk explosions dan impacts",
      ],
      technicalAchievements: [
        "Implemented complex AI behaviors menggunakan Unity NavMesh",
        "Created weapon system dengan scriptable objects",
        "Optimized performance untuk smooth 60fps gameplay",
        "Implemented save/load system untuk game progress",
        "Created modular level design system",
      ],
      gameplayMechanics: [
        "Player movement dengan keyboard/mouse controls",
        "Shooting mechanics dengan different weapon types",
        "Enemy spawning system dengan wave management",
        "Health pickup dan ammunition collection",
        "Score system dengan high score tracking",
      ],
      images: [
        "/images/gamesslandscape.png",
        "/images/Game.png",
        "/images/Game1.png",
        "/images/Game2.png",
        "/images/Game3.png",
        "/images/Game4.png",
        "/images/Game5.png",
      ],
      demoAvailable: "Windows build available for download",
    },
    {
      id: 7,
      title: "Shopee Product Scraper Tool",
      shortDescription:
        "GUI-based desktop application untuk automated data scraping",
      fullDescription:
        "Desktop application yang dibangun dengan Python dan tkinter untuk automated scraping product data dari Shopee e-commerce platform. Tool ini membantu dalam market research dan price monitoring.",
      category: "desktop",
      subcategory: "automation-tool",
      year: 2024,
      status: "completed",
      featured: false,
      complexity: "intermediate",
      client: "Personal Project",
      duration: "1 month",
      teamSize: 1,
      role: "Python Developer",
      technologies: {
        language: ["Python 3.9", "tkinter", "requests", "BeautifulSoup4"],
        libraries: ["pandas", "selenium", "openpyxl", "json"],
        tools: ["PyCharm", "Git", "Chrome WebDriver"],
      },
      features: [
        "User-friendly GUI interface dengan tkinter",
        "Automated product data extraction dari Shopee",
        "Export data ke Excel dan CSV formats",
        "Batch processing untuk multiple products",
        "Progress tracking dengan loading indicators",
        "Error handling dan retry mechanisms",
        "Configurable scraping parameters",
      ],
      dataExtracted: [
        "Product names dan descriptions",
        "Pricing information dan discounts",
        "Seller information dan ratings",
        "Product images URLs",
        "Stock availability",
        "Customer reviews dan ratings",
      ],
      images: ["/images/scrapperr.png"],
      githubUrl: "https://github.com/AzrielRosadi/toolsscrapershopee",
      useCases: [
        "Market research untuk competitive analysis",
        "Price monitoring untuk e-commerce businesses",
        "Product catalog creation",
        "Inventory management assistance",
      ],
    },
    {
      id: 8,
      title: "Classic Pac-Man Game",
      shortDescription: "Browser-based recreation of the classic arcade game",
      fullDescription:
        "Faithful recreation of the classic Pac-Man arcade game menggunakan vanilla JavaScript, HTML5 Canvas, dan CSS. Game ini menampilkan gameplay mechanics yang authentic dengan modern web technologies.",
      category: "game",
      subcategory: "arcade-classic",
      year: 2023,
      status: "completed",
      featured: false,
      complexity: "intermediate",
      client: "Learning Project",
      duration: "2 weeks",
      teamSize: 1,
      role: "Game Developer",
      technologies: {
        frontend: ["HTML5", "CSS3", "JavaScript ES6", "Canvas API"],
        tools: ["VS Code", "Git", "Chrome DevTools"],
      },
      gameFeatures: [
        "Classic Pac-Man gameplay mechanics",
        "Ghost AI dengan different behavioral patterns",
        "Power pellet system dengan ghost vulnerability",
        "Score system dengan bonus points",
        "Level progression dengan increasing difficulty",
        "Sound effects untuk authentic arcade experience",
        "Responsive controls untuk keyboard input",
      ],
      technicalImplementation: [
        "HTML5 Canvas untuk 2D graphics rendering",
        "JavaScript classes untuk game objects",
        "Collision detection algorithms",
        "Game state management system",
        "Animation loops dengan requestAnimationFrame",
        "Local storage untuk high score tracking",
      ],
      images: ["/images/pacman.png"],
      githubUrl: "https://github.com/AzrielRosadi/Games-Pacman",
      playableDemo: "Available untuk play in browser",
    },
    {
      id: 9,
      title: "Classic Tetris Game",
      shortDescription: "JavaScript implementation of the classic puzzle game",
      fullDescription:
        "Modern web implementation of the classic Tetris puzzle game dengan smooth animations, proper scoring system, dan responsive design. Built untuk demonstrate game development skills dengan vanilla JavaScript.",
      category: "game",
      subcategory: "puzzle-classic",
      year: 2023,
      status: "completed",
      featured: false,
      complexity: "intermediate",
      client: "Learning Project",
      duration: "2 weeks",
      teamSize: 1,
      role: "Game Developer",
      technologies: {
        frontend: ["HTML5", "CSS3", "JavaScript ES6", "Canvas API"],
        tools: ["VS Code", "Git", "Browser DevTools"],
      },
      gameFeatures: [
        "Classic Tetris gameplay dengan seven tetromino shapes",
        "Line clearing mechanics dengan proper scoring",
        "Level progression dengan increasing speed",
        "Next piece preview untuk strategic planning",
        "Pause dan resume functionality",
        "High score tracking dengan local storage",
        "Smooth piece rotation dan movement animations",
      ],
      technicalImplementation: [
        "Grid-based game board dengan 2D array representation",
        "Tetromino rotation algorithms dengan wall kick detection",
        "Line clearing detection dan animation",
        "Gravity system dengan adjustable drop speed",
        "Keyboard input handling untuk smooth controls",
        "Game state management untuk pause/resume",
      ],
      images: ["/images/tetris.png"],
      githubUrl: "https://github.com/AzrielRosadi/Games-Tetris2",
      playableDemo: "Browser-based game available untuk immediate play",
    },
    {
      id: 10,
      title: "Movie Search Platform",
      shortDescription:
        "IMDb API integration untuk comprehensive movie dan TV show search",
      fullDescription:
        "Platform pencarian film dan serial TV yang comprehensive dengan memanfaatkan IMDb database melalui API integration. Menyediakan detailed information tentang movies, TV shows, cast, dan ratings.",
      category: "web",
      subcategory: "entertainment",
      year: 2023,
      status: "completed",
      featured: false,
      complexity: "beginner",
      client: "Learning Project",
      duration: "1 week",
      teamSize: 1,
      role: "Frontend Developer",
      technologies: {
        frontend: ["HTML5", "CSS3", "JavaScript", "Fetch API"],
        api: ["IMDb API", "RESTful API Integration"],
        styling: ["CSS Grid", "Flexbox", "Responsive Design"],
        tools: ["VS Code", "Git", "Postman"],
      },
      features: [
        "Search functionality untuk movies dan TV shows",
        "Detailed movie information dengan cast dan crew",
        "Movie ratings dan reviews display",
        "Responsive design untuk semua screen sizes",
        "Loading states dan error handling",
        "Favorites system dengan local storage",
        "Genre filtering dan sorting options",
      ],
      apiIntegration: [
        "RESTful API calls dengan proper error handling",
        "Async/await implementation untuk better UX",
        "API rate limiting considerations",
        "Data parsing dan transformation",
        "Caching strategies untuk improved performance",
      ],
      images: ["/images/film.png"],
      githubUrl: "https://github.com/AzrielRosadi/Search-Film",
      learningOutcomes: [
        "API integration best practices",
        "Asynchronous JavaScript programming",
        "DOM manipulation techniques",
        "Responsive web design principles",
      ],
    },
  ],

  testimonials: [
    {
      id: 1,
      client: "Liboyy Store",
      clientHandle: "@liboyystore_26",
      position: "E-commerce Business Owner",
      industry: "Gaming & Digital Services",
      rating: 5,
      projectId: 1,
      review:
        "Saya sangat puas bekerja sama dengan Azriel WebDev, seorang fullstack developer yang memiliki kemampuan teknis luar biasa. Ia berhasil membangun website top up games yang responsif, cepat, dan user-friendly, sekaligus mengintegrasikan layanan sosial media dengan sangat baik!",
      detailedFeedback: {
        technicalSkills: 5,
        communication: 5,
        timeliness: 5,
        problemSolving: 5,
        overall: 5,
      },
      projectOutcome:
        "Platform berhasil meningkatkan penjualan sebesar 150% dalam 3 bulan pertama",
      recommendationLikelihood: "Definitely will work again",
      image: "/images/fixlogoliboy.png",
      date: "May 2025",
    },
    {
      id: 2,
      client: "Mbuutt Company",
      clientHandle: "@mbuuttcorp",
      position: "Laundry Business Owner",
      industry: "Service Industry",
      rating: 5,
      projectId: 2,
      review:
        "Bekerja sama dalam pengembangan website sistem laundry ini merupakan pengalaman yang sangat profesional. Komitmen terhadap ketepatan waktu, kualitas hasil, serta perhatian terhadap setiap detail proyek sangat terlihat jelas.",
      detailedFeedback: {
        technicalSkills: 5,
        communication: 5,
        timeliness: 5,
        problemSolving: 5,
        overall: 5,
      },
      businessImpact:
        "Sistem ini mengurangi manual work sebesar 70% dan meningkatkan customer satisfaction",
      image: "/images/logombuuttT.png",
      date: "February 2025",
    },
    {
      id: 3,
      client: "PT. Spektrum Kreasi Pratama",
      clientHandle: "@spektrumkp",
      position: "IT Manager",
      industry: "Laboratory Equipment",
      rating: 4,
      projectId: null,
      review:
        "Azriel membawa kreativitas dan keahlian ke dalam tim, sehingga meningkatkan kinerja frontend dan entry data kami secara signifikan. Dedikasinya terhadap detail dan kolaborasi yang efektif membuat proyek berjalan lancar dan hasilnya sangat memuaskan.",
      detailedFeedback: {
        technicalSkills: 4,
        communication: 5,
        teamwork: 5,
        reliability: 5,
        overall: 4,
      },
      professionalGrowth:
        "Azriel showed excellent learning ability dan quickly adapted to our workflow",
      image: "/images/logospektrumM.png",
      date: "February 2024",
    },
  ],

  services: {
    webDevelopment: {
      title: "Web Development",
      description:
        "Full-stack web application development dengan modern technologies",
      icon: "🌐",
      subServices: [
        {
          name: "Frontend Development",
          technologies: ["React", "Next.js", "TypeScript", "TailwindCSS"],
          deliverables: [
            "Responsive UI/UX",
            "Performance Optimization",
            "SEO Implementation",
          ],
          timeframe: "2-6 weeks",
          startingPrice: "Rp 5,000,000",
        },
        {
          name: "Backend Development",
          technologies: ["Node.js", "Laravel", "PostgreSQL", "MongoDB"],
          deliverables: [
            "REST API",
            "Database Design",
            "Authentication System",
          ],
          timeframe: "3-8 weeks",
          startingPrice: "Rp 7,000,000",
        },
        {
          name: "Full-Stack Solutions",
          technologies: [
            "React + Node.js",
            "Laravel Full-Stack",
            "Database Integration",
          ],
          deliverables: [
            "Complete Web Application",
            "Admin Dashboard",
            "Documentation",
          ],
          timeframe: "6-12 weeks",
          startingPrice: "Rp 12,000,000",
        },
      ],
    },
    mobileOptimization: {
      title: "Mobile Optimization",
      description: "Responsive design dan mobile-first development approach",
      icon: "📱",
      features: [
        "Progressive Web App (PWA)",
        "Mobile-First Design",
        "Cross-Platform Compatibility",
      ],
      timeframe: "1-3 weeks",
      startingPrice: "Rp 3,000,000",
    },
    ecommerce: {
      title: "E-Commerce Solutions",
      description:
        "Complete online store development dengan payment integration",
      icon: "🛒",
      features: [
        "Payment Gateway Integration",
        "Inventory Management",
        "Order Tracking",
        "Admin Dashboard",
      ],
      timeframe: "8-16 weeks",
      startingPrice: "Rp 15,000,000",
    },
    consulting: {
      title: "Technical Consulting",
      description: "Architecture planning, code review, dan technical guidance",
      icon: "💡",
      services: [
        "Code Review",
        "Architecture Planning",
        "Performance Audit",
        "Technology Selection",
      ],
      timeframe: "1-2 weeks",
      hourlyRate: "Rp 150,000/hour",
    },
  },

  pricingTiers: {
    basic: {
      name: "Basic Website",
      price: "Rp 5,000,000 - 8,000,000",
      duration: "2-4 weeks",
      features: [
        "Responsive Landing Page",
        "Contact Form Integration",
        "Basic SEO Optimization",
        "Mobile Optimization",
        "1 Month Free Support",
      ],
      bestFor: "Small businesses, portfolio websites, landing pages",
    },
    standard: {
      name: "Business Website",
      price: "Rp 8,000,000 - 15,000,000",
      duration: "4-8 weeks",
      features: [
        "Multi-page Website",
        "Content Management System",
        "Advanced SEO Features",
        "Analytics Integration",
        "Social Media Integration",
        "3 Months Support",
      ],
      bestFor: "Medium businesses, content-heavy websites",
    },
    premium: {
      name: "Full-Stack Application",
      price: "Rp 15,000,000 - 30,000,000+",
      duration: "8-16 weeks",
      features: [
        "Custom Web Application",
        "User Authentication System",
        "Database Integration",
        "Admin Dashboard",
        "API Development",
        "Payment Integration",
        "6 Months Support",
      ],
      bestFor: "Large businesses, SaaS platforms, e-commerce",
    },
  },

  workingProcess: [
    {
      step: 1,
      title: "Discovery & Planning",
      duration: "1-2 weeks",
      activities: [
        "Requirements gathering dan analysis",
        "Technical architecture design",
        "Timeline dan milestone planning",
        "Technology stack selection",
        "Project scope definition",
      ],
    },
    {
      step: 2,
      title: "Design & Prototyping",
      duration: "1-3 weeks",
      activities: [
        "UI/UX design creation",
        "Interactive prototype development",
        "Client feedback integration",
        "Design system establishment",
        "Responsive layout planning",
      ],
    },
    {
      step: 3,
      title: "Development",
      duration: "4-12 weeks",
      activities: [
        "Frontend development dengan modern frameworks",
        "Backend API development",
        "Database design dan implementation",
        "Third-party integrations",
        "Regular progress updates",
      ],
    },
    {
      step: 4,
      title: "Testing & Optimization",
      duration: "1-2 weeks",
      activities: [
        "Comprehensive testing (unit, integration, E2E)",
        "Performance optimization",
        "Security audit",
        "Cross-browser compatibility testing",
        "Mobile responsiveness verification",
      ],
    },
    {
      step: 5,
      title: "Deployment & Launch",
      duration: "1 week",
      activities: [
        "Production environment setup",
        "Domain dan hosting configuration",
        "SSL certificate installation",
        "Go-live coordination",
        "Post-launch monitoring",
      ],
    },
    {
      step: 6,
      title: "Support & Maintenance",
      duration: "Ongoing",
      activities: [
        "Bug fixes dan updates",
        "Performance monitoring",
        "Security updates",
        "Feature enhancements",
        "Technical support",
      ],
    },
  ],

  frequentlyAskedQuestions: [
    {
      category: "General",
      questions: [
        {
          q: "Berapa lama waktu yang dibutuhkan untuk menyelesaikan proyek?",
          a: "Waktu pengerjaan bervariasi tergantung kompleksitas proyek:\n• Landing page: 1-2 minggu\n• Business website: 4-8 minggu\n• Full-stack application: 8-16 minggu\n• E-commerce platform: 12-20 minggu",
        },
        {
          q: "Apakah menyediakan maintenance setelah proyek selesai?",
          a: "Ya, saya menyediakan:\n• Free support 1-6 bulan (tergantung paket)\n• Bug fixes dan minor updates\n• Performance monitoring\n• Security updates\n• Maintenance contract untuk long-term support",
        },
        {
          q: "Teknologi apa saja yang dikuasai?",
          a: "Frontend: React, Next.js, TypeScript, TailwindCSS\nBackend: Node.js, Laravel, Express.js\nDatabase: PostgreSQL, MySQL, MongoDB\nTools: Git, Docker, Vercel, Unity",
        },
      ],
    },
    {
      category: "Pricing",
      questions: [
        {
          q: "Bagaimana struktur harga untuk proyek?",
          a: "Harga ditentukan berdasarkan:\n• Kompleksitas fitur yang dibutuhkan\n• Timeline pengerjaan\n• Technology stack yang digunakan\n• Level customization\n• Support dan maintenance requirements",
        },
        {
          q: "Apakah ada sistem pembayaran bertahap?",
          a: "Ya, pembayaran dapat dilakukan bertahap:\n• 30% down payment untuk memulai\n• 40% saat milestone 50% tercapai\n• 30% saat project completion dan handover",
        },
      ],
    },
    {
      category: "Technical",
      questions: [
        {
          q: "Apakah website yang dibuat mobile-friendly?",
          a: "Semua website yang saya buat menggunakan responsive design dan mobile-first approach untuk memastikan optimal performance di semua devices.",
        },
        {
          q: "Bagaimana dengan SEO optimization?",
          a: "Setiap project include basic SEO optimization:\n• Meta tags dan descriptions\n• Semantic HTML structure\n• Page speed optimization\n• Mobile optimization\n• Schema markup implementation",
        },
      ],
    },
  ],
};

// Enhanced cache management dengan versioning
let portfolioCache = null;
let lastScrapeTime = 0;
let cacheVersion = "v2.0";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Advanced portfolio website scraping dengan comprehensive data extraction
async function scrapePortfolioWebsite() {
  try {
    console.log("🔍 Starting comprehensive portfolio scraping...");
    const response = await axios.get("https://azrl-webdev.vercel.app", {
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Portfolio-AI-Bot/2.0)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const $ = cheerio.load(response.data);

    // Enhanced data extraction dengan lebih comprehensive selectors
    const scrapedData = {
      // Personal Information Extraction
      personalInfo: {
        name:
          $('h1, .hero-title, [class*="name"], .name, #name')
            .first()
            .text()
            ?.trim() || ENHANCED_PORTFOLIO_DATABASE.personalInfo.name,
        title:
          $('h2, .hero-subtitle, [class*="title"], .title, .tagline')
            .first()
            .text()
            ?.trim() || ENHANCED_PORTFOLIO_DATABASE.personalInfo.title,
        bio: $('p, .bio, .about, [class*="description"], .description, .intro')
          .map((i, el) => $(el).text().trim())
          .get()
          .filter((text) => text.length > 30 && text.length < 500)
          .slice(0, 3),
        location:
          $('[class*="location"], .location, .address')
            .first()
            .text()
            ?.trim() || ENHANCED_PORTFOLIO_DATABASE.personalInfo.location,
      },

      // Skills Extraction dengan categories
      skills: {
        all: $(
          '[class*="skill"], [class*="tech"], .technology, .stack, .skill-item'
        )
          .map((i, el) => {
            const skillText = $(el).text().trim();
            const skillLevel =
              $(el).find('[class*="level"], .level').text() ||
              $(el).attr("data-level") ||
              "80";
            return {
              name: skillText,
              level: parseInt(skillLevel) || 80,
              category: "general",
            };
          })
          .get()
          .filter((skill) => skill.name.length > 0 && skill.name.length < 30),

        categories: {
          frontend: $('[class*="frontend"], .frontend-skills')
            .find('[class*="skill"], .skill-item')
            .map((i, el) => $(el).text().trim())
            .get(),
          backend: $('[class*="backend"], .backend-skills')
            .find('[class*="skill"], .skill-item')
            .map((i, el) => $(el).text().trim())
            .get(),
        },
      },

      // Projects Extraction dengan detailed information
      projects: $(
        '[class*="project"], .work-item, .portfolio-item, .project-card'
      )
        .map((i, el) => {
          const $project = $(el);
          const title = $project
            .find('h3, h4, .title, [class*="title"]')
            .first()
            .text()
            ?.trim();
          const description = $project
            .find('p, .description, [class*="desc"], .desc')
            .first()
            .text()
            ?.trim();
          const technologies = $project
            .find('[class*="tech"], .tech-stack, .stack, .technology')
            .map((j, tech) => $(tech).text().trim())
            .get();
          const liveUrl = $project
            .find('a[href*="http"], .live-link')
            .attr("href");
          const githubUrl = $project
            .find('a[href*="github"], .github-link')
            .attr("href");
          const image = $project.find("img").attr("src");

          return {
            title,
            description,
            technologies,
            liveUrl,
            githubUrl,
            image,
            category: "web",
            year: new Date().getFullYear(),
            status: "completed",
          };
        })
        .get()
        .filter((project) => project.title && project.title.length > 0),

      // Experience Extraction
      experience: $(
        '[class*="experience"], [class*="work"], .job, .experience-item'
      )
        .map((i, el) => {
          const $exp = $(el);
          return {
            company: $exp
              .find('[class*="company"], .company, h4, .job-company')
              .first()
              .text()
              ?.trim(),
            position: $exp
              .find('[class*="position"], .title, h5, .job-title')
              .first()
              .text()
              ?.trim(),
            period: $exp
              .find('[class*="date"], .date, .period, .duration')
              .first()
              .text()
              ?.trim(),
            description: $exp
              .find('p, .description, [class*="desc"], .job-desc')
              .first()
              .text()
              ?.trim(),
            responsibilities: $exp
              .find("li, .responsibility")
              .map((j, resp) => $(resp).text().trim())
              .get(),
          };
        })
        .get()
        .filter((exp) => exp.company || exp.position),

      // Contact Information Extraction
      contact: {
        email:
          $('a[href^="mailto:"]').attr("href")?.replace("mailto:", "") ||
          ENHANCED_PORTFOLIO_DATABASE.personalInfo.email,
        github:
          $('a[href*="github.com"]').attr("href") ||
          ENHANCED_PORTFOLIO_DATABASE.socialLinks.github,
        linkedin:
          $('a[href*="linkedin.com"]').attr("href") ||
          ENHANCED_PORTFOLIO_DATABASE.socialLinks.linkedin,
        instagram:
          $('a[href*="instagram.com"]').attr("href") ||
          ENHANCED_PORTFOLIO_DATABASE.socialLinks.instagram,
        phone:
          $('a[href^="tel:"], [class*="phone"], .phone').text()?.trim() ||
          ENHANCED_PORTFOLIO_DATABASE.personalInfo.phone,
      },

      // Counter/Statistics Extraction
      stats: $('[class*="counter"], .stat, .statistic, [class*="stat"]')
        .map((i, el) => {
          const $stat = $(el);
          const value =
            $stat.find('[class*="value"], .value, .number').text()?.trim() ||
            $stat.text().match(/\d+/)?.[0];
          const label =
            $stat.find('[class*="label"], .label, .title').text()?.trim() ||
            $stat
              .text()
              .replace(/\d+[\+%]?/, "")
              .trim();
          return { value: parseInt(value) || 0, label };
        })
        .get()
        .filter((stat) => stat.value > 0 && stat.label),

      // Navigation and Structure
      navigation: $('nav a, .nav-link, [class*="nav"] a')
        .map((i, el) => ({
          text: $(el).text().trim(),
          href: $(el).attr("href"),
        }))
        .get(),

      // Meta Information
      meta: {
        title: $("title").text()?.trim(),
        description:
          $('meta[name="description"]').attr("content") ||
          $('meta[property="og:description"]').attr("content"),
        keywords: $('meta[name="keywords"]').attr("content"),
        ogTitle: $('meta[property="og:title"]').attr("content"),
        ogImage: $('meta[property="og:image"]').attr("content"),
      },

      // Full text content untuk context
      fullTextContent: $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 5000),

      // Scraping metadata
      scrapingInfo: {
        timestamp: new Date().toISOString(),
        version: cacheVersion,
        url: "https://azrl-webdev.vercel.app",
        dataQuality: "comprehensive",
        elementsFound: {
          projects: $('[class*="project"]').length,
          experiences: $('[class*="experience"]').length,
          skills: $('[class*="skill"]').length,
          totalElements: $("*").length,
        },
      },
    };

    // Merge scraped data dengan database fallback
    const enrichedData = {
      ...ENHANCED_PORTFOLIO_DATABASE,
      scrapedData,
      lastUpdated: new Date().toISOString(),
      dataSource: "live_scraping + database",
      cacheVersion,
    };

    console.log("✅ Portfolio scraping completed successfully");
    console.log(
      `📊 Found: ${scrapedData.scrapingInfo.elementsFound.projects} projects, ${scrapedData.scrapingInfo.elementsFound.experiences} experiences`
    );

    return enrichedData;
  } catch (error) {
    console.error("❌ Error scraping portfolio:", error.message);

    // Return enhanced fallback data instead of basic
    return {
      ...ENHANCED_PORTFOLIO_DATABASE,
      scrapedData: null,
      lastUpdated: new Date().toISOString(),
      dataSource: "database_fallback",
      error: `Scraping failed: ${error.message}. Using comprehensive database.`,
      cacheVersion,
    };
  }
}

// Enhanced portfolio data retrieval dengan intelligent caching
async function getPortfolioData() {
  const now = Date.now();

  if (!portfolioCache || now - lastScrapeTime > CACHE_DURATION) {
    console.log("🔄 Cache expired or missing, fetching fresh data...");
    portfolioCache = await scrapePortfolioWebsite();
    lastScrapeTime = now;
  } else {
    console.log("⚡ Using cached portfolio data");
  }

  return portfolioCache;
}

// Advanced context generation untuk AI
function generateComprehensiveContext(portfolioData) {
  const context = `
=== PORTFOLIO AZRIEL ROSADI - COMPREHENSIVE DATA ===

👤 PERSONAL INFORMATION:
Name: ${portfolioData.personalInfo.name}
Title: ${portfolioData.personalInfo.title}
Location: ${portfolioData.personalInfo.location}
Email: ${portfolioData.personalInfo.email}
Portfolio: ${portfolioData.personalInfo.portfolioUrl}
Experience: ${portfolioData.personalInfo.yearsExperience} years
Tagline: ${portfolioData.personalInfo.tagline}

📊 ACHIEVEMENT STATISTICS:
${portfolioData.counterStats
  .map((stat) => `• ${stat.label}: ${stat.value}${stat.suffix} ${stat.icon}`)
  .join("\n")}

🎯 CORE ABILITIES:
${portfolioData.coreAbilities
  .map(
    (ability) => `
• ${ability.title} ${ability.icon}
  ${ability.description}
  Skills: ${ability.skills.join(", ")}`
  )
  .join("")}

💻 TECHNICAL EXPERTISE:

FRONTEND SKILLS (Advanced):
${portfolioData.technicalSkills.frontend
  .map(
    (skill) =>
      `• ${skill.name}: ${skill.level}% (${skill.experience}, ${skill.projects} projects)`
  )
  .join("\n")}

BACKEND SKILLS (Advanced):
${portfolioData.technicalSkills.backend
  .map(
    (skill) =>
      `• ${skill.name}: ${skill.level}% (${skill.experience}, ${skill.projects} projects)`
  )
  .join("\n")}

DATABASE EXPERTISE:
${portfolioData.technicalSkills.database
  .map(
    (skill) =>
      `• ${skill.name}: ${skill.level}% (${skill.experience}, ${skill.projects} projects)`
  )
  .join("\n")}

TOOLS & DEPLOYMENT:
${portfolioData.technicalSkills.tools
  .map(
    (skill) =>
      `• ${skill.name}: ${skill.level}% (${skill.experience}, ${skill.projects} projects)`
  )
  .join("\n")}

💼 WORK EXPERIENCE (Detailed):

${portfolioData.workExperience
  .map(
    (exp) => `
🏢 ${exp.position} at ${exp.company}
📅 ${exp.period} (${exp.duration}) - ${exp.status.toUpperCase()}
📍 ${exp.location} | ${exp.type}
${
  exp.companyInfo
    ? `🏭 Industry: ${exp.companyInfo.industry} | Size: ${exp.companyInfo.size}`
    : ""
}

RESPONSIBILITIES:
${exp.responsibilities.map((resp) => `  • ${resp}`).join("\n")}

ACHIEVEMENTS:
${exp.achievements.map((ach) => `  ⭐ ${ach}`).join("\n")}

TECHNOLOGIES: ${exp.technologies.join(", ")}
${
  exp.projectMetrics
    ? `
METRICS: ${Object.entries(exp.projectMetrics)
        .map(([key, value]) => `${key}: ${value}`)
        .join(" | ")}`
    : ""
}
${
  exp.learnings
    ? `
KEY LEARNINGS: ${exp.learnings.join(" | ")}`
    : ""
}
`
  )
  .join("\n")}

🚀 FEATURED PROJECTS (Portfolio Highlights):

${portfolioData.portfolioProjects
  .filter((p) => p.featured)
  .map(
    (project) => `
📂 ${project.title} (${project.year})
${project.complexity.toUpperCase()} COMPLEXITY | ${project.category.toUpperCase()} | ${project.status.toUpperCase()}
🎯 ${project.shortDescription}

CLIENT: ${project.client} | DURATION: ${project.duration} | TEAM: ${
      project.teamSize
    } person${project.teamSize > 1 ? "s" : ""}
ROLE: ${project.role}

DESCRIPTION:
${project.fullDescription}

TECH STACK:
${Object.entries(project.technologies)
  .map(
    ([category, techs]) =>
      `  ${category.toUpperCase()}: ${
        Array.isArray(techs) ? techs.join(", ") : techs
      }`
  )
  .join("\n")}

KEY FEATURES:
${project.features.map((feature) => `  ✨ ${feature}`).join("\n")}

${
  project.metrics
    ? `PERFORMANCE METRICS:
${Object.entries(project.metrics)
  .map(([key, value]) => `  📈 ${key}: ${value}`)
  .join("\n")}`
    : ""
}

${
  project.challenges
    ? `TECHNICAL CHALLENGES & SOLUTIONS:
CHALLENGES: ${project.challenges.join(" | ")}
SOLUTIONS: ${project.solutions.join(" | ")}`
    : ""
}

🔗 Links: ${project.liveUrl ? `Live: ${project.liveUrl}` : ""} ${
      project.githubUrl ? `| GitHub: ${project.githubUrl}` : ""
    }
`
  )
  .join("\n")}

💬 CLIENT TESTIMONIALS:
${portfolioData.testimonials
  .map(
    (testimonial) => `
⭐ ${testimonial.rating}/5 - ${testimonial.client} (${testimonial.industry})
"${testimonial.review}"
${
  testimonial.businessImpact
    ? `BUSINESS IMPACT: ${testimonial.businessImpact}`
    : ""
}
${testimonial.projectOutcome ? `OUTCOME: ${testimonial.projectOutcome}` : ""}
Technical Skills: ${
      testimonial.detailedFeedback.technicalSkills
    }/5 | Communication: ${testimonial.detailedFeedback.communication}/5
Date: ${testimonial.date}
`
  )
  .join("\n")}

🛠️ SERVICES OFFERED:

${Object.entries(portfolioData.services)
  .map(
    ([key, service]) => `
${service.icon} ${service.title}
${service.description}
${
  service.subServices
    ? service.subServices
        .map(
          (sub) => `
  • ${sub.name}: ${sub.technologies.join(", ")}
    Deliverables: ${sub.deliverables.join(", ")}
    Timeline: ${sub.timeframe} | Starting from: ${sub.startingPrice}`
        )
        .join("")
    : ""
}
${service.features ? `Features: ${service.features.join(", ")}` : ""}
${service.timeframe ? `Timeline: ${service.timeframe}` : ""}
${service.startingPrice ? `Starting Price: ${service.startingPrice}` : ""}
${service.hourlyRate ? `Hourly Rate: ${service.hourlyRate}` : ""}
`
  )
  .join("\n")}

💰 PRICING STRUCTURE:
${Object.entries(portfolioData.pricingTiers)
  .map(
    ([tier, pricing]) => `
${tier.toUpperCase()} TIER: ${pricing.name}
💵 Price Range: ${pricing.price}
⏱️ Duration: ${pricing.duration}
📋 Best For: ${pricing.bestFor}
✅ Includes: ${pricing.features.join(", ")}
`
  )
  .join("\n")}

📞 CONTACT INFORMATION:
Email: ${portfolioData.personalInfo.email}
Portfolio: ${portfolioData.personalInfo.portfolioUrl}
GitHub: ${portfolioData.socialLinks.github}
LinkedIn: ${portfolioData.socialLinks.linkedin}
Instagram: ${portfolioData.socialLinks.instagram}
Response Time: ${portfolioData.personalInfo.responseTime}
Availability: ${portfolioData.personalInfo.availability}
Timezone: ${portfolioData.personalInfo.timezone}

🔄 WORKING PROCESS:
${portfolioData.workingProcess
  .map(
    (step) => `
STEP ${step.step}: ${step.title} (${step.duration})
${step.activities.map((activity) => `  • ${activity}`).join("\n")}
`
  )
  .join("\n")}

❓ FREQUENTLY ASKED QUESTIONS:
${portfolioData.frequentlyAskedQuestions
  .map(
    (category) => `
${category.category.toUpperCase()} QUESTIONS:
${category.questions.map((qa) => `Q: ${qa.q}\nA: ${qa.a}`).join("\n\n")}
`
  )
  .join("\n")}

DATA SOURCES: ${portfolioData.dataSource}
LAST UPDATED: ${portfolioData.lastUpdated}
CACHE VERSION: ${portfolioData.cacheVersion || "v2.0"}
`;

  return context;
}

// Enhanced message intent detection dan routing
function detectMessageIntent(message) {
  const msg = message.toLowerCase();

  const intents = {
    projects: {
      keywords: [
        "proyek",
        "project",
        "portfolio",
        "karya",
        "hasil",
        "showcase",
        "demo",
      ],
      confidence: 0,
    },
    experience: {
      keywords: [
        "pengalaman",
        "experience",
        "kerja",
        "work",
        "karir",
        "career",
        "background",
      ],
      confidence: 0,
    },
    skills: {
      keywords: [
        "skill",
        "kemampuan",
        "teknologi",
        "tech",
        "stack",
        "bahasa",
        "framework",
        "library",
      ],
      confidence: 0,
    },
    contact: {
      keywords: [
        "kontak",
        "contact",
        "email",
        "telepon",
        "hubungi",
        "reach",
        "komunikasi",
      ],
      confidence: 0,
    },
    services: {
      keywords: [
        "layanan",
        "service",
        "jasa",
        "biaya",
        "harga",
        "price",
        "cost",
        "paket",
      ],
      confidence: 0,
    },
    collaboration: {
      keywords: [
        "kerjasama",
        "collaborate",
        "hire",
        "freelance",
        "project",
        "together",
      ],
      confidence: 0,
    },
    testimonials: {
      keywords: [
        "testimoni",
        "testimonial",
        "review",
        "feedback",
        "client",
        "opinion",
      ],
      confidence: 0,
    },
    process: {
      keywords: [
        "proses",
        "process",
        "workflow",
        "tahapan",
        "langkah",
        "steps",
        "metodologi",
      ],
      confidence: 0,
    },
    availability: {
      keywords: [
        "tersedia",
        "available",
        "waktu",
        "time",
        "schedule",
        "jadwal",
        "busy",
      ],
      confidence: 0,
    },
    technical: {
      keywords: [
        "teknis",
        "technical",
        "implementation",
        "architecture",
        "database",
        "api",
      ],
      confidence: 0,
    },
  };

  // Calculate confidence scores
  Object.keys(intents).forEach((intent) => {
    intents[intent].confidence = intents[intent].keywords.reduce(
      (score, keyword) => {
        return score + (msg.includes(keyword) ? 1 : 0);
      },
      0
    );
  });

  // Find highest confidence intent
  const detectedIntent = Object.entries(intents).sort(
    ([, a], [, b]) => b.confidence - a.confidence
  )[0];

  return {
    intent: detectedIntent[0],
    confidence: detectedIntent[1].confidence,
    allScores: intents,
  };
}

// Generate specialized responses berdasarkan intent
function generateSpecializedPrompt(userMessage, portfolioData, intent) {
  const baseContext = generateComprehensiveContext(portfolioData);

  let specializedInstructions = "";

  switch (intent.intent) {
    case "projects":
      specializedInstructions = `
FOCUS: Detailed project information dan portfolio showcase
- Highlight specific projects yang relevan dengan pertanyaan
- Include technical details, challenges solved, dan business impact
- Mention live demos, GitHub links, dan visual elements
- Showcase variety dalam project types dan complexity levels
- Emphasize measurable results dan client satisfaction`;
      break;

    case "experience":
      specializedInstructions = `
FOCUS: Professional experience dan career journey
- Detail work experience dengan specific achievements
- Highlight career progression dan skill development
- Include company information dan project scope
- Mention learning experiences dan professional growth
- Emphasize reliability, teamwork, dan technical contributions`;
      break;

    case "skills":
      specializedInstructions = `
FOCUS: Technical skills dan expertise areas
- Provide detailed breakdown by technology categories
- Include proficiency levels dan years of experience
- Mention number of projects menggunakan each technology
- Highlight cutting-edge technologies dan learning enthusiasm
- Compare skills dengan industry standards`;
      break;

    case "services":
      specializedInstructions = `
FOCUS: Service offerings, pricing, dan packages
- Detail available services dengan clear descriptions
- Include pricing ranges dan what's included
- Explain different tiers dan suitable use cases
- Mention timeline estimates dan deliverables
- Highlight value proposition dan competitive advantages`;
      break;

    case "contact":
      specializedInstructions = `
FOCUS: Contact information dan communication details
- Provide all contact methods dengan clear instructions
- Mention response time expectations
- Include timezone dan availability information
- Suggest best methods untuk different inquiry types
- Encourage direct communication untuk detailed discussions`;
      break;

    case "collaboration":
      specializedInstructions = `
FOCUS: Collaboration opportunities dan working together
- Highlight openness untuk new projects dan partnerships
- Mention current availability status
- Include working style dan communication preferences
- Suggest next steps untuk potential collaboration
- Emphasize successful past collaborations`;
      break;

    default:
      specializedInstructions = `
FOCUS: General comprehensive information
- Provide balanced overview covering multiple aspects
- Include most relevant information based on query context
- Maintain professional yet approachable tone
- Offer specific next steps atau further information`;
  }

  return `${baseContext}

SPECIALIZED RESPONSE INSTRUCTIONS:
${specializedInstructions}

RESPONSE GUIDELINES:
- Use bahasa Indonesia yang natural dan engaging
- Include relevant emojis untuk visual appeal
- Provide specific, actionable information
- Always include contact information when relevant
- Use formatting (bold, bullet points) untuk readability
- Keep response comprehensive but concise
- End dengan clear call-to-action when appropriate

USER QUERY ANALYSIS:
Intent Detected: ${intent.intent} (confidence: ${intent.confidence})
Original Message: "${userMessage}"

Generate response yang directly addresses user's intent dengan comprehensive information:`;
}

// Enhanced Gemini API integration dengan advanced prompting
async function generateGeminiResponse(userMessage, portfolioData) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY tidak ditemukan di environment variables"
      );
    }

    // Detect user intent untuk specialized response
    const messageIntent = detectMessageIntent(userMessage);
    console.log(
      `🎯 Detected intent: ${messageIntent.intent} (confidence: ${messageIntent.confidence})`
    );

    // Generate specialized prompt berdasarkan intent
    const systemPrompt = generateSpecializedPrompt(
      userMessage,
      portfolioData,
      messageIntent
    );

    console.log("🤖 Generating AI response with Gemini 2.0 Flash...");

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1500,
          candidateCount: 1,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        timeout: 20000,
      }
    );

    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error("No valid response dari Gemini API");
    }

    console.log("✅ Gemini response generated successfully");
    return aiResponse.trim();
  } catch (error) {
    console.error("❌ Error generating Gemini response:", error.message);

    // Enhanced fallback responses berdasarkan intent
    const messageIntent = detectMessageIntent(userMessage);

    return generateIntelligentFallback(
      userMessage,
      messageIntent,
      portfolioData
    );
  }
}

// Intelligent fallback response generator
function generateIntelligentFallback(userMessage, intent, portfolioData) {
  const msg = userMessage.toLowerCase();

  switch (intent.intent) {
    case "projects":
      return `🚀 **Portfolio Azriel - 25+ Completed Projects!**

**🌟 Featured Projects:**

**1. Platform Top-up Game & Social Media** 
• **Tech Stack:** React, TypeScript, Node.js, PostgreSQL
• **Achievements:** 500+ active users, 2000+ transactions
• **Client:** Liboyy Store - 95% satisfaction rate
• **Live:** https://github.com/AzrielRosadi/LiboyyStore.ID

**2. System Laundry Website**
• **Tech Stack:** Laravel 11, MySQL, TailwindCSS
• **Impact:** +60% efficiency, Rp 50M+ revenue processed
• **Client:** Mbuutt Laundry - 98% satisfaction
• **Live:** https://mbuutt-laundry.infinityfreeapp.com/

**3. DOML AI Marketing Platform**
• **Tech Stack:** React, TailwindCSS, AI Integration
• **Performance:** 98/100 Lighthouse score
• **Live:** https://doml-azrl.vercel.app/

**4. Mechstrom: War Zone (Unity Game)**
• **Tech Stack:** Unity, C#, 3D Graphics
• **Features:** Advanced AI, weapon systems, multiple levels

💻 **Complete Portfolio:** https://azrl-webdev.vercel.app
📧 **Discuss Your Project:** azrlwebdev@gmail.com`;

    case "experience":
      return `💼 **Professional Experience - Azriel Rosadi**

**🏢 Current: Frontend Developer Intern - Starspace Studio**
📅 June 2025 - Present | Remote
✨ **Achievements:**
• 5+ complex UI components completed
• 25% performance improvement
• Active in mentoring programs
• Technologies: React, TypeScript, TailwindCSS, Figma

**🏢 Fullstack JavaScript Developer - Liboyy Store**
📅 March - May 2025 | Freelance | Remote
✨ **Impact:**
• Platform dengan 500+ active users
• Real-time tracking system
• 95% client satisfaction
• Revenue: Rp 15M+ project value

**🏢 Fullstack Laravel Developer - Mbuutt Laundry**
📅 Jan - Feb 2025 | Freelance | Remote
✨ **Results:**
• Complete laundry management system
• 70% reduction dalam manual work
• Rp 50M+ revenue processed
• 4.8/5 customer satisfaction

**🏢 Frontend Developer - PT. Spektrum Kreasi Pratama**
📅 Nov 2023 - Feb 2024 | Full-time | Jakarta
✨ **Contributions:**
• 40% website speed improvement
• 1000+ data entries (99% accuracy)
• Laboratory inventory system optimization

📈 **Overall Stats:** 25+ projects, 90% client retention
📧 **Career Discussion:** azrlwebdev@gmail.com`;

    case "skills":
      return `💻 **Technical Expertise - Azriel Rosadi**

**🎨 FRONTEND (Advanced Level):**
• **React:** 90% - 2+ years, 15 projects
• **TypeScript:** 88% - 1.5+ years, 12 projects  
• **Next.js:** 85% - 1+ years, 8 projects
• **TailwindCSS:** 90% - 2+ years, 18 projects
• **JavaScript:** 92% - 2+ years, 20 projects

**⚙️ BACKEND (Proficient Level):**
• **Node.js:** 87% - 2+ years, 12 projects
• **Laravel:** 88% - 1+ years, 6 projects
• **Express.js:** 85% - 1.5+ years, 10 projects
• **Python:** 80% - 1+ years, 5 projects

**🗄️ DATABASE (Strong Knowledge):**
• **PostgreSQL:** 85% - 1+ years, 8 projects
• **MySQL:** 88% - 2+ years, 12 projects
• **MongoDB:** 82% - 1+ years, 6 projects
• **Drizzle ORM:** 80% - 6 months, 4 projects

**🛠️ TOOLS & DEPLOYMENT:**
• **Git:** 90% - Version control expert
• **Vercel:** 88% - Deployment specialist
• **Unity:** 85% - Game development
• **Docker:** 75% - Containerization

🚀 **Specialty:** Full-stack development, API integration, real-time applications
📧 **Technical Discussion:** azrlwebdev@gmail.com`;

    case "services":
      return `🛠️ **Services & Packages - Azriel WebDev**

**💼 WEB DEVELOPMENT SERVICES:**

**🥉 BASIC PACKAGE** - Rp 5,000,000 - 8,000,000
⏱️ Duration: 2-4 weeks
✅ Includes:
• Responsive Landing Page
• Contact Form Integration  
• Basic SEO Optimization
• Mobile Optimization
• 1 Month Free Support
🎯 Best for: Small businesses, portfolio sites

**🥈 STANDARD PACKAGE** - Rp 8,000,000 - 15,000,000
⏱️ Duration: 4-8 weeks
✅ Includes:
• Multi-page Website
• Content Management System
• Advanced SEO Features
• Analytics Integration
• Social Media Integration
• 3 Months Support
🎯 Best for: Medium businesses, content sites

**🥇 PREMIUM PACKAGE** - Rp 15,000,000 - 30,000,000+
⏱️ Duration: 8-16 weeks
✅ Includes:
• Custom Web Application
• User Authentication System
• Database Integration
• Admin Dashboard
• API Development
• Payment Integration
• 6 Months Support
🎯 Best for: Large businesses, SaaS, e-commerce

**💡 ADDITIONAL SERVICES:**
• Mobile Optimization: Rp 3,000,000
• Technical Consulting: Rp 150,000/hour
• E-commerce Solutions: Starting Rp 15,000,000

💳 **Payment:** 30% down payment, 40% milestone, 30% completion
📧 **Get Quote:** azrlwebdev@gmail.com`;

    case "contact":
      return `📞 **Contact Azriel Rosadi - Fullstack Developer**

**📧 PRIMARY CONTACT:**
✉️ **Email:** azrlwebdev@gmail.com
⚡ **Response Time:** < 24 hours
🕐 **Timezone:** WIB (UTC+7)
📍 **Location:** Jakarta, Indonesia

**🌐 PROFESSIONAL LINKS:**
🖥️ **Portfolio:** https://azrl-webdev.vercel.app
💼 **GitHub:** https://github.com/AzrielRosadi  
🔗 **LinkedIn:** https://linkedin.com/in/azriel-rosadi-aa2859343/
📱 **Instagram:** https://instagram.com/azrlrsdi_/

**💬 BEST CONTACT METHODS:**
• **Project Inquiries:** Email (azrlwebdev@gmail.com)
• **Quick Questions:** Instagram DM
• **Professional Network:** LinkedIn
• **Code Collaboration:** GitHub

**📋 AVAILABILITY STATUS:**
✅ **Currently Available** for freelance projects
✅ Open for collaboration opportunities  
✅ Technical consulting available
✅ Long-term partnerships welcome

**📞 CONSULTATION:**
• **Free Initial Consultation:** 30 minutes
• **Technical Discussion:** Available via video call
• **Project Planning:** Detailed proposal provided

Ready to bring your ideas to life! 🚀
📧 **Email me now:** azrlwebdev@gmail.com`;

    case "collaboration":
      return `🤝 **Let's Collaborate - Azriel Rosadi**

**✅ CURRENTLY AVAILABLE FOR:**
• **Freelance Projects** - Full-stack web development
• **Technical Partnerships** - Long-term collaborations  
• **Startup Projects** - MVP development & scaling
• **Consulting Services** - Architecture & code review
• **Remote Work** - Global team collaboration

**🎯 IDEAL COLLABORATION TYPES:**
• **E-commerce Platforms** - Complete online stores
• **SaaS Applications** - Subscription-based platforms
• **Business Websites** - Corporate & professional sites
• **Game Development** - Unity-based projects
• **API Development** - Backend services & integrations

**💪 WHAT I BRING TO YOUR TEAM:**
• **2+ years** full-stack development experience
• **25+ completed projects** with 90% client retention
• **Modern tech stack** expertise (React, Node.js, Laravel)
• **Quality focus** with attention to detail
• **Reliable communication** & on-time delivery

**📈 RECENT SUCCESS STORIES:**
• **Liboyy Store:** 500+ users, 2000+ transactions
• **Mbuutt Laundry:** 60% efficiency increase  
• **Multiple Projects:** 95%+ client satisfaction

**🚀 READY TO START:**
• **Immediate availability** for new projects
• **Flexible working hours** (WIB timezone)
• **Competitive rates** with transparent pricing
• **Professional workflow** with regular updates

**📞 NEXT STEPS:**
1. **Email your project details:** azrlwebdev@gmail.com
2. **Free consultation call** to discuss requirements
3. **Detailed proposal** with timeline & pricing
4. **Project kickoff** and collaboration begins!

Let's build something amazing together! 🌟
📧 **Start the conversation:** azrlwebdev@gmail.com`;

    default:
      return `😅 **AI Assistant Temporarily Unavailable**

Sistem AI sedang mengalami gangguan teknis, tapi saya tetap bisa membantu! 

🤖 **Yang bisa saya bantu:**
• **Portfolio & Projects** (25+ completed projects)
• **Technical Skills** (React, Laravel, Node.js, etc.)
• **Work Experience** (4 companies, 2+ years)  
• **Services & Pricing** (Custom web development)
• **Contact Information** (Direct communication)
• **Collaboration Opportunities** (Current availability)

**📧 DIRECT CONTACT (Best Option):**
✉️ **Email:** azrlwebdev@gmail.com  
⚡ **Response:** < 24 hours guaranteed
🌐 **Portfolio:** https://azrl-webdev.vercel.app

**🎯 QUICK INFO:**
• **Status:** Available for new projects
• **Specialty:** Full-stack web development  
• **Experience:** 25+ completed projects, 90% client retention
• **Tech Stack:** React, TypeScript, Laravel, Node.js, PostgreSQL

Silakan coba bertanya lagi atau hubungi langsung via email! 📩`;
  }
}

// Main API handler dengan enhanced error handling dan logging
export default async function handler(req, res) {
  const startTime = Date.now();

  // Enhanced CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only POST requests are supported",
      allowedMethods: ["POST"],
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const { message, metadata } = req.body;

    // Enhanced input validation
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Message is required and must be a non-empty string",
        code: "INVALID_MESSAGE",
        timestamp: new Date().toISOString(),
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: "Message too long",
        message: "Message must be less than 2000 characters",
        maxLength: 2000,
        currentLength: message.length,
        timestamp: new Date().toISOString(),
      });
    }

    // Sanitize input
    const sanitizedMessage = message.trim().substring(0, 2000);

    console.log(
      `📨 [${new Date().toISOString()}] Incoming message (${
        sanitizedMessage.length
      } chars):`,
      sanitizedMessage.substring(0, 100) + "..."
    );
    console.log(`🔍 Request metadata:`, {
      userAgent: req.headers["user-agent"]?.substring(0, 100),
      origin: req.headers.origin,
      contentLength: req.headers["content-length"],
    });

    // Get comprehensive portfolio data
    console.log("📊 Fetching portfolio data...");
    const portfolioData = await getPortfolioData();

    console.log(
      `✅ Portfolio data loaded (source: ${portfolioData.dataSource})`
    );
    console.log(
      `📈 Cache info: Version ${portfolioData.cacheVersion}, Updated: ${portfolioData.lastUpdated}`
    );

    // Generate AI response with enhanced error handling
    console.log("🧠 Generating AI response...");
    let aiResponse;
    let responseSource = "gemini-2.0-flash";

    try {
      aiResponse = await generateGeminiResponse(
        sanitizedMessage,
        portfolioData
      );
    } catch (geminiError) {
      console.error(
        "⚠️ Gemini API failed, using intelligent fallback:",
        geminiError.message
      );
      const messageIntent = detectMessageIntent(sanitizedMessage);
      aiResponse = generateIntelligentFallback(
        sanitizedMessage,
        messageIntent,
        portfolioData
      );
      responseSource = "intelligent-fallback";
    }

    const processingTime = Date.now() - startTime;
    console.log(`✅ Response generated successfully in ${processingTime}ms`);

    // Enhanced response dengan metadata
    return res.status(200).json({
      response: aiResponse,
      metadata: {
        timestamp: new Date().toISOString(),
        processingTimeMs: processingTime,
        responseSource,
        dataSource: portfolioData.dataSource,
        cacheVersion: portfolioData.cacheVersion,
        portfolioLastUpdated: portfolioData.lastUpdated,
        messageLength: sanitizedMessage.length,
        responseLength: aiResponse.length,
        intent: detectMessageIntent(sanitizedMessage),
      },
      status: "success",
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ [${new Date().toISOString()}] API Error:`, {
      message: error.message,
      stack: error.stack?.substring(0, 500),
      processingTime,
    });

    // Enhanced error response
    return res.status(500).json({
      error: "Internal server error",
      message:
        "Terjadi kesalahan pada server. Silakan coba lagi dalam beberapa saat.",
      code: "INTERNAL_ERROR",
      metadata: {
        timestamp: new Date().toISOString(),
        processingTimeMs: processingTime,
        errorType: error.name,
        requestId: `req_${Date.now()}`,
      },
      fallbackResponse: `🚨 **Sistem Sedang Maintenance**

Maaf, terjadi gangguan teknis pada AI Assistant. 

**📞 Hubungi Langsung:**
✉️ **Email:** azrlwebdev@gmail.com
⚡ **Response Time:** < 24 jam  
🌐 **Portfolio:** https://azrl-webdev.vercel.app

**🔧 Atau coba tanya tentang:**
• Portfolio & proyek terbaru
• Pengalaman kerja & skills
• Layanan & pricing
• Kolaborasi opportunities

Terima kasih atas pengertiannya! 🙏`,
      details:
        process.env.NODE_ENV === "development"
          ? {
              errorMessage: error.message,
              errorStack: error.stack?.substring(0, 1000),
            }
          : undefined,
    });
  }
}
