'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, User, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface Professional {
    id: string;
    firstName: string;
    lastName: string;
    profileHeadline: string;
    currentTitle: string;
    locationCity: string;
    locationState: string;
}

interface JobRole {
    id: string;
    roleTitle: string;
    department?: string;
    locationCity: string;
    locationState: string;
}

interface IntroductionRequestModalProps {
    professional: Professional;
    jobRoles: JobRole[];
    onRequestSent?: () => void;
    trigger?: React.ReactNode;
    currentCredits?: number;
}

export function IntroductionRequestModal({
    professional,
    jobRoles,
    onRequestSent,
    trigger,
    currentCredits
}: IntroductionRequestModalProps) {
    const [open, setOpen] = useState(false);
    const [selectedJobRoleId, setSelectedJobRoleId] = useState('');
    const [personalizedMessage, setPersonalizedMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedJobRoleId || !personalizedMessage.trim()) {
            setError('Please select a job role and write a personalized message.');
            return;
        }

        if (personalizedMessage.length < 50) {
            setError('Personalized message must be at least 50 characters long.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/v1/introductions/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    professionalId: professional.id,
                    jobRoleId: selectedJobRoleId,
                    personalizedMessage: personalizedMessage.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send introduction request');
            }

            toast.success('The professional will be notified of your request.');

            setOpen(false);
            setSelectedJobRoleId('');
            setPersonalizedMessage('');
            onRequestSent?.();

        } catch (error) {
            console.error('Error sending introduction request:', error);
            setError(error instanceof Error ? error.message : 'Failed to send introduction request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const defaultTrigger = (
        <Button variant="outline" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Request Introduction
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Request Introduction</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Professional Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <User className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {professional.firstName} {professional.lastName}
                                </h3>
                                <p className="text-sm text-gray-600">{professional.profileHeadline}</p>
                                <p className="text-sm text-gray-500">
                                    {professional.currentTitle} • {professional.locationCity}, {professional.locationState}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Credit Balance Display */}
                        {currentCredits !== undefined && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-blue-900">Available Credits</span>
                                    <span className={`font-bold ${currentCredits > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                        {currentCredits}
                                    </span>
                                </div>
                                {currentCredits <= 2 && (
                                    <p className="text-xs text-blue-700 mt-1">
                                        {currentCredits === 0 ? 'No credits remaining' : 'Low on credits - consider purchasing more'}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Job Role Selection */}
                        <div>
                            <Label htmlFor="jobRole">Select Job Role *</Label>
                            <select
                                id="jobRole"
                                value={selectedJobRoleId}
                                onChange={(e) => setSelectedJobRoleId(e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Choose a job role...</option>
                                {jobRoles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.roleTitle}
                                        {role.department && ` (${role.department})`}
                                        {' • '}
                                        {role.locationCity}, {role.locationState}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Personalized Message */}
                        <div>
                            <Label htmlFor="message">
                                Personalized Message *
                                <span className="text-sm text-gray-500 ml-2">
                                    ({personalizedMessage.length}/1000 characters, minimum 50)
                                </span>
                            </Label>
                            <Textarea
                                id="message"
                                value={personalizedMessage}
                                onChange={(e) => setPersonalizedMessage(e.target.value)}
                                placeholder={`Dear ${professional.firstName},

I came across your profile and was impressed by your experience in ${professional.currentTitle}. We're currently looking for someone with your background for our ${jobRoles.find(r => r.id === selectedJobRoleId)?.roleTitle || 'open position'}.

I'd love to connect you with our team to discuss this opportunity further.

Best regards,
[Your Name]`}
                                className="mt-1 min-h-[120px]"
                                maxLength={1000}
                                required
                            />
                        </div>

                        {/* Error Display */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || (currentCredits !== undefined && currentCredits <= 0)}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Request {currentCredits !== undefined && currentCredits > 0 && `(${currentCredits - 1} credits remaining)`}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
