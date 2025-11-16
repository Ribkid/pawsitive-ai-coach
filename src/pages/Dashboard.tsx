import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useGuestMode } from '../contexts/GuestModeContext';
import { supabase, Dog as DogType, TrainingSession } from '../lib/supabase';
import { Dog, TrendingUp, Calendar, Award, Plus, ArrowRight, BookOpen } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { isGuestMode, guestData } = useGuestMode();
  const [dogs, setDogs] = useState<DogType[]>([]);
  const [recentSessions, setRecentSessions] = useState<TrainingSession[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgSuccessRate: 0,
    activeTrainingPlans: 0,
    weeklyStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user, isGuestMode, guestData]);

  const loadDashboardData = async () => {
    try {
      if (isGuestMode) {
        // Load guest data from localStorage
        setDogs(guestData.dogs);
        setRecentSessions(guestData.trainingSessions.slice(0, 5));
        
        // Calculate guest stats
        const avgSuccess =
          guestData.trainingSessions.length > 0
            ? guestData.trainingSessions.reduce((sum, s) => sum + (s.success_rate || 0), 0) / guestData.trainingSessions.length
            : 0;

        setStats({
          totalSessions: guestData.trainingSessions.length,
          avgSuccessRate: Math.round(avgSuccess),
          activeTrainingPlans: guestData.trainingPlans.filter(p => p.status === 'active').length,
          weeklyStreak: calculateStreak(guestData.trainingSessions),
        });
      } else if (user) {
        // Load data for authenticated users
        const { data: dogsData } = await supabase
          .from('dogs')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (dogsData) {
          setDogs(dogsData);
        }

        const { data: sessionsData } = await supabase
          .from('training_sessions')
          .select('*')
          .eq('user_id', user?.id)
          .order('session_date', { ascending: false })
          .limit(5);

        if (sessionsData) {
          setRecentSessions(sessionsData);
        }

        const { data: allSessions } = await supabase
          .from('training_sessions')
          .select('*')
          .eq('user_id', user?.id);

        const { data: activePlans } = await supabase
          .from('training_plans')
          .select('*')
          .eq('user_id', user?.id)
          .eq('status', 'active');

        if (allSessions) {
          const avgSuccess =
            allSessions.length > 0
              ? allSessions.reduce((sum, s) => sum + (s.success_rate || 0), 0) / allSessions.length
              : 0;

          setStats({
            totalSessions: allSessions.length,
            avgSuccessRate: Math.round(avgSuccess),
            activeTrainingPlans: activePlans?.length || 0,
            weeklyStreak: calculateStreak(allSessions),
          });
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (sessions: TrainingSession[]) => {
    if (sessions.length === 0) return 0;

    const sorted = [...sessions].sort(
      (a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sorted) {
      const sessionDate = new Date(session.session_date);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 1) {
        if (daysDiff === 1 || (daysDiff === 0 && streak === 0)) {
          streak++;
          currentDate = sessionDate;
        }
      } else {
        break;
      }
    }

    return streak;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-1">Here's your training overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalSessions}</p>
              </div>
              <Calendar className="h-10 w-10 text-blue-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Success Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.avgSuccessRate}%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Plans</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeTrainingPlans}</p>
              </div>
              <Dog className="h-10 w-10 text-purple-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Training Streak</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.weeklyStreak} days</p>
              </div>
              <Award className="h-10 w-10 text-amber-600 opacity-80" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Dogs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">My Dogs</h2>
                <Link
                  to="/dogs"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              {dogs.length === 0 ? (
                <div className="text-center py-8">
                  <Dog className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No dogs added yet</p>
                  <Link
                    to="/dogs"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Dog
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {dogs.slice(0, 3).map((dog) => (
                    <div key={dog.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Dog className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{dog.name}</h3>
                        <p className="text-sm text-gray-600">
                          {dog.breed || 'Mixed Breed'} • {dog.age_years || 0}y {dog.age_months || 0}m
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Sessions</h2>
                <Link
                  to="/training-sessions"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No training sessions yet</p>
                  <Link
                    to="/training-sessions"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Log Your First Session
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(session.session_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">{session.duration_minutes || 0} minutes</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{session.success_rate || 0}%</p>
                        <p className="text-sm text-gray-600">Success</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link
            to="/dogs"
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Dog className="h-8 w-8 text-white mb-3" />
            <h3 className="text-white font-semibold text-lg mb-1">Manage Dogs</h3>
            <p className="text-blue-100 text-sm">Add or update your dog profiles</p>
          </Link>

          <Link
            to="/training-plans"
            className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <TrendingUp className="h-8 w-8 text-white mb-3" />
            <h3 className="text-white font-semibold text-lg mb-1">Training Plans</h3>
            <p className="text-green-100 text-sm">Get AI-generated training plans</p>
          </Link>

          <Link
            to="/knowledge"
            className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <BookOpen className="h-8 w-8 text-white mb-3" />
            <h3 className="text-white font-semibold text-lg mb-1">Knowledge Base</h3>
            <p className="text-purple-100 text-sm">Learn positive training methods</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}