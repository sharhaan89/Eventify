import { useState, useEffect } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

// Array of background images
const backgroundImages = [
  "../images/incident-03.jpeg",
  "../images/incident-05.jpg",
  "../images/nitk-1.avif",
  "../images/nitk-2.jpg"
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  // Change background image every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 2500)
    
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This ensures cookies are sent and received
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Login successful
        console.log('Login successful:', data)
        
        // You can store user data in localStorage/sessionStorage if needed
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        
        // Redirect to dashboard or home page
        navigate('/dashboard') // Change this to your desired route
      } else {
        // Login failed
        setError(data.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
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
            
            {error && (
              <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white disabled:cursor-not-allowed"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 ease-in-out"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={20} className="mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="py-4 bg-zinc-900 text-center">
            <p className="text-zinc-400">
              Don't have an account?{" "}
              <NavLink to="/users/signup" className="text-rose-400 hover:text-rose-300 font-medium">
                Sign up
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}