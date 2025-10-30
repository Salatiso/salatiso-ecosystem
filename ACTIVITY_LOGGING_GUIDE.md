# Activity Logging Implementation Guide - Phase 2

**Target:** Add activity logging to all 16 Professional Tab components
**Phase:** 2 (Weeks 3-4)
**Status:** 🟢 IMPLEMENTATION STARTED

---

## Quick Start - 3 Simple Steps

### Step 1: Import the Hook (Copy-Paste)
```typescript
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import { ACTIVITY_TYPES } from '@/services/bizHelpIntegration';
```

### Step 2: Get the Logger in Your Component
```typescript
export const YourComponent = ({ companyId }: Props) => {
  const { activityLogger } = useBizHelpIntegration(companyId);
  
  // Rest of component...
};
```

### Step 3: Log When Users Take Actions
```typescript
const handleCreateItem = async (data) => {
  try {
    const result = await createItem(data);
    
    // Log the activity
    await activityLogger?.log('item_created', {
      itemId: result.id,
      itemName: result.name,
    });
    
    toast.success('Item created!');
  } catch (error) {
    toast.error('Failed to create');
  }
};
```

**That's it!** 🎉

---

## Component-by-Component Implementation

### GOVERNANCE COMPONENTS

#### 1. CompanyProfileCard.tsx

**Current Implementation:**
```typescript
// Check if already has useBizHelpIntegration
```

**Add Activity Logging:**
```typescript
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';

export const CompanyProfileCard = ({ companyId }: Props) => {
  const { activityLogger } = useBizHelpIntegration(companyId);
  
  const handleSaveProfile = async (profileData) => {
    try {
      const updated = await updateProfile(profileData);
      
      await activityLogger?.log('company_profile_updated', {
        companyName: profileData.companyName,
        entityType: profileData.entityType,
        changes: detectChanges(oldData, profileData)
      });
      
      toast.success('Profile updated and logged');
    } catch (error) {
      toast.error('Failed to update');
    }
  };
};
```

**Activities to Log:**
- `company_profile_created` - New company profile
- `company_profile_updated` - Profile changes
- `registration_info_updated` - CIPC details changed
- `entity_type_changed` - Business entity type changed

---

#### 2. ComplianceTracker.tsx

**Add Activity Logging:**
```typescript
const handleCompleteObligation = async (obligationId) => {
  try {
    const result = await markCompleted(obligationId);
    
    await activityLogger?.log('compliance_completed', {
      obligationId,
      obligationName: obligation.name,
      completionDate: new Date(),
      proofDocuments: result.documents
    });
    
    toast.success('Compliance obligation marked complete');
  } catch (error) {
    toast.error('Failed to mark complete');
  }
};
```

**Activities to Log:**
- `compliance_obligation_created` - New obligation
- `compliance_status_updated` - Status change
- `compliance_completed` - Obligation fulfilled
- `compliance_overdue_alert` - Deadline missed

---

#### 3. DocumentRepository.tsx

**Add Activity Logging:**
```typescript
const handleUploadDocument = async (file, metadata) => {
  try {
    const doc = await uploadDocument(file, metadata);
    
    await activityLogger?.log('governance_document_uploaded', {
      documentId: doc.id,
      documentName: doc.name,
      documentType: metadata.type,
      fileSize: file.size,
      uploadedAt: new Date()
    });
    
    toast.success('Document uploaded');
  } catch (error) {
    toast.error('Upload failed');
  }
};
```

**Activities to Log:**
- `governance_document_uploaded` - New document
- `document_version_created` - Document versioned
- `document_access_granted` - Access shared
- `document_deleted` - Document removed

---

#### 4. BoardRegistry.tsx

**Add Activity Logging:**
```typescript
const handleAddBoardMember = async (memberData) => {
  try {
    const member = await addMember(memberData);
    
    await activityLogger?.log('board_member_added', {
      memberId: member.id,
      memberName: member.name,
      role: member.role,
      appointmentDate: memberData.appointmentDate
    });
    
    toast.success('Board member added');
  } catch (error) {
    toast.error('Failed to add');
  }
};
```

