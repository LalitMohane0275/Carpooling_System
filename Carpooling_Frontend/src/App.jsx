import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./components/About";
import CreateRide from "./pages/CreateRide";
import FindRides from "./pages/FindRides";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import BookRide from "./pages/BookRide";
import ProfilePage from "./pages/Profile";

function App() {
  let user_id = null;
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      user_id = payload.user_id; 
      console.log(`User ${user_id}`);
    } catch (error) {
      console.error("Invalid token:", error, user_id);
    }
  }

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
        {user_id ? (
          <Route
            path="/profile"
            element={<Navigate to={`/profile/${user_id}`} />}
          />
        ) : (
          <Route path="/profile" element={<Navigate to="/login" />} />
        )}
        <Route path="/profile/:user_id" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
