'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Clock, ExternalLink, Mail, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  profileHeadline?: string;
  linkedinUrl?: string;
  currentTitle?: string;
  currentCompany?: string;
  yearsOfExperience: number;
  locationCity: string;
  locationState: string;
  verificationStatus: string;
  createdAt: string;
  user: {
    email: string;
    createdAt: string;
  };
}

interface Company {
  id: string;
  companyName: string;
  industry: string;
  companySize: string;
  companyWebsite?: string;
  verificationStatus: string;
  createdAt: string;
  hrPartners: Array<{
    firstName: string;
    lastName: string;
    jobTitle: string;
    user: {
      email: string;
    };
  }>;
}

interface VerificationQueue {
  professionals: Professional[];
  companies: Company[];
  total: number;
}

export default function VerificationPage() {
  const [queue, setQueue] = useState<VerificationQueue | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'professional' | 'company';
    data: Professional | Company;
  } | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>('BASIC');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/admin/verification/queue');
      if (!response.ok) {
        toast.error('Failed to load verification queue');
        return;
      }
      const result = await response.json();

      if (result.success) {
        setQueue(result.data);
      } else {
        toast.error('Failed to load verification queue');
      }
    } catch (error) {
      console.error('Error fetching queue:', error);
      toast.error('Error loading verification queue');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    return formatDistanceToNow(date, { addSuffix: true });
  };

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Handles the approval action for a given entity.
   * Sets the selected entity, action type, verification status and notes.
   * @param {string} type - The type of the entity to approve ('professional' or 'company').
   * @param {Professional|Company} data - The entity to approve.
   */
  /*******  99df04cd-f3c3-4a76-9341-4f72b69b12e3  *******/
  const handleApprove = (type: 'professional' | 'company', data: Professional | Company) => {
    setSelectedEntity({ type, data });
    setActionType('approve');
    setVerificationStatus(type === 'professional' ? 'BASIC' : 'VERIFIED');
    setNotes('');
  };

  const handleReject = (type: 'professional' | 'company', data: Professional | Company) => {
    setSelectedEntity({ type, data });
    setActionType('reject');
    setNotes('');
  };

  const submitAction = async () => {
    if (!selectedEntity || !actionType) return;

    try {
      setSubmitting(true);

      const endpoint =
        actionType === 'approve'
          ? '/api/v1/admin/verification/approve'
          : '/api/v1/admin/verification/reject';

      const body =
        actionType === 'approve'
          ? {
            entityType: selectedEntity.type,
            entityId: selectedEntity.data.id,
            verificationStatus,
            notes: notes || null,
          }
          : {
            entityType: selectedEntity.type,
            entityId: selectedEntity.data.id,
            reason: notes,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        toast.error('Error processing verification');
        return;
      }

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setSelectedEntity(null);
        setActionType(null);
        fetchQueue(); // Refresh the queue
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting action:', error);
      toast.error('Error processing verification');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Verification Queue</h1>
        <p className="text-muted-foreground">
          Review and verify professionals and companies pending verification
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queue?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Professionals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queue?.professionals.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queue?.companies.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="professionals" className="w-full">
        <TabsList>
          <TabsTrigger value="professionals">
            Professionals ({queue?.professionals.length || 0})
          </TabsTrigger>
          <TabsTrigger value="companies">Companies ({queue?.companies.length || 0})</TabsTrigger>
        </TabsList>

        {/* Professionals Tab */}
        <TabsContent value="professionals" className="space-y-4">
          {queue?.professionals.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No professionals pending verification
              </CardContent>
            </Card>
          ) : (
            queue?.professionals.map((professional) => (
              <Card key={professional.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {professional.firstName} {professional.lastName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {professional.profileHeadline || professional.currentTitle || 'No headline'}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-4">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(professional.createdAt)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Current Role</div>
                      <div className="font-medium">
                        {professional.currentTitle || 'Not specified'} at{' '}
                        {professional.currentCompany || 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Experience</div>
                      <div className="font-medium">{professional.yearsOfExperience} years</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Location</div>
                      <div className="font-medium">
                        {professional.locationCity}, {professional.locationState}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Email</div>
                      <div className="font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {professional.user.email}
                      </div>
                    </div>
                  </div>
                  {professional.linkedinUrl && (
                    <div className="mb-4">
                      <a
                        href={professional.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View LinkedIn Profile
                      </a>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove('professional', professional)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject('professional', professional)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies" className="space-y-4">
          {queue?.companies.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No companies pending verification
              </CardContent>
            </Card>
          ) : (
            queue?.companies.map((company) => (
              <Card key={company.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{company.companyName}</CardTitle>
                      <CardDescription className="mt-1">{company.industry}</CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-4">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(new Date(company.createdAt), { addSuffix: true })}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Company Size</div>
                      <div className="font-medium">{company.companySize?.replace(/_/g, ' ')}</div>
                    </div>
                    {company.companyWebsite && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Website</div>
                        <a
                          href={company.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {company.companyWebsite}
                        </a>
                      </div>
                    )}
                    {company.hrPartners.length > 0 && (
                      <div className="md:col-span-2">
                        <div className="text-sm text-muted-foreground mb-1">HR Contacts</div>
                        <div className="space-y-1">
                          {company.hrPartners.map((hr, idx) => (
                            <div key={idx} className="text-sm">
                              {hr.firstName} {hr.lastName} - {hr.jobTitle} ({hr.user.email})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove('company', company)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject('company', company)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Approval/Rejection Dialog */}
      <Dialog
        open={!!selectedEntity && !!actionType}
        onOpenChange={() => {
          setSelectedEntity(null);
          setActionType(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Verification
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'Approve this verification and select a verification level.'
                : 'Provide a reason for rejecting this verification.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {actionType === 'approve' && (
              <div>
                <Label htmlFor="verification-status">Verification Level</Label>
                <Select value={verificationStatus} onValueChange={setVerificationStatus}>
                  <SelectTrigger id="verification-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedEntity?.type === 'professional' ? (
                      <>
                        <SelectItem value="BASIC">Basic (LinkedIn Verified)</SelectItem>
                        <SelectItem value="FULL">Full (With References)</SelectItem>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="VERIFIED">Verified</SelectItem>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="notes">
                {actionType === 'approve' ? 'Notes (Optional)' : 'Rejection Reason *'}
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  actionType === 'approve'
                    ? 'Add any notes about this verification...'
                    : 'Explain why this verification is being rejected...'
                }
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedEntity(null);
                setActionType(null);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={submitAction}
              disabled={submitting || (actionType === 'reject' && !notes.trim())}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : actionType === 'approve' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
