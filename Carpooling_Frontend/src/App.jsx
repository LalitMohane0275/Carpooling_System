import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './components/About';
import CreateRide from './components/CreateRide';
import FindRides from './components/FindRides';
import Landing from './components/Landing';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignUpPage from './pages/SignUp';
import LoginPage from './pages/Login';
import NotFound from './pages/NotFound';
import BookRide from './components/BookRide';

function App() {
  return (
    <div className="App">
      <Navbar/>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/find-ride" element={<FindRides />} />
        <Route path="/create-ride" element={<CreateRide />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book-ride/:id" element={<BookRide />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
