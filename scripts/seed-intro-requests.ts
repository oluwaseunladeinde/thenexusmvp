import { prisma } from '../src/lib/database';

async function seedIntroductionRequests() {
    console.log('🌱 Seeding introduction requests...');

    try {
        // First, let's check if we have any professionals and companies
        const professional = await prisma.professional.findFirst();
        const company = await prisma.company.findFirst();
        const hrPartner = await prisma.hrPartner.findFirst();

        if (!professional || !company || !hrPartner) {
            console.log('❌ Missing required data. Please ensure you have:');
            console.log('- At least one professional');
            console.log('- At least one company');
            console.log('- At least one HR partner');
            return;
        }

        // Create a job role first
        const jobRole = await prisma.jobRole.create({
            data: {
                companyId: company.id,
                createdByHrId: hrPartner.id,
                roleTitle: 'Senior Software Engineer',
                roleDescription: 'We are looking for a senior software engineer to join our growing team.',
                responsibilities: 'Lead development projects, mentor junior developers, architect solutions.',
                requirements: '5+ years experience, React, Node.js, TypeScript',
                preferredQualifications: 'Experience with AWS, Docker, Kubernetes',
                seniorityLevel: 'DIRECTOR',
                industry: 'Technology',
                department: 'Engineering',
                locationCity: 'Lagos',
                locationState: 'Lagos',
                remoteOption: 'HYBRID',
                employmentType: 'FULL_TIME',
                salaryRangeMin: 2000000,
                salaryRangeMax: 3500000,
                benefits: 'Health insurance, stock options, flexible working hours',
                yearsExperienceMin: 5,
                yearsExperienceMax: 10,
                requiredSkills: ['React', 'Node.js', 'TypeScript'],
                preferredSkills: ['AWS', 'Docker', 'Kubernetes'],
                isConfidential: false,
                status: 'ACTIVE',
            }
        });

        // Create introduction requests
        const introRequests = await Promise.all([
            // Pending request
            prisma.introductionRequest.create({
                data: {
                    jobRoleId: jobRole.id,
                    companyId: company.id,
                    sentByHrId: hrPartner.id,
                    sentToProfessionalId: professional.id,
                    personalizedMessage: 'Hi! We have an exciting opportunity that matches your background perfectly. Would love to discuss this senior engineering role with you.',
                    status: 'PENDING',
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                }
            }),

            // Another pending request (confidential)
            prisma.introductionRequest.create({
                data: {
                    jobRoleId: jobRole.id,
                    companyId: company.id,
                    sentByHrId: hrPartner.id,
                    sentToProfessionalId: professional.id,
                    personalizedMessage: 'Confidential opportunity at a leading fintech company. Great compensation package and growth opportunities.',
                    status: 'PENDING',
                    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                }
            })
        ]);

        // Update job role to be confidential for the second request
        await prisma.jobRole.update({
            where: { id: jobRole.id },
            data: { isConfidential: true, confidentialReason: 'Stealth mode startup' }
        });

        console.log('✅ Successfully created:');
        console.log(`- 1 job role: ${jobRole.roleTitle}`);
        console.log(`- ${introRequests.length} introduction requests`);
        console.log('\n📋 Test data ready! You can now:');
        console.log('1. Start the dev server: npm run dev');
        console.log('2. Login as the professional user');
        console.log('3. Test the APIs at /api/v1/introductions/received');

    } catch (error) {
        console.error('❌ Error seeding introduction requests:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedIntroductionRequests();