**Activities to Log:**
- `board_member_added` - New member
- `board_member_updated` - Member details changed
- `board_role_changed` - Role assignment
- `board_member_removed` - Member removed

---

#### 5. MeetingMinutes.tsx

**Add Activity Logging:**
```typescript
const handleSaveMeeting = async (meetingData) => {
  try {
    const meeting = await saveMeeting(meetingData);
    
    await activityLogger?.log('meeting_minutes_recorded', {
      meetingId: meeting.id,
      meetingDate: meetingData.date,
      attendees: meetingData.attendees.length,
      actionItems: meetingData.actionItems.length,
      decisionsRecorded: meetingData.resolutions.length
    });
    
    toast.success('Meeting minutes saved');
  } catch (error) {
    toast.error('Failed to save');
  }
};
```

**Activities to Log:**
- `meeting_scheduled` - New meeting
- `meeting_minutes_recorded` - Minutes documented
- `action_item_assigned` - Action item created
- `resolution_documented` - Decision recorded

---

### HUMAN CAPITAL COMPONENTS

#### 6. OrgChart.tsx

**Add Activity Logging:**
```typescript
const handleUpdateStructure = async (newStructure) => {
  try {
    const updated = await updateOrgStructure(newStructure);
    
    await activityLogger?.log('org_structure_updated', {
      changeType: 'hierarchy_update',
      affectedPositions: updated.positions.length,
      timestamp: new Date()
    });
    
    toast.success('Organization structure updated');
  } catch (error) {
    toast.error('Update failed');
  }
};
```

**Activities to Log:**
- `org_structure_updated` - Structure changed
- `reporting_line_changed` - Manager changed
- `team_hierarchy_modified` - Hierarchy updated

---

#### 7. RoleDefinition.tsx

**Add Activity Logging:**
```typescript
const handleCreateRole = async (roleData) => {
  try {
    const role = await createRole(roleData);
    
    await activityLogger?.log('role_created', {
      roleId: role.id,
      roleName: role.name,
      level: role.level,
      responsibilities: role.responsibilities.length
    });
    
    toast.success('Role created');
  } catch (error) {
    toast.error('Failed to create');
  }
};
```

**Activities to Log:**
- `role_created` - New role
- `role_updated` - Role changes
- `competency_added` - Competency added
- `role_archived` - Role deactivated

---

#### 8. ContractManager.tsx

**Add Activity Logging:**
```typescript
const handleSignContract = async (contractId, signatureData) => {
  try {
    const contract = await signContract(contractId, signatureData);
    
    await activityLogger?.log('contract_signed', {
      contractId,
      contractType: contract.type,
      signedDate: new Date(),
      signedBy: signatureData.signedBy,
      status: 'active'
    });
    
    toast.success('Contract signed');
  } catch (error) {
    toast.error('Signing failed');
  }
};
```

**Activities to Log:**
- `contract_created` - New contract
- `contract_updated` - Changes made
- `contract_signed` - Signed
- `contract_expired` - Expired
- `contract_renewed` - Renewed

---

#### 9. PerformanceReview.tsx

**Add Activity Logging:**
```typescript
const handleSubmitReview = async (reviewData) => {
  try {
    const review = await submitReview(reviewData);
    
    await activityLogger?.log('performance_review_submitted', {
      reviewId: review.id,
      employeeId: review.employeeId,
      rating: review.rating,
      period: reviewData.period,
      submittedDate: new Date()
    });
    
    toast.success('Review submitted');
  } catch (error) {
    toast.error('Submission failed');
  }
};
```

**Activities to Log:**
- `performance_review_created` - New review started
- `performance_review_submitted` - Review completed
- `rating_assigned` - Rating given
- `feedback_provided` - Feedback added

---

#### 10. DevelopmentPlans.tsx

**Add Activity Logging:**
```typescript
const handleCreatePlan = async (planData) => {
  try {
    const plan = await createPlan(planData);
    
    await activityLogger?.log('development_plan_created', {
      planId: plan.id,
      employeeId: plan.employeeId,
      skillTargets: plan.skills.length,
      timeframe: plan.timeframe,
      createdDate: new Date()
    });
    
    toast.success('Development plan created');
  } catch (error) {
    toast.error('Failed to create');
  }
};
```

