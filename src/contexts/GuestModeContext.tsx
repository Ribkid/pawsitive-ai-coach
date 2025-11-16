import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Dog, TrainingPlan, TrainingSession } from '../lib/supabase';

interface GuestData {
  dogs: Dog[];
  trainingPlans: TrainingPlan[];
  trainingSessions: TrainingSession[];
  lastUpdated: string;
}

interface GuestModeContextType {
  isGuestMode: boolean;
  guestData: GuestData;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
  saveGuestData: (data: Partial<GuestData>) => void;
  clearGuestData: () => void;
  showUpgradePrompt: boolean;
  setShowUpgradePrompt: (show: boolean) => void;
}

const GuestModeContext = createContext<GuestModeContextType | undefined>(undefined);

const GUEST_DATA_KEY = 'pawsitive_guest_data';
const GUEST_MODE_KEY = 'pawsitive_guest_mode';

export function GuestModeProvider({ children }: { children: ReactNode }) {
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [guestData, setGuestData] = useState<GuestData>({
    dogs: [],
    trainingPlans: [],
    trainingSessions: [],
    lastUpdated: new Date().toISOString(),
  });

  // Load guest data on mount
  useEffect(() => {
    const savedMode = localStorage.getItem(GUEST_MODE_KEY);
    const savedData = localStorage.getItem(GUEST_DATA_KEY);

    if (savedMode === 'true') {
      setIsGuestMode(true);
      if (savedData) {
        try {
          setGuestData(JSON.parse(savedData));
        } catch (error) {
          console.error('Error loading guest data:', error);
        }
      }
    }
  }, []);

  const enterGuestMode = () => {
    setIsGuestMode(true);
    localStorage.setItem(GUEST_MODE_KEY, 'true');
    
    // Show welcome message after a delay
    setTimeout(() => {
      setShowUpgradePrompt(true);
    }, 10000);
  };

  const exitGuestMode = () => {
    setIsGuestMode(false);
    localStorage.removeItem(GUEST_MODE_KEY);
    clearGuestData();
  };

  const saveGuestData = (data: Partial<GuestData>) => {
    const updatedData = {
      ...guestData,
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    setGuestData(updatedData);
    localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(updatedData));
  };

  const clearGuestData = () => {
    setGuestData({
      dogs: [],
      trainingPlans: [],
      trainingSessions: [],
      lastUpdated: new Date().toISOString(),
    });
    localStorage.removeItem(GUEST_DATA_KEY);
  };

  const value = {
    isGuestMode,
    guestData,
    enterGuestMode,
    exitGuestMode,
    saveGuestData,
    clearGuestData,
    showUpgradePrompt,
    setShowUpgradePrompt,
  };

  return <GuestModeContext.Provider value={value}>{children}</GuestModeContext.Provider>;
}

export function useGuestMode() {
  const context = useContext(GuestModeContext);
  if (context === undefined) {
    throw new Error('useGuestMode must be used within a GuestModeProvider');
  }
  return context;
}