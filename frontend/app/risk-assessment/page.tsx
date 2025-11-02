'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePreferences } from '@/context/PreferencesContext';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    score: number;
    description: string;
  }[];
}

interface RiskProfile {
  type: 'conservative' | 'moderate' | 'aggressive';
  score: number;
  title: string;
  description: string;
  color: string;
  icon: string;
  recommendedAllocation: {
    category: string;
    percentage: number;
  }[];
  recommendedDeals: string[];
  characteristics: string[];
}

export default function RiskAssessmentPage() {
  const { formatCurrency } = usePreferences();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);

  const questions: Question[] = [
    {
      id: 1,
      question: 'What is your investment experience level?',
      options: [
        { text: 'Beginner', score: 1, description: 'New to investing, prefer simple options' },
        { text: 'Intermediate', score: 2, description: 'Some experience with basic investments' },
        { text: 'Advanced', score: 3, description: 'Experienced with various investment types' },
        { text: 'Expert', score: 4, description: 'Extensive experience, comfortable with complexity' },
      ],
    },
    {
      id: 2,
      question: 'What is your primary investment goal?',
      options: [
        { text: 'Wealth Preservation', score: 1, description: 'Protect my capital from loss' },
        { text: 'Steady Income', score: 2, description: 'Generate consistent monthly returns' },
        { text: 'Balanced Growth', score: 3, description: 'Mix of income and capital appreciation' },
        { text: 'Aggressive Growth', score: 4, description: 'Maximize returns, accept higher risk' },
      ],
    },
    {
      id: 3,
      question: 'What is your investment time horizon?',
      options: [
        { text: 'Less than 1 year', score: 1, description: 'Short-term, need liquidity soon' },
        { text: '1-3 years', score: 2, description: 'Medium-term goals' },
        { text: '3-5 years', score: 3, description: 'Long-term planning' },
        { text: '5+ years', score: 4, description: 'Very long-term, retirement planning' },
      ],
    },
    {
      id: 4,
      question: 'How would you react if your investment lost 15% in a month?',
      options: [
        { text: 'Sell immediately', score: 1, description: 'Cannot tolerate any losses' },
        { text: 'Worry and consider selling', score: 2, description: 'Uncomfortable with volatility' },
        { text: 'Hold and wait for recovery', score: 3, description: 'Can handle short-term losses' },
        { text: 'Buy more at the lower price', score: 4, description: 'See opportunity in volatility' },
      ],
    },
    {
      id: 5,
      question: 'What percentage of your savings can you invest?',
      options: [
        { text: 'Less than 10%', score: 1, description: 'Very limited funds available' },
        { text: '10-25%', score: 2, description: 'Some funds available' },
        { text: '25-50%', score: 3, description: 'Significant funds available' },
        { text: 'More than 50%', score: 4, description: 'Substantial funds available' },
      ],
    },
    {
      id: 6,
      question: 'How important is liquidity to you?',
      options: [
        { text: 'Very Important', score: 1, description: 'Need to access funds quickly' },
        { text: 'Somewhat Important', score: 2, description: 'Prefer some liquidity' },
        { text: 'Not Very Important', score: 3, description: 'Can wait for optimal exit' },
        { text: 'Not Important', score: 4, description: 'Long-term hold is fine' },
      ],
    },
    {
      id: 7,
      question: 'What is your current income stability?',
      options: [
        { text: 'Unstable/Variable', score: 1, description: 'Income fluctuates significantly' },
        { text: 'Somewhat Stable', score: 2, description: 'Mostly stable with some variation' },
        { text: 'Stable', score: 3, description: 'Consistent income' },
        { text: 'Very Stable', score: 4, description: 'Very secure, multiple income sources' },
      ],
    },
    {
      id: 8,
      question: 'Which statement best describes you?',
      options: [
        { text: 'I prefer guaranteed returns', score: 1, description: 'Safety over higher returns' },
        { text: 'I prefer low-risk with modest returns', score: 2, description: 'Stability is key' },
        { text: 'I can accept moderate risk for better returns', score: 3, description: 'Balanced approach' },
        { text: 'I can accept high risk for maximum returns', score: 4, description: 'Growth focused' },
      ],
    },
  ];

  const handleAnswer = (questionId: number, score: number) => {
    setAnswers({ ...answers, [questionId]: score });
  };

  const calculateRiskProfile = (): RiskProfile => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / questions.length;

    if (averageScore <= 1.8) {
      return {
        type: 'conservative',
        score: Math.round(averageScore * 100) / 100,
        title: 'Conservative Investor',
        description: 'You prioritize capital preservation and prefer stable, predictable returns with minimal risk.',
        color: 'blue',
        icon: '🛡️',
        recommendedAllocation: [
          { category: 'Established Businesses (Low Risk)', percentage: 60 },
          { category: 'Rental Properties (Stable)', percentage: 30 },
          { category: 'Growth Opportunities (Moderate)', percentage: 10 },
        ],
        recommendedDeals: [
          'Established retail stores',
          'Long-term rental properties',
          'Mature franchise operations',
        ],
        characteristics: [
          'Focus on capital preservation',
          'Prefer established, proven businesses',
          'Target 10-15% annual returns',
          'Monthly income preferred',
          'Low tolerance for volatility',
        ],
      };
    } else if (averageScore <= 2.8) {
      return {
        type: 'moderate',
        score: Math.round(averageScore * 100) / 100,
        title: 'Moderate Investor',
        description: 'You seek a balanced approach between growth and stability, comfortable with calculated risks.',
        color: 'green',
        icon: '⚖️',
        recommendedAllocation: [
          { category: 'Established Businesses (Low Risk)', percentage: 30 },
          { category: 'Growth Opportunities (Moderate)', percentage: 50 },
          { category: 'High-Growth Ventures (Higher Risk)', percentage: 20 },
        ],
        recommendedDeals: [
          'Growing franchises',
          'Short-term rentals (Airbnb)',
          'Expanding service businesses',
          'Mixed-use properties',
        ],
        characteristics: [
          'Balanced risk-reward approach',
          'Mix of stable income and growth',
          'Target 20-30% annual returns',
          'Some volatility acceptable',
          'Diversified portfolio',
        ],
      };
    } else {
      return {
        type: 'aggressive',
        score: Math.round(averageScore * 100) / 100,
        title: 'Aggressive Investor',
        description: 'You are growth-focused and willing to take significant risks for higher potential returns.',
        color: 'orange',
        icon: '🚀',
        recommendedAllocation: [
          { category: 'High-Growth Ventures (Higher Risk)', percentage: 60 },
          { category: 'Growth Opportunities (Moderate)', percentage: 30 },
          { category: 'Established Businesses (Low Risk)', percentage: 10 },
        ],
        recommendedDeals: [
          'New concept restaurants',
          'Luxury glamping pods',
          'High-end retail boutiques',
          'Emerging market properties',
        ],
        characteristics: [
          'Growth and capital appreciation focus',
          'Comfortable with high volatility',
          'Target 35%+ annual returns',
          'Long-term investment horizon',
          'Opportunistic approach',
        ],
      };
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (Object.keys(answers).length === questions.length) {
      const profile = calculateRiskProfile();
      setRiskProfile(profile);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setRiskProfile(null);
  };

  const progress = (Object.keys(answers).length / questions.length) * 100;

  if (showResults && riskProfile) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{riskProfile.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your Risk Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Based on your responses, here's your personalized investment profile
          </p>
        </div>

        {/* Profile Card */}
        <div className={`bg-gradient-to-br from-${riskProfile.color}-50 to-${riskProfile.color}-100 dark:from-${riskProfile.color}-900/20 dark:to-${riskProfile.color}-800/20 rounded-2xl shadow-xl p-8 mb-8 border-2 border-${riskProfile.color}-200 dark:border-${riskProfile.color}-800`}>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {riskProfile.title}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {riskProfile.description}
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Risk Score</div>
                <div className={`text-5xl font-bold text-${riskProfile.color}-600`}>
                  {riskProfile.score}
                </div>
                <div className="text-sm text-gray-500 mt-2">out of 4.0</div>
              </div>
            </div>
          </div>

          {/* Characteristics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Your Investor Characteristics
            </h3>
            <ul className="space-y-2">
              {riskProfile.characteristics.map((char, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{char}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Allocation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recommended Portfolio Allocation
          </h2>
          <div className="space-y-4">
            {riskProfile.recommendedAllocation.map((allocation, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">{allocation.category}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{allocation.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`bg-${riskProfile.color}-600 h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${allocation.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Deals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Recommended Deal Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskProfile.recommendedDeals.map((deal, index) => (
              <div
                key={index}
                className={`bg-${riskProfile.color}-50 dark:bg-${riskProfile.color}-900/20 rounded-lg p-4 border-2 border-${riskProfile.color}-200 dark:border-${riskProfile.color}-800`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💼</span>
                  <span className="text-gray-900 dark:text-white font-medium">{deal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={resetAssessment}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Retake Assessment
          </button>
          <Link
            href="/deals"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Browse Deals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎯</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Risk Assessment
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Answer {questions.length} questions to discover your investor risk profile
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="text-sm font-semibold text-primary-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {questions[currentStep].question}
        </h2>
        <div className="space-y-4">
          {questions[currentStep].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(questions[currentStep].id, option.score)}
              className={`w-full text-left p-4 rounded-lg border-2 transition ${
                answers[questions[currentStep].id] === option.score
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">
                    {option.text}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </div>
                </div>
                {answers[questions[currentStep].id] === option.score && (
                  <div className="text-primary-600 text-2xl">✓</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-lg transition ${
            currentStep === 0
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!answers[questions[currentStep].id]}
          className={`px-6 py-3 rounded-lg transition ${
            !answers[questions[currentStep].id]
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : currentStep === questions.length - 1
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {currentStep === questions.length - 1 ? 'See Results' : 'Next'}
        </button>
      </div>
    </div>
  );
}