**Activities to Log:**
- `development_plan_created` - New plan
- `skill_target_set` - Skill goal added
- `training_assigned` - Training added
- `milestone_achieved` - Goal reached

---

### OPERATIONS COMPONENTS

#### 11. ProjectCanvas.tsx

**Add Activity Logging:**
```typescript
const handleCreateProject = async (projectData) => {
  try {
    const project = await createProject(projectData);
    
    await activityLogger?.log('project_created', {
      projectId: project.id,
      projectName: project.name,
      startDate: projectData.startDate,
      budget: projectData.budget,
      status: 'planning'
    });
    
    toast.success('Project created');
  } catch (error) {
    toast.error('Failed to create');
  }
};
```

**Activities to Log:**
- `project_created` - New project
- `project_updated` - Changes made
- `project_status_changed` - Status updated
- `project_completed` - Project delivered
- `project_archived` - Archived

---

#### 12. TaskTracker.tsx

**Add Activity Logging:**
```typescript
const handleStatusChange = async (taskId, newStatus) => {
  try {
    const oldStatus = getTaskStatus(taskId);
    const task = await updateTaskStatus(taskId, newStatus);
    
    await activityLogger?.log('task_status_changed', {
      taskId,
      oldStatus,
      newStatus,
      changedDate: new Date()
    });
    
    toast.success(`Task moved to ${newStatus}`);
  } catch (error) {
    toast.error('Status update failed');
  }
};
```

**Activities to Log:**
- `task_created` - New task
- `task_assigned` - Assigned to user
- `task_status_changed` - Status updated
- `task_completed` - Finished
- `task_priority_changed` - Priority updated

---

#### 13. MilestoneTimeline.tsx

**Add Activity Logging:**
```typescript
const handleCompleteMilestone = async (milestoneId) => {
  try {
    const milestone = await completeMilestone(milestoneId);
    
    await activityLogger?.log('milestone_completed', {
      milestoneId,
      milestoneName: milestone.name,
      projectId: milestone.projectId,
      completedDate: new Date(),
      onTime: !milestone.dueDate || new Date() <= milestone.dueDate
    });
    
    toast.success('Milestone completed!');
  } catch (error) {
    toast.error('Failed to complete');
  }
};
```

**Activities to Log:**
- `milestone_created` - New milestone
- `milestone_date_updated` - Date changed
- `milestone_completed` - Completed
- `milestone_delayed` - Deadline missed

---

#### 14. KnowledgeBaseViewer.tsx

**Add Activity Logging:**
```typescript
const handleUploadArticle = async (articleData, file) => {
  try {
    const article = await uploadArticle(articleData, file);
    
    await activityLogger?.log('knowledge_article_uploaded', {
      articleId: article.id,
      articleTitle: article.title,
      category: article.category,
      fileSize: file.size,
      uploadedDate: new Date()
    });
    
    toast.success('Article uploaded');
  } catch (error) {
    toast.error('Upload failed');
  }
};
```

**Activities to Log:**
- `knowledge_article_uploaded` - New article
- `documentation_version_created` - Version update
- `knowledge_search_performed` - Search conducted
- `documentation_accessed` - Article viewed

---

#### 15. RiskRegister.tsx

**Add Activity Logging:**
```typescript
const handleIdentifyRisk = async (riskData) => {
  try {
    const risk = await createRisk(riskData);
    
    await activityLogger?.log('risk_identified', {
      riskId: risk.id,
      riskName: risk.name,
      probability: risk.probability,
      impact: risk.impact,
      identifiedDate: new Date()
    });
    
    toast.success('Risk registered');
  } catch (error) {
    toast.error('Failed to register');
  }
};
```

**Activities to Log:**
- `risk_identified` - New risk
- `risk_probability_updated` - Probability changed
- `risk_impact_updated` - Impact reassessed
- `mitigation_plan_created` - Plan added
- `risk_closed` - Risk resolved

---

#### 16. IncidentReportForm.tsx

