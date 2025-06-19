import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserPlus, FaUserMd, FaCalendarCheck, FaSmile } from 'react-icons/fa';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 text-white overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="relative container mx-auto px-6 py-20 text-center flex flex-col items-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg animate-fade-in-up delay-100">
            Your Mental Wellness Journey Starts Here
          </h1>
          <p className="text-xl mb-8 animate-fade-in-up delay-200">
            Connect with professional therapists and get AI-powered emotional support
          </p>
          {!user ? (
            <div className="space-x-4 flex justify-center items-center mt-4 animate-fade-in-up delay-300">
              <Link
                to="/register"
                className="bg-white/90 text-blue-700 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-100 hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-white/20 hover:scale-105 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/therapist"
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-200"
              >
                Therapist Panel
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="bg-white/90 text-blue-700 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-100 hover:scale-105 transition-all duration-200 mt-4 animate-fade-in-up delay-300"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16 animate-fade-in-up delay-400">
        <h2 className="text-3xl font-extrabold text-center mb-12 text-gray-800">Our Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 border-t-4 border-blue-400">
            <h3 className="text-xl font-bold mb-4 text-blue-700">Professional Therapists</h3>
            <p className="text-gray-600 mb-4">
              Connect with licensed therapists specialized in various areas of mental health.
            </p>
            <FaUserMd className="text-4xl text-blue-400 mx-auto" />
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 border-t-4 border-purple-400">
            <h3 className="text-xl font-bold mb-4 text-purple-700">AI Chat Support</h3>
            <p className="text-gray-600 mb-4">
              Get immediate emotional support from our AI chatbot, available 24/7.
            </p>
            <FaSmile className="text-4xl text-purple-400 mx-auto" />
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 border-t-4 border-pink-400">
            <h3 className="text-xl font-bold mb-4 text-pink-700">Easy Scheduling</h3>
            <p className="text-gray-600 mb-4">
              Book and manage your therapy sessions with our user-friendly calendar system.
            </p>
            <FaCalendarCheck className="text-4xl text-pink-400 mx-auto" />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white/80 py-16 animate-fade-in-up delay-500">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center flex flex-col items-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg text-2xl">
                <FaUserPlus />
              </div>
              <h3 className="font-bold mb-2 text-blue-700">Create Account</h3>
              <p className="text-gray-600">Sign up and complete your profile</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg text-2xl">
                <FaUserMd />
              </div>
              <h3 className="font-bold mb-2 text-purple-700">Find Therapist</h3>
              <p className="text-gray-600">Browse and select a therapist</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="bg-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg text-2xl">
                <FaCalendarCheck />
              </div>
              <h3 className="font-bold mb-2 text-pink-700">Book Session</h3>
              <p className="text-gray-600">Schedule your appointment</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg text-2xl">
                <FaSmile />
              </div>
              <h3 className="font-bold mb-2 text-green-700">Start Therapy</h3>
              <p className="text-gray-600">Begin your wellness journey</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white py-10 mt-auto animate-fade-in-up delay-600">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-extrabold">Mental Wellness</h2>
              <p className="text-gray-400">Your path to better mental health</p>
            </div>
            <div className="flex space-x-6 text-lg">
              <a href="#" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
      {/* Animations */}
      <style>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(40px);
          animation: fadeInUp 1s forwards;
        }
        .animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in-up.delay-300 { animation-delay: 0.3s; }
        .animate-fade-in-up.delay-400 { animation-delay: 0.4s; }
        .animate-fade-in-up.delay-500 { animation-delay: 0.5s; }
        .animate-fade-in-up.delay-600 { animation-delay: 0.6s; }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Home; 