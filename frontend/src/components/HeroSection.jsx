import React from "react";
import GlobalSearchBar from "./GlobalSearchBar";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
          Discover Your Next Adventure
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          Explore breathtaking destinations, create unforgettable itineraries, and travel with confidence.
        </p>
        <GlobalSearchBar />
      </div>
      <div className="absolute inset-0 bg-black/10 z-0"></div>
    </section>
  );
}
