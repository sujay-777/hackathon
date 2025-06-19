import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaUserMd, FaCalendarAlt, FaHourglassHalf, FaUserShield, FaClipboardList, FaUserFriends, FaCalendarCheck } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTherapists: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center animate-fade-in-up">
        <div className="text-xl text-blue-700 font-bold animate-fade-in-up delay-200">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-6 animate-fade-in-up">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 animate-fade-in-up delay-100">
          <h1 className="text-3xl font-extrabold text-gray-800 drop-shadow-lg flex items-center gap-2"><FaUserShield className="text-blue-500" /> Admin Dashboard</h1>
          <div className="text-sm text-gray-600 mt-2 md:mt-0">
            Welcome, <span className="font-bold text-blue-700">{user?.name}</span>
          </div>
        </div>
        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl mb-6 border border-blue-100 animate-fade-in-up delay-200">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-bold flex items-center gap-2 transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <FaClipboardList /> Overview
            </button>
            <button
              className={`px-6 py-3 font-bold flex items-center gap-2 transition-all duration-200 ${
                activeTab === 'therapists'
                  ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
              onClick={() => setActiveTab('therapists')}
            >
              <FaUserMd /> Therapists
            </button>
            <button
              className={`px-6 py-3 font-bold flex items-center gap-2 transition-all duration-200 ${
                activeTab === 'users'
                  ? 'text-pink-600 border-b-4 border-pink-600 bg-pink-50'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <FaUserFriends /> Users
            </button>
            <button
              className={`px-6 py-3 font-bold flex items-center gap-2 transition-all duration-200 ${
                activeTab === 'appointments'
                  ? 'text-green-600 border-b-4 border-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
              onClick={() => setActiveTab('appointments')}
            >
              <FaCalendarCheck /> Appointments
            </button>
          </div>
        </div>
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-fade-in-up delay-300">
            {error}
          </div>
        )}
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up delay-300">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center border-t-4 border-blue-400">
              <FaUsers className="text-3xl text-blue-400 mb-2" />
              <h3 className="text-lg font-bold text-blue-700 mb-2">Total Users</h3>
              <p className="text-3xl font-extrabold">{stats.totalUsers}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center border-t-4 border-purple-400">
              <FaUserMd className="text-3xl text-purple-400 mb-2" />
              <h3 className="text-lg font-bold text-purple-700 mb-2">Total Therapists</h3>
              <p className="text-3xl font-extrabold">{stats.totalTherapists}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center border-t-4 border-green-400">
              <FaCalendarAlt className="text-3xl text-green-400 mb-2" />
              <h3 className="text-lg font-bold text-green-700 mb-2">Total Appointments</h3>
              <p className="text-3xl font-extrabold">{stats.totalAppointments}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center border-t-4 border-pink-400">
              <FaHourglassHalf className="text-3xl text-pink-400 mb-2" />
              <h3 className="text-lg font-bold text-pink-700 mb-2">Pending Appointments</h3>
              <p className="text-3xl font-extrabold">{stats.pendingAppointments}</p>
            </div>
          </div>
        )}
        {/* Therapists Tab */}
        {activeTab === 'therapists' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 animate-fade-in-up delay-400">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-700 flex items-center gap-2"><FaUserMd /> Manage Therapists</h2>
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2">
                <FaUserMd /> Add New Therapist
              </button>
            </div>
            {/* Add therapist management table here */}
          </div>
        )}
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 animate-fade-in-up delay-400">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-pink-700 flex items-center gap-2"><FaUserFriends /> Manage Users</h2>
              <button className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:from-pink-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2">
                <FaUsers /> Export Users
              </button>
            </div>
            {/* Add user management table here */}
          </div>
        )}
        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 animate-fade-in-up delay-400">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-700 flex items-center gap-2"><FaCalendarCheck /> Manage Appointments</h2>
              <div className="flex space-x-2">
                <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2">
                  <FaCalendarAlt /> Export Schedule
                </button>
                <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:from-blue-600 hover:to-green-600 transition-all duration-200 flex items-center gap-2">
                  <FaClipboardList /> Generate Report
                </button>
              </div>
            </div>
            {/* Add appointment management table here */}
          </div>
        )}
      </div>
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

export default AdminDashboard; 