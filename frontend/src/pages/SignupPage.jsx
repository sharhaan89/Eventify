import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;
  
  const images = [
    '../images/nitk-1.avif',
    '../images/incident-03.jpeg',
    '../images/nitk-2.jpg',
    '../images/incident-05.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
        const payload = { username, email, password, organization, role };

        try {
        const response = await fetch(`${API_URL}/users/signup`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Signup failed:', data);
            return;
        }

        console.log('Signup successful:', data);    
        navigate("/users/login");
        } catch (error) {
        console.error('Signup error:', error);
        }
    }
    };


  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${images[currentBgIndex]})` }}
    >
      <div className="bg-gray-900 p-10 rounded-xl shadow-2xl w-80 text-center">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Eventify</h2>
        <h3 className="text-xl font-semibold mb-6 text-gray-200">Create Account</h3>
        
        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-red-500 focus:outline-none"
          />
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-red-500 focus:outline-none"
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-red-500 focus:outline-none"
          />
          
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-red-500 focus:outline-none"
          />
          
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Organization"
            required
            className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-red-500 focus:outline-none"
          />
          
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-800 text-gray-400 border border-gray-700 focus:border-red-500 focus:outline-none"
          >
            <option value="" disabled>Select an Option</option>
            <option value="Manager">Manager</option>
            <option value="Student">Student</option>
          </select>
          
          {error && (
            <p className="text-red-500">{error}</p>
          )}
          
          <button
            onClick={handleSubmit}
            className="w-full p-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-300"
          >
            Sign Up
          </button>
        </div>
        
        <p className="mt-6 text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="text-red-400 hover:text-red-300 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}