import { getSession, signIn } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }
  return { props: {} };
}

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <button className="px-4 py-2 bg-blue-500 text-white" onClick={() => signIn('github')}>
        Sign in with GitHub
      </button>
    </div>
  );
}
