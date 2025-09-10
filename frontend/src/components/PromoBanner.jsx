import React from "react";

export default function PromoBanner() {
  return (
    <div className="bg-blue-100 border border-blue-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <div className="text-lg md:text-xl font-semibold text-blue-700">
        ✈️ Summer Sale! Get up to 30% off on select destinations.
      </div>
      <a href="#" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
        Book Now
      </a>
    </div>
  );
}
