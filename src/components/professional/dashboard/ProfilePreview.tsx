import { CheckCircle, Edit, Star, MapPin, Building, User } from 'lucide-react';
import Link from 'next/link';

interface ProfilePreviewProps {
    profileData?: {
        firstName?: string;
        lastName?: string;
        profileHeadline?: string;
        currentCompany?: string;
        verificationStatus?: string;
        cityName?: string;
        stateName?: string;
        profilePhotoUrl?: string;
        topSkills?: string[];
    };
}

const ProfileAvatar = ({ src, size = 'md', className = '' }: { src?: string; size?: 'sm' | 'md' | 'lg'; className?: string }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-20 h-20'
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
        <div className={`${sizeClasses[size]} rounded-full bg-linear-to-br from-primary to-[#3ABF7A] flex items-center justify-center ${className}`}>
            <User className="w-6 h-6 text-white" />
        </div>
    );
};

export default function ProfilePreview({ profileData }: ProfilePreviewProps) {
    const topSkills = profileData?.topSkills || ['React', 'Node.js', 'TypeScript', 'Leadership'];

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#0D1B2A]">How HR Sees Your Profile</h3>
                    <Link
                        href="/professional/profile"
                        className="text-sm text-primary hover:text-[#1F5F3F] font-medium flex items-center gap-1"
                    >
                        <Edit className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <div className="p-4">
                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-4">
                    <ProfileAvatar
                        src={profileData?.profilePhotoUrl}
                        size="md"
                        className="border-2 border-gray-100"
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                                {profileData?.firstName || 'Your'} {profileData?.lastName || 'Name'}
                            </h4>
                            {profileData?.verificationStatus === 'full' && (
                                <CheckCircle className="w-4 h-4 text-primary" />
                            )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                            {profileData?.profileHeadline || 'Your professional headline will appear here'}
                        </p>

                        <div className="flex flex-col gap-2 text-xs text-gray-500">
                            {profileData?.currentCompany && (
                                <div className="flex items-center gap-1">
                                    <Building className="w-3 h-3" />
                                    {profileData.currentCompany}
                                </div>
                            )}
                            {(profileData?.cityName || profileData?.stateName) && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {[profileData?.cityName, profileData?.stateName].filter(Boolean).join(', ')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Skills */}
                <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Top Skills</h5>
                    <div className="flex flex-wrap gap-2">
                        {topSkills.slice(0, 4).map((skill, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-green-500/10 text-primary text-xs rounded-xl border border-green-700/20"
                            >
                                {skill}
                            </span>
                        ))}
                        {topSkills.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{topSkills.length - 4} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Verification Badge */}
                {profileData?.verificationStatus === 'full' ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Verified Professional</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex-1">
                            <span className="text-sm font-medium text-yellow-800">Complete verification to stand out</span>
                            <p className="text-xs text-yellow-700 mt-1">Verified profiles get 5x more views</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
