"use client";

import PipelineView from '@/components/hr-partner/dashboard/PipelineView';

const PipelinePage = () => {
    return (
        <div className="min-h-screen bg-[#F4F6F8] dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold mb-6 text-foreground">Pipeline</h1>
                <PipelineView />
            </div>
        </div>
    );
};

export default PipelinePage;
