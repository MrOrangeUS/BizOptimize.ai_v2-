import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import { generateNext } from '../../../lib/openai';

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

  const { question: qText, suggestion } = await generateNext(survey);
  const question = await prisma.question.create({
    data: { text: qText, order: survey.answers.length + 1 },
  });
  if (suggestion) {
    await prisma.suggestion.create({ data: { surveyId, text: suggestion } });
  }
  res.json({ question, suggestion, done: false });
}
