"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AvatarPlayer from '../../../../components/AvatarPlayer';
import PaywallModal from '../../../../components/PaywallModal';

export default function Summary() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarEnabled, setAvatarEnabled] = useState(true);
  const [selectedPresenter, setSelectedPresenter] = useState('amy-Aq6OmG2Xc9');
  const [paywallOpen, setPaywallOpen] = useState(false);

  // MOCK: Replace with real user and purchase logic
  const user = { isMember: false };
  const hasPurchased = false;

  useEffect(() => {
    if (!id) return;
    fetch(`/api/openai/summary?surveyId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRoadmap(data.roadmap);
        setLoading(false);
      });
  }, [id]);

  const toggleAvatar = () => {
    setAvatarEnabled(!avatarEnabled);
  };

  const handleSaveClick = () => {
    if (user.isMember || hasPurchased) {
      window.print(); // Or export logic
    } else {
      setPaywallOpen(true);
    }
  };

  const handleSubscribe = () => {
    window.location.href = '/subscribe';
  };

  const handleBuy = () => {
    window.location.href = '/buy-report'; // Replace with Stripe Checkout
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your business optimization roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Optimization Complete!</h1>
            <p className="text-gray-600 text-lg">
              Your comprehensive business analysis and optimization roadmap is ready
            </p>
            {/* Avatar Controls */}
            <div className="mt-6 flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Avatar:</span>
                <button
                  onClick={toggleAvatar}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    avatarEnabled 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {avatarEnabled ? '🟢 Enabled' : '⚫ Disabled'}
                </button>
              </div>
              {avatarEnabled && (
                <select
                  value={selectedPresenter}
                  onChange={(e) => setSelectedPresenter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="amy-Aq6OmG2Xc9">Amy - Business Consultant</option>
                  <option value="john-doe-123">John - Business Advisor</option>
                  <option value="sarah-smith-456">Sarah - Business Analyst</option>
                </select>
              )}
            </div>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Roadmap Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Business Optimization Roadmap</h2>
              <div className="prose prose-lg max-w-none">
                <div 
                  className="whitespace-pre-wrap text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: roadmap.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-900 font-semibold">$1</strong>')
                      .replace(/\n\n/g, '</p><p class="mb-4">')
                      .replace(/^/, '<p class="mb-4">')
                      .replace(/$/, '</p>')
                  }}
                />
              </div>
            </div>
          </div>
          {/* Avatar Presentation */}
          <div className="lg:col-span-1">
            {avatarEnabled && (
              <div className="sticky top-6">
                <AvatarPlayer
                  text={roadmap.content.replace(/\*\*/g, '').replace(/\n\n/g, '. ').replace(/\n/g, '. ')}
                  presenterId={selectedPresenter}
                  size="large"
                  autoPlay={true}
                  showControls={true}
                />
              </div>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
          >
            🏠 Back to Dashboard
          </Link>
          <button 
            onClick={handleSaveClick}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            📄 Save/Export Report
          </button>
        </div>
        <PaywallModal
          open={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          onSubscribe={handleSubscribe}
          onBuy={handleBuy}
        />
        {/* Next Steps */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Next Steps</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Review the quick wins and implement them within 24-48 hours</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Share this roadmap with your team and stakeholders</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Schedule follow-up analyses every 3-6 months to track progress</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Consider running additional specialized analyses for specific areas</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 