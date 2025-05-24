import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, X } from "lucide-react"

export default function ClubFilter({ clubs, selectedClubs, setSelectedClubs }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  const handleClubToggle = (club) => {
    if (selectedClubs.includes(club)) {
      setSelectedClubs(selectedClubs.filter((clb) => clb !== club))
    } else {
      setSelectedClubs([...selectedClubs, club])
    }
  }

  const clearClubs = (e) => {
    e.stopPropagation()
    setSelectedClubs([])
  }

  const filteredClubs = clubs.filter(club => 
    club.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen && 
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="w-full">
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:border-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-red-500" />
            <span className="text-sm">
              {selectedClubs.length === 0
                ? "All Clubs"
                : selectedClubs.length === 1
                  ? selectedClubs[0]
                  : `${selectedClubs.length} clubs selected`}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div 
            ref={dropdownRef}
            className="absolute z-20 mt-2 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clubs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm"
                />
              </div>
            </div>

            {/* Club List */}
            <div className="max-h-60 overflow-auto">
              {filteredClubs.length === 0 ? (
                <div className="px-4 py-3 text-gray-400 text-sm text-center">
                  No clubs found
                </div>
              ) : (
                filteredClubs.map((club) => (
                  <div 
                    key={club}
                    className="flex items-center px-4 py-3 hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleClubToggle(club)}
                  >
                    <div className="flex items-center w-full">
                      <div className="w-5 h-5 mr-3 flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedClubs.includes(club)}
                          onChange={() => {}}
                          className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                        />
                      </div>
                      <span className="text-sm text-white flex-1">{club}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Clear All Button */}
            {selectedClubs.length > 0 && (
              <>
                <div className="border-t border-gray-800"></div>
                <div className="p-3">
                  <button
                    onClick={clearClubs}
                    className="w-full px-3 py-2 text-sm rounded-md text-red-400 hover:text-white hover:bg-red-900/30 border border-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}