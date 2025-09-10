import React from 'react';
import { ArrowRight } from 'lucide-react';

const destinations = [
  {
    name: 'Sigiriya Rock Fortress',
    image: '/src/assets/images/destination-1.jpg',
    description: "Climb the ancient rock citadel and marvel at breathtaking views and history.",
    price: 'From $120',
    delay: 0,
  },
  {
    name: "Udawalawe National Park",
    image: '/src/assets/images/destination-2.jpg',
    description: "Experience Sri Lanka's wild side with elephants and safaris in Udawalawe.",
    price: 'From $90',
    delay: 100,
  },
  {
    name: "Little Adam's Peak View Point",
    image: '/src/assets/images/destination-3.jpg',
    description: "Hike to panoramic vistas in Ella's lush highlands.",
    price: 'From $60',
    delay: 200,
  },
  {
    name: 'Nine Arches Bridge',
    image: '/src/assets/images/destination-4.jpg',
    description: "Witness the iconic colonial-era bridge amidst misty tea fields.",
    price: 'From $50',
    delay: 300,
  },
  {
    name: 'Bentota Beach',
    image: '/src/assets/images/destination-5.jpg',
    description: "Relax on golden sands and enjoy water sports on Sri Lanka's southwest coast.",
    price: 'From $80',
    delay: 400,
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
