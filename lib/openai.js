import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export async function generateNext(survey) {
  const prompt = `Based on the answers: ${JSON.stringify(survey.answers)}\nReturn next question followed by a quick win.`;
  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });
  const text = res.data.choices[0].message.content || '';
  const [question, suggestion] = text.split('\n');
  return { question: question?.trim(), suggestion: suggestion?.trim() };
}

export async function generateSummary(survey) {
  const prompt = `Create a concise improvement roadmap for this business based on: ${JSON.stringify(survey.answers)}`;
  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });
  return res.data.choices[0].message.content;
}
