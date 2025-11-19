import { Building, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

interface HrProfileCardProps {
    hrData: {
        firstName: string;
        lastName: string;
        jobTitle: string;
        company: {
            companyName: string;
            industry: string;
            companySize: string;
        };
        profilePhotoUrl?: string;
    };
}

const HrProfileCard = ({ hrData }: HrProfileCardProps) => {
    const initials = `${hrData.firstName?.[0] || ''}${hrData.lastName?.[0] || ''}`;



    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-semibold">
                    {hrData.profilePhotoUrl ? (
                        <img
                            src={hrData.profilePhotoUrl}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        initials
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                        {hrData.firstName} {hrData.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{hrData.jobTitle}</p>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Building className="w-4 h-4 mr-2" />
                    <span>{hrData.company.companyName}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{hrData.company.industry}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{hrData.company.companySize}</span>
                </div>
            </div>

            <Link
                href="/dashboard/hr-partner/profile"
                className="block w-full text-center py-2 px-4 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition"
            >
                Edit Profile
            </Link>
        </div>
    );
};

export default HrProfileCard;
