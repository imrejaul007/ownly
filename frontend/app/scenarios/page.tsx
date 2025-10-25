'use client';

import { useState, useEffect } from 'react';
import { scenarioAPI, dealAPI } from '@/lib/api';
import { formatCurrency, formatPercentage } from '@/lib/utils';

export default function ScenariosPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedDeal, setSelectedDeal] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [templatesRes, scenariosRes, dealsRes] = await Promise.all([
        scenarioAPI.getTemplates(),
        scenarioAPI.list(),
        dealAPI.list({ status: 'funded' }),
      ]);
      setTemplates(templatesRes.data.data.templates);
      setScenarios(scenariosRes.data.data.scenarios);
      setDeals(dealsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScenario = async () => {
    if (!selectedTemplate || !selectedDeal) return;

    try {
      // Find the deal's SPV
      const deal = deals.find((d) => d.id === selectedDeal);
      if (!deal?.spv) {
        alert('Selected deal does not have an SPV');
        return;
      }

      await scenarioAPI.create({
        spvId: deal.spv.id,
        scenarioType: selectedTemplate.type,
      });

      alert('Scenario created successfully!');
      setShowCreateModal(false);
      setSelectedTemplate(null);
      setSelectedDeal('');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create scenario');
    }
  };

  const handleRunScenario = async (scenarioId: string) => {
    try {
      const response = await scenarioAPI.run(scenarioId);
      setSelectedScenario(response.data.data.scenario);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to run scenario');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Scenario Runner
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test business scenarios and simulate investment outcomes
        </p>
      </div>

      {/* Scenario Templates */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Scenario Templates</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Scenario
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.type}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedTemplate(template);
                setShowCreateModal(true);
              }}
            >
              <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {template.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {template.parameters.holdingPeriodDays} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exit Multiple:</span>
                  <span className={`font-medium ${
                    template.parameters.exitMultiplier >= 1 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {template.parameters.exitMultiplier}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market:</span>
                  <span className="font-medium capitalize">
                    {template.parameters.marketCondition}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Scenarios */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Scenarios</h2>

        {scenarios.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">No scenarios created yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Scenario
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{scenario.name}</h3>
                    <p className="text-sm text-gray-600">
                      SPV: {scenario.spv?.spv_name} • {scenario.spv?.deal?.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`badge ${
                      scenario.status === 'completed' ? 'badge-green' :
                      scenario.status === 'running' ? 'badge-yellow' :
                      'badge-gray'
                    } capitalize`}>
                      {scenario.status}
                    </span>
                    {scenario.status !== 'completed' && (
                      <button
                        onClick={() => handleRunScenario(scenario.id)}
                        className="btn-primary text-sm"
                      >
                        Run Scenario
                      </button>
                    )}
                    {scenario.status === 'completed' && (
                      <button
                        onClick={() => setSelectedScenario(scenario)}
                        className="btn-secondary text-sm"
                      >
                        View Results
                      </button>
                    )}
                  </div>
                </div>

                {scenario.status === 'completed' && scenario.results && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Total Invested</div>
                      <div className="font-semibold">
                        {formatCurrency(scenario.results.summary.totalInvested)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Exit Value</div>
                      <div className="font-semibold">
                        {formatCurrency(scenario.results.summary.netExitValue)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Total Return</div>
                      <div className={`font-semibold ${
                        scenario.results.summary.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(scenario.results.summary.returnPercentage)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Annualized Return</div>
                      <div className={`font-semibold ${
                        scenario.results.summary.annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(scenario.results.summary.annualizedReturn)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Scenario Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Create Scenario</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Scenario Template</label>
                <select
                  value={selectedTemplate?.type || ''}
                  onChange={(e) => {
                    const template = templates.find((t) => t.type === e.target.value);
                    setSelectedTemplate(template);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">-- Select Template --</option>
                  {templates.map((template) => (
                    <option key={template.type} value={template.type}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTemplate && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm mb-3">{selectedTemplate.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Duration: </span>
                      <span className="font-medium">{selectedTemplate.parameters.holdingPeriodDays} days</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Exit Multiple: </span>
                      <span className="font-medium">{selectedTemplate.parameters.exitMultiplier}x</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Select Deal/SPV</label>
                <select
                  value={selectedDeal}
                  onChange={(e) => setSelectedDeal(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">-- Select Deal --</option>
                  {deals.filter(d => d.spv).map((deal) => (
                    <option key={deal.id} value={deal.id}>
                      {deal.title} ({deal.spv?.spv_name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedTemplate(null);
                  setSelectedDeal('');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateScenario}
                disabled={!selectedTemplate || !selectedDeal}
                className="btn-primary flex-1"
              >
                Create Scenario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {selectedScenario && selectedScenario.results && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold">{selectedScenario.name} - Results</h3>
              <button
                onClick={() => setSelectedScenario(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Total Invested</div>
                <div className="text-xl font-bold">
                  {formatCurrency(selectedScenario.results.summary.totalInvested)}
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Exit Value</div>
                <div className="text-xl font-bold">
                  {formatCurrency(selectedScenario.results.summary.netExitValue)}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Return</div>
                <div className={`text-xl font-bold ${
                  selectedScenario.results.summary.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(selectedScenario.results.summary.returnPercentage)}
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Annualized</div>
                <div className={`text-xl font-bold ${
                  selectedScenario.results.summary.annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(selectedScenario.results.summary.annualizedReturn)}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Timeline</h4>
              <div className="space-y-3">
                {selectedScenario.results.timeline.map((event: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {event.day}
                    </div>
                    <div>
                      <div className="font-medium capitalize">{event.type.replace('_', ' ')}</div>
                      <div className="text-sm text-gray-600">{event.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Investor Returns */}
            <div>
              <h4 className="font-semibold mb-3">Investor Returns</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Investor</th>
                      <th className="px-4 py-2 text-right">Invested</th>
                      <th className="px-4 py-2 text-right">Ownership</th>
                      <th className="px-4 py-2 text-right">Payout</th>
                      <th className="px-4 py-2 text-right">Return</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedScenario.results.investorReturns.map((inv: any) => (
                      <tr key={inv.investor_id}>
                        <td className="px-4 py-2">Investor</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(inv.invested)}</td>
                        <td className="px-4 py-2 text-right">{formatPercentage(inv.ownership)}</td>
                        <td className="px-4 py-2 text-right font-semibold">{formatCurrency(inv.payout)}</td>
                        <td className={`px-4 py-2 text-right font-semibold ${
                          inv.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(inv.returnPercentage)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
