import React, { useState } from "react";
import {
  Car,
  Search,
  PlusCircle,
  User,
  Menu,
  X,
  Home,
  Info,
  LogOut,
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-100 shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <a href="/home" className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-blue-600" strokeWidth={2.5} />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  RideBuddy
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <a href="/home" className="nav-link group">
                <Home className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                <span>Home</span>
              </a>
              <a href="/about" className="nav-link group">
                <Info className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                <span>About</span>
              </a>
              <a href="/find-ride" className="nav-link group">
                <Search className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                <span>Find a Ride</span>
              </a>
              <a href="/create-ride" className="nav-link group">
                <PlusCircle className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                <span>Create a Ride</span>
              </a>

              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 p-2 rounded-full bg-gray-100 hover:bg-blue-50 transition-colors group-hover:ring-2 group-hover:ring-blue-100">
                  <User className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    View Profile
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Settings
                  </a>
                  <hr className="my-2 border-gray-100" />
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
            <a href="/" className="mobile-nav-link">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </a>
            <a href="/about" className="mobile-nav-link">
              <Info className="h-5 w-5" />
              <span>About</span>
            </a>
            <a href="/find-ride" className="mobile-nav-link">
              <Search className="h-5 w-5" />
              <span>Find a Ride</span>
            </a>
            <a href="/create-ride" className="mobile-nav-link">
              <PlusCircle className="h-5 w-5" />
              <span>Create a Ride</span>
            </a>
            <a href="/profile" className="mobile-nav-link">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Add content padding to prevent overlap with fixed navbar */}
      <div className="pt-16 flex-grow">{/* Your page content goes here */}</div>
    </div>
  );
}

export default Navbar;
