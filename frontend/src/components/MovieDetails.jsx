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
  const [videoId, setVideoId] = useState(null);

  const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const watchTrailer = async (movieTitle) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          movieTitle + " trailer"
        )}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`
      );

      if (response.status === 200 && response.data.items.length > 0) {
        const id = response.data.items[0].id.videoId;
        setVideoId(id);
      } else {
        setError("Trailer not found");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch trailer");
    }
  };

  useEffect(() => {
    if (!movieTitle) {
      setError("No movie title provided");
      return;
    }

    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
            movieTitle
          )}`
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
  }, [movieTitle, OMDB_API_KEY]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
        <div className="bg-gray-700 p-6 rounded-xl shadow-sm max-w-md w-full text-center">
          <p className="text-red-500 text-lg mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm w-full sm:w-auto"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex space-x-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-gray-700 text-lg font-medium">Loading movie details...</p>
      <p className="text-gray-500 text-sm mt-2">Fetching the finest details for you</p>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-800 py-4 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button - Improved mobile sizing */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm sm:text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to results
        </button>

        {/* Movie Card - Stacked on mobile, side-by-side on larger screens */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Poster Image - Full width on mobile, fixed width on larger screens */}
            <div className="w-full sm:w-1/3 lg:w-1/4">
              <div className="relative pt-[150%] overflow-hidden">
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : "/default-poster.jpg"}
                  alt={movie.Title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/default-poster.jpg";
                    e.target.className = "absolute inset-0 w-full h-full object-contain bg-gray-100 p-4";
                  }}
                />
              </div>
            </div>

            {/* Movie Details - Full width on mobile, 2/3 on larger screens */}
            <div className="p-4 sm:p-6 md:p-8 w-full sm:w-2/3 lg:w-3/4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-tight">
                {movie.Title}
              </h1>
              
              {/* Metadata row - wraps on small screens */}
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                  {movie.Year}
                </span>
                <span className="hidden sm:inline text-gray-400">•</span>
                <span className="text-gray-600 text-sm sm:text-base">{movie.Runtime}</span>
                <span className="hidden sm:inline text-gray-400">•</span>
                <span className="text-gray-600 text-sm sm:text-base">{movie.Rated}</span>
              </div>

              {/* Details grid - 1 column on mobile, 2 on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 text-sm">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Genre</p>
                  <p className="font-medium text-sm sm:text-base">{movie.Genre}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Director</p>
                  <p className="font-medium text-sm sm:text-base">{movie.Director}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Cast</p>
                  <p className="font-medium text-sm sm:text-base">{movie.Actors}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Language</p>
                  <p className="font-medium text-sm sm:text-base">{movie.Language}</p>
                </div>
              </div>

              {/* Action Buttons - Stacked on mobile, inline on larger screens */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
                <button
                  onClick={() => setShowPlot(!showPlot)}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                    showPlot ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {showPlot ? "Hide Plot" : "Show Plot"}
                </button>

                <button
                  onClick={() => watchTrailer(movieTitle)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
                >
                  Watch Trailer
                </button>
              </div>

              {showPlot && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 text-sm sm:text-base mb-2">Plot</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{movie.Plot}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trailer Section - Responsive iframe */}
        {videoId && (
          <div className="mt-6 bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Trailer</h2>
            </div>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96"
                src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
                title="YouTube trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}