import { useEffect } from "react"
import axios from "axios"
import NavBar from "../components/Navbar.jsx"
import EventCard from "../components/EventCard"
import { useState } from "react"

import DateFilter from "../components/DateFilter"
import LocationFilter from "../components/LocationFilter"
import ClubFilter from "../components/ClubFilter"
import { NavLink } from "react-router-dom"
import fakeEvents from "../tempdata.js"

export default function EventListPage() {

  const API_URL = import.meta.env.VITE_API_URL;

  //const events = fakeEvents
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [startDateTime, setStartDateTime] = useState(null)
  const [endDateTime, setEndDateTime] = useState(null)
  const [selectedLocations, setSelectedLocations] = useState([])
  const [selectedClubs, setSelectedClubs] = useState([])

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
  const locations = [...new Set(events.map((event) => event.venue.venueName))]
  const clubs = [...new Set(events.map((event)=> event.club))]

  // Filter events based on date range and locations
  const filteredEvents = events.filter((event) => {
    // Date filtering
    const dateFilter =
      (!startDateTime || new Date(event.fromTime) >= startDateTime) &&
      (!endDateTime || new Date(event.toTime) <= endDateTime)

    // Location filtering
    const locationFilter = selectedLocations.length === 0 || selectedLocations.includes(event.venue.venueName)

    // Club filtering
    const clubFilter = selectedClubs.length === 0 || selectedClubs.includes(event.club)

    return dateFilter && locationFilter && clubFilter
  })

return ( <div className="min-h-screen bg-zinc-900 text-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-rose-400">Upcoming Events</h1>

        <div className="grid grid-cols-8 gap-2">
          <DateFilter
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            onStartDateTimeChange={setStartDateTime}
            onEndDateTimeChange={setEndDateTime}
          />

          <LocationFilter
            locations={locations}
            selectedLocations={selectedLocations}
            setSelectedLocations={setSelectedLocations}
          />

          <ClubFilter
            clubs={clubs}
            selectedClubs={selectedClubs}
            setSelectedClubs={setSelectedClubs}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {filteredEvents.map((event) => (
            <NavLink to= {`/events/${event._id}`} ><EventCard key={event._id} event={event}/></NavLink>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No events found for the selected filters.</p>
          </div>
        )}
      </div>
    </div> )}
