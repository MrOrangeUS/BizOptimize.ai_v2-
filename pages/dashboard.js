import { getSession, signOut, useSession } from 'next-auth/react';
import prisma from '../lib/prisma';
import Link from 'next/link';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  const surveys = await prisma.survey.findMany({
    where: { userId: session.user.id },
  });
  const sanitized = surveys.map((s) => ({ id: s.id, name: s.name }));
  return { props: { surveys: sanitized } };
}

export default function Dashboard({ surveys }) {
  const { data: session } = useSession();
  async function createSurvey() {
    const res = await fetch('/api/surveys', { method: 'POST' });
    const survey = await res.json();
    window.location.href = `/survey/${survey.id}/intro`;
  }
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-xl">Surveys</h1>
        <button className="text-sm underline" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
      <button className="mt-4 px-4 py-2 bg-green-500 text-white" onClick={createSurvey}>
        New Survey
      </button>
      <ul className="mt-4 space-y-2">
        {surveys.map((s) => (
          <li key={s.id}>
            <Link className="underline" href={`/survey/${s.id}/intro`}>
              {s.name || 'Untitled Survey'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
