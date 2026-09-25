import React from "react";

function Navbar({ user, onLogout }) {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(11, 15, 25, 0.8)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)",
              fontSize: "1.2rem",
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.01em" }}>
                TaskFlow
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  background: "rgba(99, 102, 241, 0.2)",
                  color: "#a5b4fc",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  border: "1px solid rgba(99, 102, 241, 0.35)",
                }}
              >
                Practical 7
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
              JWT Auth & Middleware Pipeline
            </div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* JWT Security Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              color: "#34d399",
              padding: "0.35rem 0.75rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
            title="All API requests protected with Bearer JWT"
          >
            <span style={{ fontSize: "0.7rem" }}>🔒</span>
            <span>JWT Active</span>
          </div>

          {/* User Email Badge (from /me) */}
          {user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.85rem",
                background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.825rem",
                color: "var(--text-main)",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10b981",
                  display: "inline-block",
                  boxShadow: "0 0 8px #10b981",
                }}
              />
              <span style={{ fontWeight: 600 }}>{user.email}</span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="btn btn-secondary"
            style={{
              padding: "0.45rem 0.95rem",
              fontSize: "0.85rem",
              borderRadius: "var(--radius-sm)",
            }}
            title="Clear JWT token and log out"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
