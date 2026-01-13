from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import logging
import os

# -------------------------
# App setup
# -------------------------
app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -------------------------
# Gemini setup
# -------------------------
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

model = genai.GenerativeModel("gemini-1.5-pro")

# -------------------------
# Routes
# -------------------------
@app.route("/", methods=["POST"])
def chat():
    data = request.json or {}
    query = data.get("query", "")

    if not query.strip():
        return jsonify({"response": ""})

    try:
        response = model.generate_content(query)
        return jsonify({"response": response.text})
    except Exception as e:
        logger.exception("Gemini error")
        return jsonify({"error": "Generation failed"}), 500
