import { Users, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyTalentsStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
}

const EmptyTalentsState = ({ hasFilters, onClearFilters }: EmptyTalentsStateProps) => {
    if (hasFilters) {
        return (
            <div className="text-center py-16">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                    No talents match your criteria
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try adjusting your search terms or filters to find more professionals.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={onClearFilters} variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Clear All Filters
                    </Button>
                    <Button variant="default">
                        <Search className="w-4 h-4 mr-2" />
                        Browse All Talents
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="text-center py-16">
            <Users className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">
                No talents available yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                We're building our network of verified professionals. 
                Check back soon or invite talented professionals to join theNexus.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline">
                    Invite Professionals
                </Button>
                <Button variant="default">
                    Post a Job Instead
                </Button>
            </div>
        </div>
    );
};

export default EmptyTalentsState;
