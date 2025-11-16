import { UserX, ArrowRight } from 'lucide-react';
import { useGuestMode } from '../contexts/GuestModeContext';
import { useNavigate } from 'react-router-dom';

export default function GuestModeIndicator() {
  const { isGuestMode, showUpgradePrompt, setShowUpgradePrompt } = useGuestMode();
  const navigate = useNavigate();

  if (!isGuestMode) return null;

  return (
    <>
      {/* Top banner indicator */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <UserX className="h-4 w-4 text-amber-600" />
            <span className="text-amber-900 font-medium">Guest Mode</span>
            <span className="text-amber-700">- Your data is not being saved</span>
          </div>
          <button
            onClick={() => {
              navigate('/');
            }}
            className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            Create Account
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Upgrade prompt modal */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserX className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Enjoying PawsitiveAI Coach?
              </h3>
              <p className="text-gray-600 mb-6">
                Create a free account to save your progress, training plans, and access your data from any device!
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowUpgradePrompt(false);
                    navigate('/');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => setShowUpgradePrompt(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200"
                >
                  Continue as Guest
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                No credit card required. Start training smarter today!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}