import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ArrowLeft } from 'lucide-react';

interface TemplateContent {
  content: string;
  title: string;
  category: string;
  name: string;
}

const TemplateViewer: React.FC = () => {
  const router = useRouter();
  const { category, templateName } = router.query;
  const [templateContent, setTemplateContent] = useState<TemplateContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!category || !templateName) return;

      try {
        setLoading(true);
        setError(null);

        // Construct the path to the public template file
        const templatePath = `/templates/${category}/${templateName}.html`;

        // Fetch the HTML content
        const response = await fetch(templatePath);

        if (!response.ok) {
          throw new Error(`Failed to load template: ${response.statusText}`);
        }

        const htmlContent = await response.text();

        // Extract title from HTML or use template name
        const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : templateName;

        setTemplateContent({
          content: htmlContent,
          title,
          category: category as string,
          name: templateName as string,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load template');
        console.error('Template loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [category, templateName]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Template...</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading template...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Template Error</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Template Not Found</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => router.push('/templates')}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Templates
            </button>
          </div>
        </div>
      </>
    );
  }

  // Render the HTML content in an iframe
  return (
    <>
      <Head>
        <title>{templateContent?.title || 'Template'}</title>
      </Head>
      <div className="w-full relative">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/templates')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to templates"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <p className="text-sm text-gray-500 capitalize">{templateContent?.category}</p>
              <p className="font-semibold text-gray-900">{templateContent?.title}</p>
            </div>
          </div>
          <a
            href={`/templates/${category}/${templateName}.html`}
            download
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Download
          </a>
        </div>
        
        {/* Template Content */}
        <div className="w-full">
          <iframe
            srcDoc={templateContent?.content}
            className="w-full min-h-screen border-0"
            title={templateContent?.name}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
          />
        </div>
      </div>
    </>
  );
};

export default TemplateViewer;
