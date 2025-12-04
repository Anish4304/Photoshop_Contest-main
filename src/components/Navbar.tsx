import { Link, useNavigate } from 'react-router-dom';
import { Camera, User, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { currentUser, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <Camera className="w-8 h-8 text-amber-400" />
            <span className="text-xl font-bold">PhotoContest</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/gallery" className="hover:text-amber-400 transition">
              Gallery
            </Link>
            <Link to="/voting" className="hover:text-amber-400 transition">
              Vote
            </Link>
            <Link to="/winners" className="hover:text-amber-400 transition">
              Winners
            </Link>
            <Link to="/analytics" className="hover:text-amber-400 transition">
              Analytics
            </Link>

            {currentUser ? (
              <>
                {currentUser.role === 'photographer' && (
                  <Link
                    to="/dashboard"
                    className="hover:text-amber-400 transition"
                  >
                    Dashboard
                  </Link>
                )}
                {currentUser.role === 'judge' && (
                  <Link
                    to="/judges-panel"
                    className="hover:text-amber-400 transition"
                  >
                    Judges Panel
                  </Link>
                )}
                {currentUser.role === 'admin' && (
                  <Link to="/admin" className="hover:text-amber-400 transition">
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span className="text-sm">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:text-red-400 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
