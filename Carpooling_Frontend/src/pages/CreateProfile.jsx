import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateProfile() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create the profile object
        const profile = { firstName, lastName, age, gender };

        try {
            // Use Axios to send POST request
            const response = await axios.post(`http://localhost:3000/api/v1/create-profile/${id}`, profile);

            if (response.status === 200) {
                setMessage('Profile created successfully!');
                navigate(`/profile/${firstName}_${lastName}`);
            }
        } catch (error) {
            console.error(error);
            setMessage(
                error.response?.data?.message || 'An error occurred while creating the profile.'
            );
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gray-100"
            style={{ fontFamily: 'Arial, sans-serif' }}
        >
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Profile</h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-11/12 sm:w-96"
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        First Name
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Last Name
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Age</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        min="18"
                        max="150"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Gender
                    </label>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
                >
                    Save Profile
                </button>
            </form>
            {message && (
                <p
                    className="mt-4 text-lg"
                    style={{ color: message.includes('success') ? 'green' : 'red' }}
                >
                    {message}
                </p>
            )}
        </div>
    );
}

export default CreateProfile;
