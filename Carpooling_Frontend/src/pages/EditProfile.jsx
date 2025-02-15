import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Car, Music, CookingPot as Smoking, Dog, Edit2 } from 'lucide-react';
import { getProfile } from '../api/profileApi';

function EditProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    hasVehicle: false,
    vehicleDetails: {
      make: '',
      model: '',
      year: '',
      licensePlate: '',
    },
    preferences: {
      smokingAllowed: false,
      petsAllowed: false,
      musicAllowed: true,
    },
    profilePicture: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getProfile(userId);
        if (response.success) {
          setProfile(response.data);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add your API call to update the profile here
      // const response = await updateProfile(userId, profile);
      navigate(`/profile/${userId}`);
    } catch (err) {
      setError(err.message);
      console.error('Failed to update profile:', err);
    }
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
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profile.profilePicture || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600"
                >
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{`${profile.firstName} ${profile.lastName}`}</h2>
                <p className="text-gray-500">{profile.email}</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={profile.middleName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Car className="text-gray-400" />
                <h3 className="text-lg font-medium">Vehicle Information</h3>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="hasVehicle"
                  checked={profile.hasVehicle}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">I have a vehicle</label>
              </div>
              {profile.hasVehicle && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Make</label>
                    <input
                      type="text"
                      name="vehicleDetails.make"
                      value={profile.vehicleDetails.make}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                      type="text"
                      name="vehicleDetails.model"
                      value={profile.vehicleDetails.model}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="text"
                      name="vehicleDetails.year"
                      value={profile.vehicleDetails.year}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">License Plate</label>
                    <input
                      type="text"
                      name="vehicleDetails.licensePlate"
                      value={profile.vehicleDetails.licensePlate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="preferences.smokingAllowed"
                    checked={profile.preferences.smokingAllowed}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Smoking className="text-gray-400" />
                  <label className="text-sm text-gray-700">Smoking Allowed</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="preferences.petsAllowed"
                    checked={profile.preferences.petsAllowed}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Dog className="text-gray-400" />
                  <label className="text-sm text-gray-700">Pets Allowed</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="preferences.musicAllowed"
                    checked={profile.preferences.musicAllowed}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Music className="text-gray-400" />
                  <label className="text-sm text-gray-700">Music Allowed</label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t pt-6">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(`/profile/${userId}`)}
                  className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;