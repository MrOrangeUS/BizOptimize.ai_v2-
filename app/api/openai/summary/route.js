import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import prisma from '../../../../lib/prisma';
import { generateSummary } from '../../../../lib/openai';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { surveyId } = await req.json();
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: { answers: true },
    });
    if (!survey || survey.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    let roadmap = await prisma.roadmap.findUnique({ where: { surveyId } });
    if (!roadmap) {
      const content = await generateSummary(survey);
      roadmap = await prisma.roadmap.create({ data: { surveyId, content } });
    }
    return NextResponse.json({ roadmap });
  } catch (error) {
    console.error('/api/openai/summary error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
} 