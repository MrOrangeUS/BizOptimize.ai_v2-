import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AvatarPlayer from '../../../components/AvatarPlayer';

export async function getServerSideProps({ params, req }) {
  const session = await getSession({ req });
  if (!session) return { redirect: { destination: '/login', permanent: false } };
  return { props: { id: params.id } };
}

export default function Play({ id }) {
  const [question, setQuestion] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [avatarEnabled, setAvatarEnabled] = useState(true);
  const [selectedPresenter, setSelectedPresenter] = useState('amy-Aq6OmG2Xc9');
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/openai/generate?surveyId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data.question);
        setSuggestion(data.suggestion);
        setLoading(false);
      });
  }, [id, questionNumber]);

  async function handleNext() {
    if (!answer.trim()) return;
    
    setLoading(true);
    const res = await fetch(`/api/surveys/${id}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: answer, questionId: question.id }),
    });
    const data = await res.json();
    if (data.done) {
      router.push(`/survey/${id}/summary`);
    } else {
      setQuestion(data.question);
      setSuggestion(data.suggestion);
      setAnswer('');
      setQuestionNumber(questionNumber + 1);
      setLoading(false);
    }
  }

  const toggleAvatar = () => {
    setAvatarEnabled(!avatarEnabled);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your business...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Avatar Controls */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-6">
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

          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Business Analysis</h1>
              <span className="text-sm text-gray-500">Question {questionNumber} of 12</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(questionNumber / 12) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question with Avatar */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Text Question */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">Question {questionNumber}</h2>
                <p className="text-lg text-blue-800 leading-relaxed">{question.text}</p>
              </div>

              {/* Avatar Player */}
              {avatarEnabled && (
                <div className="flex justify-center">
                  <AvatarPlayer
                    text={`Question ${questionNumber}: ${question.text}`}
                    presenterId={selectedPresenter}
                    size="medium"
                    autoPlay={true}
                    showControls={true}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Answer Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Response
            </label>
            <textarea 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              value={answer} 
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Share your thoughts, challenges, or current situation..."
              rows={4}
            />
          </div>

          {/* Quick Win Suggestion with Avatar */}
          {suggestion && (
            <div className="mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Text Suggestion */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">⚡</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-green-900 mb-2">Quick Win Suggestion</h3>
                      <p className="text-green-800 leading-relaxed">{suggestion}</p>
                    </div>
                  </div>
                </div>

                {/* Avatar for Suggestion */}
                {avatarEnabled && (
                  <div className="flex justify-center">
                    <AvatarPlayer
                      text={`Quick win suggestion: ${suggestion}`}
                      presenterId={selectedPresenter}
                      size="medium"
                      autoPlay={true}
                      showControls={true}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {questionNumber < 12 ? 'More questions coming...' : 'Final question!'}
            </div>
            <button 
              className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg ${
                answer.trim() 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleNext}
              disabled={!answer.trim() || loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : questionNumber === 12 ? (
                'Complete Analysis'
              ) : (
                'Next Question'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
