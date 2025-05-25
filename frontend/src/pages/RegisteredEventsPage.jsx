import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Building, X, QrCode, CheckCircle, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const RegisteredEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
        const response = await fetch(`${API_URL}/events/registrations/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'  // ⬅️ This sends cookies (including JWT) with the request
        });


      if (!response.ok) {
        throw new Error('Failed to fetch registered events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg">Error loading events: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Registered Events</h1>
          <p className="text-gray-400">Events you've registered for</p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No registered events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((registration) => (
              <div
                key={registration._id}
                onClick={() => openModal(registration)}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-red-500 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-red-500/20 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white line-clamp-2">
                    {registration.event.title}
                  </h3>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    registration.isCheckedIn 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {registration.isCheckedIn ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Checked In
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        Registered
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-red-400 mr-2" />
                    <span className="text-sm">
                      {formatDate(registration.event.fromTime)}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-red-400 mr-2" />
                    <span className="text-sm">
                      {formatTime(registration.event.fromTime)} - {formatTime(registration.event.toTime)}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-red-400 mr-2" />
                    <span className="text-sm">
                      {registration.event.venue?.venueName || 'Venue TBA'}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Building className="w-4 h-4 text-red-400 mr-2" />
                    <span className="text-sm">{registration.event.club}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400">
                    Registered: {formatDate(registration.registration.registeredAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">Event Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Event Info */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {selectedEvent.event.title}
                  </h3>
                  {selectedEvent.event.description && (
                    <p className="text-gray-300 mb-4">{selectedEvent.event.description}</p>
                  )}
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-5 h-5 text-red-400 mr-3" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm">{formatDate(selectedEvent.event.fromTime)}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Clock className="w-5 h-5 text-red-400 mr-3" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-sm">
                          {formatTime(selectedEvent.event.fromTime)} - {formatTime(selectedEvent.event.toTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-5 h-5 text-red-400 mr-3" />
                      <div>
                        <p className="font-medium">Venue</p>
                        <p className="text-sm">{selectedEvent.event.venue?.name || 'Venue TBA'}</p>
                        {selectedEvent.event.venue?.address && (
                          <p className="text-xs text-gray-400">{selectedEvent.event.venue.address}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Building className="w-5 h-5 text-red-400 mr-3" />
                      <div>
                        <p className="font-medium">Club</p>
                        <p className="text-sm">{selectedEvent.event.club}</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-white p-4 rounded-lg mb-4">
                      {selectedEvent.registration?.qrCode ? (
                        <img
                          src={selectedEvent.registration.qrCode.startsWith('data:') ? selectedEvent.registration.qrCode : `data:image/png;base64,${selectedEvent.registration.qrCode}`}
                          alt="QR Code"
                          className="w-48 h-48 object-contain"
                          onError={(e) => {
                            console.error('QR Code image failed to load');
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center bg-gray-200 flex-col">
                          <QrCode className="w-16 h-16 text-gray-400" />
                          <p className="text-xs text-gray-500 mt-2">No QR Code</p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 text-center">
                      Your Registration QR Code
                    </p>
                  </div>
                </div>

                {/* Registration Status */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Registration Status</p>
                      <p className="text-sm text-gray-300">
                        Registered on: {formatDate(selectedEvent.registration?.registeredAt || selectedEvent.registeredAt)}
                      </p>
                      {selectedEvent.registration?.isCheckedIn && selectedEvent.registration?.checkinTime && (
                        <p className="text-sm text-green-400">
                          Checked in on: {formatDate(selectedEvent.registration.checkinTime)} at {formatTime(selectedEvent.registration.checkinTime)}
                        </p>
                      )}
                    </div>
                    <div className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                      selectedEvent.registration?.isCheckedIn 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {selectedEvent.registration?.isCheckedIn ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Checked In
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Awaiting Check-in
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredEventsPage;