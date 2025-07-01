import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/authOptions';
import prisma from '../../../../../lib/prisma';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const surveyId = params.id;
    const survey = await prisma.survey.findUnique({ where: { id: surveyId } });
    if (!survey || survey.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { name, description } = await req.json();
    const updated = await prisma.survey.update({
      where: { id: surveyId },
      data: { name, description },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('/api/surveys/[id]/intro error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
} 