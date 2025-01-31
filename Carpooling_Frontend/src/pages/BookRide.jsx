import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BookRide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false); // Track submission state

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
        seats: parseInt(formData.seats, 10), // Convert seats to number
      };
      console.log(formDataToSend);
      const response = await axios.post(
        `http://localhost:3000/api/v1/create-passengerRide/${id}`,
        formDataToSend
      );

      // Notify user of success
      toast.success("Ride booked successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset form data and mark as submitted
      setFormData({
        start: "",
        destination: "",
        time: "",
        seats: "",
      });
      setSubmitted(true);

      // Directly navigate to the home page
      navigate("/home"); // This will trigger the redirection
    } catch (err) {
      toast.error("Failed to book the ride. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading ride details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Book Ride</h1>

      {submitted ? (
        // Show only the "Go Back to Home" button after submission
        <div className="mt-4 text-center">
          <p className="text-lg text-green-600 font-semibold">
            Thank you! Your ride has been booked.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
          >
            Go Back to Home
          </button>
        </div>
      ) : (
        <>
          {/* Ride details */}
          <div className="border rounded-md shadow-md p-4 bg-white mb-6">
            <h2 className="text-xl font-semibold">From: {ride.start}</h2>
            <h2 className="text-xl font-semibold">To: {ride.destination}</h2>
            <p>
              <strong>Time:</strong> {ride.time}
            </p>
            <p>
              <strong>Date:</strong> {ride.date}
            </p>
            <p>
              <strong>Seats Available:</strong> {ride.seats}
            </p>
          </div>

          {/* Booking form */}
          <form
            className="border rounded-md shadow-md p-4 bg-white"
            onSubmit={handleSubmit}
            style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
          >
            <h2 className="text-lg font-bold mb-4">Fill in your details</h2>

            <div className="mb-4">
              <label
                htmlFor="start"
                className="block text-sm font-medium text-gray-700"
              >
                start
              </label>
              <input
                type="text"
                id="start"
                name="start"
                value={formData.start}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your starting point"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-gray-700"
              >
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your destination"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700"
              >
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="seats"
                className="block text-sm font-medium text-gray-700"
              >
                Seats
              </label>
              <input
                type="number"
                id="seats"
                name="seats"
                value={formData.seats}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Confirm
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default BookRide;
