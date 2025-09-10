import Header from '../components/Header';
import Footer from '../components/Footer';
import { Star, StarOff, Clock, Compass, Briefcase, Umbrella } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

function Home() {
  // Hero banner image
  const heroBanner = '/src/assets/images/hero-banner.png';
  const heroBgTop = '/src/assets/images/hero-bg-top.png';
  const heroBgBottom = '/src/assets/images/hero-bg-bottom.png';
  const shape1 = '/src/assets/images/shape-1.png';
  const shape2 = '/src/assets/images/shape-2.png';
  const shape3 = '/src/assets/images/shape-3.png';

  // Destinations
  const destinations = [
    { city: 'Malé', country: 'Maldives', img: '/src/assets/images/destination-1.jpg' },
    { city: 'Bangkok', country: 'Thailand', img: '/src/assets/images/destination-2.jpg' },
    { city: 'Kuala Lumpur', country: 'Malaysia', img: '/src/assets/images/destination-3.jpg' },
    { city: 'Kathmandu', country: 'Nepal', img: '/src/assets/images/destination-4.jpg' },
    { city: 'Jakarta', country: 'Indonesia', img: '/src/assets/images/destination-5.jpg' },
  ];

  // Popular tours
  const popularTours = [
    { img: '/src/assets/images/popular-1.jpg', days: 7, price: 799, rating: 5, location: 'Kuala Lumpur, Malaysia', title: 'Discover Kuala Lumpur: Urban Wonders & Culture' },
    { img: '/src/assets/images/popular-2.jpg', days: 10, price: 1299, rating: 4, location: 'Bangkok, Thailand', title: 'Bangkok Explorer: Temples, Food & Nightlife' },
    { img: '/src/assets/images/popular-3.jpg', days: 5, price: 599, rating: 4, location: 'Malé, Maldives', title: 'Maldives Paradise: Beaches & Relaxation' },
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

      {/* Hero Section */}
      <motion.section
        className="section hero relative bg-no-repeat bg-top bg-cover"
        style={{ backgroundImage: `url(${heroBgBottom}), url(${heroBgTop})` }}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative py-16 md:py-24">
          {/* Shapes */}
          <motion.img src={shape1} alt="shape1" className="absolute left-0 top-10 w-12 h-12 opacity-80 animate-shape-float shape shape-1" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} />
          <motion.img src={shape2} alt="shape2" className="absolute right-10 top-20 w-12 h-16 opacity-80 animate-shape-rotate shape shape-2" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} />
          <motion.img src={shape3} alt="shape3" className="absolute left-1/2 bottom-0 w-12 h-16 opacity-80 animate-shape-float2 shape shape-3" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} />
          {/* Content */}
          <motion.div className="flex-1 z-10 hero-content" initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p className="section-subtitle text-blue-600 font-semibold mb-2 text-lg">Your Journey Starts Here</p>
            <h1 className="hero-title text-4xl md:text-6xl font-bold mb-4">TravelMate: Explore, Dream, Discover</h1>
            <p className="hero-text text-gray-700 mb-6 max-w-lg">Plan your next adventure with TravelMate. From hidden gems to world-famous landmarks, we help you create unforgettable memories with ease and confidence.</p>
            <div className="btn-group flex gap-4 mb-6">
              <a href="#contact" className="btn btn-primary bg-blue-600 text-white px-6 py-2 rounded shadow-lg hover:scale-105 transition-transform">Contact Us</a>
              <a href="#about" className="btn btn-outline border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 hover:scale-105 transition-transform">Learn More</a>
            </div>
          </motion.div>
          {/* Hero Banner */}
          <motion.div className="flex-1 flex justify-center z-10 hero-banner" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <img src={heroBanner} alt="hero banner" className="w-full max-w-md md:max-w-lg drop-shadow-xl" />
          </motion.div>
        </div>
      </motion.section>

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
