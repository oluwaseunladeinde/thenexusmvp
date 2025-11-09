import { Briefcase, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyJobsStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
}

const EmptyJobsState = ({ hasFilters, onClearFilters }: EmptyJobsStateProps) => {
    if (hasFilters) {
        return (
            <div className="text-center py-16">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                    No offers match your criteria
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try adjusting your search terms or filters to find more opportunities.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={onClearFilters} variant="outline">
                        Clear Filters
                    </Button>
                    <Link href="/dashboard/hr-partner/jobs/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Offer
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="text-center py-16">
            <Briefcase className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">
                No offers created yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Create your first opportunity to start connecting with talented professionals. 
                You can also browse talents and send introduction requests directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/dashboard/hr-partner/jobs/create">
                    <Button size="lg">
                        <Plus className="w-5 h-5 mr-2" />
                        Create Your First Offer
                    </Button>
                </Link>
                <Link href="/dashboard/hr-partner/talents">
                    <Button variant="outline" size="lg">
                        <Search className="w-5 h-5 mr-2" />
                        Browse Talents
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default EmptyJobsState;
