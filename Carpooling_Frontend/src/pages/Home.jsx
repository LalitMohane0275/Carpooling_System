import React, { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  Plus,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Star,
} from "lucide-react";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("available");

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome back, John!
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Find a Ride
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center bg-gray-100 rounded-md p-2">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="From"
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
              <div className="flex items-center bg-gray-100 rounded-md p-2">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="To"
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
              <div className="flex items-center bg-gray-100 rounded-md p-2">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <input
                  type="date"
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
              <button className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-300 flex items-center justify-center">
                <Search className="h-5 w-5 mr-2" />
                Search Rides
              </button>
            </form>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Rides</h2>
            <button className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-300 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Offer a Ride
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md">
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "available"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("available")}
              >
                Available
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "upcoming"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "past"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("past")}
              >
                Past
              </button>
            </div>
            <div className="p-4">
              {activeTab === "available" && (
                <div className="space-y-4">
                  <RideCard
                    from="San Francisco, CA"
                    to="Los Angeles, CA"
                    date="May 15, 2023"
                    time="09:00 AM"
                    seats={3}
                    price={35}
                  />
                  <RideCard
                    from="New York, NY"
                    to="Boston, MA"
                    date="May 18, 2023"
                    time="10:30 AM"
                    seats={2}
                    price={40}
                  />
                </div>
              )}
              {activeTab === "upcoming" && (
                <div className="text-center text-gray-500 py-4">
                  No upcoming rides scheduled.
                </div>
              )}
              {activeTab === "past" && (
                <div className="text-center text-gray-500 py-4">
                  No past rides to display.
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Popular Routes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PopularRouteCard
              from="San Francisco"
              to="Los Angeles"
              price={35}
              rating={4.8}
            />
            <PopularRouteCard
              from="New York"
              to="Boston"
              price={40}
              rating={4.7}
            />
            <PopularRouteCard
              from="Chicago"
              to="Detroit"
              price={30}
              rating={4.6}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const RideCard = ({ from, to, date, time, seats, price }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
      <div>
        <div className="font-semibold text-gray-800">
          {from} to {to}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" /> {date}
          </span>
          <span className="flex items-center mt-1">
            <Clock className="h-4 w-4 mr-1" /> {time}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-gray-800">${price}</div>
        <div className="text-sm text-gray-500 mt-1">
          <span className="flex items-center justify-end">
            <Users className="h-4 w-4 mr-1" /> {seats} seats left
          </span>
        </div>
      </div>
      <button className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-300 ml-4">
        Book
      </button>
    </div>
  );
};

const PopularRouteCard = ({ from, to, price, rating }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-gray-800">
          {from} to {to}
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 mr-1" />
          <span className="text-sm text-gray-600">{rating}</span>
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-4">Popular among commuters</div>
      <div className="flex justify-between items-center">
        <div className="font-semibold text-gray-800">From ${price}</div>
        <button className="text-blue-500 hover:text-blue-600 transition duration-300 flex items-center">
          View Rides
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
