import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation

function FindRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/find-ride");
        setRides(response.data.rides);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch rides. Please try again.");
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  if (loading) {
    return <div>Loading rides...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Rides</h1>
      {rides.length === 0 ? (
        <p>No rides available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="border rounded-md shadow-md p-4 bg-white"
            >
              <h2 className="text-xl font-semibold">From: {ride.start}</h2>
              <h2 className="text-xl font-semibold">To: {ride.destination}</h2>
              <p>
                <strong>Time:</strong> {ride.time}
              </p>
              <p>
                <strong>Date:</strong> {ride.date}
              </p>
              <p>
                <strong>Seats:</strong> {ride.seats}
              </p>
              {/* Add Book Ride button */}
              <Link
                to={`/book-ride/${ride._id}`}
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Book Ride
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FindRides;
