import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/authOptions';
import prisma from '../../../lib/prisma';
import { getDevSession } from '../../../lib/devSession';

export async function GET(req) {
  let session = getDevSession();
  if (!session) session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const surveys = await prisma.survey.findMany({ where: { userId: user.id } });
  return NextResponse.json(surveys);
}

export async function POST(req) {
  let session = getDevSession();
  if (!session) session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const data = await req.json();
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  const survey = await prisma.survey.create({
    data: {
      userId: user.id,
      title: data.title.trim(),
    },
  });
  return NextResponse.json(survey);
} 