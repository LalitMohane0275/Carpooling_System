import React, { useState, useEffect } from "react";
import {
  Car,
  Search,
  PlusCircle,
  User,
  Menu,
  X,
  Home,
  Info,
  LogOut,
  Bell, // Added Bell icon for notifications
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

function Navbar() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogInNavigation = () => navigate("/login");
  const handleSignUpNavigation = () => navigate("/signup");
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  let userId = null;
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.userId;
      console.log(`User ${userId}`);
    } catch (error) {
      console.error("Invalid token:", error, userId);
    }
  } else {
    console.log("no token found");
  }

  // Fetch notifications
  useEffect(() => {
    if (isLoggedIn && userId) {
      const fetchNotifications = async () => {
        const response = await fetch(`http://localhost:3000/api/v1/notifications/${userId}`);
        const data = await response.json();
        setNotifications(data);
      };
      fetchNotifications();

      // Poll every 10 seconds (optional; replace with WebSockets for real-time)
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, userId]);

  // Mark notification as read
  const markAsRead = async (id) => {
    await fetch(`http://localhost:3000/api/v1/notifications//read/${id}`, { method: 'PUT' });
    setNotifications(notifications.filter(n => n._id !== id));
  };

  return (
    <div className="bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-100 shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href={isLoggedIn ? "/home" : "/"} className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-blue-600" strokeWidth={2.5} />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  RideBuddy
                </span>
              </a>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-8">
              {isLoggedIn ? (
                <>
                  <a href="/home" className="nav-link group">
                    <Home className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                    <span>Home</span>
                  </a>
                  <a href="/about" className="nav-link group">
                    <Info className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                    <span>About</span>
                  </a>
                  <a href="/find-ride" className="nav-link group">
                    <Search className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                    <span>Find a Ride</span>
                  </a>
                  <a href="/create-ride" className="nav-link group">
                    <PlusCircle className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                    <span>Create a Ride</span>
                  </a>

                  {/* Notifications Dropdown */}
                  <div className="relative">
                    <button onClick={toggleNotifications} className="p-2 rounded-full bg-gray-100 hover:bg-blue-50">
                      <Bell className="h-5 w-5 text-gray-600" />
                      {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                      )}
                    </button>
                    {isNotificationsOpen && (
                      <div className="absolute right-0 w-64 mt-2 py-2 bg-white rounded-lg shadow-lg border">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div key={notif._id} className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                              {notif.message}
                              <button onClick={() => markAsRead(notif._id)} className="ml-2 text-blue-600">Mark as read</button>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">No new notifications</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-1 p-2 rounded-full bg-gray-100 hover:bg-blue-50 transition-colors group-hover:ring-2 group-hover:ring-blue-100">
                      <User className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                    </button>
                    <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <a
                        href={`/profile/${userId}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        View Profile
                      </a>
                      <hr className="my-2 border-gray-100" />
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <a href="/#features" className="nav-link group">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors">
                      Features
                    </span>
                  </a>
                  <a href="/#how-it-works" className="nav-link group">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors">
                      How It Works
                    </span>
                  </a>
                  <a href="/#testimonials" className="nav-link group">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors">
                      Testimonials
                    </span>
                  </a>
                  <button
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={handleLogInNavigation}
                  >
                    Log In
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
                    onClick={handleSignUpNavigation}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          {isLoggedIn ? (
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              <a href="/home" className="mobile-nav-link">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </a>
              <a href="/about" className="mobile-nav-link">
                <Info className="h-5 w-5" />
                <span>About</span>
              </a>
              <a href="/find-ride" className="mobile-nav-link">
                <Search className="h-5 w-5" />
                <span>Find a Ride</span>
              </a>
              <a href="/create-ride" className="mobile-nav-link">
                <PlusCircle className="h-5 w-5" />
                <span>Create a Ride</span>
              </a>
              <a href="/profile" className="mobile-nav-link">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </a>
            </div>
          ) : (
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              <a href="#features" className="mobile-nav-link">
                Features
              </a>
              <a href="#how-it-works" className="mobile-nav-link">
                How It Works
              </a>
              <a href="#testimonials" className="mobile-nav-link">
                Testimonials
              </a>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <button
                  className="w-full px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={handleLogInNavigation}
                >
                  Log In
                </button>
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
                  onClick={handleSignUpNavigation}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      <div className="pt-16 flex-grow" />
    </div>
  );
}

export default Navbar;