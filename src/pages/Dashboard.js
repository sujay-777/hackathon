import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaCalendarPlus, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaComments } from 'react-icons/fa';
import ChatBox from '../components/ChatBox';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAppointments(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/chatbot/history`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.length > 0) {
          const lastChat = response.data[0];
          const lastMessages = lastChat.messages.slice(-5); // last 5 messages
          setChatMessages(lastMessages);
        } else {
          setChatMessages([]);
        }
      } catch (error) {
        setChatMessages([]);
      }
    };

    fetchAppointments();
    fetchChatHistory();
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
          <h1 className="text-3xl font-extrabold text-gray-800 drop-shadow-lg">Dashboard</h1>
          <div className="text-sm text-gray-600 mt-2 md:mt-0">
            Welcome, <span className="font-bold text-blue-700">{user?.name}</span>
          </div>
        </div>
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-fade-in-up delay-200">
            {error}
          </div>
        )}
        {/* Profile Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-6 border border-blue-100 animate-fade-in-up delay-200">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Profile Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-semibold text-lg">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-semibold text-lg">{user?.email}</p>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-6 border border-purple-100 animate-fade-in-up delay-300">
          <h2 className="text-xl font-bold mb-4 text-purple-700">Quick Actions</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-200"
              onClick={() => navigate('/profile')}
            >
              <FaUserEdit className="text-lg" /> Update Profile
            </button>
            <button
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-bold shadow-md hover:bg-green-700 hover:scale-105 transition-all duration-200"
              onClick={() => navigate('/therapists')}
            >
              <FaCalendarPlus className="text-lg" /> Book New Session
            </button>
          </div>
        </div>
        {/* Appointments Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-pink-100 animate-fade-in-up delay-400">
          <h2 className="text-xl font-bold mb-4 text-pink-700">Upcoming Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-600">No upcoming appointments</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                let statusIcon, statusColor;
                if (appointment.status === 'confirmed') {
                  statusIcon = <FaCheckCircle className="text-green-500 mr-1" />;
                  statusColor = 'bg-green-100 text-green-800';
                } else if (appointment.status === 'pending') {
                  statusIcon = <FaHourglassHalf className="text-yellow-500 mr-1" />;
                  statusColor = 'bg-yellow-100 text-yellow-800';
                } else {
                  statusIcon = <FaTimesCircle className="text-red-500 mr-1" />;
                  statusColor = 'bg-red-100 text-red-800';
                }
                return (
                  <div
                    key={appointment._id}
                    className="border rounded-xl p-4 hover:bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between transition-all duration-200"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">
                        Session with Dr. {appointment.therapist?.name || appointment.therapistId?.name || 'Unknown'}
                      </h3>
                      <p className="text-gray-600">
                        {new Date(appointment.startDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </p>
                    </div>
                    <span
                      className={`flex items-center px-3 py-1 rounded-xl text-sm font-bold mt-2 md:mt-0 ${statusColor}`}
                    >
                      {statusIcon}
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Recent Chat History */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mt-6 border border-indigo-100 animate-fade-in-up delay-500">
          <h2 className="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2"><FaComments className="text-indigo-400" /> Recent Chat History</h2>
          {chatMessages.length === 0 ? (
            <p className="text-gray-600">No recent chat history</p>
          ) : (
            <div className="space-y-2">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="flex items-center">
                  <span className={`font-semibold mr-2 ${msg.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                    {msg.role === 'user' ? 'You:' : 'Bot:'}
                  </span>
                  <span className="text-gray-800">{msg.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Therapist Chat Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mt-6 border border-green-100 animate-fade-in-up delay-600">
          <h2 className="text-xl font-bold mb-4 text-green-700">Chat with Your Therapist</h2>
          {appointments.filter(a => a.status === 'confirmed').length === 0 ? (
            <p className="text-gray-600">No confirmed appointments to chat with a therapist.</p>
          ) : (
            <>
              <div className="mb-4 flex gap-4 overflow-x-auto pb-2">
                {appointments.filter(a => a.status === 'confirmed').map(a => {
                  const t = a.therapistId;
                  if (!t) return null;
                  const isSelected = selectedTherapist && selectedTherapist._id === t._id;
                  return (
                    <button
                      key={t._id}
                      onClick={() => setSelectedTherapist(t)}
                      className={`flex flex-col items-center px-4 py-2 rounded-xl shadow transition border-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white hover:bg-blue-100'}`}
                      style={{ minWidth: 90 }}
                    >
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold mb-1 shadow"
                        style={{ background: `hsl(${t.name ? t.name.charCodeAt(0) * 10 % 360 : 200}, 70%, 85%)` }}
                      >
                        {(t.name || '?')[0].toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-blue-900 text-center whitespace-nowrap">{t.name}</span>
                    </button>
                  );
                })}
              </div>
              {selectedTherapist && (
                <ChatBox
                  currentUser={{ id: user._id, role: 'user', name: user.name }}
                  chatPartner={{ id: selectedTherapist._id, role: 'therapist', name: selectedTherapist.name }}
                  token={token}
                />
              )}
            </>
          )}
        </div>
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

export default Dashboard; 