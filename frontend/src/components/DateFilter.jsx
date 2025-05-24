import { useState, useRef, useEffect } from "react"
import { Calendar, Clock, X, ChevronLeft, ChevronRight } from "lucide-react"

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
        const isToday = date.toDateString() === today.toDateString()
        
        days.push(
          <button
            key={i}
            onClick={() => onSelectDate(date)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors
              ${isSelected 
                ? 'bg-red-600 text-white' 
                : isToday
                  ? 'bg-red-900/30 text-red-400 border border-red-600'
                  : 'hover:bg-gray-700 text-gray-200'
              }`}
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
      <div ref={calendarRef} className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-4 w-72">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={goToPreviousMonth}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-white font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </div>
          <button 
            onClick={goToNextMonth}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
            <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 font-medium">
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
    <div className="w-full space-y-4">
      {/* Start Date/Time */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Start Date & Time</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <button
              ref={startButtonRef}
              onClick={() => setStartOpen(!startOpen)}
              className="w-full flex items-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:border-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <Calendar className="w-4 h-4 text-red-500" />
              <span className="text-sm">
                {startDate ? startDate.toLocaleDateString() : "Select date"}
              </span>
            </button>
            
            {startOpen && (
              <div className="absolute z-20 mt-2">
                <SimpleCalendar 
                  selectedDate={startDate}
                  onSelectDate={handleStartDateSelect}
                  calendarRef={startCalendarRef}
                />
              </div>
            )}
          </div>

          <div className="relative">
            <div className="flex items-center">
              <Clock className="absolute left-3 w-4 h-4 text-red-500 z-10" />
              <input
                type="time"
                value={startTime}
                onChange={handleStartTimeChange}
                disabled={!startDate}
                className="pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* End Date/Time */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">End Date & Time</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <button
              ref={endButtonRef}
              onClick={() => setEndOpen(!endOpen)}
              className="w-full flex items-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:border-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <Calendar className="w-4 h-4 text-red-500" />
              <span className="text-sm">
                {endDate ? endDate.toLocaleDateString() : "Select date"}
              </span>
            </button>
            
            {endOpen && (
              <div className="absolute z-20 mt-2">
                <SimpleCalendar 
                  selectedDate={endDate}
                  onSelectDate={handleEndDateSelect}
                  calendarRef={endCalendarRef}
                />
              </div>
            )}
          </div>

          <div className="relative">
            <div className="flex items-center">
              <Clock className="absolute left-3 w-4 h-4 text-red-500 z-10" />
              <input
                type="time"
                value={endTime}
                onChange={handleEndTimeChange}
                disabled={!endDate}
                className="pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clear Button */}
      {(startDateTime || endDateTime) && (
        <button
          onClick={clearFilters}
          className="w-full px-4 py-2 text-sm rounded-lg text-red-400 hover:text-white hover:bg-red-900/30 border border-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear Date Filter
        </button>
      )}
    </div>
  )
}