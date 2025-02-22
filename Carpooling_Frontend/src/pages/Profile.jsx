import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Car,
  Star,
  Edit2,
  Camera,
  LogOut,
  ArrowRight,
  Music,
  CookingPot as Smoking,
  Dog,
} from "lucide-react";
import { getProfile } from "../api/profileApi";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";

const ProfilePage = () => {
  let { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState({
    // API data
    name: "",
    phoneNumber: "",
    address: "",
    hasVehicle: false,
    profilePicture: "",
    vehicleDetails: {
      make: "",
      model: "",
      year: "",
      licensePlate: "",
    },
    preferences: {
      smokingAllowed: false,
      petsAllowed: false,
      musicAllowed: true,
    },
    createdAt: "",
    // Hardcoded data
    bio: "Passionate about carpooling and reducing carbon footprint. Love to meet new people during my commutes!",
    rating: 4.8,
    ridesGiven: 87,
    ridesTaken: 52,
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        const response = await getProfile(userId);
        if (response.success) {
          setUser((prevUser) => ({
            ...prevUser,
            ...response.data,
            // Add hardcoded data that's not from API
            bio: "Passionate about carpooling and reducing carbon footprint. Love to meet new people during my commutes!",
            rating: 4.8,
            ridesGiven: 87,
            ridesTaken: 52,
          }));
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleEdit = () => {
    navigate(`/profile/edit/${userId}`);
  };

  const handleRidesOffered = () => {
    navigate(`/rides/offered/${userId}`);
  };

  const handleRidesTaken = () => {
    navigate(`/rides/taken/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading profile: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="relative h-48 bg-blue-600">
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
              <div className="relative">
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                  <Camera size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8 pt-16">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">@{user.firstName}</p>
              <div className="flex items-center justify-center mt-2">
                <Star className="text-yellow-400 mr-1" size={20} />
                <span className="text-gray-600">
                  {user.rating} • {user.ridesGiven} rides given •{" "}
                  {user.ridesTaken} rides taken
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="text-blue-500" size={20} />
                  <span className="text-gray-700">{user.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-blue-500" size={20} />
                  <span className="text-gray-700">{user.address}</span>
                </div>
                {/* Preferences */}
                <div className="mt-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Ride Preferences
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex items-center space-x-2 ${
                        user.preferences.musicAllowed
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <Music size={20} />
                      <span>
                        {user.preferences.musicAllowed
                          ? "Music allowed"
                          : "No music"}
                      </span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${
                        user.preferences.smokingAllowed
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <Smoking size={20} />
                      <span>
                        {user.preferences.smokingAllowed
                          ? "Smoking allowed"
                          : "No smoking"}
                      </span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${
                        user.preferences.petsAllowed
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <Dog size={20} />
                      <span>
                        {user.preferences.petsAllowed
                          ? "Pets allowed"
                          : "No pets"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  About Me
                </h2>
                <p className="text-gray-600">{user.bio}</p>
              </div>
            </div>

            {/* Vehicle Details */}
            {user.hasVehicle && (
              <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Vehicle Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">
                      Make: {user.vehicleDetails.make}
                    </p>
                    <p className="text-gray-600">
                      Model: {user.vehicleDetails.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      Year: {user.vehicleDetails.year}
                    </p>
                    <p className="text-gray-600">
                      License Plate: {user.vehicleDetails.licensePlate}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              {/* Edit Profile Button */}
              <button
                onClick={handleEdit}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Edit2 size={18} />
                <span>Edit Profile</span>
              </button>

              {/* Rides Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleRidesOffered}
                  className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center space-x-3">
                    <Car size={20} />
                    <span className="font-semibold">Rides Offered</span>
                  </div>
                  <ArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleRidesTaken}
                  className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center space-x-3">
                    <User size={20} />
                    <span className="font-semibold">Rides Taken</span>
                  </div>
                  <ArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 mt-8 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Car className="text-blue-500" size={24} />
              <span className="text-gray-600 font-medium">
                RideBuddy Member since {new Date(user.createdAt).getFullYear()}
              </span>
            </div>
            <button
              className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
