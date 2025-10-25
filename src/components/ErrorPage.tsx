import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, ArrowLeft, RefreshCw, AlertTriangle, FileX } from 'lucide-react';

interface ErrorPageProps {
  statusCode?: number;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  showRefreshButton?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode = 500,
  title,
  message,
  showHomeButton = true,
  showBackButton = true,
  showRefreshButton = true,
}) => {
  const router = useRouter();

  const getErrorContent = () => {
    switch (statusCode) {
      case 404:
        return {
          icon: <FileX className="h-16 w-16 text-gray-400" />,
          title: title || 'Page Not Found',
          message: message || 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
          primaryAction: 'Go Home',
          primaryHref: '/',
        };
      case 500:
        return {
          icon: <AlertTriangle className="h-16 w-16 text-red-500" />,
          title: title || 'Something went wrong',
          message: message || 'We apologize for the inconvenience. Our team has been notified and is working to fix this issue.',
          primaryAction: 'Try Again',
          primaryOnClick: () => router.reload(),
        };
      default:
        return {
          icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />,
          title: title || 'An error occurred',
          message: message || 'Something unexpected happened. Please try again or contact support if the problem persists.',
          primaryAction: 'Go Home',
          primaryHref: '/',
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <>
      <Head>
        <title>{errorContent.title} - Salatiso Ecosystem</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mb-6">
              {errorContent.icon}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {errorContent.title}
            </h1>

            <p className="text-gray-600 mb-8">
              {errorContent.message}
            </p>

            <div className="space-y-3">
              {errorContent.primaryHref && (
                <Link
                  href={errorContent.primaryHref}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <Home className="h-4 w-4 mr-2" />
                  {errorContent.primaryAction}
                </Link>
              )}

              {errorContent.primaryOnClick && (
                <button
                  onClick={errorContent.primaryOnClick}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {errorContent.primaryAction}
                </button>
              )}

              {showBackButton && (
                <button
                  onClick={() => router.back()}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </button>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Error Code: {statusCode}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-gray-400 mt-2">
                  Development Mode - Check console for more details
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional help section */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              If you continue to experience issues, please contact our support team.
            </p>
            <div className="flex space-x-4 text-sm">
              <a
                href="mailto:hub@salatiso.com"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Email Support
              </a>
              <span className="text-blue-400">•</span>
              <a
                href="tel:+27870927250"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Call Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;