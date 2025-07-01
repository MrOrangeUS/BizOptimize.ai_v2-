import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/authOptions.js';
import prisma from '../../../../lib/prisma';
import { generateNext } from '../../../../lib/openai';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('No session in OpenAI generate');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { surveyId } = await req.json();
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: { answers: true },
    });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    console.log('OpenAI generate surveyId:', surveyId);
    console.log('OpenAI generate session.user:', session.user);
    console.log('OpenAI generate found survey:', survey);
    console.log('OpenAI generate found user:', user);
    if (!survey || !user || survey.userId !== user.id) {
      console.log('OpenAI generate not found or userId mismatch:', survey?.userId, user?.id);
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { question: qText, suggestion } = await generateNext(survey);
    console.log('OpenAI generateNext result:', { qText, suggestion });
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

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
} 