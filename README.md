# MovieRecs 🎬  
**A Content-Based Movie Recommendation System**  

![Demo GIF](https://via.placeholder.com/800x400?text=MovieRecs+Demo+GIF+Here)  
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://python.org)  
[![React](https://img.shields.io/badge/React-18.2+-61DAFB)](https://reactjs.org)  
[![Flask](https://img.shields.io/badge/Flask-2.3-lightgrey)](https://flask.palletsprojects.com)  

## Features ✨  
- 🔍 **Smart Search** with typeahead suggestions  
- 🎯 **Personalized Recommendations** based on movie content  
- 📽️ **Rich Movie Details** including posters, plots and trailers  
- ⚡ **Blazing Fast** performance with pre-computed similarity matrix

## Tech Stack 🛠️  
**Frontend**:  
- React 18 + Vite  
- Tailwind CSS  
- React Router 6  
- Axios for API calls  

**Backend**:  
- Flask REST API  
- Scikit-learn for cosine similarity  
- OMDb API integration  

## Installation  

### 1. Clone the repository  
```bash
git clone https://github.com/PragyaKumari2203/movierecs.git
cd movierecs

### 2. Set up backend
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
source venv/bin/activate  
pip install -r requirements.txt

Create .env file:
OMDB_API_KEY=your_api_key_here

Run backend:
python app.py

### 3.  cd ../frontend
npm install

Create .env file:
VITE_OMDB_API_KEY=your_api_key_here
VITE_YOUTUBE_API_KEY=your_api_key_here

Run frontend:
npm run dev


Usage
Search for any movie in the search bar

Get instant recommendations of similar movies

Click any movie to view detailed information

Watch trailers directly in the app


API Endpoints
Endpoint	Method	Description
/suggest	GET	Get movie title suggestions
/recommend	GET	Get movie recommendations

Screenshots
<div align="center"> <img src="https://via.placeholder.com/400x250?text=Home+Screen" width="30%" alt="Home Screen"> <img src="https://via.placeholder.com/400x250?text=Recommendations" width="30%" alt="Recommendations"> <img src="https://via.placeholder.com/400x250?text=Movie+Details" width="30%" alt="Movie Details"> </div>
