# MovieRecs 🎬  
**A Content-Based Movie Recommendation System**  

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
```

### 2. Set up backend
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
source venv/bin/activate  
pip install -r requirements.txt
```

Create .env file:
OMDB_API_KEY=your_api_key_here


Run backend:
```bash
python app.py
```

### 3.  cd frontend
```bash
npm install
```

Create .env file:
VITE_OMDB_API_KEY=your_api_key_here
VITE_YOUTUBE_API_KEY=your_api_key_here

Run frontend
```bash
npm run dev
```


Usage
-Search for any movie in the search bar
-Get instant recommendations of similar movies
-Click any movie to view detailed information
=Watch trailers directly in the app


API Endpoints
Endpoint	  Method	   Description
/suggest	  GET	    Get movie title suggestions
/recommend	GET    	Get movie recommendations

