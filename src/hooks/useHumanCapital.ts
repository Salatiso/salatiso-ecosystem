import { useState, useEffect, useCallback } from 'react';
import { useProfessional } from '@/contexts/professional/ProfessionalContext';
import { HumanCapitalService } from '@/services/humanCapital.service';
import {
  RoleDefinition,
  Employee,
  EmploymentContract,
  PerformanceReview,
  DevelopmentPlan,
  SkillInventory
} from '@/contexts/professional/ProfessionalContext';

export const useHumanCapital = () => {
  const { state, dispatch } = useProfessional();
  const [service, setService] = useState<HumanCapitalService | null>(null);

  // Initialize service with company ID
  useEffect(() => {
    if (state.company?.id && !service) {
      setService(new HumanCapitalService(state.company.id));
    }
  }, [state.company?.id, service]);

  // Role Management
  const createRole = useCallback(async (roleData: Omit<RoleDefinition, 'id'>) => {
    if (!service) return;
    try {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: true });
      const newRole = await service.createRole(roleData);
      const newRoles = [...state.humanCapital.roles, newRole];
      dispatch({ type: 'UPDATE_HUMAN_CAPITAL', data: { roles: newRoles } });
      return newRole.id;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to create role' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: false });
    }
  }, [service, state.humanCapital.roles, dispatch]);

  const updateRole = useCallback(async (roleId: string, updates: Partial<RoleDefinition>) => {
    if (!service) return;
    try {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: true });
      await service.updateRole(roleId, updates);
      const updatedRoles = state.humanCapital.roles.map(role =>
        role.id === roleId ? { ...role, ...updates } : role
      );
      dispatch({ type: 'UPDATE_HUMAN_CAPITAL', data: { roles: updatedRoles } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to update role' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: false });
    }
  }, [service, state.humanCapital.roles, dispatch]);

  // Employee Management
  const createEmployee = useCallback(async (employeeData: Omit<Employee, 'id'>) => {
    if (!service) return;
    try {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: true });
      const newEmployee = await service.createEmployee(employeeData);
      const newEmployees = [...state.humanCapital.employees, newEmployee];
      dispatch({ type: 'UPDATE_HUMAN_CAPITAL', data: { employees: newEmployees } });
      return newEmployee.id;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to create employee' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: false });
    }
  }, [service, state.humanCapital.employees, dispatch]);

  const updateEmployee = useCallback(async (employeeId: string, updates: Partial<Employee>) => {
    if (!service) return;
    try {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: true });
      await service.updateEmployee(employeeId, updates);
      const updatedEmployees = state.humanCapital.employees.map(employee =>
        employee.id === employeeId ? { ...employee, ...updates } : employee
      );
      dispatch({ type: 'UPDATE_HUMAN_CAPITAL', data: { employees: updatedEmployees } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to update employee' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: false });
    }
  }, [service, state.humanCapital.employees, dispatch]);

  // Contract Management
  const createContract = useCallback(async (contractData: Omit<EmploymentContract, 'id'>) => {
    if (!service) return;
    try {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: true });
      const newContract = await service.createContract(contractData);
      const newContracts = [...state.humanCapital.contracts, newContract];
      dispatch({ type: 'UPDATE_HUMAN_CAPITAL', data: { contracts: newContracts } });
      return newContract.id;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to create contract' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: false });
    }
  }, [service, state.humanCapital.contracts, dispatch]);

  const updateContract = useCallback(async (contractId: string, updates: Partial<EmploymentContract>) => {
    if (!service) return;
    try {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: true });
      await service.updateContract(contractId, updates);
      const updatedContracts = state.humanCapital.contracts.map(contract =>
        contract.id === contractId ? { ...contract, ...updates } : contract
      );
      dispatch({ type: 'UPDATE_HUMAN_CAPITAL', data: { contracts: updatedContracts } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to update contract' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: false });
    }
  }, [service, state.humanCapital.contracts, dispatch]);

  // Performance Management
  const createPerformanceReview = useCallback(async (reviewData: Omit<PerformanceReview, 'id' | 'createdAt'>) => {
    if (!service) return;
    try {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: true });
      const newReview = await service.createPerformanceReview(reviewData);
      const newReviews = [...state.humanCapital.performance, newReview];
      dispatch({ type: 'UPDATE_HUMAN_CAPITAL', data: { performance: newReviews } });
      return newReview.id;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to create performance review' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: false });
    }
  }, [service, state.humanCapital.performance, dispatch]);

  const updatePerformanceReview = useCallback(async (reviewId: string, updates: Partial<PerformanceReview>) => {
    if (!service) return;
    try {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: true });
      await service.updatePerformanceReview(reviewId, updates);
      const updatedReviews = state.humanCapital.performance.map(review =>
        review.id === reviewId ? { ...review, ...updates } : review
      );
      dispatch({ type: 'UPDATE_HUMAN_CAPITAL', data: { performance: updatedReviews } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to update performance review' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: false });
    }
  }, [service, state.humanCapital.performance, dispatch]);

  // Development Plans
  const createDevelopmentPlan = useCallback(async (planData: Omit<DevelopmentPlan, 'id'>) => {
    if (!service) return;
    try {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: true });
      const newPlan = await service.createDevelopmentPlan(planData);
      const newPlans = [...state.humanCapital.development, newPlan];
      dispatch({ type: 'UPDATE_HUMAN_CAPITAL', data: { development: newPlans } });
      return newPlan.id;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to create development plan' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: false });
    }
  }, [service, state.humanCapital.development, dispatch]);

  const updateDevelopmentPlan = useCallback(async (planId: string, updates: Partial<DevelopmentPlan>) => {
    if (!service) return;
    try {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: true });
      await service.updateDevelopmentPlan(planId, updates);
      const updatedPlans = state.humanCapital.development.map(plan =>
        plan.id === planId ? { ...plan, ...updates } : plan
      );
      dispatch({ type: 'UPDATE_HUMAN_CAPITAL', data: { development: updatedPlans } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to update development plan' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: false });
    }
  }, [service, state.humanCapital.development, dispatch]);

  // Skills Management
  const updateSkillInventory = useCallback(async (employeeId: string, skillsData: SkillInventory) => {
    if (!service) return;
    try {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: true });
      await service.updateSkillsInventory(employeeId, skillsData);
      const updatedSkills = state.humanCapital.skills.map(skill =>
        skill.employeeId === employeeId ? skillsData : skill
      );
      if (!updatedSkills.find(skill => skill.employeeId === employeeId)) {
        updatedSkills.push(skillsData);
      }
      dispatch({ type: 'UPDATE_HUMAN_CAPITAL', data: { skills: updatedSkills } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to update skill inventory' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', module: 'humanCapital', loading: false });
    }
  }, [service, state.humanCapital.skills, dispatch]);

  return {
    // State
    roles: state.humanCapital.roles,
    employees: state.humanCapital.employees,
    contracts: state.humanCapital.contracts,
    performance: state.humanCapital.performance,
    development: state.humanCapital.development,
    skills: state.humanCapital.skills,
    loading: state.loading.humanCapital,
    error: state.error,

    // Role Management
    createRole,
    updateRole,

    // Employee Management
    createEmployee,
    updateEmployee,

    // Contract Management
    createContract,
    updateContract,

    // Performance Management
    createPerformanceReview,
    updatePerformanceReview,

    // Development Plans
    createDevelopmentPlan,
    updateDevelopmentPlan,

    // Skills Management
    updateSkillInventory
  };
};