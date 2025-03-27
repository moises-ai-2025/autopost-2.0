import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Image, 
  Calendar, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X,
  User,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/content', label: 'Content', icon: <Image className="w-5 h-5" /> },
    { path: '/schedule', label: 'Schedule', icon: <Calendar className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
              
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="flex items-center">
                  <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-md flex items-center justify-center">
                    <Image className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">SocialAI</span>
                </Link>
              </div>
            </div>

            {/* Search bar - desktop only */}
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center">
              {/* Notifications */}
              <div className="flex items-center">
                <button
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                  onClick={toggleNotifications}
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
                
                {/* Notifications dropdown */}
                {isNotificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 top-16">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <Image className="h-5 w-5 text-indigo-600" />
                            </div>
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">New content ready</p>
                            <p className="mt-1 text-sm text-gray-500">Your weekly content has been generated and is ready for review.</p>
                            <p className="mt-1 text-xs text-gray-400">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">Post scheduled</p>
                            <p className="mt-1 text-sm text-gray-500">Your post has been scheduled for tomorrow at 9:00 AM.</p>
                            <p className="mt-1 text-xs text-gray-400">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-2">
                      <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all notifications</a>
                    </div>
                  </div>
                )}
              </div>

              <div className="ml-3 relative flex items-center">
                <div 
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={toggleProfileMenu}
                >
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-700">{currentUser?.name || 'User'}</div>
                    <div className="text-xs text-gray-500 truncate">{currentUser?.email || 'user@example.com'}</div>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                    <User className="h-5 w-5" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                </div>
                
                {/* Profile dropdown */}
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 top-16">
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 inset-x-0 z-20 border-b border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile search */}
          <div className="pt-2 pb-3 px-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="mobile-search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar Navigation (desktop) */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 border-l-4 border-indigo-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200`}
                  >
                    <span className={`mr-3 ${location.pathname === item.path ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              {/* Pro upgrade banner */}
              <div className="mt-auto px-4 py-4">
                <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 p-4 shadow-md">
                  <h3 className="text-sm font-medium text-white">Upgrade to Pro</h3>
                  <p className="mt-1 text-xs text-indigo-100">Get unlimited posts and advanced analytics</p>
                  <button className="mt-3 w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-xs font-medium py-1.5 px-2 rounded transition-colors duration-200">
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
