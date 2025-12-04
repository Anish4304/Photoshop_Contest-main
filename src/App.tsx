import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PhotographerDashboard from './pages/PhotographerDashboard';
import Gallery from './pages/Gallery';
import JudgesPanel from './pages/JudgesPanel';
import Voting from './pages/Voting';
import Winners from './pages/Winners';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-slate-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <>
                  <Login />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Register />
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRole="photographer">
                  <Navbar />
                  <PhotographerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <>
                  <Navbar />
                  <Gallery />
                </>
              }
            />
            <Route
              path="/judges-panel"
              element={
                <ProtectedRoute allowedRole="judge">
                  <Navbar />
                  <JudgesPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/voting"
              element={
                <>
                  <Navbar />
                  <Voting />
                </>
              }
            />
            <Route
              path="/winners"
              element={
                <>
                  <Navbar />
                  <Winners />
                </>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <Navbar />
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <>
                  <Navbar />
                  <Analytics />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
