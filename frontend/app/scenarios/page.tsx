'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  const [compareMode, setCompareMode] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

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

  const toggleScenarioSelection = (id: string) => {
    if (selectedScenarios.includes(id)) {
      setSelectedScenarios(selectedScenarios.filter(s => s !== id));
    } else if (selectedScenarios.length < 3) {
      setSelectedScenarios([...selectedScenarios, id]);
    }
  };

  const getTemplateIcon = (type: string) => {
    const icons: Record<string, string> = {
      'best_case': '🚀',
      'expected_case': '📊',
      'worst_case': '⚠️',
      'market_downturn': '📉',
      'early_exit': '⏩',
      'extended_holding': '⏳'
    };
    return icons[type] || '📋';
  };

  const getTemplateColor = (type: string) => {
    const colors: Record<string, string> = {
      'best_case': 'from-green-500 to-emerald-600',
      'expected_case': 'from-blue-500 to-indigo-600',
      'worst_case': 'from-red-500 to-orange-600',
      'market_downturn': 'from-purple-500 to-pink-600',
      'early_exit': 'from-yellow-500 to-amber-600',
      'extended_holding': 'from-cyan-500 to-teal-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const completedScenarios = scenarios.filter(s => s.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="mb-8 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative z-10">
          <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
            💡 Scenario Planning Tool
          </div>
          <h1 className="text-5xl font-bold mb-3">
            Investment Scenario Runner
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Test business scenarios, simulate market conditions, and predict investment outcomes
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{templates.length}</div>
              <div className="text-sm opacity-90">Templates Available</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{scenarios.length}</div>
              <div className="text-sm opacity-90">Scenarios Created</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{completedScenarios.length}</div>
              <div className="text-sm opacity-90">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Scenario
          </button>

          {completedScenarios.length >= 2 && (
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                compareMode
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {compareMode ? `Comparing (${selectedScenarios.length}/3)` : 'Compare Scenarios'}
            </button>
          )}
        </div>
      </div>

      {/* Scenario Templates Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          📋 Scenario Templates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.type}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-500"
              onClick={() => {
                setSelectedTemplate(template);
                setShowCreateModal(true);
              }}
            >
              {/* Template Header with Gradient */}
              <div className={`bg-gradient-to-r ${getTemplateColor(template.type)} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-2 right-2 text-4xl opacity-50">
                  {getTemplateIcon(template.type)}
                </div>
                <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                <p className="text-sm opacity-90">{template.description}</p>
              </div>

              {/* Template Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                    <div className="font-bold text-lg">{template.parameters.holdingPeriodDays} days</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Exit Multiple</div>
                    <div className={`font-bold text-lg ${
                      template.parameters.exitMultiplier >= 1.5 ? 'text-green-600' :
                      template.parameters.exitMultiplier >= 1 ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {template.parameters.exitMultiplier}x
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Market Condition</span>
                  <span className="text-sm font-bold capitalize">{template.parameters.marketCondition}</span>
                </div>

                <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Use This Template →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Scenarios Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            📊 My Scenarios
          </h2>
          {scenarios.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {completedScenarios.length} of {scenarios.length} completed
            </div>
          )}
        </div>

        {scenarios.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl shadow-md p-16 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div className="text-7xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">No Scenarios Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Create your first scenario to simulate different investment outcomes and make data-driven decisions
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Create Your First Scenario
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden ${
                  compareMode && selectedScenarios.includes(scenario.id)
                    ? 'ring-4 ring-purple-500'
                    : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {compareMode && scenario.status === 'completed' && (
                          <input
                            type="checkbox"
                            checked={selectedScenarios.includes(scenario.id)}
                            onChange={() => toggleScenarioSelection(scenario.id)}
                            className="w-5 h-5 text-purple-600 rounded"
                          />
                        )}
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{scenario.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        🏢 SPV: {scenario.spv?.spv_name} • {scenario.spv?.deal?.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Created: {new Date(scenario.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
                        scenario.status === 'completed' ? 'bg-green-100 text-green-800' :
                        scenario.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      } capitalize`}>
                        {scenario.status}
                      </span>
                      {scenario.status !== 'completed' && (
                        <button
                          onClick={() => handleRunScenario(scenario.id)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                        >
                          ▶ Run Scenario
                        </button>
                      )}
                      {scenario.status === 'completed' && (
                        <button
                          onClick={() => setSelectedScenario(scenario)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          📊 View Results
                        </button>
                      )}
                    </div>
                  </div>

                  {scenario.status === 'completed' && scenario.results && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Invested</div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(scenario.results.summary.totalInvested)}
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Exit Value</div>
                          <div className="text-xl font-bold text-green-600">
                            {formatCurrency(scenario.results.summary.netExitValue)}
                          </div>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Return</div>
                          <div className={`text-xl font-bold ${
                            scenario.results.summary.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(scenario.results.summary.returnPercentage)}
                          </div>
                        </div>
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Annualized</div>
                          <div className={`text-xl font-bold ${
                            scenario.results.summary.annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(scenario.results.summary.annualizedReturn)}
                          </div>
                        </div>
                      </div>

                      {/* Mini Chart Preview */}
                      <div className="mt-4">
                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Return Distribution</div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${Math.min(100, Math.max(0, scenario.results.summary.returnPercentage))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Compare Button (when scenarios are selected) */}
        {compareMode && selectedScenarios.length >= 2 && (
          <div className="fixed bottom-8 right-8 z-50">
            <Link href={`/scenarios/compare?ids=${selectedScenarios.join(',')}`}>
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition flex items-center gap-3 animate-bounce">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Compare {selectedScenarios.length} Scenarios
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Create Scenario Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Create New Scenario</h3>

              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Select Scenario Template
                  </label>
                  <select
                    value={selectedTemplate?.type || ''}
                    onChange={(e) => {
                      const template = templates.find((t) => t.type === e.target.value);
                      setSelectedTemplate(template);
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700"
                  >
                    <option value="">-- Select Template --</option>
                    {templates.map((template) => (
                      <option key={template.type} value={template.type}>
                        {getTemplateIcon(template.type)} {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Template Preview */}
                {selectedTemplate && (
                  <div className={`bg-gradient-to-r ${getTemplateColor(selectedTemplate.type)} rounded-xl p-6 text-white`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-xl font-bold mb-1">{selectedTemplate.name}</h4>
                        <p className="text-sm opacity-90">{selectedTemplate.description}</p>
                      </div>
                      <div className="text-4xl">{getTemplateIcon(selectedTemplate.type)}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-xs opacity-75">Duration</div>
                        <div className="text-lg font-bold">{selectedTemplate.parameters.holdingPeriodDays}d</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-xs opacity-75">Exit</div>
                        <div className="text-lg font-bold">{selectedTemplate.parameters.exitMultiplier}x</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-xs opacity-75">Market</div>
                        <div className="text-sm font-bold capitalize">{selectedTemplate.parameters.marketCondition}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Deal Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Select Deal/SPV to Simulate
                  </label>
                  <select
                    value={selectedDeal}
                    onChange={(e) => setSelectedDeal(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700"
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

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedTemplate(null);
                    setSelectedDeal('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateScenario}
                  disabled={!selectedTemplate || !selectedDeal}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create & Run Scenario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal - Enhanced */}
      {selectedScenario && selectedScenario.results && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full my-8">
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedScenario.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Scenario Analysis Results
                  </p>
                </div>
                <button
                  onClick={() => setSelectedScenario(null)}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
                  <div className="text-sm text-blue-700 dark:text-blue-300 mb-2">Total Invested</div>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(selectedScenario.results.summary.totalInvested)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 border-2 border-green-200 dark:border-green-700">
                  <div className="text-sm text-green-700 dark:text-green-300 mb-2">Exit Value</div>
                  <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {formatCurrency(selectedScenario.results.summary.netExitValue)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700">
                  <div className="text-sm text-purple-700 dark:text-purple-300 mb-2">Return</div>
                  <div className={`text-3xl font-bold ${
                    selectedScenario.results.summary.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(selectedScenario.results.summary.returnPercentage)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-6 border-2 border-yellow-200 dark:border-yellow-700">
                  <div className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">Annualized</div>
                  <div className={`text-3xl font-bold ${
                    selectedScenario.results.summary.annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(selectedScenario.results.summary.annualizedReturn)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Timeline */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Event Timeline</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedScenario.results.timeline.map((event: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {event.day}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold capitalize text-gray-900 dark:text-white">
                            {event.type.replace(/_/g, ' ')}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{event.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investor Returns */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Investor Returns</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200 dark:bg-gray-600">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold">Investor</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold">Invested</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold">Payout</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold">Return</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-600">
                        {selectedScenario.results.investorReturns.map((inv: any) => (
                          <tr key={inv.investor_id} className="bg-white dark:bg-gray-800">
                            <td className="px-3 py-3 text-gray-900 dark:text-white">Investor</td>
                            <td className="px-3 py-3 text-right font-semibold">{formatCurrency(inv.invested)}</td>
                            <td className="px-3 py-3 text-right font-bold text-green-600">{formatCurrency(inv.payout)}</td>
                            <td className={`px-3 py-3 text-right font-bold ${
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
          </div>
        </div>
      )}
    </div>
  );
}
