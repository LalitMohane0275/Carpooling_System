import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateRide() {
  const initialState = {
    start: "",
    destination: "",
    time: "",
    date: "",
    seats: "",
  };

  const [ride, setRide] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRide((prevRide) => ({
      ...prevRide,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Ride Object:", ride);
      const response = await axios.post("http://localhost:3000/api/v1/create-ride", ride);
      console.log("Ride Created Successfully:", response.data);

      // Show success toast notification
      toast.success("Ride created successfully!");

      // Reset the form fields after successful submission
      setRide(initialState);
    } catch (error) {
      console.error("Error Creating Ride:", error);

      // Show error toast notification
      toast.error("Failed to create the ride. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Ride</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="start">
            Start Location
          </label>
          <input
            type="text"
            id="start"
            name="start"
            value={ride.start}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="destination">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={ride.destination}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="time">
            Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={ride.time}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={ride.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="seats">
            Number of Seats
          </label>
          <input
            type="number"
            id="seats"
            name="seats"
            value={ride.seats}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
            min="1"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Ride
        </button>
      </form>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default CreateRide;
