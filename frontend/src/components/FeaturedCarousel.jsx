
import React, { useState } from 'react';

const destinations = [
  { id: 1, name: 'Maldives', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', description: 'Tropical paradise with crystal clear waters.' },
  { id: 2, name: 'Sri Lanka', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80', description: 'Island of adventure, culture, and nature.' },
  { id: 3, name: 'Thailand', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', description: 'Vibrant cities and stunning beaches.' },
];

export default function FeaturedCarousel() {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((current + 1) % destinations.length);
  const prev = () => setCurrent((current - 1 + destinations.length) % destinations.length);

  return (
    <section className="flex items-center justify-center gap-6 my-10" aria-label="Featured destinations">
      <button
        className="bg-white border-2 border-blue-500 text-blue-500 rounded-full w-11 h-11 text-2xl flex items-center justify-center shadow hover:bg-blue-500 hover:text-white transition"
        onClick={prev}
        aria-label="Previous destination"
      >
        &#60;
      </button>
      <div className="text-center bg-white rounded-xl shadow-lg px-8 py-6 min-w-[280px] max-w-xs outline-none" tabIndex={0} aria-live="polite">
        <img
          src={destinations[current].image}
          alt={destinations[current].name + ' - ' + destinations[current].description}
          loading="lazy"
          className="w-full max-w-xs h-48 object-cover rounded-lg shadow mb-3"
        />
        <h3 className="text-xl font-semibold text-blue-600 mb-1">{destinations[current].name}</h3>
        <p className="text-gray-600 text-base">{destinations[current].description}</p>
      </div>
      <button
        className="bg-white border-2 border-blue-500 text-blue-500 rounded-full w-11 h-11 text-2xl flex items-center justify-center shadow hover:bg-blue-500 hover:text-white transition"
        onClick={next}
        aria-label="Next destination"
      >
        &#62;
      </button>
    </section>
  );
}
