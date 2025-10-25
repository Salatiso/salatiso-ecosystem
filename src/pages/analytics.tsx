import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

const AnalyticsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Analytics Dashboard - Salatiso Ecosystem</title>
        <meta name="description" content="View analytics and user engagement metrics for the Salatiso Ecosystem platform" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AnalyticsDashboard />
    </>
  );
};

export default AnalyticsPage;