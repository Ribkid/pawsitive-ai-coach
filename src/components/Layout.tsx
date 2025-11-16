import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGuestMode } from '../contexts/GuestModeContext';
import GuestModeIndicator from './GuestModeIndicator';
import {
  LayoutDashboard,
  Dog,
  ClipboardList,
  Activity,
  TrendingUp,
  BookOpen,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { signOut } = useAuth();
  const { isGuestMode, exitGuestMode } = useGuestMode();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Dogs', path: '/dogs', icon: Dog },
    { name: 'Training Plans', path: '/training-plans', icon: ClipboardList },
    { name: 'Training Sessions', path: '/training-sessions', icon: Activity },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Guest Mode Indicator */}
      <GuestModeIndicator />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b border-gray-200">
            <Dog className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PawsitiveAI</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                if (isGuestMode) {
                  exitGuestMode();
                  window.location.href = '/';
                } else {
                  signOut();
                }
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 w-full transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>{isGuestMode ? 'Exit Guest Mode' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}