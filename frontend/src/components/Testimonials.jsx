import React from "react";

const testimonials = [
  {
    name: "Sarah W.",
    text: "TravelMate made planning my trip so easy and fun! Highly recommend.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "James L.",
    text: "The best travel deals and amazing customer service.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya S.",
    text: "I found unique destinations I never would have discovered on my own!",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Travelers Say</h2>
        <p className="text-gray-500">Real stories from our happy customers</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-blue-50 rounded-xl p-6 shadow text-center">
            <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full mx-auto mb-4" />
            <p className="text-gray-700 mb-2">"{t.text}"</p>
            <div className="font-semibold text-blue-700">{t.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
