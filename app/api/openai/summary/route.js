import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions';
import prisma from '../../../../lib/prisma';
import { generateSummary } from '../../../../lib/openai';
import { getDevSession } from '../../../../lib/devSession';

export async function POST(req) {
  let session = getDevSession();
  if (!session) session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const data = await req.json();
  try {
    const result = await generateSummary(data.answers);
    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 