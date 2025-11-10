import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Book, 
  LogOut, 
  User, 
  Home, 
  BookOpen, 
  Menu, 
  X,
  Settings,
  BarChart3,
  Users,
  Calendar
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home,
      description: 'Overview and statistics'
    },
    { 
      id: 'books', 
      label: 'Books', 
      icon: Book,
      description: 'Manage book collection'
    },
    { 
      id: 'borrows', 
      label: 'Borrows', 
      icon: BookOpen,
      description: 'Track borrowing activities'
    },
  ];

  // Add admin-only items
  if (profile?.role === 'admin') {
    navItems.push(
      { 
        id: 'users', 
        label: 'Users', 
        icon: Users,
        description: 'Manage library members'
      },
      { 
        id: 'reports', 
        label: 'Reports', 
        icon: BarChart3,
        description: 'Analytics and reports'
      }
    );
  }

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'lg:hidden' : 'hidden lg:flex'} flex-col w-64 bg-white border-r border-gray-200 shadow-sm`}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Book className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">LibraryMS</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {profile?.email}
            </p>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            profile?.role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {profile?.role}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-4">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                if (mobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              <div className="flex-1 text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Settings & Logout */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={() => {/* Add settings functionality */}}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-64 h-full bg-white shadow-xl">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Book className="w-6 h-6 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-900">LibraryMS</h1>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}