import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function reviewCode(input: { language: string; code: string; context?: Record<string, unknown> }) {
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OPENAI_API_KEY not set", suggestions: [] };
  }
  const system = "You are an expert code reviewer. Provide inline findings with line numbers, risks, and fixes.";
  const user = `Language: ${input.language}
Code:
${input.code}`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    temperature: 0.2
  });
  const content = response.choices[0]?.message?.content || "";
  return { content };
}

async function explainCode(input: { language: string; code: string; context?: Record<string, unknown> }) {
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OPENAI_API_KEY not set", explanation: "" };
  }
  const system = "Explain the code clearly, include any gotchas, provide ELI5 and advanced sections.";
  const user = `Language: ${input.language}
Code:
${input.code}`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    temperature: 0.3
  });
  const content = response.choices[0]?.message?.content || "";
  return { content };
}

export const aiService = { reviewCode, explainCode };
