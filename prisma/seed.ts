import { PrismaClient, SettingValueType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // ============================================
    // 1. SEED INDUSTRIES
    // ============================================
    console.log('📊 Seeding industries...');

    const industries = [
        { name: 'Financial Services', slug: 'financial-services', description: 'Banking, insurance, investment, and fintech companies', sortOrder: 1 },
        { name: 'Technology', slug: 'technology', description: 'Software, hardware, IT services, and tech startups', sortOrder: 2 },
        { name: 'Oil & Gas', slug: 'oil-gas', description: 'Petroleum exploration, production, refining, and distribution', sortOrder: 3 },
        { name: 'Telecommunications', slug: 'telecommunications', description: 'Mobile networks, internet services, and telecom infrastructure', sortOrder: 4 },
        { name: 'Healthcare', slug: 'healthcare', description: 'Hospitals, pharmaceuticals, medical devices, and health tech', sortOrder: 5 },
        { name: 'Manufacturing', slug: 'manufacturing', description: 'Industrial production, FMCG, and consumer goods', sortOrder: 6 },
        { name: 'Retail & E-commerce', slug: 'retail-ecommerce', description: 'Online and offline retail, marketplaces, and logistics', sortOrder: 7 },
        { name: 'Professional Services', slug: 'professional-services', description: 'Consulting, legal, accounting, and advisory firms', sortOrder: 8 },
        { name: 'Real Estate', slug: 'real-estate', description: 'Property development, management, and real estate services', sortOrder: 9 },
        { name: 'Media & Entertainment', slug: 'media-entertainment', description: 'Broadcasting, publishing, film, music, and creative industries', sortOrder: 10 },
        { name: 'Education', slug: 'education', description: 'Schools, universities, EdTech, and training institutions', sortOrder: 11 },
        { name: 'Agriculture', slug: 'agriculture', description: 'Farming, agribusiness, agtech, and food processing', sortOrder: 12 },
        { name: 'Transportation & Logistics', slug: 'transportation-logistics', description: 'Shipping, freight, supply chain, and delivery services', sortOrder: 13 },
        { name: 'Hospitality & Tourism', slug: 'hospitality-tourism', description: 'Hotels, restaurants, travel agencies, and tourism services', sortOrder: 14 },
        { name: 'Energy & Utilities', slug: 'energy-utilities', description: 'Power generation, renewable energy, water, and utilities', sortOrder: 15 },
        { name: 'Construction & Engineering', slug: 'construction-engineering', description: 'Building construction, civil engineering, and infrastructure', sortOrder: 16 },
        { name: 'Automotive', slug: 'automotive', description: 'Vehicle manufacturing, sales, and automotive services', sortOrder: 17 },
        { name: 'Insurance', slug: 'insurance', description: 'Life, health, property, and casualty insurance', sortOrder: 18 },
        { name: 'Non-Profit & NGO', slug: 'non-profit-ngo', description: 'Charitable organizations, foundations, and development agencies', sortOrder: 19 },
        { name: 'Government & Public Sector', slug: 'government-public-sector', description: 'Government agencies, public administration, and civil service', sortOrder: 20 },
    ];

    for (const industry of industries) {
        await prisma.industry.upsert({
            where: { industrySlug: industry.slug },
            update: {},
            create: {
                industryName: industry.name,
                industrySlug: industry.slug,
                description: industry.description,
                sortOrder: industry.sortOrder,
                isActive: true,
            },
        });
    }

    console.log(`✅ Seeded ${industries.length} industries`);

    // ============================================
    // 2. SEED SKILLS TAXONOMY
    // ============================================
    console.log('🎯 Seeding skills taxonomy...');

    const skills = [
        // Leadership Skills
        { name: 'Strategic Planning', slug: 'strategic-planning', category: 'Leadership', synonyms: ['Strategy', 'Strategic Thinking'] },
        { name: 'Change Management', slug: 'change-management', category: 'Leadership', synonyms: ['Organizational Change', 'Transformation'] },
        { name: 'Team Leadership', slug: 'team-leadership', category: 'Leadership', synonyms: ['People Management', 'Team Management'] },
        { name: 'Project Management', slug: 'project-management', category: 'Leadership', synonyms: ['Program Management', 'PMO'] },
        { name: 'Stakeholder Management', slug: 'stakeholder-management', category: 'Leadership', synonyms: ['Stakeholder Engagement'] },
        { name: 'Executive Leadership', slug: 'executive-leadership', category: 'Leadership', synonyms: ['C-Suite Leadership', 'Senior Leadership'] },
        { name: 'Performance Management', slug: 'performance-management', category: 'Leadership', synonyms: ['KPI Management', 'Goal Setting'] },

        // Technical Skills
        { name: 'Data Analysis', slug: 'data-analysis', category: 'Technical', synonyms: ['Analytics', 'Data Science'] },
        { name: 'Python', slug: 'python', category: 'Technical', synonyms: ['Python Programming'] },
        { name: 'SQL', slug: 'sql', category: 'Technical', synonyms: ['Database', 'PostgreSQL', 'MySQL'] },
        { name: 'Cloud Computing', slug: 'cloud-computing', category: 'Technical', synonyms: ['AWS', 'Azure', 'GCP'] },
        { name: 'Business Intelligence', slug: 'business-intelligence', category: 'Technical', synonyms: ['BI', 'Reporting', 'Dashboards'] },
        { name: 'ERP Systems', slug: 'erp-systems', category: 'Technical', synonyms: ['SAP', 'Oracle', 'Microsoft Dynamics'] },
        { name: 'CRM Software', slug: 'crm-software', category: 'Technical', synonyms: ['Salesforce', 'HubSpot', 'Zoho'] },
        { name: 'Microsoft Excel', slug: 'microsoft-excel', category: 'Technical', synonyms: ['Excel', 'Advanced Excel', 'Spreadsheets'] },
        { name: 'Power BI', slug: 'power-bi', category: 'Technical', synonyms: ['PowerBI', 'Microsoft BI'] },
        { name: 'Tableau', slug: 'tableau', category: 'Technical', synonyms: ['Data Visualization'] },

        // Business Skills
        { name: 'Financial Analysis', slug: 'financial-analysis', category: 'Business', synonyms: ['Financial Modeling', 'FP&A'] },
        { name: 'Business Development', slug: 'business-development', category: 'Business', synonyms: ['BD', 'Growth Strategy'] },
        { name: 'Sales Strategy', slug: 'sales-strategy', category: 'Business', synonyms: ['Sales Management', 'Revenue Growth'] },
        { name: 'Marketing Strategy', slug: 'marketing-strategy', category: 'Business', synonyms: ['Marketing Management', 'Brand Strategy'] },
        { name: 'Product Management', slug: 'product-management', category: 'Business', synonyms: ['Product Strategy', 'Product Development'] },
        { name: 'Commercial Strategy', slug: 'commercial-strategy', category: 'Business', synonyms: ['Commercial Management', 'Go-to-Market'] },
        { name: 'Pricing Strategy', slug: 'pricing-strategy', category: 'Business', synonyms: ['Revenue Management', 'Price Optimization'] },
        { name: 'Contract Negotiation', slug: 'contract-negotiation', category: 'Business', synonyms: ['Negotiation', 'Deal Making'] },
        { name: 'Partnership Development', slug: 'partnership-development', category: 'Business', synonyms: ['Strategic Partnerships', 'Alliances'] },

        // Domain-Specific Skills
        { name: 'Risk Management', slug: 'risk-management', category: 'Domain', synonyms: ['Enterprise Risk', 'Risk Assessment'] },
        { name: 'Compliance', slug: 'compliance', category: 'Domain', synonyms: ['Regulatory Compliance', 'Internal Audit'] },
        { name: 'Operations Management', slug: 'operations-management', category: 'Domain', synonyms: ['Operations', 'Process Management'] },
        { name: 'Supply Chain Management', slug: 'supply-chain', category: 'Domain', synonyms: ['SCM', 'Logistics', 'Procurement'] },
        { name: 'Quality Assurance', slug: 'quality-assurance', category: 'Domain', synonyms: ['QA', 'Quality Control', 'ISO Standards'] },
        { name: 'Human Resources', slug: 'human-resources', category: 'Domain', synonyms: ['HR', 'Talent Management', 'People Operations'] },
        { name: 'Legal & Regulatory', slug: 'legal-regulatory', category: 'Domain', synonyms: ['Legal Affairs', 'Corporate Law'] },
        { name: 'Internal Controls', slug: 'internal-controls', category: 'Domain', synonyms: ['Control Environment', 'SOX Compliance'] },
        { name: 'Merger & Acquisition', slug: 'merger-acquisition', category: 'Domain', synonyms: ['M&A', 'Corporate Development'] },

        // Financial Skills
        { name: 'Budgeting & Forecasting', slug: 'budgeting-forecasting', category: 'Financial', synonyms: ['Budget Management', 'Financial Planning'] },
        { name: 'Cost Management', slug: 'cost-management', category: 'Financial', synonyms: ['Cost Control', 'Cost Optimization'] },
        { name: 'Treasury Management', slug: 'treasury-management', category: 'Financial', synonyms: ['Cash Management', 'Liquidity'] },
        { name: 'Financial Reporting', slug: 'financial-reporting', category: 'Financial', synonyms: ['IFRS', 'GAAP', 'Financial Statements'] },
        { name: 'Investment Analysis', slug: 'investment-analysis', category: 'Financial', synonyms: ['Investment Banking', 'Portfolio Management'] },
        { name: 'Tax Planning', slug: 'tax-planning', category: 'Financial', synonyms: ['Tax Strategy', 'Tax Compliance'] },

        // Soft Skills
        { name: 'Communication', slug: 'communication', category: 'Soft Skills', synonyms: ['Presentation Skills', 'Public Speaking'] },
        { name: 'Problem Solving', slug: 'problem-solving', category: 'Soft Skills', synonyms: ['Critical Thinking', 'Analytical Thinking'] },
        { name: 'Collaboration', slug: 'collaboration', category: 'Soft Skills', synonyms: ['Teamwork', 'Cross-functional Collaboration'] },
        { name: 'Decision Making', slug: 'decision-making', category: 'Soft Skills', synonyms: ['Judgment', 'Strategic Decision Making'] },
        { name: 'Conflict Resolution', slug: 'conflict-resolution', category: 'Soft Skills', synonyms: ['Mediation', 'Dispute Resolution'] },
        { name: 'Emotional Intelligence', slug: 'emotional-intelligence', category: 'Soft Skills', synonyms: ['EQ', 'Self-awareness'] },

        // Industry-Specific Skills
        { name: 'Banking Operations', slug: 'banking-operations', category: 'Industry', synonyms: ['Retail Banking', 'Corporate Banking'] },
        { name: 'Insurance Underwriting', slug: 'insurance-underwriting', category: 'Industry', synonyms: ['Risk Underwriting', 'Actuarial'] },
        { name: 'Oil & Gas Operations', slug: 'oil-gas-operations', category: 'Industry', synonyms: ['Upstream', 'Downstream', 'Midstream'] },
        { name: 'Telecommunications', slug: 'telecommunications', category: 'Industry', synonyms: ['Telecom', 'Network Operations'] },
        { name: 'Healthcare Administration', slug: 'healthcare-administration', category: 'Industry', synonyms: ['Hospital Management', 'Clinical Operations'] },
        { name: 'Real Estate Development', slug: 'real-estate-development', category: 'Industry', synonyms: ['Property Development', 'Construction Management'] },
        { name: 'Digital Marketing', slug: 'digital-marketing', category: 'Industry', synonyms: ['SEO', 'Social Media Marketing', 'Content Marketing'] },
    ];

    for (const skill of skills) {
        await prisma.skillTaxonomy.upsert({
            where: { skillSlug: skill.slug },
            update: {},
            create: {
                skillName: skill.name,
                skillSlug: skill.slug,
                skillCategory: skill.category,
                synonyms: skill.synonyms,
                usageCount: 0,
                isActive: true,
            },
        });
    }

    console.log(`✅ Seeded ${skills.length} skills`);

    // ============================================
    // 4. SEED SYSTEM SETTINGS
    // ============================================
    console.log('⚙️ Seeding system settings...');

    const systemSettings = [
        {
            key: 'introduction_expiry_days',
            value: '7',
            type: 'INTEGER',
            description: 'Number of days before an introduction request expires',
            isPublic: true,
        },
        {
            key: 'max_pending_introductions_per_professional',
            value: '10',
            type: 'INTEGER',
            description: 'Maximum number of pending introduction requests a professional can have',
            isPublic: false,
        },
        {
            key: 'trial_duration_days',
            value: '14',
            type: 'INTEGER',
            description: 'Length of trial period for new companies in days',
            isPublic: true,
        },
        {
            key: 'min_salary_threshold_ngn',
            value: '3000000',
            type: 'INTEGER',
            description: 'Minimum salary threshold for senior roles (Naira annually)',
            isPublic: false,
        },
        {
            key: 'verification_turnaround_days',
            value: '3',
            type: 'INTEGER',
            description: 'Target number of days to complete professional verification',
            isPublic: false,
        },
        {
            key: 'platform_commission_percentage',
            value: '0',
            type: 'INTEGER',
            description: 'Commission percentage on successful hires (future feature)',
            isPublic: false,
        },
        {
            key: 'min_years_experience',
            value: '5',
            type: 'INTEGER',
            description: 'Minimum years of experience required for professionals',
            isPublic: true,
        },
        {
            key: 'email_verification_required',
            value: 'true',
            type: 'BOOLEAN',
            description: 'Whether email verification is required for new users',
            isPublic: true,
        },
        {
            key: 'phone_verification_required',
            value: 'true',
            type: 'BOOLEAN',
            description: 'Whether phone/WhatsApp verification is required',
            isPublic: true,
        },
        {
            key: 'profile_visibility_default',
            value: 'private',
            type: 'STRING',
            description: 'Default profile visibility for new professionals',
            isPublic: false,
        },
        {
            key: 'max_search_results',
            value: '50',
            type: 'INTEGER',
            description: 'Maximum number of search results to return',
            isPublic: false,
        },
        {
            key: 'vat_percentage',
            value: '7.5',
            type: 'STRING',
            description: 'VAT percentage for Nigeria',
            isPublic: true,
        },
    ];

    for (const setting of systemSettings) {
        await prisma.systemSetting.upsert({
            where: { settingKey: setting.key },
            update: {},
            create: {
                settingKey: setting.key,
                settingValue: setting.value,
                valueType: setting.type as SettingValueType,
                description: setting.description,
                isPublic: setting.isPublic,
            },
        });
    }

    console.log(`✅ Seeded ${systemSettings.length} system settings`);

    // ============================================
    // 6. SEED SAMPLE COMPANIES
    // ============================================
    console.log('🏢 Seeding sample companies...');

    // African companies data (Nigeria, Kenya, South Africa, Ghana)
    const nigerianCompanies = [
        // Nigeria
        {
            name: 'Interswitch Group',
            desciption: 'Interswitch Group is a leading payments and financial services company in Africa. It provides a wide range of payment solutions, including mobile money, e-wallets, and online payment platforms.',
            domain: 'interswitch.com',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Telecommunications',
            size: 'LARGE_51_200',
        },
        {
            name: 'Flutterwave',
            description: 'Flutterwave is one of the leading online payment platforms in Africa. It offers a range of payment solutions, including mobile money, e-wallets, and online payment platforms.',
            domain: 'flutterwave.com',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Fintech',
            size: 'LARGE_51_200',
        },
        {
            name: 'Paystack',
            domain: 'paystack.com',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Fintech',
            size: 'LARGE_51_200',
        },
        {
            name: 'Andela',
            domain: 'andela.com',
            description: 'Andela is a leading software development company in Africa. It provides software development services, including custom software development, software maintenance, and software consulting.',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Technology',
            size: 'LARGE_51_200',
        },
        {
            name: 'SystemSpecs',
            description: 'SystemSpecs is a leading software development company in Africa. It provides software development services, including custom software development, software maintenance, and software consulting.',
            domain: 'systemspecs.com.ng',
            headquarters: 'Abuja, Nigeria',
            country: 'Nigeria',
            industry: 'Technology',
            size: 'LARGE_51_200',

        },
        {
            name: 'Kuda Bank',
            domain: 'kuda.com',
            description: 'Kuda Bank is a leading payments and financial services company in Africa. It provides a wide range of payment solutions, including mobile money, e-wallets, and online payment platforms.',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Fintech',
            size: 'LARGE_51_200',
        },
        {
            name: 'PiggyVest',
            domain: 'piggyvest.com',
            description: 'PiggyVest is a leading payments and financial services company in Africa. It provides a wide range of payment solutions, including mobile money, e-wallets, and online payment platforms.',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Fintech',
            size: 'LARGE_51_200',
        },
        {
            name: 'Carbon (formerly Paylater)',
            domain: 'carbon.ng',
            description: 'Carbon is a leading payments and financial services company in Africa. It provides a wide range of payment solutions, including mobile money, e-wallets, and online payment platforms.',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Fintech',
            size: 'LARGE_51_200',
        },
        {
            name: 'TeamApt',
            domain: 'teamapt.com',
            description: 'TeamApt is a leading payments and financial services company in Africa. It provides a wide range of payment solutions, including mobile money, e-wallets, and online payment platforms.',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Fintech',
            size: 'LARGE_51_200',
        },
        {
            name: 'Cowrywise',
            domain: 'cowrywise.com',
            description: 'Cowrywise is a leading payments and financial services company in Africa. It provides a wide range of payment solutions, including mobile money, e-wallets, and online payment platforms.',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Fintech',
            size: 'LARGE_51_200',
        },
        {
            name: 'Seamfix',
            domain: 'seamfix.com',
            description: 'Seamfix provides a wide range of payment solutions, including mobile money, e-wallets, and online payment platforms.',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Fintech',
            size: 'LARGE_51_200',
        },
        {
            name: 'Kobo360',
            domain: 'kobo360.com',
            description: 'Kobo360 has become a leading payments and financial services company in Africa. It provides a wide range of payment solutions, including mobile money, e-wallets, and online payment platforms.',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Fintech',
            size: 'LARGE_51_200',
        },
        {
            name: 'TechAdvance',
            domain: 'techadvance.ng',
            headquarters: 'Abuja, Nigeria',
            country: 'Nigeria',
            industry: 'Technology',
            size: 'LARGE_51_200',
        },
        {
            name: 'Mines.io',
            description: 'Mines.io is a leading payments and financial services company in Africa. It provides a wide range of payment solutions, including mobile money, e-wallets, and online payment platforms.',
            domain: 'mines.io',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Fintech',
            size: 'XLARGE_201_500',
        },
        {
            name: 'VConnect',
            description: 'VConnect provides services related to mobile money, e-wallets, and online payment platforms.',
            domain: 'vconnect.com',
            headquarters: 'Lagos, Nigeria',
            country: 'Nigeria',
            industry: 'Services',
            size: 'XLARGE_201_500',
        },
    ];

    for (const company of nigerianCompanies) {
        await prisma.company.upsert({
            where: { companyName: company.name },
            update: {},
            create: {
                companyName: company.name,
                domain: company.domain,
                industry: company.industry,
                companySize: company.size as any,
                headquartersLocation: company.headquarters,
                companyDescription: company.description,
                companyWebsite: `https://${company.domain}`,
                verificationStatus: 'VERIFIED',
                status: 'ACTIVE',
                subscriptionTier: 'PROFESSIONAL',
                introductionCredits: 50
            }
        });
    }

    // ============================================
    // SEED COMPLETE
    // ============================================
    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('Summary:');
    console.log(`  - ${industries.length} industries`);
    console.log(`  - ${skills.length} skills`);
    console.log(`  - ${systemSettings.length} system settings`);
    console.log(`  - ${nigerianCompanies.length} sample companies`);
    console.log('\nYou can now start using theNexus platform! 🚀\n');
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e)
        prisma.$disconnect()
        process.exit(1)
    })
