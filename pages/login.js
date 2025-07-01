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
    <div className="min-h-screen bg-alien-black flex items-center justify-center font-orbitron px-4 py-8">
      <div className="w-full max-w-md bg-glass-dark border border-glass-border rounded-2xl shadow-neon p-8 relative overflow-hidden">
        {/* Neon Halo */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full border-4 border-alien-green opacity-30 blur-2xl animate-glow-pulse z-0" />
        {/* Header */}
        <div className="relative z-10 text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-alien-green flex items-center justify-center shadow-neon bg-alien-black">
            <span className="text-alien-green text-4xl font-bold">⚡</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-alien-green mb-2 tracking-widest alien-title">BizOptimize.AI</h1>
          <p className="text-alien-cyan text-base opacity-80 font-orbitron">AI-Powered Business Diagnostic & Optimization Engine</p>
        </div>
        {/* Value Proposition */}
        <div className="bg-alien-dark bg-opacity-80 rounded-xl p-6 mb-8 border border-alien-green/30 shadow-neon">
          <h2 className="text-lg font-semibold text-alien-green mb-3 tracking-wide">Transform Your Business</h2>
          <ul className="space-y-2 text-sm text-alien-cyan">
            <li className="flex items-start"><span className="text-alien-green mr-2">•</span>Identify revenue leaks and operational inefficiencies</li>
            <li className="flex items-start"><span className="text-alien-green mr-2">•</span>Get actionable quick wins with immediate ROI</li>
            <li className="flex items-start"><span className="text-alien-green mr-2">•</span>Receive strategic roadmap for long-term growth</li>
            <li className="flex items-start"><span className="text-alien-green mr-2">•</span>AI-powered insights in under 15 minutes</li>
          </ul>
        </div>
        {/* Login Buttons */}
        <div className="mt-8 space-y-4">
          <button
            className="w-full px-6 py-3 bg-alien-green text-alien-black font-bold rounded-lg shadow-neon hover:bg-alien-cyan hover:text-alien-black transition-all duration-200 flex items-center justify-center text-lg tracking-wide border-2 border-alien-green focus:outline-none focus:ring-2 focus:ring-alien-green"
            onClick={() => signIn('github')}
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            Continue with GitHub
          </button>
          <button
            className="w-full px-6 py-3 bg-alien-cyan text-alien-black font-bold rounded-lg shadow-neon hover:bg-alien-green hover:text-alien-black transition-all duration-200 flex items-center justify-center text-lg tracking-wide border-2 border-alien-cyan focus:outline-none focus:ring-2 focus:ring-alien-cyan"
            onClick={() => signIn('email')}
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.94 6.94a1.5 1.5 0 0 1 2.12 0L10 11.88l4.94-4.94a1.5 1.5 0 1 1 2.12 2.12l-6 6a1.5 1.5 0 0 1-2.12 0l-6-6a1.5 1.5 0 0 1 0-2.12z" />
            </svg>
            Continue with Email
          </button>
        </div>
        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-xs text-alien-cyan opacity-80">
            Secure authentication • No credit card required • 15-minute analysis
          </p>
        </div>
      </div>
    </div>
  );
}
