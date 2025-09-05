
import Header from './components/Header';
import FeaturedCarousel from './components/FeaturedCarousel';
import GlobalSearchBar from './components/GlobalSearchBar';
import CategoriesPromotions from './components/CategoriesPromotions';
import Footer from './components/Footer';
import { Button } from '@/components/ui/button';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      <main className="flex-1" tabIndex={-1}>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Explore breathtaking destinations, create unforgettable itineraries, and travel with confidence.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Learn More
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/10"></div>
        </section>

        {/* Featured Destinations */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              Featured Destinations
            </h2>
            <FeaturedCarousel />
          </div>
        </section>

        {/* Categories and Promotions */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <CategoriesPromotions />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
