import { useState, useEffect } from "react"
import { Eye, EyeOff, UserPlus, Check } from "lucide-react"
import { NavLink, useNavigate } from 'react-router-dom'

// Array of background images
const backgroundImages = [
  "../images/incident-03.jpeg",
  "../images/incident-05.jpg",
  "../images/nitk-1.avif",
  "../images/nitk-2.jpg"
]

// Branch options based on schema
const branchOptions = [
  'CSE', 'MECH', 'CHEM', 'CIVIL', 'ECE', 'EEE', 'IT', 'MACS', 'META', 'MINING', 'PHY'
]

// Gender options based on schema
const genderOptions = ['Male', 'Female', 'Other']

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
    organization: "",
    gender: "",
    branch: "",
    yog: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  // Change background image every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1))
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  // Check if passwords match
  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword)
    } else {
      setPasswordMatch(true)
    }
  }, [formData.password, formData.confirmPassword])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    // Form validation
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim() || 
        !formData.confirmPassword.trim() || !formData.organization.trim()) {
      setError('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!")
      setIsLoading(false)
      return
    }

    // YOG validation (if provided)
    if (formData.yog && (!/^\d{4}$/.test(formData.yog) || parseInt(formData.yog) < 1900 || parseInt(formData.yog) > 2050)) {
      setError('Year of Graduation must be a valid 4-digit year')
      setIsLoading(false)
      return
    }

    try {
      const requestBody = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        organization: formData.organization.trim()
      }

      // Add optional fields only if they have values
      if (formData.gender) requestBody.gender = formData.gender
      if (formData.branch) requestBody.branch = formData.branch
      if (formData.yog) requestBody.yog = parseInt(formData.yog)

      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Signup successful:', data)
        setSuccess('Account created successfully! Redirecting to login...')
        
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        
        setTimeout(() => {
          navigate('/users/login')
        }, 1500)
      } else {
        setError(data.error || data.message || 'Signup failed. Please try again.')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      {/* Background image with fade effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
          opacity: 0.7,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60" />

      {/* Signup Card */}
      <div className="z-10 w-full max-w-2xl px-4 py-8">
        <div className="bg-zinc-800 rounded-xl shadow-2xl overflow-hidden border border-zinc-700">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
            <p className="text-zinc-400 text-center mb-8">Join Eventify today</p>

            {error && (
              <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username and Email - Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
                    Username *
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Choose a username"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Organization */}
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-zinc-300 mb-2">
                  Organization *
                </label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Your organization/club name"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Fields - Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Create a password"
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
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-zinc-700 border ${
                        passwordMatch ? "border-zinc-600" : "border-red-500"
                      } text-white focus:outline-none focus:ring-2 ${
                        passwordMatch ? "focus:ring-rose-500" : "focus:ring-red-500"
                      } focus:border-transparent`}
                      placeholder="Confirm your password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white disabled:cursor-not-allowed"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {!passwordMatch && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Role *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`flex items-center justify-center p-3 rounded-lg cursor-pointer border ${
                      formData.role === "Student"
                        ? "bg-rose-900/50 border-rose-500"
                        : "bg-zinc-700 border-zinc-600 hover:bg-zinc-600"
                    } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => !isLoading && setFormData((prev) => ({ ...prev, role: "Student" }))}
                  >
                    <div className="flex items-center">
                      {formData.role === "Student" && <Check size={18} className="text-rose-400 mr-2" />}
                      <span className="font-medium text-white">Student</span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-center p-3 rounded-lg cursor-pointer border ${
                      formData.role === "Manager"
                        ? "bg-rose-900/50 border-rose-500"
                        : "bg-zinc-700 border-zinc-600 hover:bg-zinc-600"
                    } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => !isLoading && setFormData((prev) => ({ ...prev, role: "Manager" }))}
                  >
                    <div className="flex items-center">
                      {formData.role === "Manager" && <Check size={18} className="text-rose-400 mr-2" />}
                      <span className="font-medium text-white">Manager</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Fields Section */}
              <div className="border-t border-zinc-600 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Additional Information</h3>
                
                {/* Gender and Branch - Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-zinc-300 mb-2">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      disabled={isLoading}
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-zinc-300 mb-2">
                      Branch
                    </label>
                    <select
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      disabled={isLoading}
                    >
                      <option value="">Select Branch</option>
                      {branchOptions.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Year of Graduation */}
                <div>
                  <label htmlFor="yog" className="block text-sm font-medium text-zinc-300 mb-2">
                    Year of Graduation
                  </label>
                  <input
                    id="yog"
                    name="yog"
                    type="number"
                    value={formData.yog}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="e.g., 2025"
                    min="1900"
                    max="2050"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 ease-in-out mt-6"
                disabled={!passwordMatch || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} className="mr-2" />
                    Create Account
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="py-4 bg-zinc-900 text-center">
            <p className="text-zinc-400">
              Already have an account?{" "}
              <NavLink to="/users/login" className="text-rose-400 hover:text-rose-300 font-medium">
                Login
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}