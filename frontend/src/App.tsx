import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AuthenticationView from './views/AuthenticationView'
import DashboardView from './views/DashboardView'
import FeedView from './views/FeedView'
import TripCreationView from './views/TripCreationView'
import ItineraryView from './views/ItineraryView'
import CleanDemo from './views/CleanDemo'
import ProfileView from './views/ProfileView'
import { UserProvider } from './contexts/UserContext'

function App() {
  console.log('App component loaded');
  
  return (
    <Routes>
      {/* Test route */}
      <Route path="/test" element={<div style={{padding: '50px', fontSize: '24px', color: 'blue'}}>TEST ROUTE WORKS!</div>} />
      
      {/* Standalone demo route - no auth required */}
      <Route path="/demo-itinerary" element={<CleanDemo />} />
      
      {/* Specific main app routes wrapped in UserProvider */}
      <Route path="/" element={
        <UserProvider>
          <Navigate to="/auth" replace />
        </UserProvider>
      } />
      <Route path="/auth" element={
        <UserProvider>
          <AuthenticationView />
        </UserProvider>
      } />
      <Route path="/login" element={
        <UserProvider>
          <AuthenticationView />
        </UserProvider>
      } />
      <Route path="/register" element={
        <UserProvider>
          <AuthenticationView />
        </UserProvider>
      } />
      <Route path="/dashboard" element={
        <UserProvider>
          <Layout><DashboardView /></Layout>
        </UserProvider>
      } />
      <Route path="/feed" element={
        <UserProvider>
          <Layout><FeedView /></Layout>
        </UserProvider>
      } />
      <Route path="/trip-creation" element={
        <UserProvider>
          <Layout><TripCreationView /></Layout>
        </UserProvider>
      } />
      <Route path="/trip-planning" element={
        <UserProvider>
          <Navigate to="/trip-creation" replace />
        </UserProvider>
      } />
      <Route path="/itinerary/:tripId" element={
        <UserProvider>
          <Layout><ItineraryView /></Layout>
        </UserProvider>
      } />
      <Route path="/profile" element={
        <UserProvider>
          <Layout><ProfileView /></Layout>
        </UserProvider>
      } />
    </Routes>
  )
}

export default App