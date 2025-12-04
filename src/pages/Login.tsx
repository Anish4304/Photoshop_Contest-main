import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Mail, Lock, UserCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { photographerLogin, judgeLogin } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'photographer' | 'judge'>('photographer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (role === 'photographer') {
        response = await photographerLogin({ email, password });
        const user = { ...response.data, role: 'photographer' };
        setCurrentUser(user);
        navigate('/dashboard');
      } else {
        response = await judgeLogin({ email, password });
        const user = { ...response.data, role: 'judge' };
        setCurrentUser(user);
        navigate('/judges-panel');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Camera className="w-16 h-16 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Login to your account</p>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                I am a
              </label>
              <div className="relative">
                <UserCircle2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'photographer' | 'judge')}
                  className="w-full pl-12 pr-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-amber-400 transition appearance-none cursor-pointer"
                >
                  <option value="photographer">Photographer</option>
                  <option value="judge">Judge</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-amber-400 transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-amber-400 transition"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Photographer without an account?{' '}
              <Link to="/register" className="text-amber-400 hover:text-amber-300 font-semibold">
                Register as Photographer
              </Link>
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Note: Judges can only login with provided credentials
            </p>
          </div>

          <div className="mt-6 p-4 bg-slate-700 rounded-lg">
            <p className="text-xs text-slate-300 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-slate-400">
              <p><span className="text-amber-400">Photographer:</span> sarah@example.com</p>
              <p><span className="text-blue-400">Judge:</span> judge@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
