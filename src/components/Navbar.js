import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="backdrop-blur-md bg-gradient-to-r from-blue-600/80 via-indigo-500/80 to-purple-500/80 shadow-lg rounded-b-2xl text-white py-4 px-2 md:px-8 sticky top-0 z-50 font-sans">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-lg flex items-center gap-2">
          <span className="bg-white/20 rounded-full px-3 py-1 shadow-md">🧠</span>
          <span className="ml-2">Mental Wellness</span>
        </Link>
        <div className="space-x-2 md:space-x-6 flex items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/20 hover:scale-105 font-semibold">
                Dashboard
              </Link>
              <Link to="/therapists" className="transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/20 hover:scale-105 font-semibold">
                Find Therapist
              </Link>
              <Link to="/chatbot" className="transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/20 hover:scale-105 font-semibold">
                Chat Support
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/20 hover:scale-105 font-semibold">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="transition-all duration-200 px-4 py-2 rounded-lg hover:bg-red-500/80 hover:text-white hover:scale-105 font-semibold border border-white/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/20 hover:scale-105 font-semibold">
                Login
              </Link>
              <Link to="/register" className="transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/20 hover:scale-105 font-semibold">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 