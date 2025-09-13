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
import AdminPolls from './pages/AdminPolls';
import UserPolls from './pages/UserPolls';
import AdminProfile from './pages/AdminProfile';
import UserProfile from './pages/UserProfile';
import PollResults from './pages/PollResults';
import EditPoll from './pages/EditPoll';
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
  const { isAuthenticated, isAdmin } = useAuth();

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
        <Route 
          path="/user/polls" 
          element={
            <ProtectedRoute userOnly>
              <UserPolls />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/profile/:userId" 
          element={
            <ProtectedRoute userOnly>
              <UserProfile />
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
        <Route 
          path="/admin/polls" 
          element={
            <ProtectedRoute adminOnly>
              <AdminPolls />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/profile/:adminId" 
          element={
            <ProtectedRoute adminOnly>
              <AdminProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/poll/:pollId/results" 
          element={
            <ProtectedRoute adminOnly>
              <PollResults />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/poll/:pollId/edit" 
          element={
            <ProtectedRoute adminOnly>
              <EditPoll />
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
