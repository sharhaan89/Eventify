import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import EventsListPage from './pages/EventsListPage'
import EventDetailPage from './pages/EventDetailPage'
import EventCreatePage from './pages/EventCreatePage'
import EventEditPage from './pages/EventEditPage'
import RegisteredEventsPage from './pages/RegisteredEventsPage'
import DashboardPage from './pages/EventsManagerDashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import CheckinPage from './pages/EventCheckinPage'
import ErrorPage from './pages/ErrorPage'

function App() {
  return (
    <>
      <NavBar />
      <div style={{ padding: '1rem', marginTop: '3rem' }}/> 
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/users/login" element={<LoginPage />} />
        <Route path="/users/signup" element={<SignupPage />} />

        <Route path="/events/all" element={<EventsListPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/events/create" element={<EventCreatePage />} />
        <Route path="/events/:id/edit" element={<EventEditPage />} />
        <Route path="/events/registered" element={<RegisteredEventsPage />} />
        <Route path="/events/dashboard" element={<DashboardPage />} />
        <Route path="/events/:eventId/analytics" element={<AnalyticsPage />} />

        <Route path="/checkin/:eventId/:userId" element={<CheckinPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App