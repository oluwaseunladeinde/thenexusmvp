'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { jobTemplates, getAllCategories, getTemplatesByCategory, JobTemplate } from '@/lib/job-templates';
import { FileText, Briefcase, Users, TrendingUp, Database, Heart } from 'lucide-react';

interface JobTemplateSelectorProps {
    onSelectTemplate: (template: JobTemplate) => void;
}

const categoryIcons = {
    'Technology': FileText,
    'Product': Briefcase,
    'Marketing': TrendingUp,
    'Data & Analytics': Database,
    'Human Resources': Heart,
    'Sales': Users,
};

export default function JobTemplateSelector({ onSelectTemplate }: JobTemplateSelectorProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const categories = getAllCategories();
    const filteredTemplates = selectedCategory
        ? getTemplatesByCategory(selectedCategory)
        : jobTemplates;

    const handleSelectTemplate = (template: JobTemplate) => {
        onSelectTemplate(template);
        setIsOpen(false);
        setSelectedCategory(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mb-6">
                    <FileText className="w-4 h-4 mr-2" />
                    Use Template
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Choose a Job Template</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedCategory === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(null)}
                        >
                            All Templates
                        </Button>
                        {categories.map((category) => {
                            const Icon = categoryIcons[category as keyof typeof categoryIcons] || FileText;
                            return (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {category}
                                </Button>
                            );
                        })}
                    </div>

                    {/* Templates Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredTemplates.map((template) => {
                            const Icon = categoryIcons[template.category as keyof typeof categoryIcons] || FileText;
                            return (
                                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Icon className="w-5 h-5 text-blue-600" />
                                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                            </div>
                                            <Badge variant="light">{template.seniorityLevel}</Badge>
                                        </div>
                                        <CardDescription className="text-sm">
                                            {template.roleDescription.substring(0, 120)}...
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 mb-1">Key Skills:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {template.requiredSkills.slice(0, 3).map((skill) => (
                                                        <Badge key={skill} variant="outline" className="text-xs">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {template.requiredSkills.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{template.requiredSkills.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    {template.yearsExperienceMin}+ years experience
                                                </span>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSelectTemplate(template)}
                                                >
                                                    Use This Template
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No templates found for the selected category.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
