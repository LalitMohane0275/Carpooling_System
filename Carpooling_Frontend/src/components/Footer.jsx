import React, { useState } from "react";
import {
  Car,
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";

function Footer() {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-blue-600" strokeWidth={2.5} />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  RideBuddy
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Making carpooling easy, safe, and sustainable for everyone. Join
                our community of riders today!
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="hover:text-blue-600 text-gray-600 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="hover:text-blue-600 text-gray-600 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="hover:text-blue-600 text-gray-600 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  "Home",
                  "About",
                  "Find a Ride",
                  "Create a Ride",
                  "Safety",
                  "FAQ",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors flex items-center group"
                    >
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{item}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <MapPin className="h-5 w-5" />
                    <span>123 Ride Street, City 12345</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@ridebuddy.com"
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <Mail className="h-5 w-5" />
                    <span>info@ridebuddy.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+1234567890"
                    className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <Phone className="h-5 w-5" />
                    <span>+1 (234) 567-890</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} RideBuddy. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;