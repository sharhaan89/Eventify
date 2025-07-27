import { useEffect } from "react"
import axios from "axios"
import EventCard from "../components/EventCard"
import { useState } from "react"
import { Calendar, MapPin, Filter, Search, X } from "lucide-react"

import DateFilter from "../components/DateFilter"
import LocationFilter from "../components/LocationFilter"
import ClubFilter from "../components/ClubFilter"
import { NavLink } from "react-router-dom"

export default function EventListPage() {

  const API_URL = import.meta.env.VITE_API_URL;

  //const events = fakeEvents
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [startDateTime, setStartDateTime] = useState(null)
  const [endDateTime, setEndDateTime] = useState(null)
  const [selectedLocations, setSelectedLocations] = useState([])
  const [selectedClubs, setSelectedClubs] = useState([])
  const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/events`);
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get unique locations and clubs for the filter
  const locations = [...new Set(events.map((event) => event.venue?.venueName))]
  const clubs = [...new Set(events.map((event)=> event.club))]

  // Filter events based on date range and locations
  const filteredEvents = events.filter((event) => {
    // Date filtering
    const dateFilter =
      (!startDateTime || new Date(event.fromTime) >= startDateTime) &&
      (!endDateTime || new Date(event.toTime) <= endDateTime)

    // Location filtering
    const locationFilter = selectedLocations.length === 0 || selectedLocations.includes(event.venue?.venueName)

    // Club filtering
    const clubFilter = selectedClubs.length === 0 || selectedClubs.includes(event.club)

    return dateFilter && locationFilter && clubFilter
  })

  const clearAllFilters = () => {
    setStartDateTime(null)
    setEndDateTime(null)
    setSelectedLocations([])
    setSelectedClubs([])
  }

  const hasActiveFilters = startDateTime || endDateTime || selectedLocations.length > 0 || selectedClubs.length > 0

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Loading events...</div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Header */}
      <div className="bg-gray-900 border-b-2 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>
              <p className="text-gray-400 mt-2">Discover and join exciting events happening around campus</p>
            </div>
            
            {/* Filter Toggle Button */}
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <div className="text-gray-400 text-sm">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-red-800 text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters Section */}
        {showFilters && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-red-500" />
                Filter Events
              </h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-300 p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  Date Range
                </label>
                <DateFilter
                  startDateTime={startDateTime}
                  endDateTime={endDateTime}
                  onStartDateTimeChange={setStartDateTime}
                  onEndDateTimeChange={setEndDateTime}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Locations
                </label>
                <LocationFilter
                  locations={locations}
                  selectedLocations={selectedLocations}
                  setSelectedLocations={setSelectedLocations}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Search className="w-4 h-4 text-red-500" />
                  Clubs
                </label>
                <ClubFilter
                  clubs={clubs}
                  selectedClubs={selectedClubs}
                  setSelectedClubs={setSelectedClubs}
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {startDateTime && (
                <div className="bg-red-900/30 border border-red-700 text-red-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  From: {startDateTime.toLocaleDateString()}
                  <button
                    onClick={() => setStartDateTime(null)}
                    className="hover:text-red-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {endDateTime && (
                <div className="bg-red-900/30 border border-red-700 text-red-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Until: {endDateTime.toLocaleDateString()}
                  <button
                    onClick={() => setEndDateTime(null)}
                    className="hover:text-red-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {selectedLocations.map((location) => (
                <div key={location} className="bg-red-900/30 border border-red-700 text-red-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {location}
                  <button
                    onClick={() => setSelectedLocations(selectedLocations.filter(l => l !== location))}
                    className="hover:text-red-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {selectedClubs.map((club) => (
                <div key={club} className="bg-red-900/30 border border-red-700 text-red-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {club}
                  <button
                    onClick={() => setSelectedClubs(selectedClubs.filter(c => c !== club))}
                    className="hover:text-red-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">No Events Found</h2>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters 
                ? "No events match your current filters. Try adjusting your search criteria."
                : "There are no upcoming events at the moment."
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <NavLink 
                key={event._id} 
                to={`/events/${event._id}`}
                className="block hover:scale-105 transition-transform duration-200"
              >
                <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-red-600 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
                  <EventCard event={event} />
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}