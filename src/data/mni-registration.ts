/**
 * MNI Registration Project Data
 * Solo's task to register Mlandeli-Notemba Investments with his mother's help
 */

import { ProjectPlan, ProjectTask, ProjectMilestone, ProjectDeliverable } from '@/types/project';

export const mniRegistrationPlan: ProjectPlan = {
  id: 'mni-registration-2025',
  title: 'MNI Entity Registration',
  description: 'Register Mlandeli-Notemba Investments (Pty) Ltd as the primary holding company for the Salatiso ecosystem',
  owner: 'Solo (Lonwabo Mdeni)',
  team: ['Solo (Lonwabo Mdeni)', 'Notemba Mdeni (Mother - Supporting)'],
  startDate: new Date('2025-10-12'),
  targetEndDate: new Date('2025-11-30'),
  actualEndDate: null,
  status: 'active',
  progress: 0,
  milestones: [
    {
      id: 'milestone-1',
      title: 'Company Name Reservation',
      description: 'Reserve the company name with CIPC',
      dueDate: new Date('2025-10-19'),
      completedDate: null,
      tasks: ['task-1', 'task-2', 'task-3'],
      deliverables: ['deliverable-1'],
      status: 'upcoming'
    },
    {
      id: 'milestone-2',
      title: 'Documentation Preparation',
      description: 'Gather and prepare all required documents',
      dueDate: new Date('2025-10-26'),
      completedDate: null,
      tasks: ['task-4', 'task-5', 'task-6', 'task-7'],
      deliverables: ['deliverable-2', 'deliverable-3'],
      status: 'upcoming'
    },
    {
      id: 'milestone-3',
      title: 'CIPC Registration Submission',
      description: 'Submit company registration to CIPC',
      dueDate: new Date('2025-11-09'),
      completedDate: null,
      tasks: ['task-8', 'task-9', 'task-10'],
      deliverables: ['deliverable-4'],
      status: 'upcoming'
    },
    {
      id: 'milestone-4',
      title: 'Post-Registration Setup',
      description: 'Complete tax registration and banking setup',
      dueDate: new Date('2025-11-30'),
      completedDate: null,
      tasks: ['task-11', 'task-12', 'task-13', 'task-14'],
      deliverables: ['deliverable-5', 'deliverable-6'],
      status: 'upcoming'
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Research CIPC Name Requirements',
      description: 'Review CIPC guidelines for company name registration, check prohibited words, and understand naming conventions for Pty Ltd companies.',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'high',
      dueDate: new Date('2025-10-14'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-1-1', title: 'Visit CIPC website and download naming guidelines', completed: false, completedDate: null },
        { id: 'st-1-2', title: 'Check if "Mlandeli-Notemba Investments" is available', completed: false, completedDate: null },
        { id: 'st-1-3', title: 'Prepare 3 alternative names in case primary is taken', completed: false, completedDate: null },
        { id: 'st-1-4', title: 'Discuss name options with mother', completed: false, completedDate: null }
      ],
      dependencies: [],
      tags: ['research', 'cipc', 'naming'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-2',
      title: 'Check Name Availability on CIPC Portal',
      description: 'Use the CIPC online portal to search for name availability and check for similar existing company names.',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'high',
      dueDate: new Date('2025-10-15'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-2-1', title: 'Create CIPC customer account if needed', completed: false, completedDate: null },
        { id: 'st-2-2', title: 'Search for "Mlandeli-Notemba Investments"', completed: false, completedDate: null },
        { id: 'st-2-3', title: 'Search for similar names to avoid confusion', completed: false, completedDate: null },
        { id: 'st-2-4', title: 'Document search results with screenshots', completed: false, completedDate: null }
      ],
      dependencies: ['task-1'],
      tags: ['cipc', 'verification'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-3',
      title: 'Submit Name Reservation Application',
      description: 'Submit the CoR9.1 form to CIPC to reserve the chosen company name for 60 days.',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'urgent',
      dueDate: new Date('2025-10-17'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-3-1', title: 'Complete CoR9.1 form with company details', completed: false, completedDate: null },
        { id: 'st-3-2', title: 'Prepare payment for R50 name reservation fee', completed: false, completedDate: null },
        { id: 'st-3-3', title: 'Submit form via CIPC e-Services', completed: false, completedDate: null },
        { id: 'st-3-4', title: 'Save confirmation email and reference number', completed: false, completedDate: null },
        { id: 'st-3-5', title: 'Await approval (typically 1-2 business days)', completed: false, completedDate: null }
      ],
      dependencies: ['task-2'],
      tags: ['cipc', 'submission', 'urgent'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-4',
      title: 'Gather Directors/Shareholders ID Documents',
      description: 'Collect certified copies of ID documents for all directors and shareholders (Solo and Notemba).',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'high',
      dueDate: new Date('2025-10-20'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-4-1', title: 'Get certified copy of Solo\'s ID (R25 per copy)', completed: false, completedDate: null },
        { id: 'st-4-2', title: 'Get certified copy of Mother\'s ID', completed: false, completedDate: null },
        { id: 'st-4-3', title: 'Ensure certifications are recent (within 3 months)', completed: false, completedDate: null },
        { id: 'st-4-4', title: 'Make additional copies for bank account opening', completed: false, completedDate: null },
        { id: 'st-4-5', title: 'Store digital scans in secure folder', completed: false, completedDate: null }
      ],
      dependencies: ['task-3'],
      tags: ['documentation', 'legal'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-5',
      title: 'Prepare Proof of Address Documents',
      description: 'Obtain recent proof of address for all directors (utility bill, bank statement, or municipal account).',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'high',
      dueDate: new Date('2025-10-21'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-5-1', title: 'Get Solo\'s proof of address (not older than 3 months)', completed: false, completedDate: null },
        { id: 'st-5-2', title: 'Get Mother\'s proof of address', completed: false, completedDate: null },
        { id: 'st-5-3', title: 'Ensure addresses match ID addresses or get affidavit', completed: false, completedDate: null },
        { id: 'st-5-4', title: 'Make certified copies', completed: false, completedDate: null }
      ],
      dependencies: ['task-3'],
      tags: ['documentation', 'legal'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-6',
      title: 'Draft Memorandum of Incorporation (MOI)',
      description: 'Create the company\'s MOI defining the company structure, share allocation, and governance rules.',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'high',
      dueDate: new Date('2025-10-24'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-6-1', title: 'Use CIPC standard MOI template or customize', completed: false, completedDate: null },
        { id: 'st-6-2', title: 'Define share structure (e.g., 100 shares total)', completed: false, completedDate: null },
        { id: 'st-6-3', title: 'Allocate shares to directors/shareholders', completed: false, completedDate: null },
        { id: 'st-6-4', title: 'Define company objects and business activities', completed: false, completedDate: null },
        { id: 'st-6-5', title: 'Review MOI with mother for approval', completed: false, completedDate: null },
        { id: 'st-6-6', title: 'Have MOI reviewed by lawyer (optional but recommended)', completed: false, completedDate: null }
      ],
      dependencies: ['task-3'],
      tags: ['documentation', 'legal', 'governance'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-7',
      title: 'Determine Company Registered Address',
      description: 'Select and document the official registered address for MNI (can be residential or business address).',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'medium',
      dueDate: new Date('2025-10-23'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-7-1', title: 'Decide between home address or virtual office', completed: false, completedDate: null },
        { id: 'st-7-2', title: 'Get written consent from property owner if using rental', completed: false, completedDate: null },
        { id: 'st-7-3', title: 'Prepare proof of registered address', completed: false, completedDate: null },
        { id: 'st-7-4', title: 'Document full postal and physical addresses', completed: false, completedDate: null }
      ],
      dependencies: [],
      tags: ['documentation', 'address'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-8',
      title: 'Complete CoR14.1 Company Registration Form',
      description: 'Fill out the official CIPC CoR14.1 form for private company registration.',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'urgent',
      dueDate: new Date('2025-11-03'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-8-1', title: 'Download CoR14.1 form from CIPC portal', completed: false, completedDate: null },
        { id: 'st-8-2', title: 'Enter reserved company name details', completed: false, completedDate: null },
        { id: 'st-8-3', title: 'List all directors with ID numbers and addresses', completed: false, completedDate: null },
        { id: 'st-8-4', title: 'List all shareholders with share allocations', completed: false, completedDate: null },
        { id: 'st-8-5', title: 'Enter registered address details', completed: false, completedDate: null },
        { id: 'st-8-6', title: 'Specify financial year-end date', completed: false, completedDate: null },
        { id: 'st-8-7', title: 'Review form with mother for accuracy', completed: false, completedDate: null }
      ],
      dependencies: ['task-4', 'task-5', 'task-6', 'task-7'],
      tags: ['cipc', 'registration', 'urgent'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-9',
      title: 'Compile Registration Document Package',
      description: 'Assemble all required documents for CIPC submission.',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'high',
      dueDate: new Date('2025-11-05'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-9-1', title: 'Include completed CoR14.1 form', completed: false, completedDate: null },
        { id: 'st-9-2', title: 'Include Memorandum of Incorporation (MOI)', completed: false, completedDate: null },
        { id: 'st-9-3', title: 'Include certified ID copies of all directors', completed: false, completedDate: null },
        { id: 'st-9-4', title: 'Include proof of address for all directors', completed: false, completedDate: null },
        { id: 'st-9-5', title: 'Include consent letters if using residential address', completed: false, completedDate: null },
        { id: 'st-9-6', title: 'Create checklist to verify all documents present', completed: false, completedDate: null }
      ],
      dependencies: ['task-8'],
      tags: ['documentation', 'organization'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-10',
      title: 'Submit Registration to CIPC and Pay Fees',
      description: 'Submit the complete registration package via CIPC e-Services and pay the registration fee (approximately R500).',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'urgent',
      dueDate: new Date('2025-11-07'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-10-1', title: 'Log into CIPC e-Services portal', completed: false, completedDate: null },
        { id: 'st-10-2', title: 'Upload all documents in correct format (PDF)', completed: false, completedDate: null },
        { id: 'st-10-3', title: 'Pay R500 registration fee via online payment', completed: false, completedDate: null },
        { id: 'st-10-4', title: 'Save payment confirmation and receipt', completed: false, completedDate: null },
        { id: 'st-10-5', title: 'Note application reference number', completed: false, completedDate: null },
        { id: 'st-10-6', title: 'Await registration confirmation (7-14 days typically)', completed: false, completedDate: null }
      ],
      dependencies: ['task-9'],
      tags: ['cipc', 'submission', 'payment', 'urgent'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-11',
      title: 'Apply for Tax Compliance (Income Tax & VAT)',
      description: 'Register the company with SARS for income tax and VAT (if applicable).',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'high',
      dueDate: new Date('2025-11-16'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-11-1', title: 'Obtain company registration certificate from CIPC first', completed: false, completedDate: null },
        { id: 'st-11-2', title: 'Register on SARS eFiling as company representative', completed: false, completedDate: null },
        { id: 'st-11-3', title: 'Apply for company income tax number', completed: false, completedDate: null },
        { id: 'st-11-4', title: 'Determine if VAT registration needed (R1m+ turnover)', completed: false, completedDate: null },
        { id: 'st-11-5', title: 'Apply for VAT number if required', completed: false, completedDate: null },
        { id: 'st-11-6', title: 'Set up SARS tax payment method', completed: false, completedDate: null }
      ],
      dependencies: ['task-10'],
      tags: ['sars', 'tax', 'compliance'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-12',
      title: 'Open Company Bank Account',
      description: 'Open a dedicated business bank account for MNI with a major South African bank.',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'high',
      dueDate: new Date('2025-11-21'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-12-1', title: 'Research business account options (FNB, Standard Bank, Nedbank, etc.)', completed: false, completedDate: null },
        { id: 'st-12-2', title: 'Prepare required documents (CoR14.3, MOI, IDs, proof of address)', completed: false, completedDate: null },
        { id: 'st-12-3', title: 'Schedule appointment with chosen bank', completed: false, completedDate: null },
        { id: 'st-12-4', title: 'Attend bank appointment (may require mother\'s presence)', completed: false, completedDate: null },
        { id: 'st-12-5', title: 'Activate online banking for company account', completed: false, completedDate: null },
        { id: 'st-12-6', title: 'Order company debit/credit cards', completed: false, completedDate: null }
      ],
      dependencies: ['task-10'],
      tags: ['banking', 'finance'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-13',
      title: 'Set Up Accounting and Bookkeeping System',
      description: 'Establish accounting system for tracking income, expenses, and preparing financial statements.',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'medium',
      dueDate: new Date('2025-11-25'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-13-1', title: 'Choose accounting software (Xero, QuickBooks, Sage, etc.)', completed: false, completedDate: null },
        { id: 'st-13-2', title: 'Set up company profile in accounting software', completed: false, completedDate: null },
        { id: 'st-13-3', title: 'Link bank account to accounting system', completed: false, completedDate: null },
        { id: 'st-13-4', title: 'Set up chart of accounts', completed: false, completedDate: null },
        { id: 'st-13-5', title: 'Consider hiring bookkeeper or accountant (optional)', completed: false, completedDate: null },
        { id: 'st-13-6', title: 'Schedule first financial year-end with accountant', completed: false, completedDate: null }
      ],
      dependencies: ['task-12'],
      tags: ['accounting', 'finance', 'compliance'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    },
    {
      id: 'task-14',
      title: 'Complete Annual Return Compliance Setup',
      description: 'Set up reminders and systems for annual CIPC returns and compliance deadlines.',
      assignedTo: 'Solo (Lonwabo Mdeni)',
      status: 'not-started',
      priority: 'low',
      dueDate: new Date('2025-11-28'),
      completedDate: null,
      notes: [],
      subtasks: [
        { id: 'st-14-1', title: 'Note annual return due date (within 12 months of registration)', completed: false, completedDate: null },
        { id: 'st-14-2', title: 'Set calendar reminders for annual return deadlines', completed: false, completedDate: null },
        { id: 'st-14-3', title: 'Note financial year-end reporting requirements', completed: false, completedDate: null },
        { id: 'st-14-4', title: 'Document all compliance obligations in a checklist', completed: false, completedDate: null },
        { id: 'st-14-5', title: 'Integrate deadlines into Homestead OS calendar', completed: false, completedDate: null }
      ],
      dependencies: ['task-10'],
      tags: ['compliance', 'planning', 'cipc'],
      createdAt: new Date('2025-10-12'),
      updatedAt: new Date('2025-10-12'),
      changeHistory: []
    }
  ],
  deliverables: [
    {
      id: 'deliverable-1',
      title: 'Name Reservation Certificate',
      description: 'Official CIPC certificate confirming name reservation for "Mlandeli-Notemba Investments (Pty) Ltd"',
      type: 'approval',
      status: 'pending',
      dueDate: new Date('2025-10-19'),
      completedDate: null,
      relatedTasks: ['task-1', 'task-2', 'task-3'],
      attachments: [],
      changeHistory: []
    },
    {
      id: 'deliverable-2',
      title: 'Memorandum of Incorporation (MOI)',
      description: 'Final approved MOI defining company structure and governance',
      type: 'document',
      status: 'pending',
      dueDate: new Date('2025-10-26'),
      completedDate: null,
      relatedTasks: ['task-6'],
      attachments: [],
      changeHistory: []
    },
    {
      id: 'deliverable-3',
      title: 'Complete Documentation Package',
      description: 'All certified documents ready for CIPC submission',
      type: 'document',
      status: 'pending',
      dueDate: new Date('2025-11-05'),
      completedDate: null,
      relatedTasks: ['task-4', 'task-5', 'task-7', 'task-9'],
      attachments: [],
      changeHistory: []
    },
    {
      id: 'deliverable-4',
      title: 'Company Registration Certificate (CoR14.3)',
      description: 'Official CIPC registration certificate with company registration number',
      type: 'registration',
      status: 'pending',
      dueDate: new Date('2025-11-14'),
      completedDate: null,
      relatedTasks: ['task-8', 'task-9', 'task-10'],
      attachments: [],
      changeHistory: []
    },
    {
      id: 'deliverable-5',
      title: 'Tax Registration Numbers',
      description: 'SARS income tax and VAT registration numbers',
      type: 'registration',
      status: 'pending',
      dueDate: new Date('2025-11-20'),
      completedDate: null,
      relatedTasks: ['task-11'],
      attachments: [],
      changeHistory: []
    },
    {
      id: 'deliverable-6',
      title: 'Active Company Bank Account',
      description: 'Operational business bank account with online banking access',
      type: 'other',
      status: 'pending',
      dueDate: new Date('2025-11-25'),
      completedDate: null,
      relatedTasks: ['task-12'],
      attachments: [],
      changeHistory: []
    }
  ],
  events: []
};
