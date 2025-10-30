

import { TrendingUp, Target, Award, Users } from 'lucide-react';

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

export default function CareerInsights({ professional }: Props) {
    // Calculate insights
    const totalViews = professional.profileViews.length;
    const totalIntroductions = professional.introductionRequests.length;
    const acceptedIntroductions = professional.introductionRequests.filter(
        (req) => req.status === 'ACCEPTED'
    ).length;
    const responseRate = totalIntroductions > 0 ? (acceptedIntroductions / totalIntroductions) * 100 : 0;

    // Calculate average salary expectation
    const avgSalary = professional.salaryExpectationMin && professional.salaryExpectationMax
        ? (professional.salaryExpectationMin + professional.salaryExpectationMax) / 2
        : null;

    // Get top skills
    const topSkills = professional.skills.slice(0, 3);

    // Calculate career progression
    const workHistory = professional.workHistory.sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const formatSalary = (salary: number) => {
        if (salary >= 1000000) {
            return `₦${(salary / 1000000).toFixed(1)}M`;
        }
        return `₦${(salary / 1000).toFixed(0)}K`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-secondary">Career Insights</h2>
            </div>

            <div className="space-y-6">
                {/* Profile Performance */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Profile Performance
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{totalViews}</div>
                            <div className="text-xs text-blue-600">Profile Views</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{responseRate.toFixed(0)}%</div>
                            <div className="text-xs text-green-600">Response Rate</div>
                        </div>
                    </div>
                </div>

                {/* Salary Insights */}
                {avgSalary && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Salary Expectations
                        </h3>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-gray-900">
                                    Expected Salary Range
                                </span>
                            </div>
                            <div className="text-lg font-bold text-secondary">
                                {formatSalary(avgSalary)}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                                Based on your preferences
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Skills */}
                {topSkills.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Top Skills
                        </h3>
                        <div className="space-y-2">
                            {topSkills.map((skill, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-900">{skill.skillName}</span>
                                    <span className="text-xs text-gray-600 capitalize">{skill.proficiencyLevel}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Career Progression */}
                {workHistory.length > 1 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Career Progression
                        </h3>
                        <div className="space-y-3">
                            {workHistory.slice(-3).map((job, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Award className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                                        <div className="text-xs text-gray-600">{job.companyName}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Quick Stats
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="text-sm text-gray-700">Experience</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                {professional.yearsOfExperience} years
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <span className="text-sm text-gray-700">Profile Complete</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                {professional.profileCompleteness}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
