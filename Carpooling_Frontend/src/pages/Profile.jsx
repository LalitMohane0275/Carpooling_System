import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
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
  Zap,
  Wind,
  Droplet,
  Fuel,
} from "lucide-react";
import { getProfile } from "../api/profileApi";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";

const getVehicleTypeIcon = (type) => {
  switch (type) {
    case "ev":
      return <Zap className="text-green-500" size={16} />;
    case "cng":
      return <Wind className="text-blue-500" size={16} />;
    case "petrol":
      return <Droplet className="text-red-500" size={16} />;
    case "diesel":
      return <Fuel className="text-yellow-500" size={16} />;
    default:
      return <Car className="text-gray-500" size={16} />;
  }
};

const getVehicleTypeColor = (type) => {
  switch (type) {
    case "ev":
      return "bg-green-50 text-green-700 border-green-200";
    case "cng":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "petrol":
      return "bg-red-50 text-red-700 border-red-200";
    case "diesel":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getVehicleTypeLabel = (type) => {
  switch (type) {
    case "ev":
      return "Electric Vehicle";
    case "cng":
      return "CNG";
    case "petrol":
      return "Petrol";
    case "diesel":
      return "Diesel";
    default:
      return "Not Specified";
  }
};

const ProfilePage = () => {
  let { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState({
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
      type: "",
    },
    preferences: {
      smokingAllowed: false,
      petsAllowed: false,
      musicAllowed: true,
    },
    createdAt: "",
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-base">Error loading profile: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="relative h-40 bg-blue-600">
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
              <div className="relative">
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 pt-12">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600 text-sm">{user.firstName ? `@${user.firstName}` : ""}</p>
              <div className="flex items-center justify-center mt-2">
                <Star className="text-yellow-400 mr-1" size={16} />
                <span className="text-gray-600 text-sm">
                  {user.rating} • {user.ridesGiven} rides given • {user.ridesTaken} rides taken
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* User Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="text-blue-500" size={16} />
                  <span className="text-gray-700 text-sm">{user.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-blue-500" size={16} />
                  <span className="text-gray-700 text-sm">{user.address}</span>
                </div>
                {/* Preferences */}
                <div className="mt-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">Ride Preferences</h3>
                  <div className="flex flex-wrap gap-3">
                    <div
                      className={`flex items-center space-x-2 ${
                        user.preferences.musicAllowed ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <Music size={16} />
                      <span className="text-sm">
                        {user.preferences.musicAllowed ? "Music allowed" : "No music"}
                      </span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${
                        user.preferences.smokingAllowed ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <Smoking size={16} />
                      <span className="text-sm">
                        {user.preferences.smokingAllowed ? "Smoking allowed" : "No smoking"}
                      </span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${
                        user.preferences.petsAllowed ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <Dog size={16} />
                      <span className="text-sm">
                        {user.preferences.petsAllowed ? "Pets allowed" : "No pets"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              {user.hasVehicle && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-gray-800 mb-2 sm:mb-0">Vehicle Details</h2>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getVehicleTypeColor(
                        user.vehicleDetails.type
                      )}`}
                    >
                      {getVehicleTypeIcon(user.vehicleDetails.type)}
                      <span className="text-sm font-medium">
                        {getVehicleTypeLabel(user.vehicleDetails.type)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-600 text-sm">Make: {user.vehicleDetails.make}</p>
                      <p className="text-gray-600 text-sm">Model: {user.vehicleDetails.model}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Year: {user.vehicleDetails.year}</p>
                      <p className="text-gray-600 text-sm">
                        License Plate: {user.vehicleDetails.licensePlate}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Edit2 size={16} />
                  <span className="text-sm">Edit Profile</span>
                </button>

                <div className="space-y-3">
                  <button
                    onClick={handleRidesOffered}
                    className="w-full flex items-center justify-between px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 group"
                  >
                    <div className="flex items-center space-x-2">
                      <Car size={16} />
                      <span className="text-sm font-semibold">Rides Offered</span>
                    </div>
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={handleRidesTaken}
                    className="w-full flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 group"
                  >
                    <div className="flex items-center space-x-2">
                      <User size={16} />
                      <span className="text-sm font-semibold">Rides Taken</span>
                    </div>
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 mt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center space-x-2">
              <Car className="text-blue-500" size={16} />
              <span className="text-gray-600 text-sm font-medium">
                RideBuddy Member since {new Date(user.createdAt).getFullYear()}
              </span>
            </div>
            <button
              className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="text-sm">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;