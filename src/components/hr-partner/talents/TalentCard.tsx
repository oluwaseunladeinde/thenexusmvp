import { MapPin, Briefcase, Star, MessageCircle, Eye, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Professional {
    id: number;
    name: string;
    initials: string;
    profileHeadline: string;
    profilePhotoUrl?: string;
    location: string;
    experience: number;
    currentTitle: string;
    currentCompany: string;
    industry: string;
    salaryRange: string | null;
    verificationStatus: string;
    isVerified: boolean;
    topSkills: string[];
    profileViews: number;
    isConfidential: boolean;
}

interface TalentCardProps {
    professional: Professional;
}

const TalentCard = ({ professional }: TalentCardProps) => {
    const router = useRouter();

    const getVerificationColor = (status: string) => {
        switch (status) {
            case 'VERIFIED': return 'text-green-600 bg-green-50 dark:bg-green-950/50';
            case 'BASIC': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/50';
            case 'UNVERIFIED': return 'text-gray-600 bg-gray-50 dark:bg-gray-950/50';
            default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/50';
        }
    };

    const getVerificationText = (status: string) => {
        switch (status) {
            case 'VERIFIED': return 'Verified';
            case 'BASIC': return 'Basic';
            case 'UNVERIFIED': return 'Unverified';
            default: return 'Unknown';
        }
    };

    const handleViewProfile = async () => {
        // Track profile view from search results
        try {
            await fetch('/api/v1/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventType: 'SEARCH_RESULT_CLICK',
                    data: {
                        professionalId: professional.id,
                        source: 'search_results',
                        timestamp: new Date().toISOString(),
                    },
                }),
            });
        } catch (error) {
            console.error('Failed to track profile view:', error);
        }

        // Navigate to profile
        router.push(`/dashboard/professionals/${professional.id}`);
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                        {professional.profilePhotoUrl ? (
                            <img
                                src={professional.profilePhotoUrl}
                                alt={professional.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            professional.initials
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-foreground">{professional.name}</h3>
                            {professional.isVerified && (
                                <CheckCircle className="w-4 h-4 text-blue-500" />
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">{professional.currentTitle}</p>
                        <p className="text-xs text-muted-foreground">{professional.currentCompany}</p>
                    </div>
                </div>
                <div className="flex items-center text-sm font-semibold text-green-600">
                    <Eye className="w-4 h-4 mr-1" />
                    {professional.profileViews}
                </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{professional.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{professional.experience} years experience</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <span className="font-medium">{professional.industry}</span>
                </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                    {professional.topSkills.slice(0, 3).map((skill: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                            {skill}
                        </span>
                    ))}
                    {professional.topSkills.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                            +{professional.topSkills.length - 3} more
                        </span>
                    )}
                </div>
            </div>

            {/* Verification Status & Salary */}
            <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVerificationColor(professional.verificationStatus)}`}>
                    {getVerificationText(professional.verificationStatus)}
                </span>
                {professional.salaryRange && (
                    <span className="text-sm font-semibold text-primary">
                        {professional.salaryRange}
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={handleViewProfile}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                </Button>
                <Button size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Send Introduction
                </Button>
            </div>
        </div>
    );
};

export default TalentCard;