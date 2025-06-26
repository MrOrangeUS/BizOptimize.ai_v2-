import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export async function getServerSideProps({ params, req }) {
  const session = await getSession({ req });
  if (!session) return { redirect: { destination: '/login', permanent: false } };
  return { props: { id: params.id } };
}

export default function Play({ id }) {
  const [question, setQuestion] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/openai/generate?surveyId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data.question);
        setSuggestion(data.suggestion);
      });
  }, [id]);

  async function handleNext() {
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
    }
  }

  if (!question) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div>{question.text}</div>
      {suggestion && <div className="text-sm text-gray-500">{suggestion}</div>}
      <textarea className="border p-2 w-full" value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <button className="px-4 py-2 bg-blue-500 text-white" onClick={handleNext}>
        Next
      </button>
    </div>
  );
}
