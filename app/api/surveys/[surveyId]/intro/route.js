import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions';
import prisma from '../../../../lib/prisma';
import { getDevSession } from '../../../../lib/devSession';

export async function GET(req, { params }) {
  let session = getDevSession();
  if (!session) session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const survey = await prisma.survey.findUnique({ where: { id: params.surveyId } });
  if (!survey || !user || survey.userId !== user.id)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ name: survey.name, description: survey.description });
}

export async function POST(req, { params }) {
  let session = getDevSession();
  if (!session) session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const survey = await prisma.survey.findUnique({ where: { id: params.surveyId } });
  if (!survey || !user || survey.userId !== user.id)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const data = await req.json();
  const updated = await prisma.survey.update({
    where: { id: params.surveyId },
    data: { name: data.name, description: data.description },
  });
  return NextResponse.json(updated);
} 