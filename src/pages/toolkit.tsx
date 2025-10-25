import React from 'react';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { ToolkitProvider, ToolkitContextTabs } from '@/components/toolkit/ToolkitContextTabs';

const ToolkitPage: React.FC = () => {
  return (
    <ToolkitProvider>
      <IntranetLayout>
        <Head>
          <title>Toolkit - Salatiso Ecosystem</title>
          <meta name="description" content="Customize your tools across Individual, Family, Community, and Professional contexts" />
        </Head>

        <ToolkitContextTabs />
      </IntranetLayout>
    </ToolkitProvider>
  );
};

export default ToolkitPage;
