import { useState, useRef, useEffect } from "react"

export default function ClubFilter({ clubs, selectedClubs, setSelectedClubs }) {
  const [isOpen, setIsOpen] = useState(false)
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
    e.stopPropagation()  // Prevent dropdown from closing
    setSelectedClubs([])
  }

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
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="col-span-2 bg-zinc-800 p-4 rounded-lg shadow-md border border-zinc-700 ">
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
        <h2 className="text-sm font-medium text-white">Filter by Club</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs flex items-center gap-2 h-10 px-3 py-2 rounded-md bg-rose-700 border border-zinc-600 text-zinc-200 hover:bg-rose-600"
            >
              <span>
                {selectedClubs.length === 0
                  ? "All clubs"
                  : selectedClubs.length === 1
                    ? selectedClubs[0]
                    : `${selectedClubs.length} clubs selected`}
              </span>
            </button>

            {isOpen && (
              <div 
                ref={dropdownRef}
                className="text-xs absolute z-10 mt-1 w-56 rounded-md bg-zinc-800 border border-zinc-700 shadow-lg"
              >
                <div className="py-2 px-3 text-sm font-medium text-zinc-200">
                  Clubs
                </div>
                <div className="h-px bg-zinc-700"></div>
                <div className="py-1 max-h-60 overflow-auto">
                  {clubs.map((club) => (
                    <div 
                      key={club}
                      className="flex items-center px-3 py-2 hover:bg-zinc-700 cursor-pointer"
                      onClick={() => handleClubToggle(club)}
                    >
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedClubs.includes(club)}
                            onChange={() => {}} // Handled by parent div onClick
                            className="w-4 h-4 text-blue-600 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500 focus:ring-1"
                          />
                        </div>
                        <span className="text-xs text-zinc-200">{club}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedClubs.length > 0 && (
                  <>
                    <div className="h-px bg-zinc-700"></div>
                    <div className="p-2">
                      <button
                        onClick={clearClubs}
                        className="w-full px-3 py-1 text-sm rounded-md text-zinc-300 hover:text-white hover:bg-zinc-700 flex items-center justify-center"
                      >
                        Clear All
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
