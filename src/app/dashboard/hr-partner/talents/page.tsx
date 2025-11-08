"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Briefcase, Star, MessageCircle, Eye, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TalentCard from '@/components/hr-partner/talents/TalentCard';
import TalentFilters from '@/components/hr-partner/talents/TalentFilters';
import TalentsSkeleton from '@/components/hr-partner/talents/TalentsSkeleton';
import EmptyTalentsState from '@/components/hr-partner/talents/EmptyTalentsState';

interface Professional {
    id: number;
    name: string;
    title: string;
    company: string;
    location: string;
    experience: string;
    skills: string[];
    profilePhoto?: string;
    verified: boolean;
    matchScore?: number;
    salaryRange: string;
    availability: 'available' | 'open' | 'not_looking';
    lastActive: string;
}

const TalentsPage = () => {
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        experience: '',
        skills: '',
        availability: '',
        salaryRange: ''
    });

    useEffect(() => {
        fetchProfessionals();
    }, []);

    useEffect(() => {
        filterProfessionals();
    }, [searchQuery, filters, professionals]);

    const fetchProfessionals = async () => {
        // Mock data - replace with actual API call
        setTimeout(() => {
            const mockProfessionals: Professional[] = [
                {
                    id: 1,
                    name: 'Adebayo Ogundimu',
                    title: 'Senior Software Engineer',
                    company: 'Flutterwave',
                    location: 'Lagos, Nigeria',
                    experience: '8 years',
                    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Python'],
                    verified: true,
                    matchScore: 95,
                    salaryRange: '₦8-12M',
                    availability: 'open',
                    lastActive: '2 days ago'
                },
                {
                    id: 2,
                    name: 'Kemi Adebayo',
                    title: 'Product Manager',
                    company: 'Paystack',
                    location: 'Lagos, Nigeria',
                    experience: '6 years',
                    skills: ['Product Strategy', 'Analytics', 'Agile', 'User Research'],
                    verified: true,
                    matchScore: 88,
                    salaryRange: '₦6-10M',
                    availability: 'available',
                    lastActive: '1 day ago'
                },
                {
                    id: 3,
                    name: 'Tunde Okafor',
                    title: 'Data Scientist',
                    company: 'Interswitch',
                    location: 'Abuja, Nigeria',
                    experience: '5 years',
                    skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'R'],
                    verified: true,
                    matchScore: 82,
                    salaryRange: '₦7-11M',
                    availability: 'open',
                    lastActive: '3 days ago'
                },
                {
                    id: 4,
                    name: 'Funmi Adeyemi',
                    title: 'UX Designer',
                    company: 'Andela',
                    location: 'Remote',
                    experience: '4 years',
                    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
                    verified: false,
                    salaryRange: '₦4-7M',
                    availability: 'not_looking',
                    lastActive: '1 week ago'
                },
                {
                    id: 5,
                    name: 'Chidi Okwu',
                    title: 'DevOps Engineer',
                    company: 'Kuda Bank',
                    location: 'Lagos, Nigeria',
                    experience: '7 years',
                    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins'],
                    verified: true,
                    matchScore: 90,
                    salaryRange: '₦9-13M',
                    availability: 'available',
                    lastActive: '5 hours ago'
                }
            ];
            setProfessionals(mockProfessionals);
            setLoading(false);
        }, 1000);
    };

    const filterProfessionals = () => {
        let filtered = professionals;

        // Search query filter
        if (searchQuery) {
            filtered = filtered.filter(prof =>
                prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prof.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prof.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Location filter
        if (filters.location) {
            filtered = filtered.filter(prof =>
                prof.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Experience filter
        if (filters.experience) {
            const expYears = parseInt(filters.experience);
            filtered = filtered.filter(prof => {
                const profExp = parseInt(prof.experience);
                return profExp >= expYears;
            });
        }

        // Skills filter
        if (filters.skills) {
            filtered = filtered.filter(prof =>
                prof.skills.some(skill =>
                    skill.toLowerCase().includes(filters.skills.toLowerCase())
                )
            );
        }

        // Availability filter
        if (filters.availability) {
            filtered = filtered.filter(prof => prof.availability === filters.availability);
        }

        setFilteredProfessionals(filtered);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            experience: '',
            skills: '',
            availability: '',
            salaryRange: ''
        });
        setSearchQuery('');
    };

    if (loading) {
        return <TalentsSkeleton />;
    }

    return (
        <div className="min-h-screen bg-[#F4F6F8] dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Browse Talents</h1>
                    <p className="text-muted-foreground">
                        Discover and connect with verified senior professionals
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-card rounded-lg border border-border p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search talents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center justify-center gap-2 md:w-auto"
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                    </div>

                    {showFilters && (
                        <TalentFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                        />
                    )}

                    {/* Results Summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border gap-3">
                        <p className="text-sm text-muted-foreground">
                            {filteredProfessionals.length} of {professionals.length} talents
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sort:</span>
                            <Select defaultValue="relevance">
                                <SelectTrigger className="w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                                    <SelectItem value="relevance" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Relevance</SelectItem>
                                    <SelectItem value="experience" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Experience</SelectItem>
                                    <SelectItem value="location" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Location</SelectItem>
                                    <SelectItem value="recent" className="dark:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-white">Recent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Talent Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredProfessionals.map((professional) => (
                        <TalentCard
                            key={professional.id}
                            professional={professional}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredProfessionals.length === 0 && (
                    <EmptyTalentsState
                        hasFilters={Object.values(filters).some(f => f !== '') || searchQuery !== ''}
                        onClearFilters={clearFilters}
                    />
                )}
            </div>
        </div>
    );
};

export default TalentsPage;
