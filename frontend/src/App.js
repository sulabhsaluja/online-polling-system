import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreatePoll from './pages/CreatePoll';
import PollVoting from './pages/PollVoting';
import Home from './pages/Home';
import './App.css';

// Protected Route Components
const ProtectedRoute = ({ children, requireAuth = true, adminOnly = false, userOnly = false }) => {
  const { isAuthenticated, isAdmin, isUser } = useAuth();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (userOnly && !isUser) {
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, isAdmin, isUser } = useAuth();

  return (
    <div className="App">
      <Navigation />
      <Routes>
        {/* Home Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} replace />
            ) : (
              <Home />
            )
          } 
        />

        {/* User Routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route 
          path="/user/dashboard" 
          element={
            <ProtectedRoute userOnly>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/poll/:pollId" 
          element={
            <ProtectedRoute userOnly>
              <PollVoting />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/create-poll" 
          element={
            <ProtectedRoute adminOnly>
              <CreatePoll />
            </ProtectedRoute>
          } 
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
