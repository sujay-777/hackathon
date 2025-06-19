import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserMd, FaStar, FaCalendarPlus, FaEnvelope, FaTimes } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TherapistList = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [booking, setBooking] = useState({ date: '', startTime: '', sessionType: 'video', notes: '' });
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await axios.get(`${API_URL}/therapists`, {
          params: search ? { search } : {}
        });
        setTherapists(response.data);
      } catch (err) {
        setError('Failed to fetch therapists');
        console.error('Error fetching therapists:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, [search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const openBookingModal = (therapist) => {
    setSelectedTherapist(therapist);
    setBooking({ date: '', startTime: '', sessionType: 'video', notes: '' });
    setBookingStatus(null);
    setShowModal(true);
  };

  const closeBookingModal = () => {
    setShowModal(false);
    setSelectedTherapist(null);
    setBookingStatus(null);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingStatus(null);
    try {
      const token = localStorage.getItem('token');
      const date = booking.date;
      const time = booking.startTime;
      const startDateTime = new Date(`${date}T${time}:00+05:30`).toISOString();
      const res = await axios.post(
        `${API_URL}/appointments`,
        {
          therapistId: selectedTherapist._id,
          startDateTime,
          sessionType: booking.sessionType,
          notes: booking.notes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setBookingStatus({ success: true, message: 'Appointment booked successfully!' });
      setBooking({ date: '', startTime: '', sessionType: 'video', notes: '' });
    } catch (err) {
      setBookingStatus({ success: false, message: err.response?.data?.message || 'Failed to book appointment.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-6 animate-fade-in-up">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 drop-shadow-lg animate-fade-in-up delay-100">Find a Therapist</h1>
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-6 flex flex-col md:flex-row items-center gap-4 border border-blue-100 animate-fade-in-up delay-200">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or specialization..."
            className="w-full md:w-1/2 border border-gray-300 rounded-xl p-3 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-lg"
          />
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-fade-in-up delay-300">
            {error}
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up delay-300">
          {therapists.map((therapist) => (
            <div
              key={therapist._id}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between border border-purple-100 hover:scale-105 hover:shadow-2xl transition-all duration-200 animate-fade-in-up delay-400"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full mr-4 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg">
                    <FaUserMd />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-700">{therapist.name}</h3>
                    <p className="text-gray-600 text-sm">{Array.isArray(therapist.specialization) ? therapist.specialization.join(', ') : therapist.specialization}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 flex-1">{therapist.bio}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><FaCalendarPlus className="text-blue-400" /> Experience: {therapist.experience} years</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><FaStar className="text-yellow-400" /> Rating: {therapist.rating || 'N/A'} / 5</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-blue-700 hover:scale-105 transition-all duration-200" onClick={() => openBookingModal(therapist)}><FaCalendarPlus /> Book</button>
                    <a href={`mailto:${therapist.email}`} className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-green-700 hover:scale-105 transition-all duration-200"><FaEnvelope /> Contact</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {therapists.length === 0 && !loading && (
          <div className="text-center py-8 animate-fade-in-up delay-400">
            <p className="text-gray-600">No therapists found matching your criteria.</p>
          </div>
        )}
      </div>
      {/* Booking Modal */}
      {showModal && selectedTherapist && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fade-in-up delay-500">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-blue-200 animate-fade-in-up delay-600">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl" onClick={closeBookingModal}><FaTimes /></button>
            <h2 className="text-2xl font-extrabold mb-2 text-blue-700 flex items-center gap-2"><FaCalendarPlus /> Book Appointment</h2>
            <p className="mb-4 text-gray-700">with <span className="font-bold text-purple-700">{selectedTherapist.name}</span></p>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" name="date" value={booking.date} onChange={handleBookingChange} required className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input type="time" name="startTime" value={booking.startTime} onChange={handleBookingChange} required className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Session Type</label>
                <select name="sessionType" value={booking.sessionType} onChange={handleBookingChange} required className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="chat">Chat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea name="notes" value={booking.notes} onChange={handleBookingChange} className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" rows={2} />
              </div>
              {bookingStatus && (
                <div className={bookingStatus.success ? 'text-green-600' : 'text-red-600'}>
                  {bookingStatus.message}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeBookingModal} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold">Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default TherapistList; 