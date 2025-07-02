import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { getDevSession } from '@/lib/devSession';
import { surveyIntroSchema, surveyIdSchema } from '@/lib/schemas';
import { unauthorizedError, notFoundError, validationError, serverError } from '@/lib/apiError';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ surveyId: string }> }
) {
  try {
    const { surveyId } = surveyIdSchema.parse(await params);
    
    let session = getDevSession();
    if (!session) session = await getServerSession(authOptions);
    if (!session) return unauthorizedError();
    
    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    const survey = await prisma.survey.findUnique({ 
      where: { id: surveyId } 
    });
    
    if (!survey || !user || survey.userId !== user.id) {
      return notFoundError('Survey not found or access denied');
    }
    
    return NextResponse.json({ 
      name: survey.title, 
      description: survey.title // Using title as description for now
    });
  } catch (error) {
    console.error('GET /api/surveys/[surveyId]/intro error:', error);
    return serverError('Failed to fetch survey details');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ surveyId: string }> }
) {
  try {
    const { surveyId } = surveyIdSchema.parse(await params);
    const body = surveyIntroSchema.parse(await request.json());
    
    let session = getDevSession();
    if (!session) session = await getServerSession(authOptions);
    if (!session) return unauthorizedError();
    
    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    const survey = await prisma.survey.findUnique({ 
      where: { id: surveyId } 
    });
    
    if (!survey || !user || survey.userId !== user.id) {
      return notFoundError('Survey not found or access denied');
    }
    
    const updated = await prisma.survey.update({
      where: { id: surveyId },
      data: { 
        title: body.name // Map name to title
      },
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('POST /api/surveys/[surveyId]/intro error:', error);
    
    if (error instanceof Error && error.message.includes('ZodError')) {
      return validationError('Invalid request data', { details: error.message });
    }
    
    return serverError('Failed to update survey');
  }
} 