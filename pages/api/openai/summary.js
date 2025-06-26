import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import { generateSummary } from '../../../lib/openai';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const surveyId = Number(req.query.surveyId);
  const survey = await prisma.survey.findUnique({
    where: { id: surveyId },
    include: { answers: true },
  });
  if (!survey || survey.userId !== session.user.id) {
    return res.status(404).json({ error: 'Not found' });
  }

  let roadmap = await prisma.roadmap.findUnique({ where: { surveyId } });
  if (!roadmap) {
    const content = await generateSummary(survey);
    roadmap = await prisma.roadmap.create({ data: { surveyId, content } });
  }
  res.json({ roadmap });
}
