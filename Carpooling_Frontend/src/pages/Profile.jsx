import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, Mail, Phone, MapPin, Car, Star, Edit2, Camera, LogOut, Calendar, Clock, Users, Music, CookingPot as Smoking, Dog } from "lucide-react";
import { getProfile } from '../api/profileApi';

const ProfilePage = () => {
  let {userId} = useParams();

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
      licensePlate: ""
    },
    preferences: {
      smokingAllowed: false,
      petsAllowed: false,
      musicAllowed: true
    },
    createdAt: "",
    // Hardcoded data
    bio: "Passionate about carpooling and reducing carbon footprint. Love to meet new people during my commutes!",
    rating: 4.8,
    ridesGiven: 87,
    ridesTaken: 52,
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        const response = await getProfile(userId);
        if (response.success) {
          setUser(prevUser => ({
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
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  // Mock data for rides offered and taken
  const ridesOffered = [
    {
      id: 1,
      from: "San Francisco",
      to: "Los Angeles",
      date: "2023-05-15",
      time: "09:00 AM",
      seats: 3,
    },
    {
      id: 2,
      from: "San Jose",
      to: "Sacramento",
      date: "2023-05-20",
      time: "10:30 AM",
      seats: 2,
    },
  ];

  const ridesTaken = [
    {
      id: 1,
      from: "Oakland",
      to: "San Francisco",
      date: "2023-05-10",
      time: "08:00 AM",
      driver: "Alice Smith",
    },
    {
      id: 2,
      from: "San Francisco",
      to: "Palo Alto",
      date: "2023-05-18",
      time: "07:30 AM",
      driver: "Bob Johnson",
    },
  ];

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
                  <h3 className="text-lg font-semibold text-gray-800">Ride Preferences</h3>
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 ${user.preferences.musicAllowed ? 'text-green-600' : 'text-gray-400'}`}>
                      <Music size={20} />
                      <span>{user.preferences.musicAllowed ? 'Music allowed' : 'No music'}</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${user.preferences.smokingAllowed ? 'text-green-600' : 'text-gray-400'}`}>
                      <Smoking size={20} />
                      <span>{user.preferences.smokingAllowed ? 'Smoking allowed' : 'No smoking'}</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${user.preferences.petsAllowed ? 'text-green-600' : 'text-gray-400'}`}>
                      <Dog size={20} />
                      <span>{user.preferences.petsAllowed ? 'Pets allowed' : 'No pets'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  About Me
                </h2>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    rows="4"
                  />
                ) : (
                  <p className="text-gray-600">{user.bio}</p>
                )}
              </div>
            </div>

            {/* Vehicle Details */}
            {user.hasVehicle && (
              <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Make: {user.vehicleDetails.make}</p>
                    <p className="text-gray-600">Model: {user.vehicleDetails.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Year: {user.vehicleDetails.year}</p>
                    <p className="text-gray-600">License Plate: {user.vehicleDetails.licensePlate}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Profile Button */}
            <div className="mt-8 flex justify-center">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Edit2 size={18} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Rides Offered Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Rides Offered
              </h2>
              <div className="space-y-4">
                {ridesOffered.map((ride) => (
                  <RideCard key={ride.id} ride={ride} type="offered" />
                ))}
              </div>
            </div>

            {/* Rides Taken Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Rides Taken
              </h2>
              <div className="space-y-4">
                {ridesTaken.map((ride) => (
                  <RideCard key={ride.id} ride={ride} type="taken" />
                ))}
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
            <button className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors">
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RideCard = ({ ride, type }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {ride.from} to {ride.to}
          </h3>
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2" />
              {ride.date}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-2" />
              {ride.time}
            </div>
            {type === "offered" && (
              <div className="flex items-center text-sm text-gray-600">
                <Users size={16} className="mr-2" />
                {ride.seats} seats available
              </div>
            )}
            {type === "taken" && (
              <div className="flex items-center text-sm text-gray-600">
                <User size={16} className="mr-2" />
                Driver: {ride.driver}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {type === "offered" ? "Offered" : "Taken"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;