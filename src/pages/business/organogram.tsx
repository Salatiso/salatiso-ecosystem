import React from 'react';
import Head from 'next/head';
import IntranetLayout from '../../components/layouts/IntranetLayout';
import BusinessOrganogram from '../../components/business/BusinessOrganogram';

const BusinessOrganogramPage: React.FC = () => {
  return (
    <IntranetLayout>
      <Head>
        <title>MNI Business Organogram - Homestead OS</title>
        <meta name="description" content="MNI Business Organogram - Our family-first organizational structure embodying Ubuntu principles" />
        <meta name="keywords" content="MNI, business organogram, Ubuntu, family business, organizational structure" />
      </Head>

      <BusinessOrganogram />
    </IntranetLayout>
  );
};

export default BusinessOrganogramPage;