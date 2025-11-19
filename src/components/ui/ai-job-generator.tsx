'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface JobGenerationParams {
    role: string;
    industry: string;
    experience: string;
    keyResponsibilities: string;
    companyType: string;
    tone: string;
}

interface AiJobGeneratorProps {
    onGenerate: (generatedContent: {
        description: string;
        requirements: string;
        benefits: string;
    }) => void;
    currentValues?: {
        title?: string;
        industry?: string;
        experience?: string;
        description?: string;
    };
}

export default function AiJobGenerator({ onGenerate, currentValues }: AiJobGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [params, setParams] = useState<JobGenerationParams>({
        role: currentValues?.title || '',
        industry: currentValues?.industry || '',
        experience: currentValues?.experience || '',
        keyResponsibilities: '',
        companyType: 'tech_startup',
        tone: 'professional',
    });

    const checkAccess = async () => {
        try {
            const response = await fetch('/api/v1/subscription/status');
            const data = await response.json();
            setHasAccess(data.hasAiFeatures || false);
        } catch (error) {
            console.error('Error checking AI access:', error);
            setHasAccess(false);
        }
    };

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open);
        if (open && hasAccess === null) {
            await checkAccess();
        }
    };

    const handleGenerate = async () => {
        if (!hasAccess) {
            toast.error('AI features require a Professional or Enterprise subscription');
            return;
        }

        if (!params.role || !params.industry) {
            toast.error('Please fill in the role and industry fields');
            return;
        }

        setIsGenerating(true);
        try {
            // Mock AI generation - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 3000));

            const generatedContent = {
                description: `We are seeking a talented ${params.role} to join our dynamic team at a leading ${params.industry} company. In this role, you will be responsible for ${params.keyResponsibilities || 'driving innovation and delivering high-impact results'}.

Our ideal candidate is passionate about technology and has a proven track record of excellence in ${params.industry.toLowerCase()}. You will work closely with cross-functional teams to deliver exceptional solutions that make a difference.

This is an exciting opportunity to join a fast-growing company where your contributions will directly impact our success and help shape the future of our industry.`,

                requirements: `• ${params.experience || '3-5 years'} of experience in ${params.industry.toLowerCase()}
• Strong technical skills and problem-solving abilities
• Excellent communication and collaboration skills
• Bachelor's degree in relevant field (Master's preferred)
• Experience with modern development methodologies
• Proven track record of delivering high-quality work
• Ability to work in fast-paced, dynamic environment`,

                benefits: `• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible working arrangements and remote work options
• Professional development budget and learning opportunities
• Modern office with great amenities
• Opportunity to work on cutting-edge projects
• Collaborative and inclusive company culture`
            };

            onGenerate(generatedContent);
            setIsOpen(false);
            toast.success('Job description generated successfully!');
        } catch (error) {
            console.error('Error generating job description:', error);
            toast.error('Failed to generate job description. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mb-4">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate with AI
                    {!hasAccess && hasAccess !== null && (
                        <Crown className="w-4 h-4 ml-2 text-yellow-500" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI Job Description Generator
                    </DialogTitle>
                </DialogHeader>

                {hasAccess === false ? (
                    <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                                <Crown className="w-4 h-4" />
                                Premium Feature
                            </CardTitle>
                            <CardDescription className="text-yellow-700 dark:text-yellow-300">
                                AI-powered job description generation is available with Professional and Enterprise plans.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Current Plan:</span>
                                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                                        Trial/BASIC
                                    </Badge>
                                </div>
                                <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
                                    <Crown className="w-4 h-4 mr-2" />
                                    Upgrade to Professional
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Job Role *</Label>
                                <input
                                    id="role"
                                    type="text"
                                    value={params.role}
                                    onChange={(e) => setParams({ ...params, role: e.target.value })}
                                    placeholder="e.g. Senior Software Engineer"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry *</Label>
                                <input
                                    id="industry"
                                    type="text"
                                    value={params.industry}
                                    onChange={(e) => setParams({ ...params, industry: e.target.value })}
                                    placeholder="e.g. Technology, Finance"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="experience">Experience Level</Label>
                                <Select value={params.experience} onValueChange={(value) => setParams({ ...params, experience: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select experience level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                                        <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                                        <SelectItem value="senior">Senior Level (6-8 years)</SelectItem>
                                        <SelectItem value="lead">Lead Level (9+ years)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="companyType">Company Type</Label>
                                <Select value={params.companyType} onValueChange={(value) => setParams({ ...params, companyType: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tech_startup">Tech Startup</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                        <SelectItem value="scaleup">Scale-up</SelectItem>
                                        <SelectItem value="consulting">Consulting Firm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="responsibilities">Key Responsibilities (Optional)</Label>
                            <Textarea
                                id="responsibilities"
                                value={params.keyResponsibilities}
                                onChange={(e) => setParams({ ...params, keyResponsibilities: e.target.value })}
                                placeholder="Describe the main responsibilities and objectives for this role..."
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tone">Tone & Style</Label>
                            <Select value={params.tone} onValueChange={(value) => setParams({ ...params, tone: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="casual">Casual & Friendly</SelectItem>
                                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                                    <SelectItem value="formal">Formal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !hasAccess}
                                className="min-w-[120px]"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
