import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function timeoutPromise(promise, ms) {
  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => reject(new Error('OpenAI API call timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeout));
}

export async function generateNext(survey) {
  const businessContext = survey.name ? `Business: ${survey.name}` : '';
  const businessDescription = survey.description ? `Description: ${survey.description}` : '';
  
  const prompt = `You are an expert business optimization consultant with 20+ years of experience helping companies identify revenue leaks, operational inefficiencies, and growth opportunities.

${businessContext}
${businessDescription}

Previous answers from the business owner:
${survey.answers.map(a => `- ${a.text}`).join('\n')}

Based on these answers, generate:
1. ONE targeted question that will reveal the biggest operational inefficiency, revenue leak, or cost drain in their business
2. ONE specific "quick win" - an actionable improvement they can implement immediately (within 24-48 hours) to save money, time, or increase revenue

Focus on:
- Operational bottlenecks
- Revenue leakage points
- Unnecessary costs
- Time-wasting processes
- Customer experience gaps
- Employee productivity issues
- Technology inefficiencies

Format your response as:
QUESTION: [Your targeted question]
QUICK WIN: [Specific actionable improvement with expected impact]`;

  try {
    const res = await timeoutPromise(
      openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
      20000 // 20 seconds
    );
    const text = res.choices[0].message.content || '';
    const questionMatch = text.match(/QUESTION:\s*(.+?)(?=\n|$)/);
    const quickWinMatch = text.match(/QUICK WIN:\s*(.+?)(?=\n|$)/);
    return {
      question: questionMatch ? questionMatch[1].trim() : 'What is your biggest operational challenge right now?',
      suggestion: quickWinMatch ? quickWinMatch[1].trim() : 'Review your current processes for immediate optimization opportunities.'
    };
  } catch (error) {
    console.error('OpenAI generateNext error:', error);
    return {
      question: 'Sorry, we could not generate a question at this time. Please try again later.',
      suggestion: 'OpenAI API error: ' + error.message
    };
  }
}

export async function generateSummary(survey) {
  const businessContext = survey.name ? `Business: ${survey.name}` : '';
  const businessDescription = survey.description ? `Description: ${survey.description}` : '';
  
  const prompt = `You are a senior business optimization consultant creating a strategic roadmap for a company.

${businessContext}
${businessDescription}

Business owner's responses:
${survey.answers.map(a => `- ${a.text}`).join('\n')}

Create a comprehensive business optimization roadmap with:

1. **CRITICAL ISSUES** (3-5 major problems identified)
2. **QUICK WINS** (5-7 immediate actions with expected ROI)
3. **STRATEGIC ROADMAP** (3-month, 6-month, 12-month phases)
4. **EXPECTED IMPACT** (Revenue increase, cost savings, time savings)

Format as a professional business report with clear sections and actionable recommendations.`;

  try {
    const res = await timeoutPromise(
      openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      }),
      30000 // 30 seconds
    );
    return res.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI generateSummary error:', error);
    return 'Sorry, we could not generate a summary at this time. Please try again later. OpenAI API error: ' + error.message;
  }
}
