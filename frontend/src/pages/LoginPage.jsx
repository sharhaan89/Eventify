import { useState, useEffect } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { NavLink } from 'react-router-dom'

// Array of background images
const backgroundImages = [
  "../images/incident-03.jpeg",
  "../images/incident-05.jpg",
  "../images/nitk-1.avif",
  "../images/nitk-2.jpg"
]

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)

  // Change background image every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 2500)
    
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background image with fade effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
          opacity: 0.7
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60" />
      
      {/* Login Card */}
      <div className="z-10 w-full max-w-md px-4">
        <div className="bg-zinc-800 rounded-xl shadow-2xl overflow-hidden border border-zinc-700">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
            <p className="text-zinc-400 text-center mb-8">Sign in to your account</p>
            
            <form action="/users/login" method="POST" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 ease-in-out"
              >
                <LogIn size={20} className="mr-2" />
                Sign In
              </button>
            </form>
          </div>
          
          <div className="py-4 bg-zinc-900 text-center">
            <p className="text-zinc-400">
              Don't have an account?{" "}
              <a className="text-rose-400 hover:text-rose-300 font-medium">
               <NavLink to="/users/signup">Sign up</NavLink>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}