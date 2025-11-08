'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Book, Code, Shield, Zap } from 'lucide-react';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/docs/swagger.json')
      .then(res => res.json())
      .then(data => {
        setSpec(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load API spec:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Code className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load API Documentation</h2>
          <p className="text-gray-600">Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">theNexus API Documentation</h1>
              <p className="text-primary-foreground/90 text-lg">
                Complete API reference for Nigeria's Premier Senior Professional Network
              </p>
            </div>
            <Link 
              href="/"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Back to Platform
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Book className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">REST API</h3>
                  <p className="text-sm text-gray-600">JSON over HTTPS</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Clerk Auth</h3>
                  <p className="text-sm text-gray-600">JWT Bearer tokens</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Rate Limited</h3>
                  <p className="text-sm text-gray-600">1000 req/hour</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Code className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">OpenAPI 3.0</h3>
                  <p className="text-sm text-gray-600">Standard compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Base URL Info */}
      <div className="bg-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Base URL</h3>
              <code className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/v1
              </code>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-blue-900 mb-1">Version</h3>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Swagger UI */}
      <div className="max-w-7xl mx-auto">
        <SwaggerUI 
          spec={spec}
          docExpansion="list"
          defaultModelsExpandDepth={2}
          defaultModelExpandDepth={2}
          tryItOutEnabled={true}
          filter={true}
          supportedSubmitMethods={['get', 'post', 'put', 'delete', 'patch']}
          requestInterceptor={(request) => {
            // Add any request interceptors here
            return request;
          }}
          responseInterceptor={(response) => {
            // Add any response interceptors here
            return response;
          }}
        />
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              © 2024 theNexus - Nigeria's Premier Senior Professional Network
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
              <Link href="/support" className="hover:text-primary">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
