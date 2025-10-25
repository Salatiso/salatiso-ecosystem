import React, { useState } from 'react';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { MultiContextDashboard } from '@/components/dashboard/DashboardReporting';
import { InsightsDashboard } from '@/components/analytics/InsightsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReportingPage: React.FC = () => {
  return (
    <IntranetLayout>
      <Head>
        <title>Dashboard & Reporting - Salatiso Ecosystem</title>
        <meta name="description" content="Context-aware dashboards, analytics insights, and multi-level reporting" />
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard & Reporting</h1>
          <p className="text-gray-600">
            Comprehensive analytics, context-aware insights, and business intelligence
          </p>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
            <TabsTrigger value="context-dashboards">Context Dashboards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="mt-6">
            <InsightsDashboard />
          </TabsContent>
          
          <TabsContent value="context-dashboards" className="mt-6">
            <MultiContextDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </IntranetLayout>
  );
};

export default ReportingPage;
