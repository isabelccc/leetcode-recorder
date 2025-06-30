import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Code, 
  BarChart3, 
  Brain, 
  StickyNote, 
  Target, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';

const Homepage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let success = false;
    if (isLogin) {
      success = await login(formData.email, formData.password);
    } else {
      success = await signup(formData.name, formData.email, formData.password);
    }
    setLoading(false);
    if (success && isLogin) {
      navigate('/dashboard');
    }
    // For signup, user must confirm email, so do not redirect
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Track your LeetCode progress with detailed statistics and completion rates."
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Code Compiler",
      description: "Write, test, and debug your solutions with our integrated compiler."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Assistant",
      description: "Get intelligent code analysis and personalized practice recommendations."
    },
    {
      icon: <StickyNote className="w-6 h-6" />,
      title: "Smart Notes",
      description: "Take detailed notes for each problem to remember key concepts and solutions."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Visualize your progress with comprehensive charts and insights."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Performance Insights",
      description: "Analyze your strengths and weaknesses to improve your coding skills."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur opacity-75"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-2">
                  <Code className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white ml-3">Codexel</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isLogin 
                    ? 'bg-white/20 backdrop-blur-md text-white border border-white/30' 
                    : 'text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-white/20 backdrop-blur-md text-white border border-white/30' 
                    : 'text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-6 mb-10">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-full p-2">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/80 text-sm font-medium">The Ultimate LeetCode Tracker</span>
              </div>
              
              <h2 className="text-5xl font-bold text-white leading-tight">
                Master LeetCode with
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Smart Tracking</span>
              </h2>
              
              <p className="text-xl text-white/80 leading-relaxed">
                The ultimate platform for tracking your LeetCode progress, analyzing your code, 
                and getting personalized recommendations to improve your coding skills.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg p-3">
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 mt-10">
              <div className="flex items-center space-x-2">
                <div className="bg-green-500/20 backdrop-blur-md rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-white/80 text-sm">Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500/20 backdrop-blur-md rounded-full p-1">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-white/80 text-sm">Data privacy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-purple-500/20 backdrop-blur-md rounded-full p-1">
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-white/80 text-sm">Instant setup</span>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="relative flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
            <div
              className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-sm w-full mx-auto shadow-xl transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl"
              style={{ willChange: 'transform' }}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h3>
                <p className="text-white/70">
                  {isLogin 
                    ? 'Sign in to continue your LeetCode journey' 
                    : 'Join thousands of developers improving their skills'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 pl-10 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage; 