import { Professional } from '@prisma/client';
import { MapPin, Briefcase, Calendar, Shield, Edit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
    professional: Professional & {
        workHistory?: Array<{ companyName: string; jobTitle: string }>;
    };
}

export default function DashboardHero({ professional }: Props) {
    const currentWork = professional.workHistory?.[0];
    const verificationColor =
        professional.verificationStatus === 'PREMIUM'
            ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
            : professional.verificationStatus === 'FULL'
                ? 'text-green-600 bg-green-50 border-green-200'
                : professional.verificationStatus === 'BASIC'
                    ? 'text-blue-600 bg-blue-50 border-blue-200'
                    : 'text-gray-600 bg-gray-50 border-gray-200';

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Cover Image */}
                <div className="h-32 sm:h-48 bg-linear-to-r from-primary via-[#3ABF7A] to-primary rounded-b-lg"></div>

                <div className="relative px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 sm:-mt-20 pb-6">
                        {/* Profile Photo */}
                        <div className="relative">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                                {professional.profilePhotoUrl ? (
                                    <Image
                                        src={professional.profilePhotoUrl}
                                        alt={`${professional.firstName} ${professional.lastName}`}
                                        width={160}
                                        height={160}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-linear-to-br from-primary to-[#1F5F3F] flex items-center justify-center text-white text-5xl font-bold">
                                        {professional.firstName?.[0] || '?'}
                                        {professional.lastName?.[0] || '?'}
                                    </div>
                                )}
                            </div>

                            {/* Verification Badge */}
                            {professional.verificationStatus !== 'UNVERIFIED' && (
                                <div
                                    className={`absolute bottom-2 right-2 p-2 rounded-full border-2 ${verificationColor}`}
                                >
                                    <Shield className="w-5 h-5" />
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-secondary">
                                        {professional.firstName} {professional.lastName}
                                    </h1>
                                    <p className="text-lg text-gray-700 mt-1">{professional.profileHeadline}</p>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                                        {currentWork && (
                                            <div className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4" />
                                                <span>
                                                    {currentWork.jobTitle} at {currentWork.companyName}
                                                </span>
                                            </div>
                                        )}
                                        {professional.locationCity && professional.locationState && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>
                                                    {professional.locationCity}, {professional.locationState}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{professional.yearsOfExperience}+ years experience</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center gap-2 mt-3">
                                        {professional.openToOpportunities && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                Open to opportunities
                                            </span>
                                        )}
                                        {professional.confidentialSearch && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                                                <Shield className="w-3 h-3" />
                                                Confidential search
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Edit Button */}
                                <Link
                                    href="/professional/profile/edit"
                                    className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-200"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}