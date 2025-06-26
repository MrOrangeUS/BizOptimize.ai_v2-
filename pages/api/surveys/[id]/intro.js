import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const surveyId = Number(req.query.id);
  const survey = await prisma.survey.findUnique({ where: { id: surveyId } });
  if (!survey || survey.userId !== session.user.id) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.method === 'POST') {
    const { name, description } = req.body;
    const updated = await prisma.survey.update({
      where: { id: surveyId },
      data: { name, description },
    });
    res.json(updated);
  } else {
    res.status(405).end();
  }
}
