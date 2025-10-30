import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  User,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Settings,
  Shield,
  Crown,
  Briefcase
} from 'lucide-react';
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';
import { useHumanCapital } from '@/hooks/useHumanCapital';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { Employee, RoleDefinition } from '@/contexts/professional/ProfessionalContext';

interface OrgChartNode {
  employee: Employee;
  role: RoleDefinition;
  subordinates: OrgChartNode[];
  level: number;
}

interface OrgChartProps {
  className?: string;
}

export const OrgChart: React.FC<OrgChartProps> = ({ className = '' }) => {
  const {
    roles,
    employees,
    loading,
    createEmployee,
    updateEmployee
  } = useHumanCapital();

  const { activityLogger } = useBizHelpIntegration('');

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    userId: '',
    roleId: '',
    department: '',
    startDate: new Date(),
    employmentType: 'full-time' as const,
    salary: 0,
    currency: 'ZAR',
    status: 'active' as const
  });

  // Build organizational hierarchy
  const orgHierarchy = useMemo(() => {
    const roleMap = new Map(roles.map(role => [role.id, role]));
    const employeeMap = new Map(employees.map(emp => [emp.id, emp]));

    const buildHierarchy = (managerId?: string, level = 0): OrgChartNode[] => {
      return employees
        .filter(emp => emp.managerId === managerId)
        .map(employee => {
          const role = roleMap.get(employee.roleId);
          if (!role) return null;

          return {
            employee,
            role,
            subordinates: buildHierarchy(employee.id, level + 1),
            level
          };
        })
        .filter((node): node is OrgChartNode => node !== null);
    };

    return buildHierarchy();
  }, [employees, roles]);

  const toggleNodeExpansion = useCallback((employeeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  }, []);

  const handleAddEmployee = useCallback(async () => {
    try {
      await createEmployee(newEmployeeData);

      // Log activity: employee structure updated
      await activityLogger?.log('org_structure_updated', {
        action: 'employee_added',
        department: newEmployeeData.department,
        employmentType: newEmployeeData.employmentType,
        roleId: newEmployeeData.roleId,
        status: newEmployeeData.status
      });

      setIsAddingEmployee(false);
      setNewEmployeeData({
        userId: '',
        roleId: '',
        department: '',
        startDate: new Date(),
        employmentType: 'full-time',
        salary: 0,
        currency: 'ZAR',
        status: 'active'
      });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  }, [createEmployee, newEmployeeData, activityLogger]);

  const getRoleIcon = (level: number) => {
    switch (level) {
      case 0: return <Crown className="w-4 h-4 text-yellow-500" />;
      case 1: return <Shield className="w-4 h-4 text-blue-500" />;
      default: return <Briefcase className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderNode = (node: OrgChartNode): React.ReactNode => {
    const { employee, role, subordinates, level } = node;
    const isExpanded = expandedNodes.has(employee.id);
    const hasSubordinates = subordinates.length > 0;

    return (
      <div key={employee.id} className="flex flex-col items-center">
        {/* Employee Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            relative bg-white border-2 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow
            min-w-[200px] max-w-[280px]
            ${selectedEmployee?.id === employee.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
            ${level === 0 ? 'border-t-4 border-t-yellow-500' : ''}
          `}
          onClick={() => setSelectedEmployee(employee)}
        >
          {/* Role Level Indicator */}
          <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 border-2 border-gray-200">
            {getRoleIcon(level)}
          </div>

          {/* Employee Info */}
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {employee.userId} {/* TODO: Replace with actual user name */}
              </h3>
              <p className="text-sm text-gray-600 truncate">{role.title}</p>
            </div>
          </div>

          {/* Department & Status */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>{role.department}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                employee.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : employee.status === 'inactive'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {employee.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{employee.employmentType}</span>
              <span>{employee.currency} {employee.salary.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement edit functionality
              }}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="Edit employee"
            >
              <Edit className="w-4 h-4" />
            </button>

            {hasSubordinates && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNodeExpansion(employee.id);
                }}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                aria-label={isExpanded ? "Collapse subordinates" : "Expand subordinates"}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingEmployee(true);
              }}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
              aria-label="Add subordinate"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Subordinates */}
        {hasSubordinates && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8"
          >
            {/* Connection Line */}
            <div className="flex justify-center mb-4">
              <div className="w-px h-8 bg-gray-300"></div>
            </div>

            {/* Subordinates Grid */}
            <div className="flex flex-wrap justify-center gap-8">
              {subordinates.map(subordinate => renderNode(subordinate))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading organization chart...</span>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Organization Chart</h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddingEmployee(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>

          <button
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Organization Chart */}
      <div className="bg-gray-50 rounded-lg p-8 min-h-[600px]">
        {orgHierarchy.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Users className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Organization Structure</h3>
            <p className="text-center mb-4">
              Start building your organization by adding employees and defining their roles.
            </p>
            <button
              onClick={() => setIsAddingEmployee(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Employee</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-8">
              {orgHierarchy.map(node => renderNode(node))}
            </div>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {isAddingEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsAddingEmployee(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Add New Employee</h3>

              <div className="space-y-4">
                <AccessibleInput
                  label="User ID"
                  value={newEmployeeData.userId}
                  onChange={(e) => setNewEmployeeData(prev => ({ ...prev, userId: e.target.value }))}
                  placeholder="Enter user ID"
                />

                <AccessibleSelect
                  label="Role"
                  value={newEmployeeData.roleId}
                  onChange={(e) => setNewEmployeeData(prev => ({ ...prev, roleId: e.target.value }))}
                  options={roles.map(role => ({ value: role.id, label: role.title }))}
                />

                <AccessibleInput
                  label="Department"
                  value={newEmployeeData.department}
                  onChange={(e) => setNewEmployeeData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Enter department"
                />

                <AccessibleSelect
                  label="Employment Type"
                  value={newEmployeeData.employmentType}
                  onChange={(value) => setNewEmployeeData(prev => ({ ...prev, employmentType: value as any }))}
                  options={[
                    { value: 'full-time', label: 'Full Time' },
                    { value: 'part-time', label: 'Part Time' },
                    { value: 'contract', label: 'Contract' },
                    { value: 'intern', label: 'Intern' }
                  ]}
                />

                <div className="grid grid-cols-2 gap-4">
                  <AccessibleInput
                    label="Salary"
                    type="number"
                    value={newEmployeeData.salary.toString()}
                    onChange={(e) => setNewEmployeeData(prev => ({ ...prev, salary: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />

                  <AccessibleSelect
                    label="Currency"
                    value={newEmployeeData.currency}
                    onChange={(e) => setNewEmployeeData(prev => ({ ...prev, currency: e.target.value }))}
                    options={[
                      { value: 'ZAR', label: 'ZAR' },
                      { value: 'USD', label: 'USD' },
                      { value: 'EUR', label: 'EUR' }
                    ]}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsAddingEmployee(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddEmployee}
                  disabled={!newEmployeeData.userId || !newEmployeeData.roleId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Employee
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};