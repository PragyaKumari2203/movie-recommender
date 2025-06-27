import React, { useState, useEffect } from "react";
import "../App.css";
import { Link } from "react-router-dom";

function App() {
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch matching movie titles
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (movie.trim().length === 0) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/suggest?q=${movie}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Failed to fetch suggestions");
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [movie]);

  const handleSelectSuggestion = (title) => {
    setMovie(title);
    setShowSuggestions(false);
    fetchRecommendations(title);
  };

  const fetchRecommendations = async (title) => {
    setError("");
    setRecommendations([]);
    try {
      const res = await fetch(`http://localhost:5000/recommend?movie=${title}`);
      const data = await res.json();
      if (res.ok) {
        setRecommendations(data.recommendations);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Server error. Is Flask running?");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecommendations(movie);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white shadow-md px-4">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8 drop-shadow">
        🎬 Movie Recommender
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-center mb-10 relative"
      >
        <div className="w-full md:flex-1 relative">
          <input
            type="text"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            placeholder="Enter movie title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
            required
            onFocus={() => suggestions.length && setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white text-black rounded shadow mt-1 max-h-60 overflow-auto">
              {suggestions.map((suggestion, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold shadow"
        >
          Get Recommendations
        </button>
      </form>

      {error && (
        <p className="text-center text-red-600 font-medium mb-4">{error}</p>
      )}

      {recommendations.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
            Recommended Movies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendations.map((movie, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-xl transition"
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-40 h-auto rounded mb-3 shadow"
                />
                <p className="text-lg font-semibold text-center mb-2 text-blue-900">
                  {movie.title}
                </p>
                <Link
                  to="/details"
                  state={{ movie }}
                  className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                >
                  Know More
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

