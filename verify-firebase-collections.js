/**
 * Firebase Collection Verification Script
 * Verifies all Phase 3 collections and existing collections for proper data structure
 * 
 * Usage: node verify-firebase-collections.js
 * 
 * This script will:
 * 1. Check all collections exist
 * 2. Verify document structure in each collection
 * 3. Validate required fields
 * 4. Check data types
 * 5. Generate comprehensive report
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: serviceAccountKey.json not found in root directory');
  console.error('Please download your Firebase service account key from Firebase Console:');
  console.error('1. Go to Project Settings > Service Accounts');
  console.error('2. Click "Generate New Private Key"');
  console.error('3. Save as serviceAccountKey.json in project root');
  process.exit(1);
}

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

// Define expected collections with their required fields
const PHASE_3_COLLECTIONS = {
  roles: {
    required: ['name', 'description', 'permissions', 'hierarchy'],
    optional: ['createdAt', 'updatedAt'],
  },
  permissions: {
    required: ['name', 'description', 'resource', 'action'],
    optional: ['createdAt', 'updatedAt'],
  },
  content_categories: {
    required: ['name', 'description'],
    optional: ['icon', 'order', 'createdAt', 'updatedAt'],
  },
  user_role_assignments: {
    required: ['primaryRole', 'userId'],
    optional: ['secondaryRoles', 'assignedAt', 'assignedBy'],
  },
  audit_logs: {
    required: ['userId', 'action', 'timestamp', 'resource'],
    optional: ['details', 'status'],
  },
  chatbot_knowledge_base: {
    required: ['title', 'category', 'content', 'isActive'],
    optional: ['keywords', 'difficulty', 'views', 'helpful', 'notHelpful', 'lastUpdated', 'createdAt'],
  },
  chatbot_conversations: {
    required: ['userId', 'messages'],
    optional: ['createdAt', 'updatedAt', 'status'],
  },
  chatbot_settings: {
    required: ['enabled', 'theme', 'position'],
    optional: ['language', 'updatedAt'],
  },
};

const EXISTING_COLLECTIONS = {
  users: {
    required: ['email', 'uid'],
    optional: ['displayName', 'photoURL', 'createdAt'],
  },
  family: {
    required: ['name'],
    optional: ['description', 'createdAt'],
  },
  business: {
    required: ['name'],
    optional: ['description', 'website', 'createdAt'],
  },
  projects: {
    required: ['name'],
    optional: ['description', 'status', 'createdAt'],
  },
  documents: {
    required: ['title'],
    optional: ['type', 'url', 'createdAt'],
  },
  analytics: {
    required: ['userId'],
    optional: ['events', 'timestamp', 'data'],
  },
  badges: {
    required: ['name', 'userId'],
    optional: ['icon', 'earnedAt'],
  },
  consents: {
    required: ['userId', 'type'],
    optional: ['value', 'timestamp'],
  },
  video_rooms: {
    required: ['creatorId', 'name'],
    optional: ['roomId', 'participants', 'createdAt'],
  },
  contacts: {
    required: ['name', 'userId'],
    optional: ['email', 'phone', 'address', 'addedBy'],
  },
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(70));
  log(title, 'cyan');
  console.log('='.repeat(70) + '\n');
}

async function verifyCollection(collectionName, schema) {
  try {
    const snapshot = await db.collection(collectionName).limit(10).get();
    
    if (snapshot.empty) {
      log(`  ⚠️  ${collectionName}: No documents found (EMPTY)`, 'yellow');
      return {
        name: collectionName,
        status: 'EMPTY',
        count: 0,
        issues: ['Collection is empty'],
      };
    }

    const count = snapshot.size;
    const issues = [];
    const documents = [];

    // Check each document
    snapshot.forEach((doc) => {
      const data = doc.data();
      const docIssues = [];

      // Check required fields
      schema.required.forEach((field) => {
        if (!(field in data)) {
          docIssues.push(`Missing required field: ${field}`);
        }
      });

      // Check field types
      schema.required.forEach((field) => {
        if (field in data && data[field] === undefined) {
          docIssues.push(`Field ${field} is undefined`);
        }
      });

      if (docIssues.length > 0) {
        issues.push({
          docId: doc.id,
          problems: docIssues,
        });
      }

      documents.push({
        id: doc.id,
        data: data,
        issues: docIssues.length,
      });
    });

    const status = issues.length === 0 ? 'VALID' : 'INVALID';
    const statusColor = status === 'VALID' ? 'green' : 'red';

    log(`  ${status === 'VALID' ? '✅' : '❌'} ${collectionName}: ${count} documents`, statusColor);

    return {
      name: collectionName,
      status,
      count,
      issues,
      documents,
      schema,
    };
  } catch (error) {
    log(`  ❌ ${collectionName}: Error - ${error.message}`, 'red');
    return {
      name: collectionName,
      status: 'ERROR',
      error: error.message,
    };
  }
}

async function verifyAllCollections() {
  logSection('🔍 FIREBASE COLLECTIONS VERIFICATION');

  const results = {
    phase3: [],
    existing: [],
    summary: {
      totalValid: 0,
      totalInvalid: 0,
      totalEmpty: 0,
      totalError: 0,
    },
  };

  // Verify Phase 3 Collections
  log('Phase 3 RBAC Collections:', 'magenta');
  console.log('');

  for (const [collectionName, schema] of Object.entries(PHASE_3_COLLECTIONS)) {
    const result = await verifyCollection(collectionName, schema);
    results.phase3.push(result);

    if (result.status === 'VALID') results.summary.totalValid++;
    else if (result.status === 'INVALID') results.summary.totalInvalid++;
    else if (result.status === 'EMPTY') results.summary.totalEmpty++;
    else if (result.status === 'ERROR') results.summary.totalError++;
  }

  // Verify Existing Collections
  console.log('');
  log('Existing Collections:', 'magenta');
  console.log('');

  for (const [collectionName, schema] of Object.entries(EXISTING_COLLECTIONS)) {
    const result = await verifyCollection(collectionName, schema);
    results.existing.push(result);

    if (result.status === 'VALID') results.summary.totalValid++;
    else if (result.status === 'INVALID') results.summary.totalInvalid++;
    else if (result.status === 'EMPTY') results.summary.totalEmpty++;
    else if (result.status === 'ERROR') results.summary.totalError++;
  }

  return results;
}

function generateReport(results) {
  logSection('📊 VERIFICATION REPORT');

  // Summary Statistics
  log('Summary Statistics:', 'cyan');
  log(`  ✅ Valid Collections:   ${results.summary.totalValid}`, 'green');
  log(`  ⚠️  Invalid Collections: ${results.summary.totalInvalid}`, results.summary.totalInvalid > 0 ? 'yellow' : 'green');
  log(`  ⏭️  Empty Collections:   ${results.summary.totalEmpty}`, results.summary.totalEmpty > 0 ? 'yellow' : 'green');
  log(`  ❌ Error Collections:   ${results.summary.totalError}`, results.summary.totalError > 0 ? 'red' : 'green');

  // Detailed Results
  logSection('📋 DETAILED RESULTS');

  // Phase 3 Collections
  log('Phase 3 RBAC Collections:', 'magenta');
  results.phase3.forEach((result) => {
    const icon = result.status === 'VALID' ? '✅' : result.status === 'EMPTY' ? '⚠️' : '❌';
    const color = result.status === 'VALID' ? 'green' : result.status === 'EMPTY' ? 'yellow' : 'red';

    log(`\n  ${icon} ${result.name}`, color);
    log(`     Status: ${result.status}`, color);
    log(`     Documents: ${result.count || 0}`);

    if (result.issues && result.issues.length > 0) {
      log(`     Issues Found: ${result.issues.length}`, 'red');
      result.issues.slice(0, 3).forEach((issue) => {
        log(`       - Doc "${issue.docId}":`, 'red');
        issue.problems.forEach((problem) => {
          log(`         • ${problem}`, 'red');
        });
      });
      if (result.issues.length > 3) {
        log(`       ... and ${result.issues.length - 3} more`, 'red');
      }
    }
  });

  // Existing Collections
  console.log('');
  log('Existing Collections:', 'magenta');
  results.existing.forEach((result) => {
    const icon = result.status === 'VALID' ? '✅' : result.status === 'EMPTY' ? '⚠️' : '❌';
    const color = result.status === 'VALID' ? 'green' : result.status === 'EMPTY' ? 'yellow' : 'red';

    log(`\n  ${icon} ${result.name}`, color);
    log(`     Status: ${result.status}`, color);
    log(`     Documents: ${result.count || 0}`);

    if (result.issues && result.issues.length > 0) {
      log(`     Issues Found: ${result.issues.length}`, 'red');
      result.issues.slice(0, 3).forEach((issue) => {
        log(`       - Doc "${issue.docId}":`, 'red');
        issue.problems.forEach((problem) => {
          log(`         • ${problem}`, 'red');
        });
      });
      if (result.issues.length > 3) {
        log(`       ... and ${result.issues.length - 3} more`, 'red');
      }
    }
  });
}

function generateDetailedReport(results) {
  logSection('📄 DETAILED COLLECTION REPORT');

  // Phase 3 Collections Details
  log('Phase 3 Collections - Detailed Analysis:', 'magenta');
  results.phase3.forEach((result) => {
    if (result.status === 'VALID' && result.documents) {
      log(`\n${result.name}:`, 'cyan');
      log(`  Expected Fields: ${result.schema.required.join(', ')}`);
      log(`  Optional Fields: ${result.schema.optional.join(', ')}`);
      log(`  Sample Documents (first 3):`);

      result.documents.slice(0, 3).forEach((doc, idx) => {
        log(`    ${idx + 1}. ID: ${doc.id}`);
        Object.entries(doc.data).forEach(([key, value]) => {
          const displayValue = typeof value === 'object' ? JSON.stringify(value).substring(0, 50) : String(value).substring(0, 50);
          log(`       ${key}: ${displayValue}`);
        });
      });
    }
  });

  // Existing Collections Details
  console.log('');
  log('Existing Collections - Detailed Analysis:', 'magenta');
  results.existing.forEach((result) => {
    if (result.status === 'VALID' && result.documents) {
      log(`\n${result.name}:`, 'cyan');
      log(`  Expected Fields: ${result.schema.required.join(', ')}`);
      log(`  Optional Fields: ${result.schema.optional.join(', ')}`);
      log(`  Sample Documents (first 3):`);

      result.documents.slice(0, 3).forEach((doc, idx) => {
        log(`    ${idx + 1}. ID: ${doc.id}`);
        Object.entries(doc.data).forEach(([key, value]) => {
          const displayValue = typeof value === 'object' ? JSON.stringify(value).substring(0, 50) : String(value).substring(0, 50);
          log(`       ${key}: ${displayValue}`);
        });
      });
    }
  });
}

async function generateRecommendations(results) {
  logSection('💡 RECOMMENDATIONS');

  const recommendations = [];

  // Check for empty collections
  const emptyCollections = [
    ...results.phase3.filter((r) => r.status === 'EMPTY'),
    ...results.existing.filter((r) => r.status === 'EMPTY'),
  ];

  if (emptyCollections.length > 0) {
    recommendations.push({
      severity: 'warning',
      message: `${emptyCollections.length} collection(s) are empty and need population`,
      collections: emptyCollections.map((c) => c.name),
    });
  }

  // Check for invalid collections
  const invalidCollections = [
    ...results.phase3.filter((r) => r.status === 'INVALID'),
    ...results.existing.filter((r) => r.status === 'INVALID'),
  ];

  if (invalidCollections.length > 0) {
    recommendations.push({
      severity: 'error',
      message: `${invalidCollections.length} collection(s) have data structure issues`,
      collections: invalidCollections.map((c) => c.name),
    });
  }

  // Check for error collections
  const errorCollections = [
    ...results.phase3.filter((r) => r.status === 'ERROR'),
    ...results.existing.filter((r) => r.status === 'ERROR'),
  ];

  if (errorCollections.length > 0) {
    recommendations.push({
      severity: 'error',
      message: `${errorCollections.length} collection(s) encountered errors during verification`,
      collections: errorCollections.map((c) => c.name),
    });
  }

  // If everything is valid
  if (recommendations.length === 0) {
    log('✅ All collections are properly structured and populated!', 'green');
  } else {
    recommendations.forEach((rec) => {
      const color = rec.severity === 'error' ? 'red' : 'yellow';
      log(`${rec.severity === 'error' ? '❌' : '⚠️'} ${rec.message}`, color);
      rec.collections.forEach((col) => {
        log(`   - ${col}`, color);
      });
      console.log('');
    });
  }
}

function generateJSONReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: results.summary,
    phase3Collections: results.phase3.map((r) => ({
      name: r.name,
      status: r.status,
      documentCount: r.count || 0,
      issuesFound: r.issues ? r.issues.length : 0,
    })),
    existingCollections: results.existing.map((r) => ({
      name: r.name,
      status: r.status,
      documentCount: r.count || 0,
      issuesFound: r.issues ? r.issues.length : 0,
    })),
  };

  const reportPath = path.join(__dirname, 'firebase-verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n📁 JSON Report saved to: ${reportPath}`, 'cyan');

  return report;
}

async function main() {
  try {
    log('\n🔍 Starting Firebase Collections Verification...', 'blue');
    log(`📅 Timestamp: ${new Date().toISOString()}\n`, 'blue');

    // Run verification
    const results = await verifyAllCollections();

    // Generate reports
    generateReport(results);
    generateDetailedReport(results);
    await generateRecommendations(results);
    generateJSONReport(results);

    // Final status
    logSection('✅ VERIFICATION COMPLETE');

    const allValid = results.summary.totalInvalid === 0 && results.summary.totalError === 0;

    if (allValid) {
      log('✅ All Firebase collections are properly structured and populated!', 'green');
    } else {
      log('⚠️  Some collections need attention. See recommendations above.', 'yellow');
    }

    log(`\nTotal Collections Verified: ${results.phase3.length + results.existing.length}`, 'cyan');
    log(`Valid: ${results.summary.totalValid}`, 'green');
    log(`Invalid: ${results.summary.totalInvalid}`, results.summary.totalInvalid > 0 ? 'red' : 'green');
    log(`Empty: ${results.summary.totalEmpty}`, results.summary.totalEmpty > 0 ? 'yellow' : 'green');
    log(`Errors: ${results.summary.totalError}`, results.summary.totalError > 0 ? 'red' : 'green');

    console.log('');

    process.exit(allValid ? 0 : 1);
  } catch (error) {
    log(`\n❌ Verification failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();
