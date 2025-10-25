'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { workflowAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  trigger_config: Record<string, any>;
  steps: WorkflowStep[];
  timeout: number;
  max_retries: number;
  status: 'active' | 'inactive';
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  last_executed_at?: string;
  created_at: string;
}

interface WorkflowStep {
  id: string;
  type: 'action' | 'condition' | 'delay';
  action?: string;
  condition?: string;
  config?: Record<string, any>;
  next_step?: string;
  if_true?: string;
  if_false?: string;
}

interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  trigger_data: Record<string, any>;
  current_step_id?: string;
  completed_steps: string[];
  step_results: Record<string, any>;
  logs: Array<{
    timestamp: string;
    level: string;
    message: string;
  }>;
  error_message?: string;
  total_duration?: number;
  created_at: string;
  completed_at?: string;
}

interface TriggerType {
  type: string;
  name: string;
  description: string;
  config_schema: Record<string, string>;
}

interface ActionType {
  type: string;
  name: string;
  description: string;
  config_schema: Record<string, string>;
}

export default function WorkflowsPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [triggerTypes, setTriggerTypes] = useState<TriggerType[]>([]);
  const [actionTypes, setActionTypes] = useState<ActionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExecutions, setShowExecutions] = useState(false);
  const [showExecutionLogs, setShowExecutionLogs] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    trigger_type: string;
    trigger_config: Record<string, any>;
    steps: WorkflowStep[];
    timeout: number;
    max_retries: number;
    status: 'active' | 'inactive';
  }>({
    name: '',
    description: '',
    trigger_type: 'manual',
    trigger_config: {},
    steps: [],
    timeout: 300,
    max_retries: 3,
    status: 'active',
  });

  useEffect(() => {
    fetchWorkflows();
    fetchTriggerTypes();
    fetchActionTypes();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const response = await workflowAPI.getWorkflows();
      setWorkflows(response.data.workflows || []);
    } catch (error: any) {
      console.error('Error fetching workflows:', error);
      showMessage('error', error.response?.data?.message || 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const fetchTriggerTypes = async () => {
    try {
      const response = await workflowAPI.getAvailableTriggers();
      setTriggerTypes(response.data.triggers || []);
    } catch (error) {
      console.error('Error fetching trigger types:', error);
    }
  };

  const fetchActionTypes = async () => {
    try {
      const response = await workflowAPI.getAvailableActions();
      setActionTypes(response.data.actions || []);
    } catch (error) {
      console.error('Error fetching action types:', error);
    }
  };

  const fetchExecutions = async (workflowId: string) => {
    try {
      const response = await workflowAPI.getExecutions(workflowId);
      setExecutions(response.data.executions || []);
      setShowExecutions(true);
    } catch (error: any) {
      console.error('Error fetching executions:', error);
      showMessage('error', error.response?.data?.message || 'Failed to load execution history');
    }
  };

  const fetchExecutionDetails = async (workflowId: string, executionId: string) => {
    try {
      const response = await workflowAPI.getExecution(workflowId, executionId);
      setSelectedExecution(response.data.execution);
      setShowExecutionLogs(true);
    } catch (error: any) {
      console.error('Error fetching execution details:', error);
      showMessage('error', error.response?.data?.message || 'Failed to load execution details');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.steps.length === 0) {
      showMessage('error', 'Please add at least one step to the workflow');
      return;
    }

    setProcessing(true);
    try {
      if (selectedWorkflow) {
        await workflowAPI.updateWorkflow(selectedWorkflow.id, formData);
        showMessage('success', 'Workflow updated successfully');
      } else {
        await workflowAPI.createWorkflow(formData);
        showMessage('success', 'Workflow created successfully');
      }
      setShowCreateModal(false);
      resetForm();
      fetchWorkflows();
    } catch (error: any) {
      console.error('Error saving workflow:', error);
      showMessage('error', error.response?.data?.message || 'Failed to save workflow');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    setProcessing(true);
    try {
      await workflowAPI.deleteWorkflow(workflowId);
      showMessage('success', 'Workflow deleted successfully');
      fetchWorkflows();
    } catch (error: any) {
      console.error('Error deleting workflow:', error);
      showMessage('error', error.response?.data?.message || 'Failed to delete workflow');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleStatus = async (workflow: Workflow) => {
    setProcessing(true);
    try {
      await workflowAPI.updateWorkflow(workflow.id, {
        status: workflow.status === 'active' ? 'inactive' : 'active',
      });
      showMessage('success', `Workflow ${workflow.status === 'active' ? 'disabled' : 'enabled'}`);
      fetchWorkflows();
    } catch (error: any) {
      console.error('Error updating workflow:', error);
      showMessage('error', error.response?.data?.message || 'Failed to update workflow');
    } finally {
      setProcessing(false);
    }
  };

  const handleTriggerWorkflow = async (workflowId: string) => {
    setProcessing(true);
    try {
      await workflowAPI.triggerWorkflow(workflowId, { manual_trigger: true });
      showMessage('success', 'Workflow triggered successfully');
    } catch (error: any) {
      console.error('Error triggering workflow:', error);
      showMessage('error', error.response?.data?.message || 'Failed to trigger workflow');
    } finally {
      setProcessing(false);
    }
  };

  const handleRetryExecution = async (workflowId: string, executionId: string) => {
    setProcessing(true);
    try {
      await workflowAPI.retryExecution(workflowId, executionId);
      showMessage('success', 'Execution retry initiated');
      if (selectedWorkflow) {
        fetchExecutions(selectedWorkflow.id);
      }
    } catch (error: any) {
      console.error('Error retrying execution:', error);
      showMessage('error', error.response?.data?.message || 'Failed to retry execution');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelExecution = async (workflowId: string, executionId: string) => {
    if (!confirm('Are you sure you want to cancel this execution?')) return;

    setProcessing(true);
    try {
      await workflowAPI.cancelExecution(workflowId, executionId);
      showMessage('success', 'Execution cancelled successfully');
      if (selectedWorkflow) {
        fetchExecutions(selectedWorkflow.id);
      }
    } catch (error: any) {
      console.error('Error cancelling execution:', error);
      showMessage('error', error.response?.data?.message || 'Failed to cancel execution');
    } finally {
      setProcessing(false);
    }
  };

  const addStep = (type: 'action' | 'condition') => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      type,
      action: type === 'action' ? 'send_email' : undefined,
      condition: type === 'condition' ? '' : undefined,
      config: {},
    };
    setFormData({ ...formData, steps: [...formData.steps, newStep] });
  };

  const removeStep = (stepId: string) => {
    setFormData({ ...formData, steps: formData.steps.filter((s) => s.id !== stepId) });
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setFormData({
      name: workflow.name,
      description: workflow.description,
      trigger_type: workflow.trigger_type,
      trigger_config: workflow.trigger_config,
      steps: workflow.steps,
      timeout: workflow.timeout,
      max_retries: workflow.max_retries,
      status: workflow.status,
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setSelectedWorkflow(null);
    setFormData({
      name: '',
      description: '',
      trigger_type: 'manual',
      trigger_config: {},
      steps: [],
      timeout: 300,
      max_retries: 3,
      status: 'active',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/settings')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            ← Back to Settings
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
              <p className="mt-2 text-gray-600">Automate processes with triggers, actions, and conditions</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              + Create Workflow
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Workflows List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading workflows...</p>
          </div>
        ) : workflows.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No workflows configured</h3>
            <p className="text-gray-600 mb-6">
              Create your first workflow to automate processes
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Workflow
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                      {getStatusBadge(workflow.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                    <div className="flex items-center space-x-6 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Trigger:</span>
                        <span className="ml-2 font-medium">{workflow.trigger_type.replace(/_/g, ' ')}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Steps:</span>
                        <span className="ml-2 font-medium">{workflow.steps.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Timeout:</span>
                        <span className="ml-2 font-medium">{workflow.timeout}s</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Executions:</span>
                        <span className="ml-2 font-medium">{workflow.total_executions}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Success Rate:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {workflow.total_executions > 0
                            ? Math.round((workflow.successful_executions / workflow.total_executions) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Executed:</span>
                        <span className="ml-2 font-medium">
                          {workflow.last_executed_at ? formatDate(workflow.last_executed_at) : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => handleToggleStatus(workflow)}
                      disabled={processing}
                      className={`px-3 py-2 text-sm rounded-lg ${
                        workflow.status === 'active'
                          ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                          : 'text-green-700 bg-green-100 hover:bg-green-200'
                      } disabled:opacity-50`}
                    >
                      {workflow.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleTriggerWorkflow(workflow.id)}
                      disabled={processing || workflow.status !== 'active'}
                      className="px-3 py-2 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
                    >
                      Trigger
                    </button>
                    <button
                      onClick={() => {
                        setSelectedWorkflow(workflow);
                        fetchExecutions(workflow.id);
                      }}
                      className="px-3 py-2 text-sm text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100"
                    >
                      Executions
                    </button>
                    <button
                      onClick={() => handleEditWorkflow(workflow)}
                      className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      disabled={processing}
                      className="px-3 py-2 text-sm text-red-700 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Workflow Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {selectedWorkflow ? 'Edit Workflow' : 'Create Workflow'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateWorkflow}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="My Workflow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="What does this workflow do?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Type *</label>
                      <select
                        value={formData.trigger_type}
                        onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        {triggerTypes.map((trigger) => (
                          <option key={trigger.type} value={trigger.type}>
                            {trigger.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timeout (seconds)</label>
                      <input
                        type="number"
                        min="30"
                        max="3600"
                        value={formData.timeout}
                        onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Workflow Steps * (at least one)
                    </label>

                    {formData.steps.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-600 mb-4">No steps added yet</p>
                        <div className="space-x-2">
                          <button
                            type="button"
                            onClick={() => addStep('action')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            + Add Action
                          </button>
                          <button
                            type="button"
                            onClick={() => addStep('condition')}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            + Add Condition
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.steps.map((step, index) => (
                          <div key={step.id} className="border border-gray-300 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded">
                                    Step {index + 1}
                                  </span>
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                                    step.type === 'action' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {step.type}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {step.type === 'action' ? `Action: ${step.action}` : `Condition: ${step.condition || 'Not set'}`}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeStep(step.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => addStep('action')}
                            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            + Add Action
                          </button>
                          <button
                            type="button"
                            onClick={() => addStep('condition')}
                            className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            + Add Condition
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {processing ? 'Saving...' : selectedWorkflow ? 'Update Workflow' : 'Create Workflow'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Executions Modal */}
        {showExecutions && selectedWorkflow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 my-8 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Execution History - {selectedWorkflow.name}
                </h3>
                <button
                  onClick={() => {
                    setShowExecutions(false);
                    setSelectedWorkflow(null);
                    setExecutions([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {executions.length === 0 ? (
                <div className="text-center py-12 text-gray-600">No execution history yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Steps</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Started</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {executions.map((execution) => (
                        <tr key={execution.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(execution.status)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {execution.completed_steps.length} / {selectedWorkflow.steps.length}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {execution.total_duration ? `${execution.total_duration.toFixed(2)}s` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(execution.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() => fetchExecutionDetails(selectedWorkflow.id, execution.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View Logs
                            </button>
                            {execution.status === 'failed' && (
                              <button
                                onClick={() => handleRetryExecution(selectedWorkflow.id, execution.id)}
                                disabled={processing}
                                className="text-green-600 hover:text-green-800 disabled:opacity-50"
                              >
                                Retry
                              </button>
                            )}
                            {execution.status === 'running' && (
                              <button
                                onClick={() => handleCancelExecution(selectedWorkflow.id, execution.id)}
                                disabled={processing}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Execution Logs Modal */}
        {showExecutionLogs && selectedExecution && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">Execution Logs</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    {getStatusBadge(selectedExecution.status)}
                    {selectedExecution.total_duration && (
                      <span className="text-sm text-gray-600">
                        Duration: {selectedExecution.total_duration.toFixed(2)}s
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowExecutionLogs(false);
                    setSelectedExecution(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {selectedExecution.error_message && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800">Error:</p>
                  <p className="text-sm text-red-600 mt-1">{selectedExecution.error_message}</p>
                </div>
              )}

              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                {selectedExecution.logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={`ml-2 ${
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warn' ? 'text-yellow-400' :
                      log.level === 'info' ? 'text-blue-400' :
                      'text-gray-400'
                    }`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="ml-2">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
