import React from 'react';
import Head from 'next/head';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import { ProjectsDashboard } from '@/components/projects/ProjectsModule';

const ProjectsPage: React.FC = () => {
  return (
    <IntranetLayout>
      <Head>
        <title>Projects - Salatiso Ecosystem</title>
        <meta name="description" content="Organize and track projects across all life contexts with Kanban boards, timelines, and governance progression" />
      </Head>

      <ProjectsDashboard />
    </IntranetLayout>
  );
};

export default ProjectsPage;
