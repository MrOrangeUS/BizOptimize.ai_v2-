"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AvatarPlayer from '../../../../components/AvatarPlayer';
import AlienChatDesktop from '../../../../components/AlienChatDesktop';

export const dynamic = "force-dynamic";

export default function SurveyIntro() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const surveyId = params.id;
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (!surveyId) {
      console.error('No surveyId in params');
      router.push('/dashboard');
      return;
    }

    // Fetch survey details
    fetch(`/api/surveys/${surveyId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching survey:', data.error);
          router.push('/dashboard');
          return;
        }
        setSurvey(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching survey:', err);
        router.push('/dashboard');
      });
  }, [session, status, surveyId, router]);

  const startSurvey = () => {
    router.push(`/survey/${surveyId}/play`);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mb-8">
        <AlienChatDesktop />
      </div>
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Business Diagnostic Survey
          </h1>
          
          {survey && (
            <div className="text-white/90 mb-8">
              <p className="text-lg mb-4">
                Welcome to your personalized business diagnostic survey. This comprehensive assessment will help us understand your business better and provide tailored recommendations for optimization and growth.
              </p>
              
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <h3 className="text-xl font-semibold mb-2">Survey Details</h3>
                <p><strong>Created:</strong> {new Date(survey.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {survey.status}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={startSurvey}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Survey
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 