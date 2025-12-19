
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import GetQuotePage from './pages/GetQuotePage';
import FileClaimPage from './pages/FileClaimPage';
import PolicyDetailPage from './pages/PolicyDetailPage';
import ClaimDetailPage from './pages/ClaimDetailPage';
import AdminPolicyDetailPage from './pages/AdminPolicyDetailPage';
import AdminClaimDetailPage from './pages/AdminClaimDetailPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Spinner from './components/common/Spinner';
import Toast from './components/common/Toast';
import Chatbot from './components/common/Chatbot';
import { ToastProvider } from './context/ToastContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }
  return user ? <>{children}</> : <Navigate to="/login" />;
};

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }
  return user && user.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
    const { loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    return (
        <div className="min-h-screen bg-secondary flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/get-quote" element={<ProtectedRoute><GetQuotePage /></ProtectedRoute>} />
                    <Route path="/file-claim" element={<ProtectedRoute><FileClaimPage /></ProtectedRoute>} />
                    <Route path="/policy/:id" element={<ProtectedRoute><PolicyDetailPage /></ProtectedRoute>} />
                    <Route path="/claim/:id" element={<ProtectedRoute><ClaimDetailPage /></ProtectedRoute>} />

                    <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                    <Route path="/admin/policy/:id" element={<AdminRoute><AdminPolicyDetailPage /></AdminRoute>} />
                    <Route path="/admin/claim/:id" element={<AdminRoute><AdminClaimDetailPage /></AdminRoute>} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <Footer />
            <Chatbot />
        </div>
    );
}

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
          <Toast />
    </AuthProvider>
    </ToastProvider>
  );
};

export default App;
