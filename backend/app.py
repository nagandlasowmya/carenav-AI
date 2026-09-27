from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import sys
import os


# =========================
# FRONTEND CONNECTION
# =========================

FRONTEND_FOLDER = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "frontend")
)

app = Flask(
    __name__,
    static_folder=FRONTEND_FOLDER,
    static_url_path=""
)

CORS(app)


# =========================
# AI MODULE CONNECTION
# =========================

AI_FOLDER = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "ai")
)

sys.path.append(AI_FOLDER)

from ai_model import analyze_symptoms


# =========================
# DATABASE CONNECTION
# =========================

DATABASE_FILE = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "database",
        "hospitals.json"
    )
)


def load_hospitals():

    with open(DATABASE_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


# =========================
# HOME
# =========================

@app.route("/")
def home():

    return send_from_directory(
        FRONTEND_FOLDER,
        "login.html"
    )


# =========================
# AI SYMPTOM ANALYSIS
# =========================

@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    symptoms = data.get("symptoms", "").strip()

    if not symptoms:

        return jsonify({
            "error": "Please enter your symptoms."
        }), 400

    result = analyze_symptoms(symptoms)

    return jsonify(result)


# =========================
# GET ALL HOSPITALS
# =========================

@app.route("/hospitals", methods=["GET"])
def get_hospitals():

    hospitals = load_hospitals()

    return jsonify(hospitals)


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )