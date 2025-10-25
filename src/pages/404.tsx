import React from 'react';
import ErrorPage from '@/components/ErrorPage';

const Custom404: React.FC = () => {
  return <ErrorPage statusCode={404} />;
};

export default Custom404;