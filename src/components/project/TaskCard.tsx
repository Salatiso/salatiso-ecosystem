import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar as CalendarIcon,
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  TrendingUp,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ProjectTask, SubTask, TaskNote, ProjectPlan } from '@/types/project';
import { format } from 'date-fns';

interface TaskCardProps {
  task: ProjectTask;
  onUpdateTask: (task: ProjectTask) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddNote: (taskId: string, note: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateTask, onToggleSubtask, onAddNote }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [newNote, setNewNote] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const progress = (completedSubtasks / task.subtasks.length) * 100;

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(task.id, newNote);
      setNewNote('');
      setIsEditingNote(false);
    }
  };

  const handleToggleStatus = () => {
    const statusFlow = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusFlow.indexOf(task.status);
    const nextStatus = statusFlow[(currentIndex + 1) % statusFlow.length] as ProjectTask['status'];
    onUpdateTask({ ...task, status: nextStatus });
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={handleToggleStatus}
              className="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              aria-label={`Mark task as ${task.status === 'completed' ? 'incomplete' : 'complete'}`}
            >
              {task.status === 'completed' ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400 hover:text-primary-600" />
              )}
            </button>
            <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap ml-9">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ').toUpperCase()}
            </span>
            <span className={`flex items-center gap-1 text-sm font-medium ${getPriorityColor(task.priority)}`}>
              <AlertCircle className="h-4 w-4" />
              {task.priority.toUpperCase()}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={expanded ? 'Collapse task details' : 'Expand task details'}
        >
          {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="ml-9 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">
            {completedSubtasks}/{task.subtasks.length}
          </span>
        </div>
      </div>

      {/* Task Description */}
      <p className="text-sm text-gray-600 ml-9 mb-3">{task.description}</p>

      {/* Expanded Content */}
      {expanded && (
        <div className="ml-9 space-y-4 border-t border-gray-200 pt-4">
          {/* Subtasks */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Checklist Steps:</h4>
            <div className="space-y-2">
              {task.subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-start gap-2 group">
                  <button
                    onClick={() => onToggleSubtask(task.id, subtask.id)}
                    className="mt-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    aria-label={subtask.completed ? 'Mark subtask as incomplete' : 'Mark subtask as complete'}
                  >
                    {subtask.completed ? (
                      <CheckSquare className="h-5 w-5 text-green-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {subtask.title}
                    </p>
                    {subtask.completed && subtask.completedDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        ✓ Completed {format(new Date(subtask.completedDate), 'MMM dd, yyyy')}
                        {subtask.completedBy && ` by ${subtask.completedBy}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm text-gray-900">Notes:</h4>
              <button
                onClick={() => setIsEditingNote(!isEditingNote)}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                {isEditingNote ? 'Cancel' : '+ Add Note'}
              </button>
            </div>
            
            {isEditingNote && (
              <div className="mb-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add your notes here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  rows={3}
                />
                <button
                  onClick={handleAddNote}
                  className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                >
                  Save Note
                </button>
              </div>
            )}

            <div className="space-y-2">
              {task.notes.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No notes yet</p>
              ) : (
                task.notes.map(note => (
                  <div key={note.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {note.author} • {format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assigned To */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>Assigned to: <strong>{task.assignedTo}</strong></span>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {task.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Import missing Circle component
const Circle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
  </svg>
);
