import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Smartphone,
  HardDrive
} from 'lucide-react';
import { AccessibleRadioGroup, AccessibleModal } from '@/components/accessibility';
import { Contact } from '@/services/ContactsService';
import { isMobileDevice, getDeviceType } from '@/utils/deviceDetection';
import { parseVCFContent, parsedContactToContact } from '@/utils/vcfParser';

interface ImportExportProps {
  contacts: Contact[];
  onImport: (contacts: Contact[]) => void;
  onClose: () => void;
}

const ImportExport: React.FC<ImportExportProps> = ({
  contacts,
  onImport,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [exportFormat, setExportFormat] = useState<'csv' | 'vcf'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deviceType, setDeviceType] = useState<string>('desktop');

  // Track device type on mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
    setDeviceType(getDeviceType());
  }, []);

  // Track export event (analytics)
  const trackExportEvent = (format: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'export_contacts', {
        format,
        contact_count: contacts.length,
        device_type: deviceType,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Track import event (analytics)
  const trackImportEvent = (success: number, errors: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'import_contacts', {
        success_count: success,
        error_count: errors,
        device_type: deviceType,
        file_type: 'csv_or_vcf',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    trackExportEvent(exportFormat);

    try {
      if (exportFormat === 'csv') {
        await exportToCSV();
      } else {
        await exportToVCF();
      }
    } catch (error) {
      console.error('Export failed:', error);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: 'export_contacts_failed',
          fatal: false
        });
      }
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'First Name',
      'Last Name',
      'Phone Numbers',
      'Emails',
      'Addresses',
      'Category',
      'Tags',
      'Notes',
      'Privacy',
      'Added By',
      'Created Date',
      'Updated Date'
    ];

    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => [
        `"${contact.firstName}"`,
        `"${contact.lastName}"`,
        `"${contact.phoneNumbers.join('; ')}"`,
        `"${contact.emails.join('; ')}"`,
        `"${contact.addresses.join('; ')}"`,
        `"${contact.category}"`,
        `"${contact.tags.join('; ')}"`,
        `"${contact.notes.replace(/"/g, '""')}"`,
        `"${contact.privacy}"`,
        `"${contact.addedBy}"`,
        `"${contact.createdAt.toISOString()}"`,
        `"${contact.updatedAt.toISOString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `family-contacts-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToVCF = () => {
    const vcfContent = contacts.map(contact => {
      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${contact.firstName} ${contact.lastName}`,
        `N:${contact.lastName};${contact.firstName};;;`,
        ...contact.phoneNumbers.map(phone => `TEL:${phone}`),
        ...contact.emails.map(email => `EMAIL:${email}`),
        ...contact.addresses.map(address => `ADR:;;${address};;;`),
        contact.notes ? `NOTE:${contact.notes.replace(/\n/g, '\\n')}` : null,
        `CATEGORIES:${contact.category},${contact.tags.join(',')}`,
        'END:VCARD'
      ].filter(Boolean).join('\n');

      return vcard;
    }).join('\n\n');

    const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `family-contacts-${new Date().toISOString().split('T')[0]}.vcf`;
    link.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  // Handle drag and drop (desktop only)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.vcf'))) {
      processFile(file);
      trackImportEvent(0, 0); // Track drag-drop
    }
  };

  const processFile = async (file: File) => {
    setIsImporting(true);
    setImportResults(null);

    try {
      const text = await file.text();
      let importedContacts: Contact[] = [];
      let errors: string[] = [];

      if (file.name.endsWith('.csv')) {
        const result = parseCSV(text);
        importedContacts = result.contacts;
        errors = result.errors;
      } else if (file.name.endsWith('.vcf')) {
        const result = parseVCFFile(text);
        importedContacts = result.contacts;
        errors = result.errors;
      } else {
        errors.push('Unsupported file format. Please use CSV or VCF files.');
      }

      if (importedContacts.length > 0) {
        onImport(importedContacts);
        trackImportEvent(importedContacts.length, errors.length);
      }

      setImportResults({
        success: importedContacts.length,
        errors
      });
    } catch (error) {
      setImportResults({
        success: 0,
        errors: ['Failed to parse file. Please check the format.']
      });
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: 'import_contacts_parse_failed',
          fatal: false
        });
      }
    } finally {
      setIsImporting(false);
    }
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n');
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine).map(h => h.toLowerCase().trim());
    const contacts: Contact[] = [];
    const errors: string[] = [];

    // Detect if this is a Google Contacts CSV or custom format
    const isGoogleFormat = headers.some(h => 
      h.includes('given name') || 
      h.includes('family name') || 
      h.includes('email address') ||
      h.includes('phone')
    );

    for (let i = 1; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();
      if (!trimmedLine) continue;

      try {
        const values = parseCSVLine(lines[i]);
        
        // Skip rows that are entirely empty (all values are empty)
        const hasData = values.some(v => v.trim());
        if (!hasData) {
          continue;
        }
        
        // Create a map of header to value
        const rowData: Record<string, string> = {};
        headers.forEach((header, idx) => {
          rowData[header] = values[idx] || '';
        });

        // Parse the contact based on detected format
        let contact: Contact | null = null;
        let parseError: string | null = null;
        
        if (isGoogleFormat) {
          contact = parseGoogleContactRow(rowData);
          if (!contact) {
            parseError = 'Missing required fields (first/last name)';
          }
        } else {
          // Try custom format
          contact = parseCustomContactRow(rowData, values, headers.length);
          if (!contact) {
            parseError = 'Custom format requires at least first or last name';
          }
        }

        if (!contact) {
          // More detailed error reporting for debugging
          const valuesSummary = values.slice(0, 3).filter(v => v.trim()).join(', ') || '(empty row)';
          errors.push(`Line ${i + 1}: Could not parse contact data - ${parseError}. Values: ${valuesSummary}`);
          continue;
        }

        contacts.push(contact);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`Parse error on line ${i + 1}:`, error);
        errors.push(`Line ${i + 1}: Failed to parse - ${errorMsg}`);
      }
    }

    return { contacts, errors };
  };

  const parseGoogleContactRow = (rowData: Record<string, string>): Contact | null => {
    // Google Contacts fields - multiple possible header names
    const givenName = (rowData['given name'] || rowData['first name'] || rowData['given names'] || '').trim();
    const familyName = (rowData['family name'] || rowData['last name'] || rowData['family names'] || '').trim();
    
    // At least one name is required
    if (!givenName && !familyName) return null;

    // Parse emails - Google has email 1 value, email 1 type, email 2 value, etc.
    const emails: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const emailValue = (rowData[`email ${i} value`] || rowData[`email address`] || '').trim();
      if (emailValue && !emails.includes(emailValue)) {
        emails.push(emailValue);
      }
    }

    // Parse phone numbers - Google has phone 1 value, phone 1 type, etc.
    const phoneNumbers: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const phoneValue = (rowData[`phone ${i} value`] || rowData[`phone number`] || rowData[`phone`] || '').trim();
      if (phoneValue && !phoneNumbers.includes(phoneValue)) {
        phoneNumbers.push(phoneValue);
      }
    }

    // Parse addresses
    const addresses: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const street = (rowData[`address ${i} street`] || '').trim();
      const city = (rowData[`address ${i} city`] || '').trim();
      const region = (rowData[`address ${i} region`] || '').trim();
      const postalCode = (rowData[`address ${i} postal code`] || '').trim();
      const country = (rowData[`address ${i} country`] || '').trim();
      
      const addressParts = [street, city, region, postalCode, country].filter(Boolean);
      if (addressParts.length > 0) {
        const fullAddress = addressParts.join(', ');
        if (!addresses.includes(fullAddress)) {
          addresses.push(fullAddress);
        }
      }
    }

    // Parse relationships and groups for classification
    const notes = (rowData['notes'] || rowData['note'] || '').trim();
    const groups = (rowData['group membership'] || rowData['groups'] || '').trim();
    const relationships = (rowData['relation'] || rowData['relationship'] || '').trim();

    // Determine category based on groups, relationships, or default to friend
    let category: Contact['category'] = 'friend';
    let isFamilyMember = false;
    let isHouseholdMember = false;
    let sonnyRole: Contact['sonnyRole'] = 'none';

    const groupsLower = groups.toLowerCase();
    const relsLower = relationships.toLowerCase();

    if (groupsLower.includes('family') || relsLower.includes('family') || groupsLower.includes('relative')) {
      category = 'family';
      isFamilyMember = true;
      sonnyRole = 'none';
    } else if (groupsLower.includes('household') || relsLower.includes('household')) {
      isHouseholdMember = true;
      category = 'friend';
      sonnyRole = 'none';
    } else if (groupsLower.includes('business') || groupsLower.includes('work')) {
      category = 'business';
    } else if (groupsLower.includes('professional')) {
      category = 'professional';
    } else if (groupsLower.includes('service')) {
      category = 'service';
    }

    // Extract tags from groups
    const tags: string[] = groups
      .split(',')
      .map(g => g.trim())
      .filter(Boolean);

    // Remove duplicates and filter empty tags
    const uniqueTags = [...new Set(tags)].filter(t => t.length > 0);

    const contact: Contact = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      firstName: givenName,
      lastName: familyName,
      phoneNumbers: [...new Set(phoneNumbers)],
      emails: [...new Set(emails)],
      addresses: [...new Set(addresses)],
      category,
      tags: uniqueTags,
      notes,
      privacy: 'family',
      addedBy: 'imported-google',
      createdAt: new Date(),
      updatedAt: new Date(),
      isFamilyMember,
      isHouseholdMember,
      sonnyRole
    };

    return contact;
  };

  const parseCustomContactRow = (
    rowData: Record<string, string>,
    values: string[],
    headerCount: number
  ): Contact | null => {
    // For custom format, map available fields
    const firstName = (rowData['first name'] || rowData['given name'] || values[0] || '').trim();
    const lastName = (rowData['last name'] || rowData['family name'] || values[1] || '').trim();

    if (!firstName && !lastName) return null;

    const phoneNumbers = (rowData['phone numbers'] || values[2] || '')
      .split(';')
      .map(p => p.trim())
      .filter(Boolean);

    const emails = (rowData['emails'] || values[3] || '')
      .split(';')
      .map(e => e.trim())
      .filter(Boolean);

    const addresses = (rowData['addresses'] || values[4] || '')
      .split(';')
      .map(a => a.trim())
      .filter(Boolean);

    const category = (rowData['category'] || values[5] || 'friend') as Contact['category'];
    
    const tags = (rowData['tags'] || values[6] || '')
      .split(';')
      .map(t => t.trim())
      .filter(Boolean);

    const contact: Contact = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      firstName,
      lastName,
      phoneNumbers: [...new Set(phoneNumbers)],
      emails: [...new Set(emails)],
      addresses: [...new Set(addresses)],
      category,
      tags: [...new Set(tags)],
      notes: (rowData['notes'] || values[7] || '').trim(),
      privacy: (rowData['privacy'] || values[8] || 'family') as Contact['privacy'],
      addedBy: 'imported-custom',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return contact;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.replace(/"/g, ''));
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.replace(/"/g, ''));
    return result;
  };

  const parseVCFFile = (vcfText: string) => {
    // Use our new VCF parser utility
    const parsedResult = parseVCFContent(vcfText);
    
    const contacts: Contact[] = parsedResult.contacts.map(parsed => {
      const partial = parsedContactToContact(parsed);
      return {
        id: `contact_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        firstName: partial.firstName || '',
        lastName: partial.lastName || '',
        phoneNumbers: partial.phoneNumbers || [],
        emails: partial.emails || [],
        addresses: partial.addresses || [],
        category: partial.category || 'friend',
        tags: partial.tags || [],
        notes: partial.notes || '',
        privacy: 'family' as const,
        addedBy: 'imported-vcf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    return {
      contacts,
      errors: parsedResult.errors
    };
  };

  const tabs = [
    { id: 'export', label: 'Export Contacts', icon: Download },
    { id: 'import', label: 'Import Contacts', icon: Upload }
  ];

  return (
    <AccessibleModal
      isOpen={true}
      onClose={onClose}
      title="Import/Export Contacts"
      size="xl"
    >
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-ubuntu-warm-100 rounded-lg p-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'export' | 'import')}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-ubuntu-warm-900 shadow-sm'
                      : 'text-ubuntu-warm-600 hover:text-ubuntu-warm-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Export Tab */}
            {activeTab === 'export' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                    Export Your Contacts
                  </h3>
                  <p className="text-ubuntu-warm-600 text-sm mb-4">
                    Download your contacts in a format that can be imported into other applications.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <AccessibleRadioGroup
                        name="exportFormat"
                        label="Export Format"
                        options={[
                          { value: 'csv', label: 'CSV (Spreadsheet)' },
                          { value: 'vcf', label: 'VCF (Address Book)' }
                        ]}
                        value={exportFormat}
                        onChange={(value) => setExportFormat(value as 'csv' | 'vcf')}
                      />
                    </div>

                    <div className="bg-ubuntu-warm-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-ubuntu-warm-700">
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">
                          {contacts.length} contact{contacts.length !== 1 ? 's' : ''} ready for export
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleExport}
                      disabled={isExporting || contacts.length === 0}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-ubuntu-gold text-white rounded-lg hover:bg-ubuntu-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Export Contacts
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Import Tab */}
            {activeTab === 'import' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                    Import Contacts
                  </h3>
                  <p className="text-ubuntu-warm-600 text-sm mb-4">
                    Upload a CSV or VCF file to import contacts into your address book.
                  </p>

                  <div className="space-y-4">
                    {/* Device Detection Info */}
                    {isMobile && (
                      <div className="bg-blue-50 rounded-lg p-3 flex items-center space-x-2">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-blue-700">
                          Mobile device detected - tap to select files
                        </span>
                      </div>
                    )}

                    {/* Drag and Drop Zone (Desktop Only) */}
                    {!isMobile && (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          isDragging
                            ? 'border-ubuntu-gold bg-ubuntu-gold/5'
                            : 'border-ubuntu-warm-300 hover:border-ubuntu-gold'
                        }`}
                      >
                        <Upload className="w-12 h-12 mx-auto mb-3 text-ubuntu-warm-400" />
                        <p className="text-ubuntu-warm-900 font-medium mb-1">
                          Drag and drop your files here
                        </p>
                        <p className="text-ubuntu-warm-600 text-sm mb-3">
                          or click the button below to browse
                        </p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-ubuntu-gold text-white rounded-lg hover:bg-ubuntu-gold/90 transition-colors inline-flex items-center space-x-2"
                        >
                          <HardDrive className="w-4 h-4" />
                          <span>Browse Files</span>
                        </button>
                      </div>
                    )}

                    {/* Mobile File Input */}
                    {isMobile && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isImporting}
                        className="w-full px-4 py-3 bg-ubuntu-gold text-white rounded-lg hover:bg-ubuntu-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center space-x-2"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Choose File</span>
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.vcf"
                      onChange={handleImport}
                      disabled={isImporting}
                      className="hidden"
                    />

                    {isImporting && (
                      <div className="flex items-center space-x-2 text-ubuntu-warm-700">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Importing contacts...</span>
                      </div>
                    )}

                    {importResults && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-ubuntu-warm-50 rounded-lg p-4"
                      >
                        <div className="flex items-start space-x-3">
                          {importResults.errors.length === 0 ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                          )}
                          <div>
                            <p className="font-medium text-ubuntu-warm-900">
                              Import Complete
                            </p>
                            <p className="text-sm text-ubuntu-warm-700 mt-1">
                              {importResults.success} contact{importResults.success !== 1 ? 's' : ''} imported successfully
                            </p>
                            {importResults.errors.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-ubuntu-warm-900">Errors:</p>
                                <ul className="text-sm text-red-600 mt-1 list-disc list-inside">
                                  {importResults.errors.map((error, index) => (
                                    <li key={index} className="truncate">{error}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Supported Formats:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• <strong>CSV:</strong> First Name, Last Name, Phone Numbers, Emails, Addresses, Category, Tags, Notes, Privacy</li>
                        <li>• <strong>VCF:</strong> Standard vCard format from most address book applications</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
    </AccessibleModal>
  );
};

export default ImportExport;