**Add Activity Logging:**
```typescript
const handleReportIncident = async (incidentData) => {
  try {
    const incident = await reportIncident(incidentData);
    
    await activityLogger?.log('incident_reported', {
      incidentId: incident.id,
      title: incident.title,
      severity: incidentData.severity,
      reportedDate: new Date(),
      reportedBy: userId,
      affectedAreas: incidentData.affectedAreas.length
    });
    
    toast.success('Incident reported');
  } catch (error) {
    toast.error('Report failed');
  }
};
```

**Activities to Log:**
- `incident_reported` - New incident
- `incident_severity_assigned` - Severity set
- `investigation_started` - Investigation began
- `corrective_action_assigned` - Action assigned
- `incident_resolved` - Resolved

---

## Testing Your Implementation

### Test Template for Each Component

```typescript
describe('ComponentName - Activity Logging', () => {
  it('logs activity when creating item', async () => {
    const { activityLogger } = useBizHelpIntegration('test-company');
    
    const result = await handleCreate(testData);
    
    // Verify activity was logged
    const activities = await getActivities('test-user');
    expect(activities).toContainEqual(
      expect.objectContaining({
        type: 'item_created',
        source: 'MNI',
        companyId: 'test-company'
      })
    );
  });
  
  it('includes correct data in activity log', async () => {
    const result = await handleCreate(testData);
    
    const activities = await getActivities('test-user');
    const activity = activities[activities.length - 1];
    
    expect(activity.data).toEqual(
      expect.objectContaining({
        itemId: result.id,
        itemName: result.name
      })
    );
  });
});
```

---

## Checklist for Each Component

- [ ] Import hook and activity types
- [ ] Get logger in component
- [ ] Identify all CRUD operations
- [ ] Add logging calls to each operation
- [ ] Test activity logging works
- [ ] Verify Firestore collection populated
- [ ] Check activity appears in BizHelp
- [ ] Code review passed
- [ ] Documentation updated
- [ ] Deployed to staging

---

## Common Patterns

### Pattern 1: Create Operation
```typescript
const handleCreate = async (data) => {
  const result = await createItem(data);
  await activityLogger?.log('item_created', { id: result.id, ...result });
};
```

### Pattern 2: Update Operation
```typescript
const handleUpdate = async (id, changes) => {
  const result = await updateItem(id, changes);
  await activityLogger?.log('item_updated', { id, changes });
};
```

### Pattern 3: Status Change
```typescript
const handleStatusChange = async (id, newStatus) => {
  const old = getStatus(id);
  const result = await updateStatus(id, newStatus);
  await activityLogger?.log('item_status_changed', { 
    id, oldStatus: old, newStatus 
  });
};
```

### Pattern 4: Delete Operation
```typescript
const handleDelete = async (id) => {
  const item = getItem(id);
  await deleteItem(id);
  await activityLogger?.log('item_deleted', { id, name: item.name });
};
```

---

## Troubleshooting

### Issue: Activity not logging
**Solution:** Verify:
1. Hook is imported correctly
2. activityLogger is not null
3. Firestore security rules allow write
4. User is authenticated
5. Check browser console for errors

### Issue: Activity not visible in BizHelp
**Solution:** Verify:
1. Activity logged successfully in MNI
2. Activity is in /activities/{userId} collection
3. BizHelp user has read permissions
4. BizHelp is subscribed to activities collection

### Issue: Duplicate activities
**Solution:** 
1. Check if activity logged twice in handler
2. Verify no accidental double-calls
3. Check for retries in error handling

---

## Performance Tips

1. **Batch operations:** Group multiple activities
2. **Use async/await:** Don't block UI
3. **Error handling:** Log failures separately
4. **Debounce:** For rapid-fire events
5. **Filter:** Only log meaningful changes

---

## What's Next

After implementing all 16 components:
1. Create comprehensive test suite
2. Verify bi-directional sync
3. Performance optimization
4. Production deployment
5. Phase 3: Shared Widgets

---

**Let's get logging!** 📝🚀

Questions? Refer to PHASE2_KICKOFF.md or QUICK_REFERENCE_BIZHELP_INTEGRATION.md
