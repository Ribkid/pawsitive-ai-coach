import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GuestModeProvider, useGuestMode } from './contexts/GuestModeContext';
import { ChatProvider } from './contexts/ChatContext';
import ChatButton from './components/ChatButton';
import ChatInterface from './components/ChatInterface';
import LandingPage from './pages/LandingPage';
import ChatHomePage from './pages/ChatHomePage';
import Dashboard from './pages/Dashboard';
import Dogs from './pages/Dogs';
import TrainingPlans from './pages/TrainingPlans';
import TrainingSessions from './pages/TrainingSessions';
import Progress from './pages/Progress';
import KnowledgeBase from './pages/KnowledgeBase';
import Settings from './pages/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isGuestMode } = useGuestMode();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading PawsitiveAI Coach...</p>
        </div>
      </div>
    );
  }

  // Allow access for both authenticated users and guest mode
  if (!user && !isGuestMode) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  const { isGuestMode } = useGuestMode();
  const location = useLocation();
  
  // Hide floating chat button on landing page and chat page
  const showFloatingChat = location.pathname !== '/' && location.pathname !== '/chat';

  return (
    <>
      <Routes>
        {/* Landing Page with Auth */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Chat Interface */}
        <Route path="/chat" element={<ChatHomePage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dogs"
          element={
            <ProtectedRoute>
              <Dogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training-plans"
          element={
            <ProtectedRoute>
              <TrainingPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training-sessions"
          element={
            <ProtectedRoute>
              <TrainingSessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge"
          element={
            <ProtectedRoute>
              <KnowledgeBase />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
      
      {/* Floating chat interface - available on dashboard pages only */}
      {showFloatingChat && (
        <>
          <ChatButton />
          <ChatInterface />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GuestModeProvider>
          <ChatProvider>
            <AppRoutes />
          </ChatProvider>
        </GuestModeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;