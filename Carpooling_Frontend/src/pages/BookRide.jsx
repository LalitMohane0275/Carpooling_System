import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  User,
  UserRound,
  MapPinned,
  Timer,
  CarFront,
} from "lucide-react";

function BookRide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    start: "",
    destination: "",
    time: "",
    seats: 1,
  });

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/book-ride/${id}`
        );
        setRide(response.data.ride);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch ride details.");
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = {
        ...formData,
        seats: parseInt(formData.seats, 10),
      };
      const response = await axios.post(
        `http://localhost:3000/api/v1/create-passengerRide/${id}`,
        formDataToSend
      );

      toast.success("Ride booked successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setFormData({
        start: "",
        destination: "",
        time: "",
        seats: "",
      });
      setSubmitted(true);
      navigate("/home");
    } catch (err) {
      toast.error("Failed to book the ride. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error(err);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <ToastContainer />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Book Your Ride
        </h1>

        {submitted ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mb-6">
              <CarFront className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl text-green-600 font-semibold">
                Thank you! Your ride has been booked successfully.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <>
            {/* Ride Details Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Ride Details
                </h2>
                <div className="space-y-4">
                  {/* Route Information */}
                  <div className="flex items-center space-x-2">
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{ride.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{ride.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{ride.seats} seats available</span>
                  </div>

                  {/* Created By */}
                  <div className="flex items-center pt-4 border-t border-gray-100">
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
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Your Booking Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="start"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Pickup Location
                      </label>
                      <div className="relative">
                        <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="start"
                          name="start"
                          value={formData.start}
                          onChange={handleInputChange}
                          className="pl-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter your pickup location"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="destination"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Drop-off Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="destination"
                          name="destination"
                          value={formData.destination}
                          onChange={handleInputChange}
                          className="pl-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter your drop-off location"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="time"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Preferred Time
                      </label>
                      <div className="relative">
                        <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="pl-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="seats"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Number of Seats
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          id="seats"
                          name="seats"
                          value={formData.seats}
                          onChange={handleInputChange}
                          min="1"
                          max={ride.seats}
                          className="pl-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-300"
                  >
                    Confirm Booking
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookRide;
