import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { MapPin, Clock, Calendar, Users, ArrowLeft, Share2, Heart } from 'lucide-react'
import Navbar from "../components/Navbar"
import fakeEvents from "../tempdata.js"

export default function EventDetails() {

  const events = fakeEvents
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find the event with the matching id
    const foundEvent = events.find((e) => e._id === parseInt(id))
    setEvent(foundEvent)
    setLoading(false)
  }, [id])

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
        <img src={event.image || "../images/placeholder.png"} alt={event.title} className="w-full h-full object-cover" />
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
                            <span className="block">{formatDate(event.endTime)} at {formatTime(event.endTime)}</span>
                          </>
                        ) : (
                          <>
                            <span className="block">{formatDate(event.fromTime)}</span>
                            <span className="block">{formatTime(event.fromTime)} - {formatTime(event.endTime)}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-rose-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-white">Location</h3>
                      <p className="text-zinc-300">{event.venue}</p>
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
                    <button className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-md transition-colors">
                      Register for Event
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
