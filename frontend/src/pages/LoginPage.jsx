import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login submitted:', { email, password });

        try {
            const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // sends cookies
            body: JSON.stringify({ email, password }),
            });

            const data = await response.json(); // direct JSON parsing

            if (!response.ok) {
            console.error('Login failed:', data);
            return;
            }

            console.log('Login successful:', data);
            navigate('/events'); // or another route
        } catch (error) {
            console.error('Login error:', error);
        }
        };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${images[currentBgIndex]})` }}
    >
      <div className="bg-gray-900 p-10 rounded-xl shadow-2xl w-80 text-center">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Eventify</h2>
        <h3 className="text-xl font-semibold mb-6 text-gray-200">Welcome Back</h3>
        
        <div className="space-y-4">
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
          
          <button
            onClick={handleSubmit}
            className="w-full p-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-300"
          >
            Log In
          </button>
        </div>
        
        <p className="mt-6 text-gray-300">
          Don't have an account?{' '}
          <a href="/signup" className="text-red-400 hover:text-red-300 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}