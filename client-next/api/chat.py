import json
import os
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-pro")

def handler(request, response):
    # Vercel passes a request object
    if request.method != "POST":
        response.status_code = 405
        response.headers["Content-Type"] = "application/json"
        return response.send(json.dumps({"error": "Method not allowed"}))

    try:
        data = request.json() or {}
        query = data.get("query", "").strip()

        if not query:
            return response.send(json.dumps({"response": ""}))

        # Generate content
        result = model.generate_content(query)
        return response.send(json.dumps({"response": result.text}))

    except Exception as e:
        response.status_code = 500
        return response.send(json.dumps({"error": str(e)}))
