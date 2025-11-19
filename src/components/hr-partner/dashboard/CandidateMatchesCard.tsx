import { Star, MapPin, Briefcase, MessageCircle, Eye } from 'lucide-react';
import Link from 'next/link';

interface CandidateMatch {
    id: number;
    name: string;
    title: string;
    experience: string;
    location: string;
    matchScore: number;
    skills: string[];
    jobId: number;
    jobTitle: string;
    status: 'new' | 'reviewed' | 'contacted' | 'interviewed';
}

interface CandidateMatchesCardProps {
    matches: CandidateMatch[];
}

const CandidateMatchesCard = ({ matches }: CandidateMatchesCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'text-blue-600 bg-blue-50';
            case 'reviewed': return 'text-yellow-600 bg-yellow-50';
            case 'contacted': return 'text-green-600 bg-green-50';
            case 'interviewed': return 'text-purple-600 bg-purple-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getMatchScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-yellow-600';
        return 'text-gray-600';
    };

    const handleViewProfile = (candidateId: number) => {
        // Handle view profile logic here
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Top Candidate Matches</h3>
                <Link
                    href="/dashboard/hr-partner/candidates"
                    className="text-primary text-sm font-semibold hover:text-primary/80"
                >
                    View All →
                </Link>
            </div>

            <div className="space-y-4">
                {matches.map((match) => (
                    <div key={match.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold"
                                    aria-label={`${match.name}'s avatar`}
                                >
                                    {match.name.split(' ').filter(n => n).map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">{match.name}</h4>
                                    <p className="text-sm text-muted-foreground">{match.title}</p>
                                    <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                                        <div className="flex items-center">
                                            <Briefcase className="w-3 h-3 mr-1" />
                                            {match.experience}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {match.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`flex items-center text-sm font-semibold ${getMatchScoreColor(match.matchScore)}`}>
                                    <Star className="w-4 h-4 mr-1" />
                                    {match.matchScore}% match
                                </div>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(match.status)}`}>
                                    {match.status}
                                </span>
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="text-sm text-muted-foreground mb-2">
                                Matched for: <span className="font-medium text-foreground">{match.jobTitle}</span>
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {match.skills.slice(0, 3).map((skill, index) => (
                                    <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                                        {skill}
                                    </span>
                                ))}
                                {match.skills.length > 3 && (
                                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                                        +{match.skills.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleViewProfile(match.id)}
                                    className="flex items-center space-x-1 text-primary text-sm font-medium hover:text-primary/80">
                                    <Eye className="w-4 h-4" />
                                    <span>View Profile</span>
                                </button>
                                <button className="flex items-center space-x-1 text-primary text-sm font-medium hover:text-primary/80">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Send Introduction</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {
                matches.length === 0 && (
                    <div className="text-center py-8">
                        <div className="text-muted-foreground text-4xl mb-4">🎯</div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">No matches yet</h4>
                        <p className="text-muted-foreground">Candidate matches will appear here once you post jobs.</p>
                    </div>
                )
            }
        </div >
    );
};

export default CandidateMatchesCard;
