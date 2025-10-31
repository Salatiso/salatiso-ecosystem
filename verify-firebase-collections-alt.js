/**
 * Firebase Collection Verification Script (Alternative - Uses Firebase CLI Auth)
 * 
 * Usage: 
 *   1. Make sure you're logged into Firebase: firebase login
 *   2. Run: node verify-firebase-collections-alt.js
 * 
 * This version uses Firebase CLI authentication instead of service account key
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Try to initialize from environment or service account
let initialized = false;

// First, try to use service account if it exists
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    initialized = true;
  } catch (error) {
    console.log('Service account initialization failed, trying alternative method...');
  }
}

// If not initialized, try using default credentials
if (!initialized) {
  try {
    admin.initializeApp({
      projectId: 'lifecv-d2724', // Replace with your project ID
    });
    initialized = true;
  } catch (error) {
    console.error('❌ Could not initialize Firebase Admin SDK');
    console.error('Please either:');
    console.error('1. Run: firebase login');
    console.error('2. Or download service account key to serviceAccountKey.json');
    process.exit(1);
  }
}

const db = admin.firestore();

// Define expected collections with their required fields
const COLLECTIONS_SCHEMA = {
  // Phase 3 RBAC Collections
  roles: {
    type: 'Phase 3 RBAC',
    required: ['name', 'description', 'permissions', 'hierarchy'],
    optional: ['createdAt', 'updatedAt'],
    minDocs: 3,
  },
  permissions: {
    type: 'Phase 3 RBAC',
    required: ['name', 'description', 'resource', 'action'],
    optional: ['createdAt', 'updatedAt'],
    minDocs: 5,
  },
  content_categories: {
    type: 'Phase 3 RBAC',
    required: ['name', 'description'],
    optional: ['icon', 'order', 'createdAt', 'updatedAt'],
    minDocs: 1,
  },
  user_role_assignments: {
    type: 'Phase 3 RBAC',
    required: ['primaryRole', 'userId'],
    optional: ['secondaryRoles', 'assignedAt', 'assignedBy'],
    minDocs: 0,
  },
  audit_logs: {
    type: 'Phase 3 RBAC',
    required: ['userId', 'action', 'timestamp', 'resource'],
    optional: ['details', 'status'],
    minDocs: 0,
  },
  chatbot_knowledge_base: {
    type: 'Phase 3 RBAC',
    required: ['title', 'category', 'content', 'isActive'],
    optional: ['keywords', 'difficulty', 'views', 'helpful', 'notHelpful', 'lastUpdated', 'createdAt'],
    minDocs: 0,
  },
  chatbot_conversations: {
    type: 'Phase 3 RBAC',
    required: ['userId', 'messages'],
    optional: ['createdAt', 'updatedAt', 'status'],
    minDocs: 0,
  },
  chatbot_settings: {
    type: 'Phase 3 RBAC',
    required: ['enabled', 'theme', 'position'],
    optional: ['language', 'updatedAt'],
    minDocs: 0,
  },

  // Existing Collections
  users: {
    type: 'Existing',
    required: ['email', 'uid'],
    optional: ['displayName', 'photoURL', 'createdAt'],
    minDocs: 0,
  },
  family: {
    type: 'Existing',
    required: ['name'],
    optional: ['description', 'createdAt'],
    minDocs: 0,
  },
  business: {
    type: 'Existing',
    required: ['name'],
    optional: ['description', 'website', 'createdAt'],
    minDocs: 0,
  },
  projects: {
    type: 'Existing',
    required: ['name'],
    optional: ['description', 'status', 'createdAt'],
    minDocs: 0,
  },
  documents: {
    type: 'Existing',
    required: ['title'],
    optional: ['type', 'url', 'createdAt'],
    minDocs: 0,
  },
  analytics: {
    type: 'Existing',
    required: ['userId'],
    optional: ['events', 'timestamp', 'data'],
    minDocs: 0,
  },
  badges: {
    type: 'Existing',
    required: ['name', 'userId'],
    optional: ['icon', 'earnedAt'],
    minDocs: 0,
  },
  consents: {
    type: 'Existing',
    required: ['userId', 'type'],
    optional: ['value', 'timestamp'],
    minDocs: 0,
  },
  video_rooms: {
    type: 'Existing',
    required: ['creatorId', 'name'],
    optional: ['roomId', 'participants', 'createdAt'],
    minDocs: 0,
  },
  contacts: {
    type: 'Existing',
    required: ['name', 'userId'],
    optional: ['email', 'phone', 'address', 'addedBy'],
    minDocs: 0,
  },
};

// Color codes
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
        type: schema.type,
        status: 'EMPTY',
        count: 0,
        issues: ['Collection is empty'],
      };
    }

    const count = snapshot.size;
    const issues = [];
    const documents = [];

    // Check if minimum documents requirement is met
    if (count < schema.minDocs) {
      issues.push(`Expected at least ${schema.minDocs} documents, found ${count}`);
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const docIssues = [];

      // Check required fields
      schema.required.forEach((field) => {
        if (!(field in data)) {
          docIssues.push(`Missing required field: ${field}`);
        } else if (data[field] === undefined || data[field] === null) {
          docIssues.push(`Field ${field} is null or undefined`);
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
        issuesCount: docIssues.length,
      });
    });

    const hasIssues = issues.some((i) => typeof i === 'object' || i.includes('Expected at least'));
    const status = hasIssues ? 'INVALID' : 'VALID';
    const statusColor = status === 'VALID' ? 'green' : 'red';

    log(`  ${status === 'VALID' ? '✅' : '❌'} ${collectionName}: ${count} documents`, statusColor);

    return {
      name: collectionName,
      type: schema.type,
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
      type: schema.type,
      status: 'ERROR',
      count: 0,
      error: error.message,
    };
  }
}

async function verifyAllCollections() {
  logSection('🔍 FIREBASE COLLECTIONS VERIFICATION');

  const results = [];
  const summary = {
    total: 0,
    valid: 0,
    invalid: 0,
    empty: 0,
    error: 0,
  };

  // Group by type
  const phase3 = [];
  const existing = [];

  log('Verifying Phase 3 RBAC Collections:', 'magenta');
  console.log('');

  for (const [collectionName, schema] of Object.entries(COLLECTIONS_SCHEMA)) {
    if (schema.type === 'Phase 3 RBAC') {
      const result = await verifyCollection(collectionName, schema);
      results.push(result);
      phase3.push(result);
      summary.total++;

      if (result.status === 'VALID') summary.valid++;
      else if (result.status === 'INVALID') summary.invalid++;
      else if (result.status === 'EMPTY') summary.empty++;
      else if (result.status === 'ERROR') summary.error++;
    }
  }

  console.log('');
  log('Verifying Existing Collections:', 'magenta');
  console.log('');

  for (const [collectionName, schema] of Object.entries(COLLECTIONS_SCHEMA)) {
    if (schema.type === 'Existing') {
      const result = await verifyCollection(collectionName, schema);
      results.push(result);
      existing.push(result);
      summary.total++;

      if (result.status === 'VALID') summary.valid++;
      else if (result.status === 'INVALID') summary.invalid++;
      else if (result.status === 'EMPTY') summary.empty++;
      else if (result.status === 'ERROR') summary.error++;
    }
  }

  return { results, phase3, existing, summary };
}

function displaySummary(data) {
  logSection('📊 VERIFICATION SUMMARY');

  log('Collection Statistics:', 'cyan');
  log(`  ✅ Valid:   ${data.summary.valid}/${data.summary.total}`, data.summary.valid === data.summary.total ? 'green' : 'yellow');
  log(`  ❌ Invalid: ${data.summary.invalid}/${data.summary.total}`, data.summary.invalid > 0 ? 'red' : 'green');
  log(`  ⚠️  Empty:   ${data.summary.empty}/${data.summary.total}`, data.summary.empty > 0 ? 'yellow' : 'green');
  log(`  💥 Errors:  ${data.summary.error}/${data.summary.total}`, data.summary.error > 0 ? 'red' : 'green');

  logSection('📋 DETAILED RESULTS');

  log('Phase 3 RBAC Collections:', 'magenta');
  data.phase3.forEach((result) => {
    const icon = result.status === 'VALID' ? '✅' : result.status === 'EMPTY' ? '⚠️' : '❌';
    const color = result.status === 'VALID' ? 'green' : result.status === 'EMPTY' ? 'yellow' : 'red';

    log(`\n  ${icon} ${result.name}`, color);
    log(`     Status: ${result.status} | Documents: ${result.count}`);

    if (result.issues && result.issues.length > 0) {
      result.issues.slice(0, 2).forEach((issue) => {
        if (typeof issue === 'object') {
          log(`     ❌ Doc "${issue.docId}": ${issue.problems.join(', ')}`, 'red');
        } else {
          log(`     ⚠️  ${issue}`, 'yellow');
        }
      });
    }
  });

  console.log('');
  log('Existing Collections:', 'magenta');
  data.existing.forEach((result) => {
    const icon = result.status === 'VALID' ? '✅' : result.status === 'EMPTY' ? '⚠️' : '❌';
    const color = result.status === 'VALID' ? 'green' : result.status === 'EMPTY' ? 'yellow' : 'red';

    log(`\n  ${icon} ${result.name}`, color);
    log(`     Status: ${result.status} | Documents: ${result.count}`);

    if (result.issues && result.issues.length > 0) {
      result.issues.slice(0, 2).forEach((issue) => {
        if (typeof issue === 'object') {
          log(`     ❌ Doc "${issue.docId}": ${issue.problems.join(', ')}`, 'red');
        } else {
          log(`     ⚠️  ${issue}`, 'yellow');
        }
      });
    }
  });
}

function displayRecommendations(data) {
  logSection('💡 RECOMMENDATIONS');

  const emptyCount = data.summary.empty;
  const invalidCount = data.summary.invalid;
  const errorCount = data.summary.error;

  if (emptyCount > 0) {
    log(`⚠️  ${emptyCount} collection(s) are empty`, 'yellow');
    data.results
      .filter((r) => r.status === 'EMPTY')
      .forEach((r) => {
        log(`   - ${r.name}`, 'yellow');
      });
    console.log('');
  }

  if (invalidCount > 0) {
    log(`❌ ${invalidCount} collection(s) have structure issues`, 'red');
    data.results
      .filter((r) => r.status === 'INVALID')
      .forEach((r) => {
        log(`   - ${r.name}`, 'red');
      });
    console.log('');
  }

  if (errorCount > 0) {
    log(`💥 ${errorCount} collection(s) encountered errors`, 'red');
    data.results
      .filter((r) => r.status === 'ERROR')
      .forEach((r) => {
        log(`   - ${r.name}: ${r.error}`, 'red');
      });
    console.log('');
  }

  if (emptyCount === 0 && invalidCount === 0 && errorCount === 0) {
    log('✅ All collections are valid and properly structured!', 'green');
    console.log('');
    log('Next Steps:', 'cyan');
    log('  1. KB articles can be populated via: https://lifecv-d2724.web.app/admin/initialize-kb', 'cyan');
    log('  2. Run Phase 3 final deployment: firebase deploy --only hosting', 'cyan');
    log('  3. Proceed to Phase 4: Google Gemini integration', 'cyan');
  }
}

async function main() {
  try {
    log('\n🔍 Starting Firebase Collections Verification...', 'blue');
    log(`📅 Timestamp: ${new Date().toISOString()}\n`, 'blue');

    // Run verification
    const data = await verifyAllCollections();

    // Display results
    displaySummary(data);
    displayRecommendations(data);

    // Save JSON report
    const report = {
      timestamp: new Date().toISOString(),
      summary: data.summary,
      collections: data.results.map((r) => ({
        name: r.name,
        type: r.type,
        status: r.status,
        documentCount: r.count || 0,
        issues: r.issues ? r.issues.length : 0,
      })),
    };

    const reportPath = path.join(__dirname, 'firebase-verification-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`\n📁 JSON Report: ${reportPath}`, 'cyan');

    logSection('✅ VERIFICATION COMPLETE');

    const success = data.summary.invalid === 0 && data.summary.error === 0;
    process.exit(success ? 0 : 1);
  } catch (error) {
    log(`\n❌ Verification failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
