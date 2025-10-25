import React from 'react';
import Head from 'next/head';
import IntranetLayout from '../../components/layouts/IntranetLayout';
import CareerPaths from '../../components/business/CareerPaths';

const CareerPathsPage: React.FC = () => {
  return (
    <IntranetLayout>
      <Head>
        <title>Career Development Paths - Homestead OS</title>
        <meta name="description" content="Career development framework with mentorship, skill building, and growth opportunities" />
        <meta name="keywords" content="career paths, professional development, Ubuntu, mentorship, skill building" />
      </Head>

      <CareerPaths />
    </IntranetLayout>
  );
};

export default CareerPathsPage;