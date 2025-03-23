# from flask import Flask, Response
# from elevenlabs import ElevenLabs
# from dotenv import load_dotenv
# import os
# import json
# import requests
# import base64
# from flask_cors import CORS
# from google import genai
# from google.genai import types
# from dictionary_extractor import extract_dict_from_response


# load_dotenv()

# app = Flask(__name__)
# # change this two if new
# CORS(app)  # Allow all origins


# agent_id = "vsDNB8N14rbDO2ccHwMs"
# eleven_labs_api_key = "sk_13fb1be20802c065df7c69ae6acfdfc6958ad60e74f86469"
# gemini_api_key = "AIzaSyD68nyQ4AYt49z5kUW5WJ1EZB9h9pU6F9Q"


# client = ElevenLabs(
#     api_key=eleven_labs_api_key,
# )


# client_gemini = genai.Client(api_key=gemini_api_key)


# def audio_analysis(conversation_id):
#     AUDIO_URL = (
#         f"https://api.elevenlabs.io/v1/convai/conversations/{conversation_id}/audio"
#     )
#     headers = {"xi-api-key": eleven_labs_api_key}
#     response = requests.get(AUDIO_URL, headers=headers)
#     if response.status_code == 200:
#         audio_bytes = response.content
#     else:
#         print("No audio found")

#     response = client_gemini.models.generate_content(
#         model="gemini-2.0-flash",
#         contents=[
#             "This audio contains a 911 call. The first speaker is an AI agent, followed by the human caller. Please listen only to the human part of the audio and rate their **confusion** and **fear** levels separately on a scale from 0 to 10. Respond only in this format: Confusion: X, Fear: Y",
#             types.Part.from_bytes(
#                 data=audio_bytes,
#                 mime_type="audio/mp3",
#             ),
#         ],
#     )

#     result = {
#         k.strip().lower(): int(v.strip())
#         for k, v in (pair.split(":") for pair in response.text.split(","))
#     }
#     return result


# def get_audio(conversation_id):
#     AUDIO_URL = (
#         f"https://api.elevenlabs.io/v1/convai/conversations/{conversation_id}/audio"
#     )
#     headers = {"xi-api-key": eleven_labs_api_key}
#     response = requests.get(AUDIO_URL, headers=headers)
#     if response.status_code == 200:
#         encoded_audio = base64.b64encode(response.content).decode("utf-8")
#         return encoded_audio
#     else:
#         return "error getting the audio"


# def emergency_analysis(transcript):
#     prompt = f"""
# You are a 911 AI chatbot. You will receive a transcript of a conversation between a 911 AI agent and a human caller. Your task is to analyze the transcript and extract the following information:

# Return your answer in **Python dictionary format** with these three keys:

# 1. **"emergency title"** – A short phrase (3 to 5 words) that best describes the nature of the emergency.
# 2. **"Level of Emergency"** – One of the following values: ["CRITICAL", "UURGENT", "STANDARD"], based on immediacy, severity, or risk to life/property.
# 3. **"location"** – The full location of the emergency, inferred from the transcript. Try to return a **complete address** that includes:
#    - Street address (if mentioned)
#    - City
#    - State
#    - Zip code
#    - Country  
   
#    If any parts are missing in the transcript, do your best to **infer the most likely location** based on the context (for example, if "Washington, DC" is known as the dispatching city, assume it's in that region). Format it as a full address string.

# Example format as dictionary:

#   "emergency_title": "Apartment fire with smoke",
#   "level_of_emergency": "CRITICAL",
#   "location": "134 Michigan Ave NE, Washington, DC"

# Now analyze this transcript:

# ---  
# {transcript} 
# ---

# """

#     response = client_gemini.models.generate_content(
#         model="gemini-2.0-flash", contents=prompt
#     )
#     answer = response.text
#     return extract_dict_from_response(answer)


# def get_transcript(conversation_id):
#     response = client.conversational_ai.get_conversation(
#         conversation_id=conversation_id,
#     ).json()
#     response = json.loads(response)
#     cleaned_transcript = [
#         {"role": item["role"].strip(), "message": item["message"].strip()}
#         for item in response["transcript"]
#         if item["message"]
#     ]
#     cleaned_emergency_data = emergency_analysis(cleaned_transcript)
#     cleaned_data = {
#         "transcript": cleaned_transcript,
#         "summary": response["analysis"]["transcript_summary"].strip(),
#         "encoded_audio": "Hi",
#         "emotions": audio_analysis(conversation_id),
#         "phone_number": response["conversation_initiation_client_data"][
#             "dynamic_variables"
#         ]["system__caller_id"],
#         "time": response["conversation_initiation_client_data"]["dynamic_variables"][
#             "system__time_utc"
#         ],
#         "type": cleaned_emergency_data["emergency_title"],
#         "severity": cleaned_emergency_data["level_of_emergency"],
#         "location": cleaned_emergency_data["location"],
#     }
#     return cleaned_data


# def convert_to_frontendneeded_format(transcript_with_summary):
#     return {
#         "emergencies": [
#             {"id": convo_id, **data}
#             for convo_id, data in transcript_with_summary.items()
#         ]
#     }


# @app.route("/get_conversation", methods=["GET"])
# def get_conversation():
#     response = client.conversational_ai.get_conversations(
#         agent_id=agent_id,
#     ).json()

#     response_dict = json.loads(response)
#     trasncript_with_summary = {}
#     i = 0
#     for item in response_dict["conversations"]:
#         # if i == 1 or i == 4:
#         #     i += 1
#         #     continue
#         conversation_id = item["conversation_id"]
#         trasncript_with_summary[conversation_id] = get_transcript(conversation_id)

#         # # Convert to JSON
#         # json_output = json.dumps(trasncript_with_summary, indent=4)

#         # # Print or Save JSON
#         # print(json_output)

#         # # If you want to save it as a file
#         # with open("cleaned_chat.json", "w") as file:
#         #     file.write(json_output)
#         #     # audio = get_audio(conversation_id)
#         # if i >= 5:
#         #     break
#         # i += 1
#         break
#     to_be_sent_data = convert_to_frontendneeded_format(trasncript_with_summary)
#     return Response(json.dumps(to_be_sent_data), mimetype="application/json")


# if __name__ == "__main__":
#     app.run(debug=True)
