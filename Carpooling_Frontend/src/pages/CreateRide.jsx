import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";

function CreateRide() {
  const initialState = {
    start: "",
    stops: [],
    destination: "",
    time: "",
    date: "",
    seats: "",
    price: "",
  };

  const [ride, setRide] = useState(initialState);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [stopSuggestions, setStopSuggestions] = useState([]);
  const [isStartFocused, setIsStartFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [focusedStopIndex, setFocusedStopIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRide((prevRide) => ({
      ...prevRide,
      [name]: value,
    }));

    if (name === "start") {
      fetchSuggestions(value, setStartSuggestions);
    } else if (name === "destination") {
      fetchSuggestions(value, setDestinationSuggestions);
    }
  };

  const handleStopChange = (index, value) => {
    setRide((prevRide) => {
      const newStops = [...prevRide.stops];
      newStops[index] = value;
      return { ...prevRide, stops: newStops };
    });

    fetchSuggestions(value, (suggestions) => {
      setStopSuggestions((prev) => {
        const newSuggestions = [...prev];
        newSuggestions[index] = suggestions;
        return newSuggestions;
      });
    });
  };

  const addStop = () => {
    setRide((prevRide) => ({
      ...prevRide,
      stops: [...prevRide.stops, ""],
    }));
    setStopSuggestions((prev) => [...prev, []]);
  };

  const removeStop = (index) => {
    setRide((prevRide) => ({
      ...prevRide,
      stops: prevRide.stops.filter((_, i) => i !== index),
    }));
    setStopSuggestions((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=5&countrycodes=in`
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (name, suggestion, index = null) => {
    const address = suggestion.display_name;
    if (index !== null) {
      setRide((prevRide) => {
        const newStops = [...prevRide.stops];
        newStops[index] = address;
        return { ...prevRide, stops: newStops };
      });
      setStopSuggestions((prev) => {
        const newSuggestions = [...prev];
        newSuggestions[index] = [];
        return newSuggestions;
      });
    } else {
      setRide((prevRide) => ({
        ...prevRide,
        [name]: address,
      }));
      if (name === "start") setStartSuggestions([]);
      if (name === "destination") setDestinationSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(atob(token.split(".")[1])).userId;
      const rideData = {
        ...ride,
        user_id: userId,
        seats: Number(ride.seats),
        price: Number(ride.price),
      };
      console.log("Ride Object:", rideData);
      const response = await axios.post(
        "http://localhost:3000/api/v1/create-ride",
        rideData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Ride Created Successfully:", response.data);
      toast.success("Ride created successfully!");
      setRide(initialState);
      setStartSuggestions([]);
      setDestinationSuggestions([]);
      setStopSuggestions([]);
    } catch (error) {
      console.error("Error Creating Ride:", error.response?.data || error);
      toast.error("Failed to create the ride. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-3xl font-extrabold text-blue-900 mb-2">
              Create a Ride
            </h1>
            <p className="text-blue-600 mb-8">
              Fill in the details to offer a new ride
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <InputField
                  id="start"
                  name="start"
                  label="Start Location"
                  value={ride.start}
                  onChange={handleChange}
                  onFocus={() => setIsStartFocused(true)}
                  onBlur={() => setTimeout(() => setIsStartFocused(false), 200)}
                  placeholder="Enter pickup location (India only)"
                  icon={<MapPin className="w-5 h-5 text-blue-500" />}
                  suggestions={isStartFocused ? startSuggestions : []}
                  onSuggestionSelect={(suggestion) =>
                    handleSuggestionSelect("start", suggestion)
                  }
                />

                {ride.stops.map((stop, index) => (
                  <StopField
                    key={index}
                    index={index}
                    value={stop}
                    onChange={(value) => handleStopChange(index, value)}
                    onFocus={() => setFocusedStopIndex(index)}
                    onBlur={() =>
                      setTimeout(() => setFocusedStopIndex(null), 200)
                    }
                    onRemove={() => removeStop(index)}
                    suggestions={
                      focusedStopIndex === index
                        ? stopSuggestions[index] || []
                        : []
                    }
                    onSuggestionSelect={(suggestion) =>
                      handleSuggestionSelect("stops", suggestion, index)
                    }
                  />
                ))}

                <button
                  type="button"
                  onClick={addStop}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stop
                </button>

                <InputField
                  id="destination"
                  name="destination"
                  label="Destination"
                  value={ride.destination}
                  onChange={handleChange}
                  onFocus={() => setIsDestinationFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsDestinationFocused(false), 200)
                  }
                  placeholder="Enter drop-off location (India only)"
                  icon={<MapPin className="w-5 h-5 text-blue-500" />}
                  suggestions={
                    isDestinationFocused ? destinationSuggestions : []
                  }
                  onSuggestionSelect={(suggestion) =>
                    handleSuggestionSelect("destination", suggestion)
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    id="time"
                    name="time"
                    label="Time"
                    type="time"
                    value={ride.time}
                    onChange={handleChange}
                    icon={<Clock className="w-5 h-5 text-blue-500" />}
                  />

                  <InputField
                    id="date"
                    name="date"
                    label="Date"
                    type="date"
                    value={ride.date}
                    onChange={handleChange}
                    icon={<Calendar className="w-5 h-5 text-blue-500" />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    id="seats"
                    name="seats"
                    label="Available Seats"
                    type="number"
                    value={ride.seats}
                    onChange={handleChange}
                    placeholder="Number of seats"
                    min="1"
                    icon={<Users className="w-5 h-5 text-blue-500" />}
                  />

                  <InputField
                    id="price"
                    name="price"
                    label="Total Price"
                    type="number"
                    value={ride.price}
                    onChange={handleChange}
                    placeholder="Total trip price"
                    min="0"
                    step="0.01"
                    icon={<span className="text-blue-500 font-bold">$</span>}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Create Ride</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="bg-white shadow-lg rounded-xl border border-blue-100 mt-16"
      />
    </div>
  );
}

function InputField({
  id,
  name,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  icon,
  suggestions,
  onSuggestionSelect,
  type = "text",
  min,
  step,
}) {
  return (
    <div className="relative">
      <label
        className="flex items-center text-sm font-medium text-blue-900 mb-2"
        htmlFor={id}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
        placeholder={placeholder}
        required
        min={min}
        step={step}
      />
      {suggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-blue-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => onSuggestionSelect(suggestion)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-800 transition-colors duration-150"
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StopField({
  index,
  value,
  onChange,
  onFocus,
  onBlur,
  onRemove,
  suggestions,
  onSuggestionSelect,
}) {
  return (
    <div className="relative group">
      <label className="flex items-center text-sm font-medium text-blue-900 mb-2">
        <MapPin className="w-5 h-5 mr-2 text-blue-500" />
        Stop {index + 1}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none pr-10"
          placeholder={`Enter stop ${index + 1} location (India only)`}
          required
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {suggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-blue-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => onSuggestionSelect(suggestion)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-800 transition-colors duration-150"
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CreateRide;
