from flask import Flask, Response, request
from elevenlabs import ElevenLabs
import json
import requests
import base64
from flask_cors import CORS
from google import genai
from google.genai import types
from pymongo import MongoClient
import time
import ast


def extract_dict_from_response(response_text):
    """
    Extracts a Python dictionary from a code-formatted string response.
    Assumes the dictionary is enclosed in triple backticks and starts with ```python.
    """
    try:
        # Find the first '{' and last '}' to isolate the dictionary content
        start = response_text.find("{")
        end = response_text.rfind("}") + 1

        if start == -1 or end == -1:
            raise ValueError("No dictionary content found in response.")

        dict_str = response_text[start:end]

        # Convert string to actual Python dictionary safely
        data_dict = ast.literal_eval(dict_str)
        return data_dict

    except Exception as e:
        # print("Failed to parse dictionary from response.")
        print("Error:", e)
        return None


# --- Flask setup ---
app = Flask(__name__)
CORS(app)

# Removed API keys and MongoDB uri for security reasons

# --- API Keys & Agent ---
agent_id = ""
eleven_labs_api_key = ""
gemini_api_key = ""

# --- ElevenLabs & Gemini Clients ---
client = ElevenLabs(api_key=eleven_labs_api_key)
client_gemini = genai.Client(api_key=gemini_api_key)

# --- MongoDB Atlas Setup ---
mongo_uri = ""
mongo_client = MongoClient(
    mongo_uri,
    tls=True,
    tlsAllowInvalidCertificates=True,
    serverSelectionTimeoutMS=5000,
)

db = mongo_client["emergency_db"]
collection = db["conversations"]


# --- Core Functions ---


def audio_analysis(conversation_id):
    time.sleep(3)
    AUDIO_URL = (
        f"https://api.elevenlabs.io/v1/convai/conversations/{conversation_id}/audio"
    )
    headers = {"xi-api-key": eleven_labs_api_key}
    response = requests.get(AUDIO_URL, headers=headers)
    if response.status_code == 200:
        audio_bytes = response.content
    else:
        print("No audio found")
        return {"confusion": 0, "fear": 0}

    response = client_gemini.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            "This audio contains a 911 call. The first speaker is an AI agent, followed by the human caller. Please listen only to the human part of the audio and rate their **confusion** and **fear** levels separately on a scale from 0 to 10. Respond only in this format: Confusion: X, Fear: Y",
            types.Part.from_bytes(data=audio_bytes, mime_type="audio/mp3"),
        ],
    )

    result = {
        k.strip().lower(): int(v.strip())
        for k, v in (pair.split(":") for pair in response.text.split(","))
    }
    return result


def get_audio(conversation_id):
    AUDIO_URL = (
        f"https://api.elevenlabs.io/v1/convai/conversations/{conversation_id}/audio"
    )
    headers = {"xi-api-key": eleven_labs_api_key}
    response = requests.get(AUDIO_URL, headers=headers)
    if response.status_code == 200:
        return base64.b64encode(response.content).decode("utf-8")
    else:
        return "error getting the audio"


def emergency_analysis(transcript):
    prompt = f"""
You are a 911 AI chatbot. You will receive a transcript of a conversation between a 911 AI agent and a human caller. Your task is to analyze the transcript and extract the following information:

Return your answer in **Python dictionary format** with these three keys:

1. **"emergency title"** – A short phrase (3 to 5 words) that best describes the nature of the emergency.
2. **"Level of Emergency"** – One of the following values: ["CRITICAL", "URGENT", "STANDARD"], based on immediacy, severity, or risk to life/property.
3. **"location"** – The full location of the emergency, inferred from the transcript. Try to return a **complete address** that includes:
   - Street address (if mentioned)
   - City
   - State
   - Zip code
   - Country  

Example format as dictionary:

  "emergency_title": "Apartment fire with smoke",
  "level_of_emergency": "CRITICAL",
  "location": "134 Michigan Ave NE, Washington, DC"

Now analyze this transcript:

---  
{transcript} 
---

"""
    response = client_gemini.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    )
    answer = response.text
    return extract_dict_from_response(answer)


def get_transcript(conversation_id):
    time.sleep(2)
    response = client.conversational_ai.get_conversation(
        conversation_id=conversation_id,
    ).json()
    response = json.loads(response)

    cleaned_transcript = [
        {"role": item["role"].strip(), "message": item["message"].strip()}
        for item in response["transcript"]
        if item["message"]
    ]

    cleaned_emergency_data = emergency_analysis(cleaned_transcript)

    cleaned_data = {
        "transcript": cleaned_transcript,
        "summary": response["analysis"]["transcript_summary"].strip(),
        "encoded_audio": get_audio(conversation_id),
        "emotions": audio_analysis(conversation_id),
        "phone_number": response["conversation_initiation_client_data"][
            "dynamic_variables"
        ]["system__caller_id"],
        "time": response["conversation_initiation_client_data"]["dynamic_variables"][
            "system__time_utc"
        ],
        "type": cleaned_emergency_data["emergency_title"],
        "severity": cleaned_emergency_data["level_of_emergency"],
        "location": cleaned_emergency_data["location"],
        "status": "open",
        "id": conversation_id,
    }
    return cleaned_data


@app.route("/get_conversation", methods=["GET"])
def get_conversation():
    try:
        data = list(
            collection.find({}, {"_id": 0}).sort("_id", -1)
        )  # optional: sort newest first
        return Response(json.dumps({"emergencies": data}), mimetype="application/json")
    except Exception as e:
        print("[ERROR] /get_conversation failed:", e)
        return Response(
            json.dumps({"error": str(e)}), status=500, mimetype="application/json"
        )


@app.route("/close_conversation", methods=["POST"])
def close_conversation():
    try:
        data = request.json
        conversation_id = data.get("id")

        if not conversation_id:
            return Response(
                json.dumps({"error": "Missing conversation id"}),
                status=400,
                mimetype="application/json",
            )

        result = collection.update_one(
            {"id": conversation_id}, {"$set": {"status": "close"}}
        )
        print("database updated")

        if result.matched_count == 0:
            return Response(
                json.dumps({"error": "Conversation not found"}),
                status=404,
                mimetype="application/json",
            )

        return Response(
            json.dumps(
                {"message": f"Conversation {conversation_id} status updated to 'close'"}
            ),
            mimetype="application/json",
        )

    except Exception as e:
        return Response(
            json.dumps({"error": str(e)}), status=500, mimetype="application/json"
        )
