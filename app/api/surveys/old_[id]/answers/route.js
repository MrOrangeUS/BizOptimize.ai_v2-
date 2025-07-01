import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/authOptions';
import prisma from '../../../../../lib/prisma';
import { generateNext } from '../../../../../lib/openai';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const surveyId = params.id;
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: { answers: true },
    });
    if (!survey || survey.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { text, questionId } = await req.json();
    await prisma.answer.create({ data: { surveyId, questionId, text } });

    const updated = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: { answers: true },
    });
    const { question: qText, suggestion } = await generateNext(updated);
    const question = await prisma.question.create({
      data: { text: qText, order: updated.answers.length + 1 },
    });
    await prisma.suggestion.create({ data: { surveyId, text: suggestion } });
    const done = updated.answers.length + 1 >= 12;
    return NextResponse.json({ question, suggestion, done });
  } catch (error) {
    console.error('/api/surveys/[id]/answers error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
} 