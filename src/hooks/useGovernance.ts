import { useState, useEffect, useCallback } from 'react';
import { useProfessional } from '../contexts/professional/ProfessionalContext';
import { createGovernanceService } from '../services/governance.service';
import type {
  CompanyProfile,
  Policy,
  PolicyAcknowledgment,
  ComplianceRecord,
  BoardMember,
  BoardMeeting
} from '../contexts/professional/ProfessionalContext';

/**
 * Custom hook for Governance module functionality
 * Provides methods to manage company governance data
 */
export const useGovernance = () => {
  const { state, dispatch, updateCompanyProfile, logAuditEvent } = useProfessional();
  const [governanceService, setGovernanceService] = useState<ReturnType<typeof createGovernanceService> | null>(null);

  // Initialize governance service when company is available
  useEffect(() => {
    if (state.company?.id && !governanceService) {
      setGovernanceService(createGovernanceService(state.company.id));
    }
  }, [state.company?.id, governanceService]);

  // Company Profile Management
  const loadCompanyProfile = useCallback(async () => {
    if (!governanceService) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'company', loading: true });
      const profile = await governanceService.getCompanyProfile();
      if (profile) {
        dispatch({ type: 'SET_COMPANY', company: profile });
      }
    } catch (error) {
      console.error('Error loading company profile:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to load company profile' });
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'company', loading: false });
    }
  }, [governanceService, dispatch]);

  const createCompanyProfile = useCallback(async (profileData: Omit<CompanyProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!governanceService || !state.company?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'company', loading: true });
      await governanceService.createCompanyProfile(profileData);
      await logAuditEvent('create', 'company', state.company.id, profileData);

      // Reload company data
      await loadCompanyProfile();
    } catch (error) {
      console.error('Error creating company profile:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to create company profile' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'company', loading: false });
    }
  }, [governanceService, state.company?.id, dispatch, logAuditEvent, loadCompanyProfile]);

  const updateCompanyProfileData = useCallback(async (updates: Partial<CompanyProfile>) => {
    if (!state.company?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'company', loading: true });
      await updateCompanyProfile(state.company.id, updates);
      await logAuditEvent('update', 'company', state.company.id, updates);

      // Reload company data
      await loadCompanyProfile();
    } catch (error) {
      console.error('Error updating company profile:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to update company profile' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'company', loading: false });
    }
  }, [state.company?.id, dispatch, updateCompanyProfile, logAuditEvent, loadCompanyProfile]);

  // Constitution Management
  const getConstitution = useCallback(async () => {
    if (!governanceService) return null;

    try {
      return await governanceService.getConstitution();
    } catch (error) {
      console.error('Error getting constitution:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to get constitution' });
      return null;
    }
  }, [governanceService, dispatch]);

  const updateConstitution = useCallback(async (content: string, approvedBy: string[]) => {
    if (!governanceService || !state.company?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      await governanceService.updateConstitution(content, approvedBy);
      await logAuditEvent('update', 'constitution', state.company.id, { content, approvedBy });

      // Update local state
      dispatch({
        type: 'UPDATE_GOVERNANCE',
        data: {
          constitution: {
            content,
            lastUpdated: new Date(),
            approvedBy
          }
        }
      });
    } catch (error) {
      console.error('Error updating constitution:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to update constitution' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, state.company?.id, dispatch, logAuditEvent]);

  // Policy Management
  const loadPolicies = useCallback(async () => {
    if (!governanceService) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      const policies = await governanceService.getPolicies();
      dispatch({
        type: 'UPDATE_GOVERNANCE',
        data: { policies }
      });
    } catch (error) {
      console.error('Error loading policies:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to load policies' });
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, dispatch]);

  const createPolicy = useCallback(async (policyData: Omit<Policy, 'id'>) => {
    if (!governanceService || !state.company?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      const policyId = await governanceService.createPolicy(policyData);
      await logAuditEvent('create', 'policy', policyId, policyData);

      // Reload policies
      await loadPolicies();
      return policyId;
    } catch (error) {
      console.error('Error creating policy:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to create policy' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, state.company?.id, dispatch, logAuditEvent, loadPolicies]);

  const updatePolicy = useCallback(async (policyId: string, updates: Partial<Policy>) => {
    if (!governanceService || !state.company?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      await governanceService.updatePolicy(policyId, updates);
      await logAuditEvent('update', 'policy', policyId, updates);

      // Reload policies
      await loadPolicies();
    } catch (error) {
      console.error('Error updating policy:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to update policy' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, state.company?.id, dispatch, logAuditEvent, loadPolicies]);

  const acknowledgePolicy = useCallback(async (
    policyId: string,
    userId: string,
    userName: string,
    version: number
  ) => {
    if (!governanceService || !state.company?.id) return;

    try {
      await governanceService.acknowledgePolicy(policyId, userId, userName, version);
      await logAuditEvent('acknowledge', 'policy', policyId, { userId, userName, version });

      // Reload policies to get updated acknowledgments
      await loadPolicies();
    } catch (error) {
      console.error('Error acknowledging policy:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to acknowledge policy' });
      throw error;
    }
  }, [governanceService, state.company?.id, dispatch, logAuditEvent, loadPolicies]);

  // Compliance Management
  const loadComplianceRecords = useCallback(async () => {
    if (!governanceService) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      const compliance = await governanceService.getComplianceRecords();
      dispatch({
        type: 'UPDATE_GOVERNANCE',
        data: { compliance }
      });
    } catch (error) {
      console.error('Error loading compliance records:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to load compliance records' });
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, dispatch]);

  const createComplianceRecord = useCallback(async (recordData: Omit<ComplianceRecord, 'id'>) => {
    if (!governanceService || !state.company?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      const recordId = await governanceService.createComplianceRecord(recordData);
      await logAuditEvent('create', 'compliance', recordId, recordData);

      // Reload compliance records
      await loadComplianceRecords();
      return recordId;
    } catch (error) {
      console.error('Error creating compliance record:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to create compliance record' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, state.company?.id, dispatch, logAuditEvent, loadComplianceRecords]);

  const updateComplianceRecord = useCallback(async (recordId: string, updates: Partial<ComplianceRecord>) => {
    if (!governanceService || !state.company?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      await governanceService.updateComplianceRecord(recordId, updates);
      await logAuditEvent('update', 'compliance', recordId, updates);

      // Reload compliance records
      await loadComplianceRecords();
    } catch (error) {
      console.error('Error updating compliance record:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to update compliance record' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, state.company?.id, dispatch, logAuditEvent, loadComplianceRecords]);

  // Board Management
  const loadBoardMembers = useCallback(async () => {
    if (!governanceService) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      const board = await governanceService.getBoardMembers();
      dispatch({
        type: 'UPDATE_GOVERNANCE',
        data: { board }
      });
    } catch (error) {
      console.error('Error loading board members:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to load board members' });
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, dispatch]);

  const addBoardMember = useCallback(async (memberData: Omit<BoardMember, 'id'>) => {
    if (!governanceService || !state.company?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      const memberId = await governanceService.addBoardMember(memberData);
      await logAuditEvent('create', 'board_member', memberId, memberData);

      // Reload board members
      await loadBoardMembers();
      return memberId;
    } catch (error) {
      console.error('Error adding board member:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to add board member' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, state.company?.id, dispatch, logAuditEvent, loadBoardMembers]);

  const updateBoardMember = useCallback(async (memberId: string, updates: Partial<BoardMember>) => {
    if (!governanceService || !state.company?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      await governanceService.updateBoardMember(memberId, updates);
      await logAuditEvent('update', 'board_member', memberId, updates);

      // Reload board members
      await loadBoardMembers();
    } catch (error) {
      console.error('Error updating board member:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to update board member' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, state.company?.id, dispatch, logAuditEvent, loadBoardMembers]);

  // Meeting Management
  const loadBoardMeetings = useCallback(async () => {
    if (!governanceService) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      const meetings = await governanceService.getBoardMeetings();
      dispatch({
        type: 'UPDATE_GOVERNANCE',
        data: { meetings }
      });
    } catch (error) {
      console.error('Error loading board meetings:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to load board meetings' });
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, dispatch]);

  const createBoardMeeting = useCallback(async (meetingData: Omit<BoardMeeting, 'id'>) => {
    if (!governanceService || !state.company?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      const meetingId = await governanceService.createBoardMeeting(meetingData);
      await logAuditEvent('create', 'board_meeting', meetingId, meetingData);

      // Reload meetings
      await loadBoardMeetings();
      return meetingId;
    } catch (error) {
      console.error('Error creating board meeting:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to create board meeting' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, state.company?.id, dispatch, logAuditEvent, loadBoardMeetings]);

  const updateBoardMeeting = useCallback(async (meetingId: string, updates: Partial<BoardMeeting>) => {
    if (!governanceService || !state.company?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: true });
      await governanceService.updateBoardMeeting(meetingId, updates);
      await logAuditEvent('update', 'board_meeting', meetingId, updates);

      // Reload meetings
      await loadBoardMeetings();
    } catch (error) {
      console.error('Error updating board meeting:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to update board meeting' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'governance', loading: false });
    }
  }, [governanceService, state.company?.id, dispatch, logAuditEvent, loadBoardMeetings]);

  // Load all governance data
  const loadAllGovernanceData = useCallback(async () => {
    await Promise.all([
      loadCompanyProfile(),
      loadPolicies(),
      loadComplianceRecords(),
      loadBoardMembers(),
      loadBoardMeetings()
    ]);
  }, [loadCompanyProfile, loadPolicies, loadComplianceRecords, loadBoardMembers, loadBoardMeetings]);

  return {
    // State
    company: state.company,
    governance: state.governance,
    loading: state.loading.governance,
    error: state.error,

    // Company Profile
    loadCompanyProfile,
    createCompanyProfile,
    updateCompanyProfile: updateCompanyProfileData,

    // Constitution
    getConstitution,
    updateConstitution,

    // Policies
    loadPolicies,
    createPolicy,
    updatePolicy,
    acknowledgePolicy,

    // Compliance
    loadComplianceRecords,
    createComplianceRecord,
    updateComplianceRecord,

    // Board
    loadBoardMembers,
    addBoardMember,
    updateBoardMember,

    // Meetings
    loadBoardMeetings,
    createBoardMeeting,
    updateBoardMeeting,

    // Bulk operations
    loadAllGovernanceData
  };
};