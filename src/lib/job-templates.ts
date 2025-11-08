export interface JobTemplate {
    id: string;
    name: string;
    category: string;
    seniorityLevel: string;
    roleTitle: string;
    roleDescription: string;
    responsibilities: string;
    requirements: string;
    preferredQualifications?: string;
    yearsExperienceMin: number;
    yearsExperienceMax?: number;
    requiredSkills: string[];
    preferredSkills?: string[];
    salaryRangeMin: number;
    salaryRangeMax: number;
    remoteOption: string;
    employmentType: string;
    benefits?: string;
    industry: string;
    department?: string;
}

export const jobTemplates: JobTemplate[] = [
    {
        id: 'software-engineer-senior',
        name: 'Senior Software Engineer',
        category: 'Technology',
        seniorityLevel: 'SENIOR',
        roleTitle: 'Senior Software Engineer',
        roleDescription: 'We are seeking a Senior Software Engineer to join our engineering team and help build scalable, high-performance applications that serve millions of users.',
        responsibilities: '• Design, develop, and maintain high-quality software applications\n• Collaborate with cross-functional teams to define and implement new features\n• Write clean, maintainable, and well-documented code\n• Participate in code reviews and mentor junior developers\n• Optimize application performance and scalability\n• Stay current with emerging technologies and best practices',
        requirements: '• 5+ years of software development experience\n• Strong proficiency in TypeScript/JavaScript and React\n• Experience with Node.js and modern backend technologies\n• Knowledge of database design and SQL/NoSQL databases\n• Experience with cloud platforms (AWS, GCP, or Azure)\n• Bachelor\'s degree in Computer Science or related field',
        preferredQualifications: '• Experience with microservices architecture\n• Knowledge of DevOps practices and CI/CD pipelines\n• Experience with containerization (Docker, Kubernetes)\n• Familiarity with agile development methodologies\n• Previous experience in fintech or high-growth startups',
        industry: 'Technology',
        department: 'Engineering',
        requiredSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
        preferredSkills: ['Python', 'Docker', 'Kubernetes', 'GraphQL', 'Redis'],
        salaryRangeMin: 120000,
        salaryRangeMax: 180000,
        remoteOption: "HYBRID",
        employmentType: "FULL_TIME",
        yearsExperienceMin: 5,
        benefits: '• Competitive salary and equity package\n• Health insurance and wellness programs\n• Flexible working hours and remote work options\n• Professional development budget\n• Modern office with free meals and snacks'
    },
    {
        id: 'product-manager-senior',
        name: 'Senior Product Manager',
        category: 'Product',
        seniorityLevel: 'SENIOR',
        roleTitle: 'Senior Product Manager',
        roleDescription: 'We are looking for a Senior Product Manager to drive product strategy and execution for our core platform, working closely with engineering, design, and business teams.',
        responsibilities: '• Define product vision and strategy aligned with company goals\n• Conduct market research and competitive analysis\n• Develop product roadmaps and prioritize feature development\n• Collaborate with engineering teams to deliver high-quality products\n• Analyze product metrics and user feedback to drive improvements\n• Present product plans and progress to stakeholders',
        requirements: '• 5+ years of product management experience\n• Proven track record of shipping successful products\n• Strong analytical skills and data-driven decision making\n• Experience with agile development methodologies\n• Excellent communication and leadership skills\n• Bachelor\'s degree in Business, Computer Science, or related field',
        preferredQualifications: '• Experience in fintech or financial services\n• Technical background or coding experience\n• Experience with product analytics tools\n• Knowledge of UX/UI design principles\n• MBA or advanced degree in related field',
        industry: 'Technology',
        department: 'Product',
        requiredSkills: ['Product Strategy', 'Agile', 'Analytics', 'SQL', 'User Research'],
        preferredSkills: ['Python', 'Figma', 'Mixpanel', 'Jira', 'A/B Testing'],
        salaryRangeMin: 120000,
        salaryRangeMax: 180000,
        remoteOption: "HYBRID",
        employmentType: "FULL_TIME",
        yearsExperienceMin: 5,
        benefits: '• Competitive salary and equity package\n• Health insurance and wellness programs\n• Flexible working hours and remote work options\n• Professional development budget\n• Modern office with free meals and snacks'
    },
    {
        id: 'marketing-director',
        name: 'Marketing Director',
        category: 'Marketing',
        seniorityLevel: 'DIRECTOR',
        roleTitle: 'Director of Marketing',
        roleDescription: 'We are seeking a Director of Marketing to lead our marketing efforts and drive brand awareness, customer acquisition, and revenue growth across all channels.',
        responsibilities: '• Develop and execute comprehensive marketing strategies\n• Lead a high-performing marketing team\n• Manage marketing budget and optimize ROI across channels\n• Drive brand positioning and messaging\n• Oversee content creation and campaign execution\n• Analyze marketing performance and provide insights\n• Collaborate with sales and product teams for go-to-market strategies',
        requirements: '• 8+ years of marketing experience with 3+ years in leadership\n• Proven track record of driving growth and scaling marketing teams\n• Experience with digital marketing, content marketing, and PR\n• Strong analytical skills and experience with marketing analytics\n• Excellent leadership and communication skills\n• Bachelor\'s degree in Marketing, Business, or related field',
        preferredQualifications: '• Experience in B2B SaaS or fintech marketing\n• MBA or advanced degree\n• Experience with marketing automation platforms\n• Knowledge of SEO and SEM best practices\n• Previous experience in high-growth startups',
        industry: 'Technology',
        department: 'Marketing',
        requiredSkills: ['Digital Marketing', 'Content Strategy', 'Analytics', 'Team Leadership', 'Budget Management'],
        preferredSkills: ['SEO/SEM', 'Marketing Automation', 'PR', 'Brand Strategy', 'CRM'],
        salaryRangeMin: 150000,
        salaryRangeMax: 220000,
        remoteOption: "HYBRID",
        employmentType: "FULL_TIME",
        yearsExperienceMin: 8,
        benefits: '• Competitive salary and equity package\n• Health insurance and wellness programs\n• Flexible working hours and remote work options\n• Professional development budget\n• Modern office with free meals and snacks'
    },
    {
        id: 'data-scientist-senior',
        name: 'Senior Data Scientist',
        category: 'Data & Analytics',
        seniorityLevel: 'SENIOR',
        roleTitle: 'Senior Data Scientist',
        roleDescription: 'We are looking for a Senior Data Scientist to join our data team and help build machine learning models and analytics solutions that drive business insights and product improvements.',
        responsibilities: '• Develop and deploy machine learning models for business applications\n• Analyze large datasets to extract actionable insights\n• Collaborate with product and engineering teams on data-driven features\n• Design and implement A/B tests and experiments\n• Create data visualizations and reports for stakeholders\n• Stay current with advances in machine learning and AI',
        requirements: '• 5+ years of data science or machine learning experience\n• Strong proficiency in Python, R, and SQL\n• Experience with machine learning frameworks (scikit-learn, TensorFlow, PyTorch)\n• Knowledge of statistical analysis and experimental design\n• Experience with big data technologies (Spark, Hadoop)\n• PhD or Master\'s degree in Data Science, Statistics, or related field',
        preferredQualifications: '• Experience with deep learning and NLP\n• Knowledge of cloud ML platforms (SageMaker, Vertex AI)\n• Experience with real-time analytics\n• Background in fintech or financial services\n• Publications in machine learning conferences',
        industry: 'Technology',
        department: 'Data Science',
        requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'A/B Testing'],
        preferredSkills: ['R', 'TensorFlow', 'Spark', 'NLP', 'Deep Learning'],
        salaryRangeMin: 120000,
        salaryRangeMax: 180000,
        remoteOption: "HYBRID",
        employmentType: "FULL_TIME",
        yearsExperienceMin: 5,
        benefits: '• Competitive salary and equity package\n• Health insurance and wellness programs\n• Flexible working hours and remote work options\n• Professional development budget\n• Modern office with free meals and snacks'
    },
    {
        id: 'hr-director',
        name: 'HR Director',
        category: 'Human Resources',
        seniorityLevel: 'DIRECTOR',
        roleTitle: 'Director of Human Resources',
        roleDescription: 'We are seeking a Director of Human Resources to lead our people operations and build a world-class culture that attracts and retains top talent in the competitive tech landscape.',
        responsibilities: '• Develop and implement HR strategies aligned with business goals\n• Lead talent acquisition, onboarding, and retention initiatives\n• Design and manage compensation and benefits programs\n• Foster a positive company culture and employee engagement\n• Oversee performance management and professional development\n• Ensure compliance with labor laws and regulations\n• Partner with leadership on organizational development',
        requirements: '• 8+ years of HR experience with 3+ years in leadership\n• Experience in high-growth tech companies\n• Strong knowledge of HR best practices and employment law\n• Excellent interpersonal and leadership skills\n• Experience with HRIS systems and talent management tools\n• Bachelor\'s degree in Human Resources, Business, or related field',
        preferredQualifications: '• SHRM or HRCI certification\n• Experience with equity compensation\n• Knowledge of Nigerian labor laws\n• Background in consulting or corporate HR\n• MBA or advanced HR certification',
        industry: 'Technology',
        department: 'Human Resources',
        requiredSkills: ['Talent Management', 'Employee Relations', 'Compensation Design', 'HR Strategy', 'Compliance'],
        preferredSkills: ['Organizational Development', 'Change Management', 'Diversity & Inclusion', 'HR Analytics', 'Coaching'],
        salaryRangeMin: 150000,
        salaryRangeMax: 220000,
        remoteOption: "HYBRID",
        employmentType: "FULL_TIME",
        yearsExperienceMin: 8,
        benefits: '• Competitive salary and equity package\n• Health insurance and wellness programs\n• Flexible working hours and remote work options\n• Professional development budget\n• Modern office with free meals and snacks'
    },
    {
        id: 'sales-director',
        name: 'Sales Director',
        category: 'Sales',
        seniorityLevel: 'DIRECTOR',
        roleTitle: 'Director of Sales',
        roleDescription: 'We are looking for a Director of Sales to lead our sales organization and drive revenue growth through strategic selling, team development, and market expansion.',
        responsibilities: '• Develop and execute sales strategies to achieve revenue targets\n• Build and lead a high-performing sales team\n• Establish sales processes, methodologies, and KPIs\n• Identify and pursue new market opportunities\n• Collaborate with marketing on lead generation and conversion\n• Provide sales training and coaching to team members\n• Analyze sales performance and market trends',
        requirements: '• 8+ years of sales experience with 3+ years in sales leadership\n• Proven track record of exceeding sales quotas and building teams\n• Experience in enterprise software or SaaS sales\n• Strong negotiation and relationship-building skills\n• Experience with CRM systems and sales analytics\n• Bachelor\'s degree in Business, Marketing, or related field',
        preferredQualifications: '• Experience in fintech or financial services sales\n• Background in consultative selling\n• Knowledge of sales enablement tools\n• Experience with channel sales and partnerships\n• MBA or advanced business degree',
        industry: 'Technology',
        department: 'Sales',
        requiredSkills: ['Sales Strategy', 'Team Leadership', 'CRM', 'Negotiation', 'Sales Analytics'],
        preferredSkills: ['Enterprise Sales', 'Consultative Selling', 'Channel Management', 'Sales Enablement', 'Forecasting'],
        salaryRangeMin: 150000,
        salaryRangeMax: 220000,
        remoteOption: "HYBRID",
        employmentType: "FULL_TIME",
        yearsExperienceMin: 8,
        benefits: '• Competitive salary and equity package\n• Health insurance and wellness programs\n• Flexible working hours and remote work options\n• Professional development budget\n• Modern office with free meals and snacks'
    }
];

export const getTemplatesByCategory = (category: string): JobTemplate[] => {
    return jobTemplates.filter(template => template.category === category);
};

export const getAllCategories = (): string[] => {
    return Array.from(new Set(jobTemplates.map(template => template.category)));
};

export const getTemplateById = (id: string): JobTemplate | undefined => {
    return jobTemplates.find(template => template.id === id);
};
