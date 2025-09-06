

import Header from './components/Header';
import FeaturedCarousel from './components/FeaturedCarousel';
import GlobalSearchBar from './components/GlobalSearchBar';
import CategoriesPromotions from './components/CategoriesPromotions';
import Footer from './components/Footer';
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';


function App() {
  // Hero slideshow animation using inline style and React state
  const heroImages = [
    "http://static.photos/travel/1200x630/1",
    "http://static.photos/travel/1200x630/2",
    "http://static.photos/travel/1200x630/3",
    "http://static.photos/travel/1200x630/4",
  ];
  const [bgIndex, setBgIndex] = React.useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((i) => (i + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section with Slideshow */}
      <section
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('${heroImages[bgIndex]}')` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Discover Your Next Adventure</h1>
            <p className="text-xl text-white/90 mb-8">AI-powered travel planning for your perfect getaway</p>
          </div>
          {/* AI Optimized Search Bar */}
          <div className="max-w-2xl mx-auto">
            <GlobalSearchBar />
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Destinations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our most popular travel spots curated by our community</p>
          </div>
          <FeaturedCarousel />
        </div>
      </section>

      {/* Categories & Promotions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <CategoriesPromotions />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
