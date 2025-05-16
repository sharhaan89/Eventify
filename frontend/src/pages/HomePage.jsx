import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, QrCode, Users } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-rose-50 to-white py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Welcome to <span className="text-rose-600">Eventify</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                The seamless platform for event management and registration with unique digital tickets.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <button onClick={() => navigate('/users/signup')} className="flex items-center justify-center rounded-md bg-rose-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-700">
                Signup
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button onClick={() => navigate('/events/all')} className="flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-100">
                Browse Events
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="mb-12 flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Platform Features</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Everything you need to create, manage, and attend events with ease.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-rose-100 p-3">
                <Calendar className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold">Event Creation</h3>
              <p className="text-center text-gray-500">
                Easily create and customize events with all the details your attendees need.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-rose-100 p-3">
                <MapPin className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold">Venue Selection</h3>
              <p className="text-center text-gray-500">
                Choose from available venues or add your own custom location for your event.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-rose-100 p-3">
                <QrCode className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold">Digital Tickets</h3>
              <p className="text-center text-gray-500">
                Generate unique QR code tickets for seamless check-in and enhanced security.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-rose-100 p-3">
                <Users className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold">Attendee Management</h3>
              <p className="text-center text-gray-500">
                Track registrations, send updates, and manage your attendee list effortlessly.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-rose-100 p-3">
                <svg
                    className="h-6 w-6 text-rose-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    >
                    <path d="M3 3v18h18" />
                    <rect x="7" y="13" width="3" height="5" />
                    <rect x="12" y="9" width="3" height="9" />
                    <rect x="17" y="5" width="3" height="13" />
                </svg>

              </div>
              <h3 className="text-xl font-bold">Analytics & Insights</h3>
              <p className="text-center text-gray-500">
                Track attendee engagement, event popularity, and performance metrics to optimize future events.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-rose  -100 p-3">
                <svg
                  className="h-6 w-6 text-rose-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12h5" />
                  <path d="M9 12h5" />
                  <path d="M16 12h6" />
                  <path d="M3 7h7" />
                  <path d="M13 7h3" />
                  <path d="M19 7h2" />
                  <path d="M3 17h2" />
                  <path d="M8 17h8" />
                  <path d="M19 17h2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Customization</h3>
              <p className="text-center text-gray-500">
                Brand your events with custom themes, logos, and personalized messages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20">
        <div className="container px-4 md:px-6">
          <div className="mb-12 flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Simple steps to create or attend events on our platform.
              </p>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-2xl font-bold">For Event Managers</h3>
              <ol className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold">Create an account</h4>
                    <p className="text-gray-500">Sign up as an event manager to access all creation tools.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold">Set up your event</h4>
                    <p className="text-gray-500">Add details, select a venue, set ticket types and prices.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold">Publish and promote</h4>
                    <p className="text-gray-500">Make your event live and share it with your audience.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold">Manage registrations</h4>
                    <p className="text-gray-500">Track attendees and scan QR codes at the event entrance.</p>
                  </div>
                </li>
              </ol>
            </div>
            <div className="rounded-lg border bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-2xl font-bold">For Attendees</h3>
              <ol className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold">Browse events</h4>
                    <p className="text-gray-500">Find events that interest you through our search or categories.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold">Register for an event</h4>
                    <p className="text-gray-500">Select your ticket type and complete the registration process.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold">Receive your ticket</h4>
                    <p className="text-gray-500">Get your unique QR code ticket via email or in your account.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold">Attend the event</h4>
                    <p className="text-gray-500">Show your QR code at the entrance for quick and easy check-in.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

    {/*  
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="mb-12 flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Hear from event managers and attendees who love using Eventify.
              </p>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Event Manager</p>
                </div>
              </div>
              <p className="mt-4 text-gray-500">
                "Eventify has transformed how I manage my corporate events. The QR code tickets have eliminated check-in
                lines and made the whole process so much smoother."
              </p>
            </div>
            <div className="rounded-lg border p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div>
                  <h4 className="font-bold">Michael Chen</h4>
                  <p className="text-sm text-gray-500">Conference Organizer</p>
                </div>
              </div>
              <p className="mt-4 text-gray-500">
                "The venue selection feature saved me hours of research. I found the perfect space for my tech
                conference and could manage everything in one place."
              </p>
            </div>
            <div className="rounded-lg border p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div>
                  <h4 className="font-bold">Jessica Williams</h4>
                  <p className="text-sm text-gray-500">Regular Attendee</p>
                </div>
              </div>
              <p className="mt-4 text-gray-500">
                "I love having all my event tickets in one place. The QR codes make entry so quick, and I never have to
                worry about losing my ticket anymore."
              </p>
            </div>
          </div>
        </div>
      </section>

    */}
  
    </div>
  );
}