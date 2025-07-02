import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, context) {
  const { params } = context;
  const { surveyId } = await params;

  // Validate surveyId as a 24-character hex string
  if (!surveyId || typeof surveyId !== 'string' || !/^[a-fA-F0-9]{24}$/.test(surveyId)) {
    return NextResponse.json({ error: 'Invalid surveyId' }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch survey
    const survey = await prisma.survey.findFirst({
      where: {
        id: surveyId,
        userId: user.id
      }
    });

    if (!survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error('Error fetching survey:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const { params } = context;
  const { surveyId } = await params;

  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();

    // Update survey
    const updatedSurvey = await prisma.survey.update({
      where: {
        id: surveyId,
        userId: user.id
      },
      data: body
    });

    return NextResponse.json(updatedSurvey);
  } catch (error) {
    console.error('Error updating survey:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const { params } = context;
  const { surveyId } = await params;

  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete survey and all related answers
    await prisma.answer.deleteMany({
      where: {
        surveyId: surveyId
      }
    });

    await prisma.survey.delete({
      where: {
        id: surveyId,
        userId: user.id
      }
    });

    return NextResponse.json({ message: 'Survey deleted successfully' });
  } catch (error) {
    console.error('Error deleting survey:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 