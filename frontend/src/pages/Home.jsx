
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Star, StarOff, Clock, Compass, Briefcase, Umbrella } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalSearchBar from '../components/GlobalSearchBar';
import FeaturedCarousel from '../components/FeaturedCarousel';
import CategoriesPromotions from '../components/CategoriesPromotions';
import Testimonials from '../components/Testimonials';

function Home() {
  // Hero slideshow images (Sri Lankan destinations)
  const heroSlides = [
    {
      img: '/src/assets/images/destination-1.jpg',
      title: "Sigiriya Rock Fortress",
      desc: "Climb the ancient rock citadel and marvel at breathtaking views and history."
    },
    {
      img: '/src/assets/images/destination-2.jpg',
      title: "Udawalawe National Park",
      desc: "Experience Sri Lanka's wild side with elephants and safaris in Udawalawe."
    },
    {
      img: '/src/assets/images/destination-3.jpg',
      title: "Little Adam's Peak View Point",
      desc: "Hike to panoramic vistas in Ella's lush highlands."
    },
    {
      img: '/src/assets/images/destination-4.jpg',
      title: "Nine Arches Bridge",
      desc: "Witness the iconic colonial-era bridge amidst misty tea fields."
    },
    {
      img: '/src/assets/images/destination-5.jpg',
      title: "Bentota Beach",
      desc: "Relax on golden sands and enjoy water sports on Sri Lanka's southwest coast."
    },
  ];

  // Slideshow state
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Only Sri Lankan destinations
  const destinations = [
    { city: "Sigiriya", country: "Sri Lanka", img: '/src/assets/images/destination-1.jpg' },
    { city: "Udawalawe National Park", country: "Sri Lanka", img: '/src/assets/images/destination-2.jpg' },
    { city: "Little Adam's Peak", country: "Sri Lanka", img: '/src/assets/images/destination-3.jpg' },
    { city: "Nine Arches Bridge", country: "Sri Lanka", img: '/src/assets/images/destination-4.jpg' },
    { city: "Bentota Beach", country: "Sri Lanka", img: '/src/assets/images/destination-5.jpg' },
  ];

  // Popular tours (Sri Lankan destinations only)
  const popularTours = [
    {
      img: '/src/assets/images/destination-1.jpg',
      days: 3,
      price: 120,
      rating: 5,
      location: 'Sigiriya, Sri Lanka',
      title: 'Sigiriya Rock Fortress Adventure',
    },
    {
      img: '/src/assets/images/destination-2.jpg',
      days: 2,
      price: 90,
      rating: 4,
      location: 'Udawalawe, Sri Lanka',
      title: 'Udawalawe National Park Safari',
    },
    {
      img: '/src/assets/images/destination-3.jpg',
      days: 1,
      price: 60,
      rating: 5,
      location: 'Ella, Sri Lanka',
      title: "Little Adam's Peak Hiking Tour",
    },
    {
      img: '/src/assets/images/destination-4.jpg',
      days: 1,
      price: 50,
      rating: 4,
      location: 'Ella, Sri Lanka',
      title: 'Nine Arches Bridge & Tea Fields',
    },
    {
      img: '/src/assets/images/destination-5.jpg',
      days: 2,
      price: 80,
      rating: 5,
      location: 'Bentota, Sri Lanka',
      title: 'Bentota Beach Relaxation & Water Sports',
    },
  ];

  // About features (TravelMate value props)
  const aboutFeatures = [
    { icon: <Compass className="w-8 h-8 text-blue-600" />, title: 'Expert Local Guides', text: 'Our certified guides ensure you experience every destination like a true local.' },
    { icon: <Briefcase className="w-8 h-8 text-blue-600" />, title: 'Best Price Guarantee', text: 'We offer competitive pricing and exclusive deals for every traveler.' },
    { icon: <Umbrella className="w-8 h-8 text-blue-600" />, title: '24/7 Support', text: 'Travel worry-free with our dedicated support team, anytime, anywhere.' },
  ];

  // Blog posts (TravelMate content)
  const blogPosts = [
    { img: '/src/assets/images/popular-1.jpg', date: '04 Dec', author: 'TravelMate Team', time: '10:30 AM', title: 'Top 5 Must-Visit Destinations for 2025' },
    { img: '/src/assets/images/blog-2.jpg', date: '12 Nov', author: 'TravelMate Team', time: '09:00 AM', title: 'How to Plan a Stress-Free Vacation' },
    { img: '/src/assets/images/blog-3.jpg', date: '28 Oct', author: 'TravelMate Team', time: '02:15 PM', title: 'Hidden Gems: Underrated Cities to Explore' },
  ];


  return (

    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Slideshow Section - Fullscreen Image with Overlayed Content */}
      <section className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background slideshow image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={heroSlides[slide].img}
            src={heroSlides[slide].img}
            alt={heroSlides[slide].title}
            className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-all duration-700"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
        {/* Centered content */}
        <div className="relative z-20 w-full flex flex-col items-center justify-center h-full px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-3xl mx-auto text-center"
            >
              <p className="section-subtitle text-blue-200 font-semibold mb-2 text-lg drop-shadow">Explore Sri Lanka with TravelMate.lk</p>
              <h1 className="hero-title text-4xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg leading-tight">{heroSlides[slide].title}</h1>
              <p className="hero-text text-gray-100 mb-8 max-w-2xl mx-auto text-lg md:text-xl drop-shadow">{heroSlides[slide].desc}</p>
              <div className="btn-group flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
                <a
                  href="#search"
                  className="btn bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 text-white px-10 py-4 rounded-full font-bold shadow-xl text-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-cyan-600 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 animate-shimmer"
                  style={{ backgroundSize: '200% 200%' }}
                >
                  <span className="text-white">Start Planning</span>
                  <svg className="w-5 h-5 ml-1 animate-move-right" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
                <a
                  href="#about"
                  className="btn border-2 border-blue-500 bg-gradient-to-r from-white/90 to-blue-50 text-blue-700 px-8 py-3 rounded-full font-semibold shadow-md text-lg flex items-center gap-2 transition-all duration-300 hover:bg-blue-50 hover:text-blue-800 hover:scale-105 focus:ring-4 focus:ring-blue-200"
                >
                  <span className="font-semibold">Why TravelMate?</span>
                  <svg className="w-5 h-5 ml-1 text-blue-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Slide indicators */}
          <div className="flex gap-3 mt-2 justify-center">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                className={`w-5 h-2.5 rounded-full ${slide === idx ? 'bg-blue-500 shadow-lg' : 'bg-white/60'} border-none transition-all duration-300`}
                onClick={() => setSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{ outline: 'none' }}
              />
            ))}
          </div>
        </div>
      </section>


      {/* AI Search Bar */}
      <section id="search" className="container mx-auto px-4 mt-[-60px] mb-12 relative z-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <GlobalSearchBar />
        </motion.div>
      </section>

      {/* Featured Destinations Carousel */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Featured Destinations</h2>
        <FeaturedCarousel />
      </section>

      {/* Categories and Promotions */}
      <section className="container mx-auto px-4 mb-16">
        <CategoriesPromotions />
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 mb-16">
        <Testimonials />
      </section>

      {/* Destinations */}
      <motion.section className="section destination py-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } }}>
        <div className="container mx-auto px-4">
          <p className="section-subtitle text-blue-600 font-semibold mb-2 text-lg text-center">Destinations</p>
          <h2 className="h2 section-title text-3xl font-bold text-center mb-8">Handpicked Places for Every Traveler</h2>
          <div className="destination-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {destinations.map((d, i) => (
              <motion.div
                key={d.city}
                className="destination-card bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition group"
                whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <img src={d.img} alt={d.city} className="w-full h-48 object-cover card-banner group-hover:scale-105 transition-transform duration-300" />
                <div className="p-4 text-center card-content">
                  <p className="card-subtitle text-blue-600 font-semibold">{d.city}</p>
                  <h3 className="h3 card-title text-lg font-bold">{d.country}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Popular Tours */}
      <motion.section className="section popular py-16 bg-gray-50" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } }}>
        <div className="container mx-auto px-4">
          <p className="section-subtitle text-blue-600 font-semibold mb-2 text-lg text-center">Featured Tours</p>
          <h2 className="h2 section-title text-3xl font-bold text-center mb-8">Our Most Popular Experiences</h2>
          <div className="popular-list grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularTours.map((tour, idx) => (
              <motion.div
                key={idx}
                className="popular-card bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group"
                whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.13)' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
              >
                <div className="relative card-banner">
                  <img src={tour.img} alt="Popular Tour" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="card-badge absolute top-4 left-4 bg-white/90 px-3 py-1 rounded flex items-center gap-2 text-blue-600 font-medium text-sm shadow">
                    <Clock className="w-4 h-4" />
                    {tour.days} Days
                  </span>
                </div>
                <div className="p-6 card-content">
                  <div className="card-wrapper flex justify-between items-center mb-2">
                    <div className="card-price text-blue-600 font-bold">From ${tour.price.toLocaleString()}</div>
                    <div className="card-rating flex items-center gap-1">
                      {[...Array(5)].map((_, i) => i < tour.rating ? <Star key={i} className="w-4 h-4 text-yellow-400" /> : <StarOff key={i} className="w-4 h-4 text-gray-300" />)}
                      <span className="ml-1 text-xs text-gray-500">({tour.rating * 10})</span>
                    </div>
                  </div>
                  <h3 className="card-title font-semibold text-lg mb-1">{tour.title}</h3>
                  <address className="card-location text-gray-500 text-sm">{tour.location}</address>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section className="section about py-16" id="about" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <motion.div className="flex-1 about-content" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <p className="section-subtitle text-blue-600 font-semibold mb-2 text-lg">About TravelMate</p>
            <h2 className="h2 section-title text-3xl font-bold mb-4">Your Trusted Partner in Travel</h2>
            <p className="about-text text-gray-700 mb-6">TravelMate is dedicated to making travel accessible, enjoyable, and safe for everyone. Whether you crave adventure, relaxation, or cultural immersion, our team crafts personalized journeys to suit your style and budget.</p>
            <ul className="about-list mb-6 space-y-4">
              {aboutFeatures.map((f, i) => (
                <li key={i} className="about-item flex items-start gap-4">
                  <div className="about-item-icon">{f.icon}</div>
                  <div className="about-item-content">
                    <h3 className="h3 about-item-title font-semibold text-lg mb-1">{f.title}</h3>
                    <p className="about-item-text text-gray-500 text-sm">{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <a href="#" className="btn btn-primary bg-blue-600 text-white px-6 py-2 rounded shadow-lg hover:scale-105 transition-transform">Booking Now</a>
          </motion.div>
          <motion.div className="flex-1 flex justify-center about-banner" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <img src="/src/assets/images/about-banner.png" alt="About Banner" className="w-full max-w-md md:max-w-lg drop-shadow-xl" />
          </motion.div>
        </div>
      </motion.section>

      {/* Blog Section */}
      <motion.section className="section blog py-16 bg-gray-50" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <div className="container mx-auto px-4">
          <p className="section-subtitle text-blue-600 font-semibold mb-2 text-lg text-center">From the TravelMate Blog</p>
          <h2 className="h2 section-title text-3xl font-bold text-center mb-8">Travel Tips & Inspiration</h2>
          <div className="blog-list grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <motion.div
                key={idx}
                className="blog-card bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group"
                whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
              >
                <div className="relative card-banner">
                  <img src={post.img} alt="Blog" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="card-badge absolute top-4 left-4 bg-white/90 px-3 py-1 rounded flex items-center gap-2 text-blue-600 font-medium text-sm shadow">
                    <Clock className="w-4 h-4" />
                    {post.date}
                  </span>
                </div>
                <div className="p-6 card-content">
                  <div className="card-wrapper flex items-center gap-2 mb-2">
                    <img src="/src/assets/images/author-avatar.png" alt="author" className="w-8 h-8 rounded-full author-avatar" />
                    <div>
                      <div className="font-semibold text-sm author-name">{post.author}</div>
                      <div className="text-xs text-gray-400 author-title">Travel Expert</div>
                    </div>
                    <span className="ml-auto text-xs text-gray-400 publish-time">{post.time}</span>
                  </div>
                  <h3 className="card-title font-semibold text-lg mb-2">{post.title}</h3>
                  <a href="#" className="btn-link text-blue-600 hover:underline flex items-center gap-1 text-sm">
                    <span>Read More</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />

    </div>
  );
}

export default Home;
