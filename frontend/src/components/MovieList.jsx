import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import '../App.css'

function App() {
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setSuggestions([]);
    setShowSuggestions(false);
    document.getElementById("movie-input")?.blur();
  };

  const fetchRecommendations = async (title) => {
    setError("");
    setRecommendations([]);
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    fetchRecommendations(movie);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            MovieMagic
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover your next favorite film based on movies you love
          </p>
        </header>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mb-12 relative"
        >
          <div className="relative">
            <input
              id="movie-input"
              type="text"
              value={movie}
              onChange={(e) => setMovie(e.target.value)}
              placeholder="Type a movie you love..."
              className="w-full px-6 py-4 rounded-full bg-gray-800 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all text-white placeholder-gray-400 shadow-lg"
              required
              onFocus={() => suggestions.length && setShowSuggestions(true)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
              Recommend
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                {suggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="text-1rem px-6 py-1 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>

        {/* Loading & Error States */}
        <div className="text-center min-h-[200px] flex items-center justify-center">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 px-6 py-4 rounded-xl max-w-md mx-auto">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center">
              <ClipLoader size={60} color="#06b6d4" />
              <p className="mt-4 text-cyan-300">Finding perfect recommendations...</p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {!loading && recommendations.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              You Might Also Enjoy
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((movie, index) => (
                <div
                  key={index}
                  className="group bg-gray-800/50 hover:bg-gray-800/80 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-cyan-400/30"
                >
                  <div className="relative pt-[150%] overflow-hidden bg-gray-800">
  <img
    src={movie.poster}
    alt={movie.title}
    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    onError={(e) => {
      e.target.src = "/default-posterjpeg";
      e.target.className = "absolute inset-0 w-full h-full object-contain p-4";
      e.target.onerror = null; // Prevent infinite loop if default image fails
    }}
  />
</div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 truncate">
                      {movie.title}
                    </h3>
                    <Link
                      to="/details"
                      state={{ movie }}
                      className="inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default App;