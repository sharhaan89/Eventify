import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, BarChart3, Edit, Trash2, AlertCircle } from 'lucide-react';

const EventsManagerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
        const response = await fetch(`${API_URL}/events/me`, {
        method: 'GET',
        credentials: 'include', // This tells the browser to include cookies
        headers: {
            'Content-Type': 'application/json'
        }
        });


      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setDeleteLoading(eventId);
        const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include', // Ensure cookies are sent
        headers: {
            'Content-Type': 'application/json'
        }
        });


      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Remove the event from the local state
      setEvents(events.filter(event => event._id !== eventId));
    } catch (err) {
      alert('Error deleting event: ' + err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleViewAnalytics = (eventId) => {
    // Redirect to analytics page
    window.location.href = `/events/${eventId}/analytics`;
  };

  const handleModifyEvent = (eventId) => {
    // Redirect to edit page
    window.location.href = `/events/${eventId}/edit`;
  };

  const getEventStatus = (fromTime, toTime) => {
    const now = new Date();
    const start = new Date(fromTime);
    const end = new Date(toTime);

    if (now < start) {
      return { status: 'upcoming', label: 'Upcoming', color: 'text-yellow-400' };
    } else if (now >= start && now <= end) {
      return { status: 'ongoing', label: 'Ongoing', color: 'text-green-400' };
    } else {
      return { status: 'ended', label: 'Ended', color: 'text-gray-400' };
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 text-xl mb-2">Error loading events</div>
          <div className="text-gray-400">{error}</div>
          <button 
            onClick={fetchEvents}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b-2 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Event Manager Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage and monitor your events</p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">No Events Found</h2>
            <p className="text-gray-500">You haven't created any events yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventStatus = getEventStatus(event.fromTime, event.toTime);
              
              return (
                <div 
                  key={event._id} 
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-600 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20"
                >
                  {/* Event Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white truncate pr-2">
                      {event.title}
                    </h3>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full bg-gray-800 ${eventStatus.color}`}>
                      {eventStatus.label}
                    </span>
                  </div>

                  {/* Event Description
                  {event.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>
                  )}
                     */}

                  {/* Event Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-300">
                      <Users className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm">{event.club}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm">
                        {event.venue?.venueName || 'Venue not specified'}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm">
                        {formatDate(event.fromTime)}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm">
                        {formatTime(event.fromTime)} - {formatTime(event.toTime)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewAnalytics(event._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                      </button>
                      
                      <button
                        onClick={() => handleModifyEvent(event._id)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Modify
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      disabled={deleteLoading === event._id}
                      className="w-full bg-gray-800 hover:bg-red-900 border border-red-700 text-red-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deleteLoading === event._id ? 'Deleting...' : 'Delete Event'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsManagerDashboard;