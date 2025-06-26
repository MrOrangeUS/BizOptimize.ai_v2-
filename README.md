# Generative Business Diagnostic MVP

Minimal Next.js app with Prisma, NextAuth, Tailwind CSS and OpenAI.

## CLI Setup

```bash
npx create-next-app bizoptimize
cd bizoptimize
npm install next-auth prisma @prisma/client tailwindcss postcss autoprefixer openai
npx prisma init
npx tailwindcss init -p
```

## Run Locally

```bash
npm run dev
```

## Deploy

Push to GitHub, connect the repo to Vercel, add environment variables from `.env.example`, and deploy.
