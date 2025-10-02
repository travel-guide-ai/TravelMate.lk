import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';

const navLinks = [
  { name: 'Destinations', href: '#' },
  { name: 'Experiences', href: '#' },
  { name: 'Deals', href: '#' },
  { name: 'About', href: '#' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#1e293b] shadow-lg border-b border-gray-900/80">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <img src="/src/assets/images/logo1.png" alt="TravelMate.lk Logo" className="w-10 h-10 object-contain drop-shadow group-hover:scale-110 transition-transform duration-200" />
          <span className="text-2xl font-extrabold text-white tracking-tight group-hover:text-blue-300 transition-colors">TravelMate.lk</span>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="relative text-gray-200 hover:text-blue-300 font-medium transition-colors duration-200 px-2 py-1 group"
            >
              <span>{link.name}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {isLoaded && isSignedIn ? (
            // Authenticated user menu
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-blue-200 hover:bg-blue-900/30 hover:text-white transition font-semibold"
              >
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt={user.fullName} className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span className="hidden md:block">{user.firstName || 'User'}</span>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Bookings
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Guest user buttons
            <>
              <Button 
                variant="ghost" 
                className="hidden md:block px-4 py-2 rounded-full text-blue-200 hover:bg-blue-900/30 hover:text-white transition font-semibold" 
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:from-blue-600 hover:to-blue-800 shadow-md font-semibold transition" 
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </>
          )}
          
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="w-6 h-6 text-blue-200" />
          </button>
        </div>
      </div>
      
      {/* Mobile nav menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#1e293b] px-4 pb-4 border-b border-gray-900/80 animate-fade-in-down">
          <div className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="text-gray-200 hover:text-blue-300 transition py-2 font-medium">
                {link.name}
              </a>
            ))}
            
            {isLoaded && isSignedIn ? (
              <>
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <p className="text-blue-200 font-semibold">{user.fullName}</p>
                  <p className="text-gray-400 text-sm">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
                <Link to="/profile" className="text-gray-200 hover:text-blue-300 transition py-2 font-medium">
                  Profile
                </Link>
                <Link to="/bookings" className="text-gray-200 hover:text-blue-300 transition py-2 font-medium">
                  My Bookings
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut(); }}
                  className="w-full text-left text-red-400 hover:text-red-300 transition py-2 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full text-blue-200 hover:bg-blue-900/30 hover:text-white font-semibold" 
                  onClick={() => { setMobileOpen(false); navigate('/login'); }}
                >
                  Sign In
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold" 
                  onClick={() => { setMobileOpen(false); navigate('/register'); }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
