import { Plus, MapPin, Users, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Job {
    id: number;
    title: string;
    department: string;
    location: string;
    salary: string;
    applicants: number;
    matches: number;
    status: string;
    postedDate: string;
    urgency: 'high' | 'medium' | 'low';
}

interface ActiveJobsCardProps {
    jobs: Job[];
}

const ActiveJobsCard = ({ jobs }: ActiveJobsCardProps) => {
    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Active Job Postings</h3>
                <div className="flex items-center space-x-2">
                    <Link
                        href="/dashboard/hr-partner/jobs"
                        className="text-primary text-sm font-semibold hover:text-primary/80"
                    >
                        View All
                    </Link>
                    <Link
                        href="/dashboard/hr-partner/jobs/create"
                        className="flex items-center space-x-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/80 transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Job</span>
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                {jobs.map((job) => (
                    <div key={job.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-semibold text-foreground">{job.title}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                                        {job.urgency}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{job.department}</p>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {job.postedDate}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-primary">{job.salary}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
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
                            <Link
                                href={`/dashboard/hr-partner/jobs/${job.id}`}
                                className="text-primary text-sm font-medium hover:text-primary/80"
                            >
                                View Details →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {jobs.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-muted-foreground text-4xl mb-4">📋</div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">No active jobs</h4>
                    <p className="text-muted-foreground mb-4">Start hiring by posting your first job.</p>
                    <Link
                        href="/dashboard/hr-partner/jobs/create"
                        className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/80 transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Post a Job</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ActiveJobsCard;
