import React from 'react';
import Head from 'next/head';
import IntranetLayout from '../../components/layouts/IntranetLayout';
import ProgressTracker from '../../components/academy/ProgressTracker';

const ProgressPage: React.FC = () => {
  return (
    <IntranetLayout>
      <Head>
        <title>Learning Progress - Sazi Life Academy</title>
        <meta name="description" content="Track your learning journey and achievements in the Sazi Life Academy" />
        <meta name="keywords" content="learning progress, achievements, Sazi Life Academy, Ubuntu journey" />
      </Head>

      <ProgressTracker />
    </IntranetLayout>
  );
};

export default ProgressPage;