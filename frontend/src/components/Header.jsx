import React, { useState } from 'react';

const navLinks = [
  { name: 'Home', href: '#', current: true },
  { name: 'Destinations', href: '#destinations' },
  { name: 'Itineraries', href: '#itineraries' },
  { name: 'Contact', href: '#contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 to-blue-400 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="inline-block bg-white/20 rounded-full p-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l2.09 6.26L21 9.27l-5 4.87L17.18 21 12 17.27 6.82 21 8 14.14l-5-4.87 6.91-1.01z" /></svg>
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm select-none" tabIndex={0} aria-label="TravelMate.lk Home">
            TravelMate.lk
          </span>
        </div>
        {/* Desktop nav */}
        <nav className="hidden md:block" aria-label="Main navigation">
          <ul className="flex gap-8 items-center">
            {navLinks.map(link => (
              <li key={link.name}>
                <a
                  href={link.href}
                  aria-current={link.current ? 'page' : undefined}
                  className={`text-lg px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70 ${link.current ? 'bg-white/20 text-white' : 'text-white'}`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* Mobile nav toggle */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/70"
          aria-label="Open navigation menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile nav menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-gradient-to-r from-blue-700 to-blue-400 px-6 pb-4 animate-fade-in-down" aria-label="Mobile navigation">
          <ul className="flex flex-col gap-2">
            {navLinks.map(link => (
              <li key={link.name}>
                <a
                  href={link.href}
                  aria-current={link.current ? 'page' : undefined}
                  className={`block text-lg px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70 ${link.current ? 'bg-white/20 text-white' : 'text-white'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
