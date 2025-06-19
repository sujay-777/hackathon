import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaSave } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', profilePicture: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', password: '', profilePicture: user.profilePicture || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture' && files && files[0]) {
      setForm((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/users/profile`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center animate-fade-in-up">
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100 animate-fade-in-up delay-200">
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle className="text-6xl text-blue-400 mb-2" />
          <h2 className="text-2xl font-extrabold text-blue-700">Update Profile</h2>
        </div>
        {success && <div className="text-green-600 mb-2 font-bold animate-fade-in-up delay-300">{success}</div>}
        {error && <div className="text-red-600 mb-2 font-bold animate-fade-in-up delay-300">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span></label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700">Profile Picture <span className="text-gray-400 font-normal">(optional)</span></label>
          <input type="file" name="profilePicture" accept="image/*" onChange={handleChange} className="w-full" />
        </div>
        <button type="submit" className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-3 rounded-xl font-bold shadow-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200" disabled={loading}>
          <FaSave className="inline-block mr-2" /> {loading ? 'Updating...' : 'Update Profile'}
        </button>
        <style>{`
          .animate-fade-in-up {
            opacity: 0;
            transform: translateY(40px);
            animation: fadeInUp 1s forwards;
          }
          .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
          .animate-fade-in-up.delay-300 { animation-delay: 0.3s; }
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: none;
            }
          }
        `}</style>
      </form>
    </div>
  );
};

export default Profile; 