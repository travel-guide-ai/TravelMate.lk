
import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#1e293b] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/src/assets/images/logo1.png" alt="TravelMate.lk Logo" className="w-10 h-10 object-contain drop-shadow" />
              <span className="text-2xl font-extrabold text-white tracking-tight">TravelMate.lk</span>
            </div>
            <p className="text-gray-400">Making travel planning effortless and enjoyable since 2025.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Press</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Safety</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Cancellation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe for travel tips and exclusive deals</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none" />
              <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 transition">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            © 2025 TravelMate.lk All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">
              <Facebook />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">
              <Twitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">
              <Instagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">
              <Youtube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
