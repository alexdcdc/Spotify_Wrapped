import requests

import google.generativeai as genai
from django.conf import settings

def get_spotify_endpoint_data(endpoint, token, params=None):
    url = f"https://api.spotify.com/v1/{endpoint}"
    headers = {"Authorization": "Bearer " + token}

    response = requests.get(url, headers=headers, params=params)
    if response.ok:
        return response.json()

    raise Exception(
        f"Call to url {url} failed with status code {response.status_code}: {response.text}."
    )


def get_llm_description(genres, artist_names):
    genai.configure(api_key=settings.GOOGLE_CLIENT_ID)
    model = genai.GenerativeModel("gemini-1.5-flash")
    gemini_prompt = f"""
            Create a vibrant personality description for someone who:
            - Frequently listens to genres like: {', '.join(genres)}
            - Enjoys artists such as: {', '.join(artist_names)}

            Please describe the following with clear labels:

            1. Personality & Thinking Style: Describe likely personality traits and thinking style in 3-4 words.
            2. Fashion Choices: Describe probable fashion choices and aesthetic preferences in 3-4 words.
               Make sure it's specific clothing.
            3. Behavior: Describe typical behaviors and habits in 3-4 words.

            Make sure each section starts with the label
            (e.g., "Personality & Thinking Style:", "Fashion Choices:", "Behavior:").
            You also don't have to add the numbers, they're just there to help you structure your response. 
            Do not bold or italicize any text.
            """
    response = model.generate_content(gemini_prompt)
    full_description = response.text.strip()

    personality_description = ""
    fashion_choices = ""
    behavior_description = ""

    if "Personality & Thinking Style:" in full_description:
        personality_description = (
            full_description.split("Personality & Thinking Style:")[1]
            .split("Fashion Choices:")[0]
            .strip()
        )

    if "Fashion Choices:" in full_description:
        fashion_choices = (
            full_description.split("Fashion Choices:")[1].split("Behavior:")[0].strip()
        )

    if "Behavior:" in full_description:
        behavior_description = full_description.split("Behavior:")[1].strip()

    return {
        "personality_description": personality_description,
        "fashion_choices": fashion_choices,
        "behavior_description": behavior_description,
        "based_on": {"genres": list(genres), "artists": artist_names},
    }