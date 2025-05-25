import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { MapPin, Clock, Calendar, Users, ArrowLeft, Share2, Heart, CheckCircle, AlertCircle } from 'lucide-react'
import Navbar from "../components/NavBar.jsx"
import fakeEvents from "../tempdata.js"

export default function EventDetails() {

  const API_URL = import.meta.env.VITE_API_URL;
  const events = fakeEvents
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [registrationMessage, setRegistrationMessage] = useState(null)
  const [registrationError, setRegistrationError] = useState(null)

    useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/events/${id}`, {
          credentials: "include", // if your backend requires auth cookies
        });

        if (!res.ok) {
          throw new Error("Failed to fetch event");
        }

        const data = await res.json();
        setEvent(data);
      } catch (err) {
        //setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  /*
  useEffect(() => {
    // Find the event with the matching id
    const foundEvent = events.find((e) => e._id === parseInt(id))
    setEvent(foundEvent)
    setLoading(false)
  }, [id])
*/

  const handleRegister = async () => {
    setRegistering(true)
    setRegistrationMessage(null)
    setRegistrationError(null)

    try {
      const res = await fetch(`${API_URL}/events/${id}/registrations`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to register for event');
      }

      const data = await res.json();
      setRegistrationMessage('Successfully registered for the event!');
      
      // Hide the success message after 5 seconds
      setTimeout(() => {
        setRegistrationMessage(null);
      }, 5000);

    } catch (err) {
      setRegistrationError("You have already registered for this event.");
      
      // Hide the error message after 5 seconds
      setTimeout(() => {
        setRegistrationError(null);
      }, 5000);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="text-zinc-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Format date to display as "Day of Week, Month Day, Year"
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Format time to display as "HH:MM AM/PM"
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Check if the event spans multiple days
  const isMultiDayEvent = new Date(event.fromTime).toDateString() !== new Date (event.endTime).toDateString()

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <Navbar />

      {/* Back button */}
      <div className="container mx-auto px-4 py-4 pt-12">
        <Link to="/events" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Events
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        <img src={event.banner?.url || "/images/placeholder.jpg"} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-90"></div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Title and Actions */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{event.title}</h1>
              
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors">
                  <Heart className="h-5 w-5 text-red-400" />
                </button>
                <button className="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors">
                  <Share2 className="h-5 w-5 text-zinc-300" />
                </button>
              </div>
            </div>

            {/* Registration Messages */}
            {registrationMessage && (
              <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <p className="text-green-100">{registrationMessage}</p>
              </div>
            )}

            {registrationError && (
              <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-red-100">{registrationError}</p>
              </div>
            )}

            {/* Event Details */}
            <div className="grid grid-cols-1 gap-8">
              <div className="md:col-span-2 space-y-6">
                {/* Date, Time, Location */}
                <div className="bg-zinc-750 rounded-lg p-4 space-y-3 border border-zinc-700">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-rose-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-white">Date & Time</h3>
                      <p className="text-zinc-300">
                        {isMultiDayEvent ? (
                          <>
                            <span className="block">{formatDate(event.fromTime)} at {formatTime(event.fromTime)}</span>
                            <span className="block">to</span>
                            <span className="block">{formatDate(event.toTime)} at {formatTime(event.toTime)}</span>
                          </>
                        ) : (
                          <>
                            <span className="block">{formatDate(event.fromTime)}</span>
                            <span className="block">{formatTime(event.fromTime)} - {formatTime(event.toTime)}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-rose-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-white">Location</h3>
                      <p className="text-zinc-300">{event.venue.venueName}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 text-rose-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-white">Organized by</h3>
                      <p className="text-zinc-300">{event.club}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">About This Event</h2>
                  <div className="text-zinc-300 space-y-4">
                    <p>{event.description}</p>
                  </div>
                </div>
                 <div className="mt-6">
                    <button 
                      onClick={handleRegister}
                      disabled={registering}
                      className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                    >
                      {registering ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Registering...
                        </>
                      ) : (
                        'Register for Event'
                      )}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}