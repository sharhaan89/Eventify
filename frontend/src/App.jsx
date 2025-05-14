import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import EventsListPage from './pages/EventsListPage'
import EventDetailPage from './pages/EventDetailPage'
import EventCreatePage from './pages/EventCreatePage'
import UserEventsPage from './pages/UserEventsPage'
import DashboardPage from './pages/DashboardPage'
import ErrorPage from './pages/ErrorPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/users/login" element={<LoginPage />} />
        <Route path="/users/signup" element={<SignupPage />} />

        <Route path="/events/all" element={<EventsListPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/events/create" element={<EventCreatePage />} />
        <Route path="/events/registered" element={<UserEventsPage />} />
        <Route path="/events/dashboard" element={<DashboardPage />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  )
}

export default App