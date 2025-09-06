import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Compass } from 'lucide-react';

const navLinks = [
  { name: 'Destinations', href: '#' },
  { name: 'Experiences', href: '#' },
  { name: 'Deals', href: '#' },
  { name: 'About', href: '#' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Compass className="text-blue-500 w-8 h-8" />
          <span className="text-2xl font-bold text-blue-600">TravelMate</span>
        </div>
        <div className="hidden md:flex space-x-8">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-gray-700 hover:text-blue-600 transition">
              {link.name}
            </a>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden md:block px-4 py-2 rounded-full text-blue-600 hover:bg-blue-50 transition">
            Sign In
          </Button>
          <Button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            Sign Up
          </Button>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="w-6 h-6 text-blue-600" />
          </button>
        </div>
      </div>
      {/* Mobile nav menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 px-4 pb-4 border-b border-gray-100 animate-fade-in-down">
          <div className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="text-gray-700 hover:text-blue-600 transition py-2">
                {link.name}
              </a>
            ))}
            <Button variant="ghost" className="w-full text-blue-600">Sign In</Button>
            <Button className="w-full bg-blue-600 text-white">Sign Up</Button>
          </div>
        </div>
      )}
    </nav>
  );
}
