import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import CreateRide from "./pages/CreateRide";
import FindRides from "./pages/FindRides";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import BookRide from "./pages/BookRide";
import ProfilePage from "./pages/Profile";
import Footer from "./components/Footer";

function App() {
  // Extract the username from localStorage
  const userName = localStorage.getItem("userName");

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/find-ride" element={<FindRides />} />
        <Route path="/create-ride" element={<CreateRide />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book-ride/:id" element={<BookRide />} />
        {/* Add dynamic routing for the profile */}
        {userName ? (
          <Route
            path="/profile"
            element={<Navigate to={`/profile/${userName}`} />}
          />
        ) : (
          <Route path="/profile" element={<Navigate to="/login" />} />
        )}
        <Route path="/profile/:userName" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
