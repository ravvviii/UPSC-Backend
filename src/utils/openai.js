// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const generateMCQsFromContent = async (title, content) => {
//   const prompt = `
// Generate 5 multiple choice questions (MCQs) for UPSC preparation based on the following article.
// Each question must have exactly 4 options and one correct answer. 
// Return only valid JSON in this format:
// [
//   {
//     "question": "string",
//     "options": ["option1", "option2", "option3", "option4"],
//     "correctAnswer": "option2"
//   }
// ]

// Title: ${title}
// Content: ${content}
// `;

//   const response = await client.chat.completions.create({
//     model: "gpt-5",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.7,
//   });

//   const text = response.choices[0].message.content.trim();

//   let data;
//   try {
//     data = JSON.parse(text);
//   } catch (err) {
//     console.error("❌ Failed to parse OpenAI response:", text);
//     throw new Error("Invalid JSON from OpenAI");
//   }

//   return data;
// };
