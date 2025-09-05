
import React from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalSearchBar() {
  return (
    <form className="flex justify-center my-8" role="search" aria-label="Global search">
      <input
        type="search"
        placeholder="Search destinations, itineraries..."
        aria-label="Search destinations, itineraries"
        name="search"
        autoComplete="off"
        className="w-80 max-w-full px-5 py-3 border-2 border-blue-500 border-r-0 rounded-l-full outline-none text-base bg-blue-50 focus:border-blue-700"
      />
      <Button type="submit" aria-label="Search" className="rounded-l-none rounded-r-full px-6 py-3">
        <span role="img" aria-label="Search icon">🔍</span> Search
      </Button>
    </form>
  );
}

// Removed CSS import as per the requirement

// Refactored form class to use Tailwind CSS
<form className="flex justify-center my-8" role="search" aria-label="Global search">
  <input
    type="search"
    placeholder="Search destinations, itineraries..."
    aria-label="Search destinations, itineraries"
    name="search"
    autoComplete="off"
    className="w-80 max-w-full px-5 py-3 border-2 border-blue-500 border-r-0 rounded-l-full outline-none text-base bg-blue-50 focus:border-blue-700"
  />
  <button
    type="submit"
    aria-label="Search"
    className="px-6 py-3 bg-blue-600 text-white rounded-r-full text-base font-medium hover:bg-blue-700 transition flex items-center gap-2"
  >
    <span role="img" aria-label="Search icon">🔍</span> Search
  </button>
</form>
