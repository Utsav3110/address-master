import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LocationPermissionModal from './components/LocationPermissionModal';
import LocationPicker from './components/LocationPicker';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/registerPage';
import Header from './components/Header';
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from './contexts/userContext';

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* Home Page */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/location-permission"
            element={
              <ProtectedRoute>
                <LocationPermissionModal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/location-picker"
            element={
              <ProtectedRoute>
                <LocationPicker />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <h1 className="text-red-700 text-2xl font-bold">404 - Page Not Found</h1>
  </div>
);

export default App;
