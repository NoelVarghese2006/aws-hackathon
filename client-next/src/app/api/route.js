import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function POST(req) {
  try {
    const body = await req.json();
    const { query } = body || {};

    if (!query || !query.trim()) {
      return new Response(JSON.stringify({ response: "" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    const result = await model.generateContent(query);

    // `result.response.text()` may be a function in some SDK versions.
    const text = typeof result?.response?.text === "function" ? result.response.text() : result?.response?.text || "";

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || "Something went wrong" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
