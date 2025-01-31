import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Users, User, UserRound } from "lucide-react";

function FindRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/find-ride"
        );
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Available Rides
        </h1>

        {rides.length === 0 ? (
          <div className="text-center text-gray-600 bg-white p-8 rounded-lg shadow-sm">
            No rides available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.map((ride) => (
              <div
                key={ride._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Route Information */}
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">From</div>
                      <div className="font-semibold text-gray-800">
                        {ride.start}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">To</div>
                      <div className="font-semibold text-gray-800">
                        {ride.destination}
                      </div>
                    </div>
                  </div>

                  {/* Time and Date */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{ride.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{ride.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{ride.seats} seats available</span>
                    </div>
                  </div>

                  {/* Created By */}
                  <div className="flex items-center mb-4 pt-4 border-t border-gray-100">
                    {ride.createdBy?.gender === "female" ? (
                      <User className="w-5 h-5 text-pink-500 mr-2" />
                    ) : (
                      <UserRound className="w-5 h-5 text-blue-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-600">
                      Created by{" "}
                      <span className="font-medium">
                        {ride.createdBy?.name || "Anonymous"}
                      </span>
                    </span>
                  </div>

                  {/* Book Button */}
                  <Link
                    to={`/book-ride/${ride._id}`}
                    className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Book Ride
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FindRides;
