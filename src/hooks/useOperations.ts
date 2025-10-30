import { useState, useEffect, useCallback } from 'react';
import { useProfessional } from '@/contexts/professional/ProfessionalContext';
import { OperationsService, Project, Task, Milestone, Risk } from '@/services/operations.service';

export const useOperations = () => {
  const { state, dispatch } = useProfessional();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState<OperationsService | null>(null);

  // Initialize service with company ID
  useEffect(() => {
    if (state.company?.id && !service) {
      setService(new OperationsService(state.company.id));
    }
  }, [state.company?.id, service]);

  const operations = state.operations;

  // Project Management
  const loadProjects = useCallback(async () => {
    if (!service) return;

    setLoading(true);
    setError(null);

    try {
      const projects = await service.getProjects();
      dispatch({
        type: 'UPDATE_OPERATIONS',
        data: {
          ...operations,
          projects
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  }, [service, operations, dispatch]);

  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>) => {
    if (!service) throw new Error('Service not initialized');

    setLoading(true);
    setError(null);

    try {
      const projectId = await service.createProject(projectData);
      await loadProjects(); // Reload to get updated list
      return projectId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, loadProjects]);

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    if (!service) throw new Error('Service not initialized');

    setLoading(true);
    setError(null);

    try {
      await service.updateProject(projectId, updates);
      await loadProjects(); // Reload to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, loadProjects]);

  const deleteProject = useCallback(async (projectId: string) => {
    if (!service) throw new Error('Service not initialized');

    setLoading(true);
    setError(null);

    try {
      await service.deleteProject(projectId);
      await loadProjects(); // Reload to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, loadProjects]);

  // Task Management
  const loadTasks = useCallback(async (projectId?: string) => {
    if (!service) return;

    setLoading(true);
    setError(null);

    try {
      const tasks = await service.getTasks(projectId);
      dispatch({
        type: 'UPDATE_OPERATIONS',
        payload: {
          ...operations,
          tasks
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [service, operations, dispatch]);

  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!service) throw new Error('Service not initialized');

    setLoading(true);
    setError(null);

    try {
      const taskId = await service.createTask(taskData);
      await loadTasks(); // Reload to get updated list
      return taskId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, loadTasks]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!service) throw new Error('Service not initialized');

    setLoading(true);
    setError(null);

    try {
      await service.updateTask(taskId, updates);
      await loadTasks(); // Reload to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, loadTasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!service) throw new Error('Service not initialized');

    setLoading(true);
    setError(null);

    try {
      await service.deleteTask(taskId);
      await loadTasks(); // Reload to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, loadTasks]);

  // Milestone Management
  const loadMilestones = useCallback(async (projectId?: string) => {
    if (!service) return;

    setLoading(true);
    setError(null);

    try {
      const milestones = await service.getMilestones(projectId);
      dispatch({
        type: 'UPDATE_OPERATIONS',
        payload: {
          ...operations,
          milestones
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load milestones');
      console.error('Error loading milestones:', err);
    } finally {
      setLoading(false);
    }
  }, [service, operations, dispatch]);

  const createMilestone = useCallback(async (milestoneData: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!service) throw new Error('Service not initialized');

    setLoading(true);
    setError(null);

    try {
      const milestoneId = await service.createMilestone(milestoneData);
      await loadMilestones(); // Reload to get updated list
      return milestoneId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create milestone';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, loadMilestones]);

  const updateMilestone = useCallback(async (milestoneId: string, updates: Partial<Milestone>) => {
    if (!service) throw new Error('Service not initialized');

    setLoading(true);
    setError(null);

    try {
      await service.updateMilestone(milestoneId, updates);
      await loadMilestones(); // Reload to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update milestone';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, loadMilestones]);

  const deleteMilestone = useCallback(async (milestoneId: string) => {
    if (!service) throw new Error('Service not initialized');

    setLoading(true);
    setError(null);

    try {
      await service.deleteMilestone(milestoneId);
      await loadMilestones(); // Reload to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete milestone';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, loadMilestones]);

  // Risk Management
  const loadRisks = useCallback(async (projectId?: string) => {
    if (!service) return;

    setLoading(true);
    setError(null);

    try {
      const risks = await service.getRisks(projectId);
      dispatch({
        type: 'UPDATE_OPERATIONS',
        payload: {
          ...operations,
          risks
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load risks');
      console.error('Error loading risks:', err);
    } finally {
      setLoading(false);
    }
  }, [service, operations, dispatch]);

  const createRisk = useCallback(async (riskData: Omit<Risk, 'id' | 'riskScore' | 'createdAt' | 'updatedAt'>) => {
    if (!service) throw new Error('Service not initialized');

    setLoading(true);
    setError(null);

    try {
      const riskId = await service.createRisk(riskData);
      await loadRisks(); // Reload to get updated list
      return riskId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create risk';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, loadRisks]);

  const updateRisk = useCallback(async (riskId: string, updates: Partial<Risk>) => {
    if (!service) throw new Error('Service not initialized');

    setLoading(true);
    setError(null);

    try {
      await service.updateRisk(riskId, updates);
      await loadRisks(); // Reload to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update risk';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, loadRisks]);

  const deleteRisk = useCallback(async (riskId: string) => {
    if (!service) throw new Error('Service not initialized');

    setLoading(true);
    setError(null);

    try {
      await service.deleteRisk(riskId);
      await loadRisks(); // Reload to get updated list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete risk';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [service, loadRisks]);

  return {
    operations,
    loading,
    error,
    // Project methods
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    // Task methods
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    // Milestone methods
    loadMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    // Risk methods
    loadRisks,
    createRisk,
    updateRisk,
    deleteRisk
  };
};