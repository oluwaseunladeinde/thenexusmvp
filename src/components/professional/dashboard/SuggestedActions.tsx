

import { Lightbulb, Edit, Plus, MessageSquare, FileText, Target } from 'lucide-react';
import Link from 'next/link';

interface Professional {
    id: string;
    firstName: string;
    lastName: string;
    profileHeadline: string | null;
    yearsOfExperience: number;
    currentTitle: string | null;
    currentCompany: string | null;
    currentIndustry: string | null;
    locationCity: string;
    locationState: string;
    salaryExpectationMin: number | null;
    salaryExpectationMax: number | null;
    linkedinUrl: string | null;
    portfolioUrl: string | null;
    profileCompleteness: number;
    skills: Array<{
        skillName: string;
        proficiencyLevel: string;
    }>;
    workHistory: Array<{
        companyName: string;
        jobTitle: string;
        startDate: Date;
        endDate: Date | null;
        isCurrent: boolean;
    }>;
    introductionRequests: Array<{
        status: string;
        sentAt: Date;
    }>;
    profileViews: Array<{
        viewedAt: Date;
    }>;
}

interface Props {
    professional: Professional;
}

export default function SuggestedActions({ professional }: Props) {
    // Calculate completion gaps
    const hasHeadline = !!professional.profileHeadline;
    const hasSkills = professional.skills.length > 0;
    const hasWorkHistory = professional.workHistory.length > 0;
    const hasLinkedIn = !!professional.linkedinUrl;
    const hasPortfolio = !!professional.portfolioUrl;
    const hasSalaryExpectations = !!(professional.salaryExpectationMin && professional.salaryExpectationMax);

    // Generate action items based on profile completeness
    const actionItems = [];

    if (!hasHeadline) {
        actionItems.push({
            id: 'headline',
            icon: Edit,
            title: 'Add a Professional Headline',
            description: 'Create a compelling headline that showcases your expertise',
            priority: 'high',
            link: '/professional/profile',
        });
    }

    if (!hasSkills || professional.skills.length < 5) {
        actionItems.push({
            id: 'skills',
            icon: Plus,
            title: 'Add More Skills',
            description: `You have ${professional.skills.length} skills listed. Add more to improve visibility`,
            priority: 'high',
            link: '/professional/profile',
        });
    }

    if (!hasWorkHistory) {
        actionItems.push({
            id: 'experience',
            icon: FileText,
            title: 'Add Work Experience',
            description: 'Complete your work history to build credibility',
            priority: 'high',
            link: '/professional/profile',
        });
    }

    if (!hasLinkedIn) {
        actionItems.push({
            id: 'linkedin',
            icon: MessageSquare,
            title: 'Connect LinkedIn Profile',
            description: 'Link your LinkedIn to showcase your professional network',
            priority: 'medium',
            link: '/professional/profile',
        });
    }

    if (!hasPortfolio) {
        actionItems.push({
            id: 'portfolio',
            icon: Target,
            title: 'Add Portfolio/Resume',
            description: 'Upload your portfolio or resume to stand out',
            priority: 'medium',
            link: '/professional/profile',
        });
    }

    if (!hasSalaryExpectations) {
        actionItems.push({
            id: 'salary',
            icon: Target,
            title: 'Set Salary Expectations',
            description: 'Define your salary range to match with relevant opportunities',
            priority: 'medium',
            link: '/professional/profile',
        });
    }

    // If profile is complete, show engagement actions
    if (professional.profileCompleteness >= 80 && actionItems.length === 0) {
        actionItems.push(
            {
                id: 'network',
                icon: MessageSquare,
                title: 'Engage with HR Partners',
                description: 'Respond to pending introduction requests',
                priority: 'high',
                link: '/professional/dashboard',
            },
            {
                id: 'update',
                icon: Edit,
                title: 'Keep Profile Updated',
                description: 'Regularly update your skills and experience',
                priority: 'low',
                link: '/professional/profile',
            }
        );
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-50 border-red-200 text-red-700';
            case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
            case 'low': return 'bg-green-50 border-green-200 text-green-700';
            default: return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-secondary">Suggested Actions</h2>
            </div>

            {actionItems.length === 0 ? (
                <div className="text-center py-8">
                    <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Great job! Your profile is complete
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Keep engaging with opportunities and updating your profile regularly.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {actionItems.slice(0, 4).map((action) => (
                        <Link
                            key={action.id}
                            href={action.link}
                            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <action.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                            {action.title}
                                        </h3>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(action.priority)}`}>
                                            {action.priority}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        {action.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {actionItems.length > 4 && (
                        <div className="text-center pt-2">
                            <Link
                                href="/professional/profile"
                                className="text-sm text-primary hover:text-primary/80 font-medium"
                            >
                                View all {actionItems.length} suggestions →
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
