import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 max-h-[10vh] text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">Carpooling Website</h2>
          <p className="text-sm">© 2024 Carpooling. All rights reserved.</p>
        </div>
        <div className="mb-4 md:mb-0">
          <nav className="flex space-x-4">
            <a href="/about" className="text-sm hover:text-gray-400">About Us</a>
            <a href="/services" className="text-sm hover:text-gray-400">Services</a>
            <a href="/contact" className="text-sm hover:text-gray-400">Contact</a>
            <a href="/privacy" className="text-sm hover:text-gray-400">Privacy Policy</a>
          </nav>
        </div>
        <div className="flex space-x-4">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
