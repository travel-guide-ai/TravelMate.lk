import React from 'react';
import { ArrowRight } from 'lucide-react';

const destinations = [
  {
    name: 'Bali, Indonesia',
    image: 'http://static.photos/travel/640x360/10',
    description: 'Tropical paradise with lush jungles and pristine beaches',
    price: '$899',
    delay: 0,
  },
  {
    name: 'Kyoto, Japan',
    image: 'http://static.photos/travel/640x360/11',
    description: 'Ancient temples and beautiful cherry blossoms',
    price: '$1299',
    delay: 100,
  },
  {
    name: 'Santorini, Greece',
    image: 'http://static.photos/travel/640x360/12',
    description: 'Whitewashed buildings with stunning sea views',
    price: '$1099',
    delay: 200,
  },
  {
    name: 'Banff, Canada',
    image: 'http://static.photos/travel/640x360/13',
    description: 'Majestic mountains and crystal-clear lakes',
    price: '$799',
    delay: 300,
  },
];

export default function FeaturedCarousel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {destinations.map((dest, i) => (
        <div
          key={dest.name}
          className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
        >
          <div
            className="h-48 bg-cover bg-center"
            style={{ backgroundImage: `url('${dest.image}')` }}
          ></div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{dest.name}</h3>
            <p className="text-gray-600 mb-4">{dest.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-medium">From {dest.price}</span>
              <button className="text-blue-500 hover:text-blue-700">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
