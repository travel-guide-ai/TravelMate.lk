
import React from 'react';

const categories = [
  { name: 'Beaches', icon: '🏖️', desc: 'Relax on sandy shores.' },
  { name: 'Mountains', icon: '🏔️', desc: 'Explore scenic peaks.' },
  { name: 'Cities', icon: '🏙️', desc: 'Discover vibrant cities.' },
  { name: 'Wildlife', icon: '🦁', desc: 'Experience nature & wildlife.' },
];

const promotions = [
  { title: 'Summer Sale', description: 'Up to 30% off on selected destinations!' },
  { title: 'Family Packages', description: 'Special deals for families.' },
];

export default function CategoriesPromotions() {
  return (
    <section className="flex flex-wrap gap-8 justify-between my-10" aria-label="Categories and Promotions">
      <div className="flex-1 min-w-[220px] bg-blue-50 rounded-xl shadow p-6" aria-label="Categories">
        <h4 className="mb-3 text-blue-600 text-lg font-semibold">Categories</h4>
        <ul className="flex gap-6 flex-wrap list-none p-0 m-0">
          {categories.map((cat) => (
            <li className="flex flex-col items-center bg-white rounded-lg px-4 py-3 shadow min-w-[90px] focus:outline-none focus:ring-2 focus:ring-blue-300" key={cat.name} tabIndex={0} aria-label={cat.name + ': ' + cat.desc}>
              <span className="text-2xl mb-1" aria-hidden="true">{cat.icon}</span>
              <span className="font-semibold mb-0.5">{cat.name}</span>
              <span className="text-gray-500 text-sm text-center">{cat.desc}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 min-w-[220px] bg-blue-50 rounded-xl shadow p-6" aria-label="Promotions">
        <h4 className="mb-3 text-blue-600 text-lg font-semibold">Promotions</h4>
        <ul className="list-disc ml-5">
          {promotions.map((promo) => (
            <li key={promo.title} className="mb-2 text-base">
              <strong>{promo.title}:</strong> {promo.description}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
