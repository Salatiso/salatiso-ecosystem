import React from 'react';
import Head from 'next/head';
import type { Document } from '@/types';

const Library: React.FC = () => {
  const documents: Document[] = [
    {
      id: 'doc1',
      title: 'Sample Document',
      category: 'Education',
      type: 'guide',
      description: 'A sample document',
      author: 'Admin',
      date: '2025-10-01',
      tags: ['sample'],
      status: 'published',
      featured: true,
      accessLevel: 'public',
      xpReward: 100,
      estimatedReadTime: 10,
      difficulty: 'beginner'
    }
  ];

  return (
    <div>
      <Head>
        <title>Library</title>
      </Head>
      <h1>Document Library</h1>
      <div>
        {documents.map((doc) => (
          <div key={doc.id}>
            <h3>{doc.title}</h3>
            <p>{doc.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
