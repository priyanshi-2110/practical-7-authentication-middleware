import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "./components/Navbar";
import AuthView from "./components/AuthView";
import Projects from "./pages/Projects";
import {
  getToken,
  getStoredUser,
  getMe,
  logoutUser,
  authEvents,
} from "./api";

function App() {
  const [token, setTokenState] = useState(getToken());
  const [user, setUserState] = useState(getStoredUser());
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check stored auth token on mount
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = getToken();
      if (!savedToken) {
        setCheckingAuth(false);
        return;
      }

      try {
        const currentUser = await getMe();
        setUserState(currentUser);
        setTokenState(savedToken);
      } catch (err) {
        console.warn("Session validation failed:", err.message);
        logoutUser();
        setTokenState(null);
        setUserState(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifySession();
  }, []);

  // Subscribe to global auth events (401 token expiry and logout)
  useEffect(() => {
    const handleUnauthorized = () => {
      setTokenState(null);
      setUserState(null);
      toast.error("Session expired or unauthorized. Please log in again.", {
        id: "session-expired",
      });
    };

    const handleLogout = () => {
      setTokenState(null);
      setUserState(null);
      toast("Logged out successfully.", { icon: "👋", id: "logout-toast" });
    };

    authEvents.addEventListener("unauthorized", handleUnauthorized);
    authEvents.addEventListener("logout", handleLogout);

    return () => {
      authEvents.removeEventListener("unauthorized", handleUnauthorized);
      authEvents.removeEventListener("logout", handleLogout);
    };
  }, []);

  // Handle successful login / register
  const handleAuthSuccess = (authenticatedUser, authToken) => {
    setUserState(authenticatedUser);
    setTokenState(authToken);
  };

  // Handle explicit logout
  const handleLogoutClick = () => {
    logoutUser();
  };

  if (checkingAuth) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "1rem",
        }}
      >
        <div style={{ fontSize: "2rem" }}>⚡</div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Verifying security token...
        </p>
      </div>
    );
  }

  const isAuthenticated = Boolean(token && user);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "0.885rem",
          },
        }}
      />

      {isAuthenticated ? (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar user={user} onLogout={handleLogoutClick} />
          <Projects user={user} />
        </div>
      ) : (
        <AuthView onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}

export default App;