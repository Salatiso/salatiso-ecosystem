import React from 'react';
import Head from 'next/head';
import IntranetLayout from '../../components/layouts/IntranetLayout';
import AcademyDashboard from '../../components/academy/AcademyDashboard';

const AcademyPage: React.FC = () => {
  return (
    <IntranetLayout>
      <Head>
        <title>Sazi Life Academy - Homestead OS</title>
        <meta name="description" content="Sazi Life Academy - Family-first learning ecosystem with Ubuntu philosophy" />
        <meta name="keywords" content="Sazi Life Academy, Ubuntu learning, family education, Homestead OS" />
      </Head>

      <AcademyDashboard />
    </IntranetLayout>
  );
};

export default AcademyPage;