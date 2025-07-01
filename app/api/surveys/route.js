import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/authOptions';
import prisma from '../../../lib/prisma';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const survey = await prisma.survey.create({
    data: { userId: session.user.id },
  });
  return NextResponse.json(survey);
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const surveys = await prisma.survey.findMany({
    where: { userId: session.user.id },
  });
  return NextResponse.json(surveys);
} 