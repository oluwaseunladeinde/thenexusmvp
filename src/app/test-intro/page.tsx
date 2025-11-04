'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function TestIntroPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [message, setMessage] = useState('');

    const testGetRequests = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/introductions/received?page=1&limit=10');
            const data = await response.json();
            setResult({ endpoint: 'GET /api/v1/introductions/received', status: response.status, data });
        } catch (error) {
            setResult({ endpoint: 'GET /api/v1/introductions/received', error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const testAcceptRequest = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/introductions/${id}/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            setResult({ endpoint: `POST /api/v1/introductions/${id}/accept`, status: response.status, data });
        } catch (error) {
            setResult({ endpoint: `POST /api/v1/introductions/${id}/accept`, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const testDeclineRequest = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/introductions/${id}/decline`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            setResult({ endpoint: `POST /api/v1/introductions/${id}/decline`, status: response.status, data });
        } catch (error) {
            setResult({ endpoint: `POST /api/v1/introductions/${id}/decline`, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Introduction Request API Test</h1>
            
            <div className="grid gap-6">
                {/* Test Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle>API Test Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Button onClick={testGetRequests} disabled={loading}>
                                Test Get Requests
                            </Button>
                            <Button onClick={() => testAcceptRequest('test-id')} disabled={loading} variant="outline">
                                Test Accept (test-id)
                            </Button>
                            <Button onClick={() => testDeclineRequest('test-id')} disabled={loading} variant="outline">
                                Test Decline (test-id)
                            </Button>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Response Message:</label>
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter optional response message..."
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {result && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p><strong>Endpoint:</strong> {result.endpoint}</p>
                                {result.status && <p><strong>Status:</strong> {result.status}</p>}
                                {result.error && <p className="text-red-600"><strong>Error:</strong> {result.error}</p>}
                                {result.data && (
                                    <div>
                                        <p><strong>Response:</strong></p>
                                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                                            {JSON.stringify(result.data, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Instructions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Test Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>Make sure you're logged in as a professional user</li>
                            <li>Run the seed script to create test data: <code className="bg-gray-100 px-2 py-1 rounded">npx tsx scripts/seed-intro-requests.ts</code></li>
                            <li>Click "Test Get Requests" to fetch introduction requests</li>
                            <li>Use a real introduction request ID from the response to test accept/decline</li>
                            <li>Check the database to verify status changes</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
