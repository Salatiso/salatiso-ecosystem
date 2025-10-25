import React from 'react';
import Head from 'next/head';
import IntranetLayout from '../../components/layouts/IntranetLayout';
import CurriculumBrowser from '../../components/academy/CurriculumBrowser';

const CurriculumPage: React.FC = () => {
  return (
    <IntranetLayout>
      <Head>
        <title>Curriculum Browser - Sazi Life Academy</title>
        <meta name="description" content="Explore comprehensive learning modules in the Sazi Life Academy" />
        <meta name="keywords" content="curriculum, learning modules, Sazi Life Academy, Ubuntu education" />
      </Head>

      <CurriculumBrowser />
    </IntranetLayout>
  );
};

export default CurriculumPage;