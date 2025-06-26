import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';
import { generateNext } from '../../../../lib/openai';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const surveyId = Number(req.query.id);
  const survey = await prisma.survey.findUnique({
    where: { id: surveyId },
    include: { answers: true },
  });
  if (!survey || survey.userId !== session.user.id) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.method === 'POST') {
    const { text, questionId } = req.body;
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
    const done = updated.answers.length + 1 >= 5;
    res.json({ question, suggestion, done });
  } else {
    res.status(405).end();
  }
}
