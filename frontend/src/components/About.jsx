import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-800 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400">
          About MovieRecs 🎬
        </h1>

        <p className="text-lg leading-relaxed text-gray-300 mb-4">
          <span className="font-semibold text-white">MovieRecs</span> is a simple and intuitive movie recommendation
          platform built using <span className="text-yellow-300">React</span>, <span className="text-yellow-300">Flask</span>, and the <span className="text-yellow-300">OMDb API</span>. It uses a
          content-based recommendation engine that suggests similar movies based
          on the one you search for.
        </p>

        <p className="text-lg leading-relaxed text-gray-300 mb-4">
          This project demonstrates how machine learning models (trained on movie
          similarity), frontend components, and real-time external APIs can work
          together to provide useful recommendations to users.
        </p>

        <div className="mt-8 text-center">
          <a
            href="https://www.omdbapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-blue-400 hover:text-yellow-400 transition underline"
          >
            Learn more about OMDb API →
          </a>
        </div>
      </div>
    </div>
  );
}
