import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const survey = await prisma.survey.create({
      data: { userId: session.user.id },
    });
    res.json(survey);
  } else if (req.method === 'GET') {
    const surveys = await prisma.survey.findMany({
      where: { userId: session.user.id },
    });
    res.json(surveys);
  } else {
    res.status(405).end();
  }
}
