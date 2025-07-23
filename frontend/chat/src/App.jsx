import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Loginpage from './pages/Loginpage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import NotificationPage from './pages/NotificationPage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader';
import Layout from './components/Layout';
import useAuthUser from './hooks/useAuthUser';
import { ThemeStore } from './store/ThemeStore';

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = ThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = Boolean(authUser?.isOnboarded);

  // ✅ Apply theme to the HTML root tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Loginpage />
            ) : (
              <Navigate to={isOnboarded ? '/' : '/onboarding'} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignupPage />
            ) : (
              <Navigate to={isOnboarded ? '/' : '/onboarding'} />
            )
          }
        />
        <Route
          path="/notification"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Wildcard fallback route */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/' : '/login'} />}
        />
      </Routes>
    </div>
  );
};

export default App; 
