import requests
from flask import Flask, request, jsonify
import pickle
from flask_cors import CORS

import os
from dotenv import load_dotenv

import gdown

from io import BytesIO



load_dotenv()  # Load from .env
OMDB_API_KEY = os.getenv('OMDB_API_KEY')

app = Flask(__name__)
CORS(app)

# Replace these with actual IDs from your Google Drive share links
MOVIES_FILE_ID = '198GxBSMwtrgTKHRCDWUP6cNASngH65c7'
SIMILARITY_FILE_ID = '1ZZtY0mjGSlTS-KzNfOPSQzbItU1pbsh-'

# Load .pkl files from models folder
base_dir = os.path.dirname(os.path.abspath(__file__))

def download_large_file_from_google_drive(file_id):
    URL = "https://drive.google.com/uc?export=download"
    session = requests.Session()

    response = session.get(URL, params={'id': file_id}, stream=True)
    token = get_confirm_token(response)

    if token:
        response = session.get(URL, params={'id': file_id, 'confirm': token}, stream=True)

    file_data = save_response_content(response)

    # ✅ Check if the content is HTML (Google error page)
    if file_data[:5] == b'<!DOC' or b'<html' in file_data[:500].lower():
        raise ValueError("❌ Downloaded file is HTML, not a pickle. Check sharing permissions or quota.")

    return pickle.load(BytesIO(file_data))


def get_confirm_token(response):
    for key, value in response.cookies.items():
        if key.startswith('download_warning'):
            return value
    return None


def save_response_content(response):
    CHUNK_SIZE = 32768
    buffer = bytearray()

    for chunk in response.iter_content(CHUNK_SIZE):
        if chunk:
            buffer.extend(chunk)

    return buffer

def load_or_download(file_id, filename):
    if os.path.exists(filename):
        print(f"✅ Loading {filename} locally...")
        with open(filename, 'rb') as f:
            return pickle.load(f)
    else:
        print(f"⬇️ Downloading {filename} from Google Drive...")
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, filename, quiet=False, fuzzy=True)
        with open(filename, 'rb') as f:
            return pickle.load(f)


movies = load_or_download(MOVIES_FILE_ID, 'movies.pkl')
similarity = load_or_download(SIMILARITY_FILE_ID, 'similarity.pkl')



# Fetch poster from OMDb using title
def fetch_poster(title):
    url = f"http://www.omdbapi.com/?apikey={OMDB_API_KEY}&t={title}"
    res = requests.get(url)
    data = res.json()
    return data.get('Poster', None)

#Suggestion
@app.route('/suggest', methods=['GET'])
def suggest_movies():
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify([])

    # Filter movie titles starting with the query
    suggestions = movies[movies['title'].str.lower().str.startswith(query)]['title'].head(10).tolist()
    return jsonify(suggestions)


# Recommendation logic
def recommend(movie_title):
    movie_title = movie_title.lower()
    matches = movies[movies['title'].str.lower() == movie_title]
    
    if matches.empty:
        return []

    index = matches.index[0]
    distances = list(enumerate(similarity[index]))
    recommended_movies = sorted(distances, key=lambda x: x[1], reverse=True)[1:6]
    
    return [movies.iloc[i[0]].title for i in recommended_movies]

# API route
@app.route('/recommend', methods=['GET'])
def recommend_api():
    movie = request.args.get('movie')
    if not movie:
        return jsonify({'error': 'No movie title provided'}), 400

    titles = recommend(movie)
    if not titles:
        return jsonify({'error': 'Movie not found'}), 404

    # Add poster to each title
    recommendations = [
        {'title': title, 'poster': fetch_poster(title)}
        for title in titles
    ]

    return jsonify({'recommendations': recommendations})

# Run the server
if __name__ == '__main__':
    app.run(debug=True)
