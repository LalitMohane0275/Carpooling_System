import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

function SearchForm() {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    date: '',
  });

  const [rides, setRides] = useState([]); // State to store fetched rides
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/v1/rides/search-rides', formData);

      // Update rides if API call is successful
      setRides(response.data.rides);
      setError(''); // Clear previous errors
    } catch (err) {
      console.error('Error fetching rides:', err);
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Search Rides</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="source" className="block text-gray-700 font-medium mb-2">Source</label>
          <input
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="Enter source location"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="destination" className="block text-gray-700 font-medium mb-2">Destination</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Enter destination"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring"
          >
            Search
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}

      {/* Display Rides */}
      <div className="mt-6">
        {rides.length > 0 ? (
          <div>
            <h3 className="text-lg font-bold mb-4">Available Rides:</h3>
            <ul>
              {rides.map((ride) => (
                <>
                  <li key={ride._id} className="p-4 border rounded-lg mb-2">
                    <p><strong>Source:</strong> {ride.start}</p>
                    <p><strong>Destination:</strong> {ride.destination}</p>
                    <p><strong>Date:</strong> {ride.date}</p>
                    <p><strong>Time:</strong> {ride.time}</p>
                    <p><strong>Available Seats:</strong> {ride.seats}</p>
                  </li>
                  <NavLink
                    to={`/book-ride/${ride._id}`}
                    className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <button>Book Ride</button>
                  </NavLink>
                </>
              ))}
            </ul>

          </div>
        ) : (
          !error && <p className="mt-4 text-center text-gray-500">No rides found.</p>
        )}
      </div>

    </div>
  );
}

export default SearchForm;
