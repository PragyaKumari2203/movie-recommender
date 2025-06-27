import requests
from flask import Flask, request, jsonify
import pickle
from flask_cors import CORS

import os
from dotenv import load_dotenv

load_dotenv()  # Load from .env
OMDB_API_KEY = os.getenv('OMDB_API_KEY')

app = Flask(__name__)
CORS(app)

# Load .pkl files from model folder
base_dir = os.path.dirname(os.path.abspath(__file__))
model_dir = os.path.join(base_dir, 'models')

movies = pickle.load(open(os.path.join(model_dir, 'movies.pkl'), 'rb'))
similarity = pickle.load(open(os.path.join(model_dir, 'similarity.pkl'), 'rb'))

# Fetch poster from OMDb using title
def fetch_poster(title):
    url = f"http://www.omdbapi.com/?apikey={OMDB_API_KEY}&t={title}"
    res = requests.get(url)
    data = res.json()
    return data.get('Poster', None)

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
