import React from 'react';

function About() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white shadow-md rounded-lg max-w-4xl p-8">
        <h1 className="text-4xl font-bold text-green-500 mb-6 text-center">
          About RideBuddy
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Welcome to <strong>RideBuddy</strong>, your trusted companion for hassle-free, eco-friendly, and affordable travel. 
          Our mission is simple: to connect people who share similar travel routes, fostering a community that values 
          convenience, sustainability, and mutual benefit.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Goals</h2>
        <ul className="list-disc list-inside text-gray-700 text-lg mb-6">
          <li>Reduce carbon footprint by minimizing the number of vehicles on the road.</li>
          <li>Promote cost-efficiency by sharing travel expenses.</li>
          <li>Build connections and friendships through shared rides.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
        <ul className="list-disc list-inside text-gray-700 text-lg mb-6">
          <li><strong>Safe & Secure:</strong> User verification and transparent rider/driver profiles.</li>
          <li><strong>User-Friendly Interface:</strong> An intuitive platform for finding or creating rides.</li>
          <li><strong>Flexible Options:</strong> Ideal for both daily commutes and one-time trips.</li>
          <li><strong>Time & Money Savings:</strong> Reduce search efforts and share travel costs.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Our Community</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          By using <strong>RideBuddy</strong>, you’re not just choosing a smarter way to travel—you’re  becoming part of a 
          movement to make commuting more sustainable, cost-effective, and enjoyable. Whether you're a student, a 
          professional, or simply someone who values convenience, RideBuddy is here to make your journeys better.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          Together, let’s revolutionize the way we travel—one ride at a time.
        </p>
      </div>
    </div>
  );
}

export default About;
