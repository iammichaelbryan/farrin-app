import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plane, User, MapPin, Calendar, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Plane className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">Farrin</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Welcome Message */}
                  {user && (
                    <span className="text-sm text-gray-600 mr-2">
                      Welcome, <span className="font-medium text-gray-900">{user.firstName}</span>
                    </span>
                  )}
                  
                  {/* Dashboard Tab - Left of Feed */}
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/dashboard')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <LayoutDashboard className="inline h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                  <Link
                    to="/feed"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/feed')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Feed
                  </Link>
                  <Link
                    to="/trip-creation"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/trip-creation')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Plan Trip
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/profile')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <User className="inline h-4 w-4 mr-1" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="inline h-4 w-4 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Plane className="h-6 w-6 text-primary-600" />
                <span className="text-lg font-bold text-gray-900">Farrin</span>
              </div>
              <p className="text-gray-600 text-sm">
                Your comprehensive travel companion for planning unforgettable international trips.
                Discover, plan, and experience the world with AI-powered recommendations.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Features
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Trip Planning</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Recommendations</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Travel Requirements</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Weather Forecast</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-gray-400 text-sm text-center">
              © 2024 Farrin Travel Companion. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;