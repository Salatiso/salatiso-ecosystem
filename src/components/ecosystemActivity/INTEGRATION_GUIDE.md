/**
 * INTEGRATION EXAMPLE
 * How to integrate EcosystemActivityWidget into the Salatiso Hub Dashboard
 * 
 * This file shows the recommended way to add the activity widget to your dashboard.
 * Copy this pattern to integrate into any page in any app.
 */

// ============================================================================
// EXAMPLE 1: Simple Integration (Compact Mode)
// ============================================================================

import React from 'react';
import { EcosystemActivityWidget } from '@/components/ecosystemActivity/EcosystemActivityWidget';

export default function HubDashboard() {
  return (
    <div className="space-y-8">
      {/* Existing dashboard content */}
      <h1 className="text-3xl font-bold">Hub Dashboard</h1>

      {/* Add the activity widget in compact mode */}
      <section>
        <EcosystemActivityWidget
          mode="compact"
          limit={4}
          showStats={true}
          showFilters={false}
        />
      </section>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Full Integration with Routing
// ============================================================================

import React, { useState } from 'react';
import { EcosystemActivityWidget } from '@/components/ecosystemActivity/EcosystemActivityWidget';
import { Activity } from '@/services/EcosystemActivityService';

export default function HubDashboardFull() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    // You can add additional logic here:
    // - Show activity details in a modal
    // - Track analytics
    // - Customize deep linking behavior
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left sidebar - Navigation */}
      <div className="lg:col-span-1">
        {/* Navigation menu */}
      </div>

      {/* Main content area */}
      <div className="lg:col-span-3 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hub Dashboard</h1>
          <p className="text-gray-600">Welcome back to your ecosystem hub</p>
        </div>

        {/* Activity widget in full mode */}
        <EcosystemActivityWidget
          mode="full"
          limit={20}
          showStats={true}
          showFilters={true}
          onActivityClick={handleActivityClick}
        />

        {/* Activity detail view (optional) */}
        {selectedActivity && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900">
              {selectedActivity.activityTitle}
            </h3>
            <p className="text-blue-800 mt-2">
              {selectedActivity.activityDescription}
            </p>
            <button className="mt-3 text-blue-600 hover:text-blue-800 font-medium">
              View in {selectedActivity.sourceApp}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: With Activity Logging (Logging Activities)
// ============================================================================

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { EcosystemActivityWidget } from '@/components/ecosystemActivity/EcosystemActivityWidget';
import { activityService, ActivityCategory, ActivityPriority } from '@/services/EcosystemActivityService';

export default function HubDashboardWithLogging() {
  const { user } = useAuth();

  /**
   * Example: Log an activity when user takes action
   */
  const handleCreateProject = async (projectName: string) => {
    try {
      // Create project logic here...

      // Log activity to ecosystem
      await activityService.logActivity(user?.uid, {
        sourceApp: 'Hub',
        activityType: 'project_created',
        activityTitle: `Created project "${projectName}"`,
        activityDescription: `You started a new project called ${projectName}`,
        activityIcon: '📁',
        appIcon: '🏠',
        appColor: '#3B82F6',
        deepLink: `/hub/projects/${projectName}`,
        category: 'business' as ActivityCategory,
        priority: 'medium' as ActivityPriority,
        visibility: 'private',
        data: {
          projectName,
          timestamp: new Date().toISOString(),
        },
      });

      console.log('✅ Project created and activity logged');
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Hub Dashboard</h1>

      {/* Create project button */}
      <button
        onClick={() => handleCreateProject('My Awesome Project')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Create Project
      </button>

      {/* Activity widget - updates automatically when activity is logged */}
      <EcosystemActivityWidget
        mode="full"
        showStats={true}
      />
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Landing in Existing Dashboard File
// ============================================================================

/**
 * If you already have a dashboard file at:
 * src/pages/intranet/simple-dashboard.tsx
 * 
 * Follow this pattern to add the widget:
 */

// At the top of your file, add the import:
import { EcosystemActivityWidget } from '@/components/ecosystemActivity/EcosystemActivityWidget';

// In your dashboard JSX, add the widget component:
export default function SimpleDashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Your existing dashboard content */}

      {/* Add this somewhere in your layout - typically below key metrics */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <EcosystemActivityWidget
          mode="compact"
          limit={5}
          showStats={true}
          showFilters={false}
        />
      </section>
    </div>
  );
}

// ============================================================================
// INTEGRATION CHECKLIST
// ============================================================================

/**
 * 1. ✅ Import the component:
 *    import { EcosystemActivityWidget } from '@/components/ecosystemActivity/EcosystemActivityWidget';
 *
 * 2. ✅ Ensure AuthContext is set up (for user authentication):
 *    The widget uses useAuth() hook to get current user
 *
 * 3. ✅ Ensure Firebase is configured:
 *    Widget uses `db` from '@/lib/firebase' for Firestore
 *
 * 4. ✅ Choose mode:
 *    - mode="compact" for dashboard cards (4 activities)
 *    - mode="full" for detail pages (all activities with filters)
 *
 * 5. ✅ Set props:
 *    - limit: How many activities to show (default 10)
 *    - showStats: Show statistics cards (default true)
 *    - showFilters: Show filter UI (default true)
 *    - initialFilters: Start with pre-applied filters (optional)
 *    - onActivityClick: Handle clicks (optional)
 *
 * 6. ✅ Test:
 *    - Log in as a user
 *    - Navigate to dashboard
 *    - Widget should load with existing activities
 *    - Create an activity from another app
 *    - Widget should update in real-time (< 500ms)
 *
 * 7. ✅ Deploy:
 *    - Run: npm run build
 *    - Deploy: firebase deploy
 */

// ============================================================================
// LOGGING ACTIVITIES FROM YOUR APP
// ============================================================================

/**
 * Every app should log activities when users perform key actions.
 * Here's a template for BizHelp as an example:
 */

// In BizHelp: src/pages/projects/create.tsx
import { activityService } from '@/services/EcosystemActivityService';

async function createNewProject(projectData) {
  try {
    // 1. Create project in your app
    const projectRef = await db.collection('bizhelp').add(projectData);

    // 2. Log activity to ecosystem
    await activityService.logActivity(user?.uid, {
      sourceApp: 'BizHelp',
      activityType: 'project_created',
      activityTitle: `Created project "${projectData.name}"`,
      activityDescription: `New business project started: ${projectData.name}`,
      activityIcon: '📂',
      appIcon: '💼',
      appColor: '#EC4899',
      deepLink: `/bizhelp/projects/${projectRef.id}`,
      category: 'business',
      priority: 'high',
      visibility: 'private',
      data: {
        projectId: projectRef.id,
        projectName: projectData.name,
        clientName: projectData.clientName,
      },
    });

    return projectRef.id;
  } catch (error) {
    console.error('❌ Failed to create project:', error);
    throw error;
  }
}

// ============================================================================
// ACTIVITY TYPES BY APP (Quick Reference)
// ============================================================================

/**
 * LifeSync Activities:
 *   - 'profile_updated'
 *   - 'verification_completed'
 *   - 'badge_earned'
 *   - 'trust_score_changed'
 *
 * BizHelp Activities:
 *   - 'project_created'
 *   - 'client_added'
 *   - 'milestone_completed'
 *   - 'team_member_joined'
 *   - 'revenue_recorded'
 *
 * FinHelp Activities:
 *   - 'payment_received'
 *   - 'budget_created'
 *   - 'financial_goal_created'
 *   - 'financial_alert'
 *
 * SafetyHelp Activities:
 *   - 'incident_reported'
 *   - 'training_completed'
 *   - 'protocol_updated'
 *   - 'safety_drill_executed'
 *
 * PigeeBack Activities:
 *   - 'ride_offered'
 *   - 'booking_confirmed'
 *   - 'rating_given'
 *   - 'property_listed'
 *
 * Ekhaya Activities:
 *   - 'group_joined'
 *   - 'event_created'
 *   - 'event_attended'
 *   - 'connection_made'
 *
 * DocHelp Activities:
 *   - 'document_created'
 *   - 'document_shared'
 *   - 'document_version_updated'
 *
 * Sazi Academy Activities:
 *   - 'course_enrolled'
 *   - 'lesson_completed'
 *   - 'certificate_earned'
 *   - 'quiz_passed'
 */

// ============================================================================
// FIRESTORE RULES REQUIRED
// ============================================================================

/**
 * Add these rules to your firestore.rules to enable activity access:
 *
 * // Activities collection - users can read their own activities
 * match /activities/{userId}/{document=**} {
 *   allow read: if request.auth.uid == userId;
 *   allow create: if request.auth.uid == userId;
 *   allow update, delete: if request.auth.uid == userId;
 * }
 */

export {};
