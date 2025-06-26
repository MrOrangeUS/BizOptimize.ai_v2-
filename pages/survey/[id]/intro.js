import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import { useState } from 'react';
import { useRouter } from 'next/router';

export async function getServerSideProps({ params, req }) {
  const session = await getSession({ req });
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  const survey = await prisma.survey.findUnique({ where: { id: Number(params.id) } });
  if (!survey || survey.userId !== session.user.id) {
    return { notFound: true };
  }
  return { props: { id: survey.id, name: survey.name || '', description: survey.description || '' } };
}

export default function Intro({ id, name, description }) {
  const [form, setForm] = useState({ name, description });
  const router = useRouter();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch(`/api/surveys/${id}/intro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push(`/survey/${id}/play`);
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Business Intro</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input className="border p-2 w-full" name="name" placeholder="Business name" value={form.name} onChange={handleChange} />
        <textarea className="border p-2 w-full" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <button className="px-4 py-2 bg-blue-500 text-white" type="submit">Save & Start</button>
      </form>
    </div>
  );
}
