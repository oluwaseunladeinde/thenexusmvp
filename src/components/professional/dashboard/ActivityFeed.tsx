import { Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProfileView {
    id: string;
    viewedAt: Date;
    viewer: {
        firstName: string;
        lastName: string;
        jobTitle: string;
        company: {
            companyName: string;
        };
    };
}

interface Props {
    profileViews: ProfileView[];
}

export default function ActivityFeed({ profileViews }: Props) {
    if (profileViews.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-secondary">Recent Profile Views</h2>
            </div>

            <div className="space-y-3">
                {profileViews.slice(0, 5).map((view) => (
                    <div
                        key={view.id}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-secondary to-[#1A3A52] flex items-center justify-center text-white text-sm font-bold shrink-0">
                                {view.viewer.firstName[0] || '?'}
                                {view.viewer.lastName[0] || '?'}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    {view.viewer.firstName} {view.viewer.lastName}
                                </p>
                                <p className="text-xs text-gray-600">{view.viewer.jobTitle}</p>
                                <p className="text-xs text-gray-600">{view.viewer.company.companyName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <p className="text-xs text-gray-600">
                                {formatDistanceToNow(new Date(view.viewedAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
