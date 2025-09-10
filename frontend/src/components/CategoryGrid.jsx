import React from "react";
import { Compass, Mountain, Sun, Landmark, Hotel, MapPin } from "lucide-react";

const categories = [
  { name: "Adventure", icon: <Mountain className="w-6 h-6" /> },
  { name: "Beach", icon: <Sun className="w-6 h-6" /> },
  { name: "Cultural", icon: <Landmark className="w-6 h-6" /> },
  { name: "Luxury", icon: <Hotel className="w-6 h-6" /> },
  { name: "Nature", icon: <Compass className="w-6 h-6" /> },
  { name: "City", icon: <MapPin className="w-6 h-6" /> },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className="flex flex-col items-center bg-white rounded-xl shadow p-4 hover:bg-blue-50 transition"
        >
          <div className="mb-2 text-blue-600">{cat.icon}</div>
          <div className="font-medium text-gray-700">{cat.name}</div>
        </div>
      ))}
    </div>
  );
}
