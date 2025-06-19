import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaRobot, FaPaperPlane } from 'react-icons/fa';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat history
    const loadChatHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/chatbot/history`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.length > 0) {
          const lastChat = response.data[0];
          setMessages(lastChat.messages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/chatbot/message`,
        { message: userMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Add bot response to chat
      setMessages(prev => [...prev, { role: 'bot', content: response.data.response }]);

      // If escalation is needed, show a notification
      if (response.data.requiresEscalation) {
        alert('Your message has been escalated to a therapist. They will contact you soon.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-6 flex flex-col justify-center sm:py-12 animate-fade-in-up">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto animate-fade-in-up delay-100">
        <div className="relative px-4 py-10 bg-white/80 backdrop-blur-lg mx-8 md:mx-0 shadow-2xl rounded-3xl sm:p-10 border border-blue-100 animate-fade-in-up delay-200">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="h-96 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up delay-300`}
                    >
                      {message.role === 'bot' && (
                        <FaRobot className="text-2xl text-purple-400 mr-2 self-end" />
                      )}
                      <div
                        className={`inline-block p-3 rounded-2xl shadow-md max-w-xs break-words ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.role === 'user' && (
                        <FaUserCircle className="text-2xl text-blue-400 ml-2 self-end" />
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="mt-4 animate-fade-in-up delay-400">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-3 border border-gray-300 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base bg-white/80"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                    >
                      <FaPaperPlane className="inline-block" /> {loading ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
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

export default Chatbot; 