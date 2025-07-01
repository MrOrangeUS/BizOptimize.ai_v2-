"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IntroPage({ params }) {
  const [form, setForm] = useState({ name: '', description: '' });
  const router = useRouter();

  // Fetch survey data on mount (client-side fetch)
  useEffect(() => {
    async function fetchSurvey() {
      const res = await fetch(`/api/surveys/${params.id}/intro`);
      if (res.ok) {
        const data = await res.json();
        setForm({ name: data.name || '', description: data.description || '' });
      }
    }
    fetchSurvey();
  }, [params.id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch(`/api/surveys/${params.id}/intro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push(`/survey/${params.id}/play`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Diagnostic Setup</h1>
            <p className="text-gray-600 text-lg">
              Let's configure your business analysis to identify revenue leaks and optimization opportunities
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">Setup</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Analysis</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Results</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="name" 
                placeholder="Enter your business name" 
                value={form.name} 
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description
              </label>
              <textarea 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                name="description" 
                placeholder="Briefly describe your business, industry, and main challenges (optional but helpful for better analysis)"
                value={form.description} 
                onChange={handleChange}
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-1">
                This helps our AI provide more targeted questions and recommendations
              </p>
            </div>

            {/* What to Expect */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">What to Expect</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>12 targeted questions about your business operations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Immediate "quick win" suggestions after each question</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Comprehensive optimization roadmap with expected ROI</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Takes approximately 10-15 minutes to complete</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center pt-4">
              <button 
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                type="submit"
              >
                🚀 Start Business Analysis
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 