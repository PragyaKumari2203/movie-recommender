import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MovieDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const movieTitle = location.state?.movie?.title;

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [showPlot, setShowPlot] = useState(false);

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  useEffect(() => {
    if (!movieTitle) {
      setError("No movie title provided");
      return;
    }

    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(movieTitle)}`
        );

        if (response.data.Response === "True") {
          setMovie(response.data);
        } else {
          setError("Movie not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movie data");
      }
    };

    fetchMovie();
  }, [movieTitle, API_KEY]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <p className="text-red-600 text-xl font-semibold">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full md:w-64 rounded shadow"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold mb-2 text-blue-800">{movie.Title}</h1>
          <p><span className="font-semibold">Released:</span> {movie.Released}</p>
          <p><span className="font-semibold">Runtime:</span> {movie.Runtime}</p>
          <p><span className="font-semibold">Genre:</span> {movie.Genre}</p>
          <p><span className="font-semibold">Director:</span> {movie.Director}</p>
          <p><span className="font-semibold">Actors:</span> {movie.Actors}</p>
          <p><span className="font-semibold">Language:</span> {movie.Language}</p>

          <button
            onClick={() => setShowPlot(!showPlot)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-fit"
          >
            {showPlot ? "Hide Plot" : "Show Plot"}
          </button>

          {showPlot && (
            <p className="mt-4 italic text-gray-700 border-l-4 border-blue-500 pl-4">
              {movie.Plot}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
