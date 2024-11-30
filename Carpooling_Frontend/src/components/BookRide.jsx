import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios for making HTTP requests

function BookRide() {
  const [rides, setRides] = useState([]); // State to store fetched rides
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  // Fetch rides from the backend
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/book-ride"); 
        console.log("Response:", response.data);
        setRides(response.data.rides); 
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch rides. Please try again.");
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  // Render loading or error messages
  if (loading) {
    return <div>Loading rides...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Render the list of rides
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookRide;
