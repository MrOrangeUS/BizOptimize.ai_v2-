import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/authOptions';
import prisma from '../../../../../lib/prisma';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('No session in POST');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const surveyId = params.id;
    const survey = await prisma.survey.findUnique({ where: { id: surveyId } });
    console.log('POST surveyId:', surveyId);
    console.log('POST session.user:', session.user);
    console.log('POST found survey:', survey);
    if (!survey || survey.userId !== session.user.id) {
      console.log('POST not found or userId mismatch:', survey?.userId, session.user.id);
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

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('No session in GET');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const surveyId = params.id;
    const survey = await prisma.survey.findUnique({ where: { id: surveyId } });
    console.log('GET surveyId:', surveyId);
    console.log('GET session.user:', session.user);
    console.log('GET found survey:', survey);
    if (!survey || survey.userId !== session.user.id) {
      console.log('GET not found or userId mismatch:', survey?.userId, session.user.id);
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ name: survey.name, description: survey.description });
  } catch (error) {
    console.error('/api/surveys/[id]/intro GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
} 