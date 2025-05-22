import { MapPin, Clock, Calendar } from "lucide-react"

export default function EventCard({ event }) {
  // Format date to display as "Month Day, Year"
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
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
  const isMultiDayEvent = formatDate(event.fromTime) !== formatDate(event.toTime)

  return (
    <div className="bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-zinc-700">
      <div className="relative h-48">
        <img src={event.image || "../images/placeholder.png"} alt={event.title.length > 30 ? event.title.slice(0, 30) + "..." : event.title} className="w-full h-full object-cover" />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-white">{event.title.length > 30 ? event.title.slice(0, 30) + "..." : event.title}</h3>

        <div className="text-sm text-zinc-300 mb-3 space-y-2">
          <p className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-zinc-400" />
            <span className="line-clamp-1">{event.venue.venueName}</span>
          </p>

          <p className="flex items-start">
            <Calendar className="h-4 w-4 mr-1 text-zinc-400 mt-0.5" />
            <span>
              {isMultiDayEvent ? (
                <span>
                  {formatDate(event.fromTime)} - {formatDate(event.toTime)}
                </span>
              ) : (
                <span>{formatDate(event.fromTime)}</span>
              )}
            </span>
          </p>

          <p className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-zinc-400" />
            <span>
              {formatTime(event.fromTime)} - {formatTime(event.toTime)}
            </span>
          </p>
        </div>

        <div className="bg-rose-900 text-white text-sm font-medium px-3 py-1 rounded-full inline-block">
          {event.club}
        </div>
      </div>
    </div>
  )
}
