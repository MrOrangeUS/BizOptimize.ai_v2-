import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions';
import prisma from '../../../../lib/prisma';
import { generateNext } from '../../../../lib/openai';

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

    const { question: qText, suggestion } = await generateNext(survey);
    const question = await prisma.question.create({
      data: { text: qText, order: survey.answers.length + 1 },
    });
    if (suggestion) {
      await prisma.suggestion.create({ data: { surveyId, text: suggestion } });
    }
    return NextResponse.json({ question, suggestion, done: false });
  } catch (error) {
    console.error('/api/openai/generate error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
} 