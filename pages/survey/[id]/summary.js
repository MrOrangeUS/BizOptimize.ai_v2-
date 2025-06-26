import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export async function getServerSideProps({ params, req }) {
  const session = await getSession({ req });
  if (!session) return { redirect: { destination: '/login', permanent: false } };
  return { props: { id: params.id } };
}

export default function Summary({ id }) {
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    fetch(`/api/openai/summary?surveyId=${id}`)
      .then((res) => res.json())
      .then((data) => setRoadmap(data.roadmap));
  }, [id]);

  if (!roadmap) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Roadmap</h1>
      <pre className="whitespace-pre-wrap">{roadmap.content}</pre>
    </div>
  );
}
