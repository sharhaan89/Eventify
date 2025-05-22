import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function EventCheckinPage() {
  // Extract eventId and userId from URL path
  const getParamsFromURL = () => {
    const path = window.location.pathname;
    const pathParts = path.split('/');
    // Assuming URL format: /checkin/:eventId/:userId
    const eventId = pathParts[pathParts.length - 2];
    const userId = pathParts[pathParts.length - 1];
    return { eventId, userId };
  };
  
  const { eventId, userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    const performCheckin = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${API_URL}/events/checkin/${eventId}/${userId}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRegistrationData(data.registration || data);
          setSuccess(true);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Check-in failed');
        }
      } catch (err) {
        setError('Network error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId && userId) {
      performCheckin();
    } else {
      setError('Missing event ID or user ID');
      setLoading(false);
    }
  }, [eventId, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-400 text-lg">Processing check-in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-red-500 mb-2">Event Check-in</h1>
            <div className="w-24 h-1 bg-red-500 mx-auto"></div>
          </div>

          {/* Content Card */}
          <div className="bg-gray-900 border border-red-500/30 rounded-lg shadow-2xl overflow-hidden">
            {success && registrationData ? (
              <div className="p-8">
                {/* Success Icon */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-green-400 mb-2">Check-in Successful!</h2>
                  <p className="text-gray-300">You have been successfully checked in to the event.</p>
                </div>

                {/* Event Details */}
                <div className="bg-black/50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Event Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Title:</span>
                      <span className="text-white font-medium">{registrationData.event?.title || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Club:</span>
                      <span className="text-white font-medium">{registrationData.event?.club || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* User Details */}
                <div className="bg-black/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    User Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Username:</span>
                      <span className="text-white font-medium">{registrationData.user?.username || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white font-medium">{registrationData.user?.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                {/* Error Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-red-400 mb-4">Check-in Failed</h2>
                <p className="text-gray-300 text-lg mb-6">{error}</p>
                
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center mx-auto"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Event ID: {eventId} | User ID: {userId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}