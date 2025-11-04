import { MapPin, Building, Eye, TrendingUp, CheckCircle } from 'lucide-react';

interface ProfileCardProps {
    profileData?: {
        firstName?: string;
        lastName?: string;
        profileHeadline?: string;
        currentCompany?: string;
        verificationStatus?: string;
        cityName?: string;
        stateName?: string;
    };
    stats: {
        profileViews: number;
        impressions: number;
    };
    premiumText?: string;
}

export default function ProfileCard({ profileData, stats, premiumText }: ProfileCardProps) {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">
                        {profileData?.firstName?.[0]}{profileData?.lastName?.[0]}
                    </span>
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
                            Profile views
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
