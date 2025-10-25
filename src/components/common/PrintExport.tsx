import React from 'react';
import { Printer, Download, Upload, FileJson } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PrintExportButtonsProps {
  data: any;
  filename: string;
  title?: string;
  onImport?: (data: any) => void;
  printView?: React.ReactNode;
}

export const PrintExportButtons: React.FC<PrintExportButtonsProps> = ({
  data,
  filename,
  title,
  onImport,
  printView
}) => {
  // Print functionality
  const handlePrint = () => {
    window.print();
    toast.success('Opening print dialog...');
  };

  // Export to JSON
  const handleExportJSON = () => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('JSON file downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export JSON file');
    }
  };

  // Import from JSON
  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const importedData = JSON.parse(text);
        
        if (onImport) {
          onImport(importedData);
          toast.success('Data imported successfully!');
        } else {
          toast.error('Import functionality not implemented');
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to import JSON file. Please check the file format.');
      }
    };

    input.click();
  };

  return (
    <div className="flex flex-wrap gap-3 no-print">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
        title="Print this page"
      >
        <Printer className="h-5 w-5" />
        <span>Print</span>
      </button>

      <button
        onClick={handleExportJSON}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        title="Download as JSON"
      >
        <Download className="h-5 w-5" />
        <span>Export JSON</span>
      </button>

      {onImport && (
        <button
          onClick={handleImportJSON}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          title="Import from JSON"
        >
          <Upload className="h-5 w-5" />
          <span>Import JSON</span>
        </button>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <FileJson className="h-4 w-4" />
        <span>JSON format for easy sharing & backup</span>
      </div>
    </div>
  );
};

interface PrintHeaderProps {
  title: string;
  subtitle?: string;
  documentType?: string;
  date?: Date;
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({
  title,
  subtitle,
  documentType = 'Document',
  date = new Date()
}) => {
  return (
    <div className="print-only print-header">
      <div className="logo">
        <div>Mlandeli-Notemba Investments</div>
        <div style={{ fontSize: '12pt', fontWeight: 'normal', color: '#666' }}>
          Salatiso Ecosystem
        </div>
      </div>
      <div className="document-info">
        <div><strong>{documentType}</strong></div>
        <div>{title}</div>
        {subtitle && <div style={{ fontSize: '9pt' }}>{subtitle}</div>}
        <div style={{ marginTop: '4pt' }}>
          Printed: {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

interface PrintFooterProps {
  confidential?: boolean;
  pageNumbers?: boolean;
}

export const PrintFooter: React.FC<PrintFooterProps> = ({
  confidential = true,
  pageNumbers = true
}) => {
  return (
    <div className="print-only print-footer">
      <div>
        {confidential && <span style={{ fontWeight: 'bold' }}>CONFIDENTIAL - </span>}
        Mlandeli-Notemba Investments © {new Date().getFullYear()}
        {' • '}
        <a href="mailto:hub@salatiso.com">hub@salatiso.com</a>
        {pageNumbers && <span> • Page <span className="page-number"></span></span>}
      </div>
    </div>
  );
};

interface PrintableDocumentProps {
  title: string;
  subtitle?: string;
  documentType?: string;
  children: React.ReactNode;
  confidential?: boolean;
  data?: any;
  filename?: string;
  onImport?: (data: any) => void;
}

export const PrintableDocument: React.FC<PrintableDocumentProps> = ({
  title,
  subtitle,
  documentType,
  children,
  confidential = true,
  data,
  filename,
  onImport
}) => {
  return (
    <div>
      {/* Print/Export Buttons (visible on screen only) */}
      {data && filename && (
        <div className="mb-6">
          <PrintExportButtons
            data={data}
            filename={filename}
            title={title}
            onImport={onImport}
          />
        </div>
      )}

      {/* Print Header (visible in print only) */}
      <PrintHeader
        title={title}
        subtitle={subtitle}
        documentType={documentType}
      />

      {/* Main Content */}
      <div className="print-content">
        {children}
      </div>

      {/* Print Footer (visible in print only) */}
      <PrintFooter confidential={confidential} />
    </div>
  );
};

// Helper function to prepare data for export
export const prepareExportData = (data: any, metadata?: any) => {
  return {
    exportedAt: new Date().toISOString(),
    exportedBy: 'MNI Ecosystem',
    version: '1.0.0',
    metadata: metadata || {},
    data: data
  };
};

// Helper function to validate imported data
export const validateImportData = (data: any, requiredFields: string[]): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  if (data.data) {
    // Wrapped format
    return requiredFields.every(field => field in data.data);
  }
  
  // Direct format
  return requiredFields.every(field => field in data);
};
