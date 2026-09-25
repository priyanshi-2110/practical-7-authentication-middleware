import React, { useState } from "react";
import toast from "react-hot-toast";
import { loginUser, registerUser } from "../api";

function AuthView({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      const err = "Please provide both email and password.";
      setErrorMsg(err);
      toast.error(err);
      return;
    }

    if (!isLogin && password.length < 6) {
      const err = "Password must be at least 6 characters long.";
      setErrorMsg(err);
      toast.error(err);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      const err = "Passwords do not match.";
      setErrorMsg(err);
      toast.error(err);
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        const data = await loginUser(email.trim(), password);
        toast.success("Welcome back! Logged in successfully.");
        if (onAuthSuccess) onAuthSuccess(data.user, data.token);
      } else {
        const data = await registerUser(email.trim(), password);
        toast.success("Account created successfully!");
        if (onAuthSuccess) onAuthSuccess(data.user, data.token);
      }
    } catch (err) {
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("student@college.edu");
    setPassword("password123");
    setConfirmPassword("password123");
    toast("Demo credentials filled!", { icon: "✨" });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "85vh",
        padding: "2rem 1rem",
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "2.5rem 2rem",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Header Icon */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              margin: "0 auto 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              boxShadow: "0 8px 24px rgba(99, 102, 241, 0.35)",
            }}
          >
            🔐
          </div>
          <h2 style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            {isLogin
              ? "Sign in to access your JWT-protected task pipeline"
              : "Register a new user account with hashed credentials"}
          </p>
        </div>

        {/* Tab Toggle */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.25rem",
            background: "var(--bg-primary)",
            padding: "4px",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.5rem",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setErrorMsg("");
            }}
            style={{
              padding: "0.55rem",
              background: isLogin ? "var(--primary)" : "transparent",
              color: isLogin ? "#fff" : "var(--text-muted)",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setErrorMsg("");
            }}
            style={{
              padding: "0.55rem",
              background: !isLogin ? "var(--primary)" : "transparent",
              color: !isLogin ? "#fff" : "var(--text-muted)",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              padding: "0.75rem 1rem",
              marginBottom: "1.25rem",
              borderRadius: "var(--radius-sm)",
              background: "rgba(244, 63, 94, 0.12)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              color: "#fb7185",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.825rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                marginBottom: "0.4rem",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
              required
              autoFocus
            />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.4rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.825rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.825rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  marginBottom: "0.4rem",
                }}
              >
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              marginTop: "0.5rem",
              padding: "0.8rem",
              fontSize: "0.95rem",
            }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isLogin ? (
              <span>Sign In to Dashboard →</span>
            ) : (
              <span>Create Account →</span>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div
          style={{
            marginTop: "1.5rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
            Quick evaluation:
          </span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-secondary"
            style={{
              padding: "0.35rem 0.75rem",
              fontSize: "0.785rem",
              borderRadius: "var(--radius-sm)",
            }}
          >
            Fill Demo Account
          </button>
        </div>
      </div>

      {/* Educational Footer for Practical 7 */}
      <div
        style={{
          marginTop: "1.5rem",
          maxWidth: "440px",
          textAlign: "center",
          color: "var(--text-dim)",
          fontSize: "0.785rem",
          lineHeight: "1.4",
        }}
      >
        <p>
          🛡️ <strong>Practical 7 Architecture</strong>: Passwords are protected using{" "}
          <code style={{ fontSize: "0.75rem" }}>bcryptjs</code> salt hashing. Successful login
          issues a signed <code style={{ fontSize: "0.75rem" }}>JSON Web Token</code> (1h expiry).
        </p>
      </div>
    </div>
  );
}

export default AuthView;
