import { MapPin, Clock, Users, AlertCircle, MoreVertical, Edit, Trash2, Eye, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Job {
    id: number;
    title: string;
    department: string;
    location: string;
    salary: string;
    type: 'full-time' | 'part-time' | 'contract';
    status: 'active' | 'paused' | 'closed';
    applicants: number;
    matches: number;
    postedDate: string;
    expiryDate: string;
    urgency: 'high' | 'medium' | 'low';
    description: string;
}

interface JobCardProps {
    job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-600 bg-green-50 dark:bg-green-950/50';
            case 'paused': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/50';
            case 'closed': return 'text-gray-600 bg-gray-50 dark:bg-gray-950/50';
            default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/50';
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high': return 'text-red-600 bg-red-50 dark:bg-red-950/50';
            case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/50';
            case 'low': return 'text-green-600 bg-green-50 dark:bg-green-950/50';
            default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/50';
        }
    };

    const getTypeText = (type: string) => {
        switch (type) {
            case 'full-time': return 'Full-time';
            case 'part-time': return 'Part-time';
            case 'contract': return 'Contract';
            default: return type;
        }
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                            {job.urgency}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{job.department}</p>
                    <p className="text-sm font-semibold text-primary">{job.salary}</p>
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Job
                        </DropdownMenuItem>
                        {job.status === 'active' ? (
                            <DropdownMenuItem>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause Job
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem>
                                <Play className="w-4 h-4 mr-2" />
                                Activate Job
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Job
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{job.location}</span>
                    <span className="mx-2">•</span>
                    <span>{getTypeText(job.type)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Posted {job.postedDate}</span>
                    <span className="mx-2">•</span>
                    <span>{job.expiryDate}</span>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {job.description}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{job.applicants} applicants</span>
                    </div>
                    <div className="flex items-center text-primary">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span>{job.matches} matches</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View Introductions
                </Button>
                <Button size="sm" className="flex-1">
                    <Users className="w-4 h-4 mr-1" />
                    Find Talent
                </Button>
            </div>
        </div>
    );
};

export default JobCard;
