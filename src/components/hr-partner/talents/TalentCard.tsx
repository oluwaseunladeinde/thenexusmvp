import { MapPin, Briefcase, Star, MessageCircle, Eye, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Professional {
    id: number;
    name: string;
    title: string;
    company: string;
    location: string;
    experience: string;
    skills: string[];
    profilePhoto?: string;
    verified: boolean;
    matchScore?: number;
    salaryRange: string;
    availability: 'available' | 'open' | 'not_looking';
    lastActive: string;
}

interface TalentCardProps {
    professional: Professional;
}

const TalentCard = ({ professional }: TalentCardProps) => {
    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'available': return 'text-green-600 bg-green-50 dark:bg-green-950/50';
            case 'open': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/50';
            case 'not_looking': return 'text-gray-600 bg-gray-50 dark:bg-gray-950/50';
            default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/50';
        }
    };

    const getAvailabilityText = (availability: string) => {
        switch (availability) {
            case 'available': return 'Actively Looking';
            case 'open': return 'Open to Offers';
            case 'not_looking': return 'Not Looking';
            default: return 'Unknown';
        }
    };

    const initials = professional.name.split(' ').map(n => n[0]).join('');

    return (
        <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                        {professional.profilePhoto ? (
                            <img 
                                src={professional.profilePhoto} 
                                alt={professional.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-foreground">{professional.name}</h3>
                            {professional.verified && (
                                <CheckCircle className="w-4 h-4 text-blue-500" />
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">{professional.title}</p>
                        <p className="text-xs text-muted-foreground">{professional.company}</p>
                    </div>
                </div>
                {professional.matchScore && (
                    <div className="flex items-center text-sm font-semibold text-green-600">
                        <Star className="w-4 h-4 mr-1" />
                        {professional.matchScore}%
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{professional.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{professional.experience} experience</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Active {professional.lastActive}</span>
                </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                    {professional.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                            {skill}
                        </span>
                    ))}
                    {professional.skills.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                            +{professional.skills.length - 3} more
                        </span>
                    )}
                </div>
            </div>

            {/* Availability & Salary */}
            <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(professional.availability)}`}>
                    {getAvailabilityText(professional.availability)}
                </span>
                <span className="text-sm font-semibold text-primary">
                    {professional.salaryRange}
                </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" variant="outline" className="flex-1">
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
