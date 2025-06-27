// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import React, { useState } from "react";
import "./App.css";

function App() {
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRecommendations([]);

    try {
      const res = await fetch(`http://localhost:5000/recommend?movie=${movie}`);
      const data = await res.json();

      if (res.ok) {
        setRecommendations(data.recommendations);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Server error. Is Flask running?");
    }
  };

  return (
    <div className="App">
      <h1>🎬 Movie Recommender</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          placeholder="Enter movie title"
          required
        />
        <button type="submit">Get Recommendations</button>
      </form>

      {error && <p className="error">{error}</p>}

      {recommendations.length > 0 && (
        <div className="results">
          <h2>Recommended Movies:</h2>
          <ul>
            {recommendations.map((movie, index) => (
              <li key={index}>
                <p>{movie.title}</p>
                {movie.poster && (
                  <img src={movie.poster} alt={movie.title} width="150" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
