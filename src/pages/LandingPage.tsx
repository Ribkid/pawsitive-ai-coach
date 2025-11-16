import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGuestMode } from '../contexts/GuestModeContext';
import { useNavigate } from 'react-router-dom';
import { Dog, Heart, Brain, TrendingUp, BookOpen, Award, UserX, MessageCircle, Info, Star } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, PulseButton } from '../components/AnimatedComponents';
import ParticleBackground from '../components/ParticleBackground';

export default function LandingPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { signIn, signUp, user, isAuthenticated } = useAuth();
  const { enterGuestMode } = useGuestMode();

  // Navigate to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (authError) {
        setError(authError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    enterGuestMode();
    navigate('/chat');
  };

  const handleChatClick = () => {
    setActiveTab('chat');
    enterGuestMode();
    navigate('/chat');
  };

  const handleScrollToFeatures = () => {
    setActiveTab('features');
    document.querySelector('#features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToHowItWorks = () => {
    setActiveTab('how-it-works');
    document.querySelector('#how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-amber-50 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dog className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">PawsitiveAI Coach</span>
            </div>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('chat');
                enterGuestMode();
                navigate('/chat');
              }}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              Chat with AI Trainer
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Try Now
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'how-it-works'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Info className="h-5 w-5" />
              How It Works
            </button>
            
            <button
              onClick={() => setActiveTab('features')}
              className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'features'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Star className="h-5 w-5" />
              Features
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <FadeIn direction="left">
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Science-Based Dog Training,{' '}
                  <span className="text-blue-600">Powered by AI</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                  Transform your relationship with your dog through personalized, positive reinforcement training.
                  Our AI coach creates custom training plans tailored to your dog's unique personality, breed, and needs.
                </p>
                <StaggerContainer className="flex flex-wrap gap-4">
                  <StaggerItem>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Heart className="h-5 w-5 text-rose-500" />
                      <span>100% Positive Reinforcement</span>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <span>AI-Powered Personalization</span>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex items-center gap-2 text-gray-700">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span>Track Real Progress</span>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </FadeIn>

            {/* Right: Auth Form */}
            <FadeIn direction="right" delay={0.2}>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Start Your Journey' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600 mb-6">
                {isSignUp
                  ? 'Create an account to get your personalized training plan'
                  : 'Sign in to continue training'}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              {/* Guest Mode Button */}
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <PulseButton
                  onClick={handleGuestMode}
                  className="mt-4 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <UserX className="h-5 w-5" />
                  Try Without Sign Up
                </PulseButton>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Full access • No registration required • Start immediately
                </p>
              </div>

              <p className="mt-4 text-center text-sm text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </FadeIn>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works-section" className="bg-gradient-to-r from-blue-50 to-green-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                How It Works
              </h2>
            </FadeIn>
            <div className="grid md:grid-cols-3 gap-8">
              <StaggerItem>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Chat with AI</h3>
                  <p className="text-gray-600">
                    Tell our AI trainer about your dog - their breed, age, temperament, and training goals. No signup required to start!
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">2. AI Creates Plan</h3>
                  <p className="text-gray-600">
                    Our AI analyzes your dog's unique characteristics and creates a personalized training plan with specific exercises and tips.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Train & Track</h3>
                  <p className="text-gray-600">
                    Follow the step-by-step training exercises, track your progress, and celebrate milestones with your furry friend.
                  </p>
                </div>
              </StaggerItem>
            </div>
            
            <div className="text-center mt-12">
              <PulseButton
                onClick={handleChatClick}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg mx-auto"
              >
                <MessageCircle className="h-6 w-6" />
                Start Your AI Training Session
              </PulseButton>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features-section" className="bg-white/80 backdrop-blur-sm py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                Everything You Need for Training Success
              </h2>
            </FadeIn>
            <StaggerContainer className="grid md:grid-cols-3 gap-8">
              <StaggerItem>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Personalized Plans</h3>
                <p className="text-gray-600">
                  Our AI analyzes your dog's breed, age, temperament, and your goals to create a perfectly tailored
                  training journey.
                </p>
              </div>
              </StaggerItem>

              <StaggerItem>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-gray-600">
                  Visualize your dog's improvement with detailed analytics, success rates, and milestone celebrations.
                </p>
              </div>
              </StaggerItem>

              <StaggerItem>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Knowledge Base</h3>
                <p className="text-gray-600">
                  Access comprehensive guides on positive reinforcement methods, behavior modification, and breed-specific
                  tips.
                </p>
              </div>
              </StaggerItem>

              <StaggerItem>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Positive Reinforcement Only</h3>
                <p className="text-gray-600">
                  Science-backed, ethical training methods that build trust and strengthen your bond with your dog.
                </p>
              </div>
              </StaggerItem>

              <StaggerItem>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Milestone Celebrations</h3>
                <p className="text-gray-600">
                  Celebrate achievements and track badges as you and your dog master new skills together.
                </p>
              </div>
              </StaggerItem>

              <StaggerItem>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dog className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Breed-Specific Guidance</h3>
                <p className="text-gray-600">
                  Tailored advice for your dog's breed characteristics, typical challenges, and training considerations.
                </p>
              </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Dog Training?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of dog owners building stronger, happier relationships through positive training.
            </p>
            <button
              onClick={handleChatClick}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition duration-200 shadow-lg flex items-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Start Chatting Now
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            PawsitiveAI Coach - Ethical, Science-Based Dog Training | Built with love for dogs and their humans
          </p>
        </div>
      </footer>
    </div>
  );
}