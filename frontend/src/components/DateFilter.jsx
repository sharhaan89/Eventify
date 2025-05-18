import { useState, useRef, useEffect } from "react"
import { Calendar, X, Clock } from "lucide-react"

export default function DateFilter({ startDateTime, endDateTime, onStartDateTimeChange, onEndDateTimeChange }) {
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [startTime, setStartTime] = useState("00:00")
  const [endTime, setEndTime] = useState("23:59")
  
  const startCalendarRef = useRef(null)
  const endCalendarRef = useRef(null)
  const startButtonRef = useRef(null)
  const endButtonRef = useRef(null)

  const clearFilters = () => {
    setStartDate(null)
    setEndDate(null)
    setStartTime("00:00")
    setEndTime("23:59")
    onStartDateTimeChange(null)
    onEndDateTimeChange(null)
  }

  const formatDateTime = (date) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleStartDateSelect = (date) => {
    setStartDate(date)
    if (date) {
      const [hours, minutes] = startTime.split(":").map(Number)
      const newDate = new Date(date)
      newDate.setHours(hours, minutes, 0, 0)
      onStartDateTimeChange(newDate)
    } else {
      onStartDateTimeChange(null)
    }
    setStartOpen(false)
  }

  const handleEndDateSelect = (date) => {
    setEndDate(date)
    if (date) {
      const [hours, minutes] = endTime.split(":").map(Number)
      const newDate = new Date(date)
      newDate.setHours(hours, minutes, 0, 0)
      onEndDateTimeChange(newDate)
    } else {
      onEndDateTimeChange(null)
    }
    setEndOpen(false)
  }

  const handleStartTimeChange = (e) => {
    const newTime = e.target.value
    setStartTime(newTime)
    if (startDate) {
      const [hours, minutes] = newTime.split(":").map(Number)
      const newDateTime = new Date(startDate)
      newDateTime.setHours(hours, minutes, 0, 0)
      onStartDateTimeChange(newDateTime)
    }
  }

  const handleEndTimeChange = (e) => {
    const newTime = e.target.value
    setEndTime(newTime)
    if (endDate) {
      const [hours, minutes] = newTime.split(":").map(Number)
      const newDateTime = new Date(endDate)
      newDateTime.setHours(hours, minutes, 0, 0)
      onEndDateTimeChange(newDateTime)
    }
  }

  // Handle clicks outside the calendar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startOpen && startCalendarRef.current && !startCalendarRef.current.contains(event.target) && 
          startButtonRef.current && !startButtonRef.current.contains(event.target)) {
        setStartOpen(false)
      }
      
      if (endOpen && endCalendarRef.current && !endCalendarRef.current.contains(event.target) && 
          endButtonRef.current && !endButtonRef.current.contains(event.target)) {
        setEndOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [startOpen, endOpen])

  // Custom calendar component
  const SimpleCalendar = ({ selectedDate, onSelectDate, calendarRef }) => {
    const today = new Date()
    const [currentMonth, setCurrentMonth] = useState(today.getMonth())
    const [currentYear, setCurrentYear] = useState(today.getFullYear())
    
    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate()
    }
    
    const getFirstDayOfMonth = (year, month) => {
      return new Date(year, month, 1).getDay()
    }
    
    const renderDays = () => {
      const daysInMonth = getDaysInMonth(currentYear, currentMonth)
      const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
      const days = []
      
      // Add empty days for the first week
      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>)
      }
      
      // Add actual days
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentYear, currentMonth, i)
        const isSelected = selectedDate && 
          date.getDate() === selectedDate.getDate() && 
          date.getMonth() === selectedDate.getMonth() && 
          date.getFullYear() === selectedDate.getFullYear()
        
        days.push(
          <button
            key={i}
            onClick={() => onSelectDate(date)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
              ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-zinc-700 text-zinc-200'}`}
          >
            {i}
          </button>
        )
      }
      
      return days
    }
    
    const goToPreviousMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    }
    
    const goToNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
    
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December"]
    
    return (
      <div ref={calendarRef} className="text-sm bg-zinc-800 border border-zinc-700 rounded-md shadow-lg p-3 w-64">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={goToPreviousMonth}
            className="text-zinc-400 hover:text-white p-1"
          >
            &lt;
          </button>
          <div className="text-zinc-200 font-medium">
            {monthNames[currentMonth]} {currentYear}
          </div>
          <button 
            onClick={goToNextMonth}
            className="text-zinc-400 hover:text-white p-1"
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
            <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-zinc-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderDays()}
        </div>
      </div>
    )
  }

  return (
    <div className="col-span-4 bg-zinc-800 p-4 rounded-lg shadow-md border border-zinc-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-sm font-medium text-white">Filter Events by Date & Time</h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-2">
            <div className="relative">
              <button
                ref={startButtonRef}
                onClick={() => setStartOpen(!startOpen)}
                className="text-xs flex items-center gap-2 h-10 px-3 py-2 rounded-md bg-rose-700 border border-zinc-600 text-zinc-200 hover:bg-rose-600"
              >
                <Calendar className="h-4 w-4" />
                {startDate ? startDate.toLocaleDateString() : "Start Date"}
              </button>
              
              {startOpen && (
                <div className="absolute z-10 mt-1">
                  <SimpleCalendar 
                    selectedDate={startDate}
                    onSelectDate={handleStartDateSelect}
                    calendarRef={startCalendarRef}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="time"
                value={startTime}
                onChange={handleStartTimeChange}
                className="text-xs h-8 w-25 px-2 py-1 rounded-md bg-rose-700 border border-zinc-600 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={!startDate}
              />
            </div>
          </div>

          <span className="text-zinc-400">to</span>

          <div className="space-y-2">
            <div className="relative">
              <button
                ref={endButtonRef}
                onClick={() => setEndOpen(!endOpen)}
                className="flex text-xs items-center gap-2 h-10 px-3 py-2 rounded-md bg-rose-700 border border-zinc-600 text-zinc-200 hover:bg-rose-600"
              >
                <Calendar className="text-xs h-4 w-4" />
                {endDate ? endDate.toLocaleDateString() : "End Date"}
              </button>
              
              {endOpen && (
                <div className="absolute z-10 mt-1">
                  <SimpleCalendar 
                    selectedDate={endDate}
                    onSelectDate={handleEndDateSelect}
                    calendarRef={endCalendarRef}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="time"
                value={endTime}
                onChange={handleEndTimeChange}
                className="text-xs h-8 w-25 px-2 py-1 rounded-md bg-rose-700 border border-zinc-600 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={!endDate}
              />
            </div>
          </div>

          {(startDateTime || endDateTime) && (
            <button
              onClick={clearFilters}
              className="text-sm h-10 px-3 py-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-700 flex items-center"
            >
              <X className="text-sm h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}