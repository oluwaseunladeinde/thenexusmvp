'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Sparkles, Edit3, Crown } from 'lucide-react';
import JobTemplateSelector from './job-template-selector';
import AiJobGenerator from './ai-job-generator';
import { JobTemplate } from '@/lib/job-templates';

interface JobCreationOptionsProps {
    onTemplateSelect: (template: JobTemplate) => void;
    onAiGenerate: (generatedContent: {
        description: string;
        requirements: string;
        benefits: string;
    }) => void;
    onCreateManually: () => void;
    currentValues?: {
        title?: string;
        industry?: string;
        experience?: string;
        description?: string;
    };
}

export default function JobCreationOptions({
    onTemplateSelect,
    onAiGenerate,
    onCreateManually,
    currentValues
}: JobCreationOptionsProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const options = [
        {
            id: 'template',
            title: 'Choose a Template',
            description: 'Start with a pre-built job template and customize it to fit your needs',
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
        },
        {
            id: 'ai',
            title: 'Generate with AI',
            description: 'Use AI to create a complete job description based on your requirements',
            icon: Sparkles,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20',
            borderColor: 'border-purple-200 dark:border-purple-800',
            premium: true,
        },
        {
            id: 'manual',
            title: 'Create Yourself',
            description: 'Build your job posting from scratch with full control over every detail',
            icon: Edit3,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950/20',
            borderColor: 'border-green-200 dark:border-green-800',
        },
    ];

    const handleOptionSelect = (optionId: string) => {
        setSelectedOption(optionId);

        if (optionId === 'manual') {
            onCreateManually();
        }
        // For 'template' and 'ai', the modals will handle the selection
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">How would you like to create your job?</h2>
                <p className="text-muted-foreground">Choose the method that works best for you to get started quickly</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {options.map((option) => (
                    <Card
                        key={option.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-green-500/20 hover:border-green-500 ${option.borderColor} ${selectedOption === option.id ? 'ring-2 ring-primary' : ''
                            }`}
                        onClick={() => handleOptionSelect(option.id)}
                    >
                        <CardHeader className="text-center pb-3">
                            <div className={`w-12 h-12 rounded-full ${option.bgColor} flex items-center justify-center mx-auto mb-3`}>
                                <option.icon className={`w-6 h-6 ${option.color}`} />
                            </div>
                            <CardTitle className="text-lg flex items-center justify-center gap-2">
                                {option.title}
                                {option.premium && <Crown className="w-4 h-4 text-yellow-500" />}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <CardDescription className="text-sm">
                                {option.description}
                            </CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Template Selector Modal */}
            <Dialog open={selectedOption === 'template'} onOpenChange={(open) => !open && setSelectedOption(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Choose a Job Template</DialogTitle>
                    </DialogHeader>
                    <JobTemplateSelector
                        onSelectTemplate={(template) => {
                            onTemplateSelect(template);
                            setSelectedOption(null);
                        }}
                        onBack={() => setSelectedOption(null)}
                    />
                    <div className="flex justify-end mt-4">
                        <Button variant="outline" onClick={() => setSelectedOption(null)}>
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* AI Generator Modal */}
            <Dialog open={selectedOption === 'ai'} onOpenChange={(open) => !open && setSelectedOption(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Generate Job Description with AI</DialogTitle>
                    </DialogHeader>
                    <AiJobGenerator
                        onGenerate={(content) => {
                            onAiGenerate(content);
                            setSelectedOption(null);
                        }}
                        currentValues={currentValues}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
