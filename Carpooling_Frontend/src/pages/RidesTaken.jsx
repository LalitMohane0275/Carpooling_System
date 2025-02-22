// RidesTaken.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Search,
  User,
  Car,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

const RidesTaken = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/v1/get-passenger-rides/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 404) {
            // Handle "no rides found" case separately
            setRides([]);
            return;
          }
          throw new Error(errorData.message || `Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched rides:", data);
        setRides(data.rides || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An error occurred while fetching rides");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRides = rides
    .filter((ride) => {
      const matchesSearch =
        ride.start.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.destination.toLowerCase().includes(searchTerm.toLowerCase());
      if (filter === "all") return matchesSearch;
      return matchesSearch && ride.status === filter;
    })
    .sort((a, b) => {
      if (sortBy === "date")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Error Loading Rides
          </h3>
          <p className="mt-1 text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => navigate(`/profile/${userId}`)}
                  className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  My Ride History
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search rides..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Rides</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {filteredRides.length === 0 ? (
            <div className="text-center py-12">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No Rides Taken Yet
              </h3>
              <p className="mt-1 text-gray-500">
                You haven't taken any rides as a passenger yet. Book a ride to
                get started!
              </p>
              <button
                onClick={() => navigate("/find-ride")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Find a Ride
              </button>
            </div>
          ) : (
            filteredRides.map((ride) => (
              <div
                key={ride._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {ride.ride.driver.photo && (
                      <img
                        src={ride.ride.driver.photo}
                        alt={ride.ride.driver.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {ride.ride.driver.name}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 mt-2 rounded-full text-sm font-medium ${getStatusColor(
                          ride.status
                        )}`}
                      >
                        {ride.status.charAt(0).toUpperCase() +
                          ride.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">From</p>
                        <p className="font-medium text-gray-900">
                          {ride.start}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">To</p>
                        <p className="font-medium text-gray-900">
                          {ride.destination}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">
                          {ride.ride.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium text-gray-900">
                          {ride.ride.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                    <span className="text-sm font-medium">View Details</span>
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RidesTaken;
