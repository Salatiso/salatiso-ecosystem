import React from 'react';
import { NextPage, NextPageContext } from 'next';
import ErrorPage from '@/components/ErrorPage';

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return <ErrorPage statusCode={statusCode} />;
};

Error.getInitialProps = ({ res, err, asPath }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;