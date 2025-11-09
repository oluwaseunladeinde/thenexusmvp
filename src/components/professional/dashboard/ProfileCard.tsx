import { MapPin, Building, Eye, TrendingUp, CheckCircle, User, ArrowUp, ArrowDown } from 'lucide-react';

// Profile Avatar Component
const ProfileAvatar = ({ src, size = 'md', className = '' }: { src?: string; size?: 'sm' | 'md' | 'lg'; className?: string }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-20 h-20'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-8 h-8'
    };

    if (src) {
        return (
            <img
                src={src}
                alt="Profile"
                className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
            />
        );
    }

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
            <User className={`${iconSizes[size]} text-gray-400`} />
        </div>
    );
};

interface ProfileCardProps {
    profileData?: {
        firstName?: string;
        lastName?: string;
        profileHeadline?: string;
        currentCompany?: string;
        verificationStatus?: string;
        cityName?: string;
        stateName?: string;
        profilePhotoUrl?: string;
    };
    stats: {
        profileViews: number;
        impressions: number;
        trend?: 'up' | 'down' | 'neutral';
    };
    premiumText?: string;
}

export default function ProfileCard({ profileData, stats, premiumText }: ProfileCardProps) {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                    <ProfileAvatar
                        src={profileData?.profilePhotoUrl}
                        size="lg"
                        className="border-2 border-gray-100"
                    />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-semibold text-[#0D1B2A]">
                        {profileData?.firstName || 'User'} {profileData?.lastName || ''}
                    </h3>
                    {profileData?.verificationStatus === 'full' && (
                        <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {profileData?.profileHeadline || 'Complete your profile to get discovered'}
                </p>
                {profileData?.currentCompany && (
                    <div className="flex items-center justify-center text-xs gap-1 mb-2">
                        <Building className="w-3 h-3" />
                        {profileData.currentCompany}
                    </div>
                )}
                {(profileData?.cityName || profileData?.stateName) && (
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {[profileData?.cityName, profileData?.stateName].filter(Boolean).join(', ')}
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t px-6 py-4">
                <div className="flex justify-between text-sm">
                    <div>
                        <div className="flex items-center gap-1 text-gray-600">
                            <Eye className="w-3 h-3" />
                            Profile views
                            {stats.trend && stats.trend !== 'neutral' && (
                                <div className={`flex items-center ${stats.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} aria-label={`Trending ${stats.trend}`}>
                                    {stats.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                </div>
                            )}
                        </div>
                        <div className="font-semibold text-primary">{stats.profileViews}</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 text-gray-600">
                            Impressions
                        </div>
                        <div className="font-semibold text-primary">{stats.impressions}</div>
                    </div>
                </div>
            </div>

            {premiumText && (
                <div className="border-t px-6 py-4">
                    <button className="w-full text-left text-sm text-primary hover:bg-gray-50 py-2 rounded">
                        {premiumText}
                    </button>
                </div>
            )}
        </div>
    );
}
