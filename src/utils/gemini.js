import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateMCQsFromGemini = async (title, content) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Generate 5 UPSC-style MCQs or previous year questions based on the article below.
Each question must have exactly 4 options and ONE correct answer.
Return only valid JSON in this format:
[
  {
    "question": "string",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": "option2"
  }
]

Title: ${title}
Content: ${content}
`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 40000);

    const result = await model.generateContent(prompt, { signal: controller.signal });
    clearTimeout(timeout);

    const text = result.response.text().trim();
    const cleanText = text.replace(/```(json)?/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("❌ Gemini generation error:", error);
    throw new Error("Gemini failed to generate MCQs");
  }
};





export const evaluateAnswerWithGemini = async (question, answerText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an experienced UPSC examiner.
Evaluate the following answer critically and return a JSON object with the following fields:
{
  "marks": number (0 to 10),
  "feedback": string,
  "suggestions": string[]
}

Question:
${question}

Answer:
${answerText}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const clean = text.replace(/```(json)?/g, "").trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("❌ Gemini evaluation error:", error);
    throw new Error("Gemini failed to evaluate the answer");
  }
};
