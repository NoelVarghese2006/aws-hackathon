import { NextApiRequest, NextApiResponse } from "next";
import genai from "google-generativeai";

genai.configure({
  apiKey: process.env.GEMINI_API_KEY,
});

const model = new genai.GenerativeModel("gemini-1.5-pro");

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query } = req.body || {};

    if (!query || !query.trim()) {
      return res.status(200).json({ response: "" });
    }

    // Generate content
    const response = await model.generate_content(query);

    return res.status(200).json({ response: response.text });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
