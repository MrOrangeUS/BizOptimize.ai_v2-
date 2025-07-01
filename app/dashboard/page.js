"use client";
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session } = useSession();
  const [surveys, setSurveys] = useState([]);
  useEffect(() => {
    async function fetchSurveys() {
      const res = await fetch('/api/surveys');
      if (res.ok) {
        const data = await res.json();
        setSurveys(data.surveys || []);
      }
    }
    fetchSurveys();
  }, []);
  async function createSurvey() {
    const res = await fetch('/api/surveys', { method: 'POST' });
    const survey = await res.json();
    window.location.href = `/survey/${survey.id}/intro`;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Generative Business Optimizer</h1>
              <p className="text-gray-600 mt-2">AI-Powered Business Diagnostic & Optimization Engine</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {session?.user?.name}</span>
              <button 
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline" 
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Start Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Start New Business Analysis</h2>
              <p className="text-gray-600 mb-6">
                Our AI will interrogate your business operations to identify revenue leaks, operational inefficiencies, 
                and growth opportunities. Get actionable quick wins and a strategic roadmap in minutes.
              </p>
              <button 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={createSurvey}
              >
                🚀 Launch Business Diagnostic
              </button>
            </div>
          </div>
          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Analytics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Analyses</span>
                <span className="font-semibold text-blue-600">{surveys.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Analysis</span>
                <span className="font-semibold text-green-600">
                  {surveys.length > 0 ? 'Recent' : 'None yet'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Previous Analyses */}
        {surveys.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Previous Business Analyses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {surveys.map((s) => (
                  <Link 
                    key={s.id} 
                    href={`/survey/${s.id}/intro`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <h3 className="font-medium text-gray-900">
                      {s.name || 'Untitled Analysis'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Click to review or continue</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 