from flask import Flask, render_template, request
import openai
from flask import request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Replace 'YOUR_ORGANIZATION' and 'YOUR_SECRET_KEY' with your actual OpenAI organization and secret key
openai.api_key = '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'



@app.route('/generate_lyrics', methods=['POST'])
def generate_lyrics():
    data = request.json  # Access JSON data from request body
    theme = data.get('theme')
    sentiment = data.get('sentiment')

    if theme is None or sentiment is None:
        return jsonify({'error': 'Theme and sentiment are required'}), 400

    # Generate lyrics using OpenAI GPT-3
    lyrics = generate_lyrics_openai(theme, sentiment)
    musicType= getMusicType (lyrics)

    return jsonify({'lyrics': lyrics , 'musicType':musicType})

def generate_lyrics_openai(theme, sentiment):
    # Use OpenAI GPT-3 for lyric generation
    prompt = f"Write a full song about {theme} with a {sentiment} sentiment."
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt=prompt,
        max_tokens=150,  # Adjust as needed
        temperature=0.8,  # Adjust as needed
        top_p=0.9  
    )

    return response['choices'][0]['text']
def getMusicType(data):
    # Use OpenAI GPT-3 for lyric generation
    prompt = f"Take this lyrics {data} and strictly give exactly three suitable music patterns and styles names ONLY in a list form"
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt=prompt,
        max_tokens=150,  # Adjust as needed
        temperature=0.8,  # Adjust as needed
        top_p=0.9  # Adjust as needed
    )

    return response['choices'][0]['text']

if __name__ == '__main__':
    app.run(debug=True)
