import React, { useState } from "react";
import "./Register.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../redux/gamesSlice";
import { setItem, setAuthTokenExpiry } from "../../utils/localStorage";
import logo from "../../assets/VH_Title_v3.png";

export default function Register() {
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const backendURL =
    process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const register = async (e) => {
    e.preventDefault();
    setError("");

    if (pw !== confirmPw) {
      setError("Passwords do not match");
      return;
    }

    if (pw.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${backendURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password: pw,
          email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setItem("authToken", data.token);
        setItem("refreshToken", data.refreshToken);
        setItem("username", data.username);
        setItem("twitchName", data.username);
        setAuthTokenExpiry();

        dispatch(setIsAuthenticated(true));
        navigate("/games");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ crossed = false }) =>
    crossed ? (
      // eye-off icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5 0-9-4-10-8a10.78 10.78 0 0 1 3.17-5.19" />
        <path d="M6.1 6.1A9.12 9.12 0 0 1 12 4c5 0 9 4 10 8a10.86 10.86 0 0 1-4.17 5.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      // eye icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  return (
    <div className="vh-auth-page">
      <div className="vh-auth-glow vh-auth-glow--left" />
      <div className="vh-auth-glow vh-auth-glow--right" />

      <div className="vh-auth-card">
        <div className="vh-auth-logo">
          <img className="vh-logo" src={logo} alt="Victory History logo" />
        </div>

        <p className="vh-auth-tagline">Become a Victory Historian today</p>

        <div className="vh-auth-divider" />

        <h1 className="vh-auth-title">Create account</h1>
        <p className="vh-auth-subtitle">
          Track your wins, your backlog and every legendary run in one place.
        </p>

        {error && <div className="vh-auth-error">{error}</div>}

        <Form className="vh-auth-form" onSubmit={register}>
          <Form.Group className="vh-auth-field">
            <Form.Label className="vh-auth-label">Email</Form.Label>
            <Form.Control
              className="vh-auth-input"
              placeholder="you@example.com"
              required
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="vh-auth-field">
            <Form.Label className="vh-auth-label">Username</Form.Label>
            <Form.Control
              className="vh-auth-input"
              placeholder="Pick your historian name"
              required
              value={username}
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="vh-auth-field">
            <Form.Label className="vh-auth-label">Password</Form.Label>
            <div className="vh-password-wrapper">
              <Form.Control
                className="vh-auth-input"
                placeholder="Create a password"
                required
                value={pw}
                type={showPw ? "text" : "password"}
                onChange={(e) => setPw(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="vh-password-toggle"
                onClick={() => setShowPw((prev) => !prev)}
                aria-label={showPw ? "Hide password" : "Show password"}
                disabled={loading}
              >
                <EyeIcon crossed={showPw} />
              </button>
            </div>
          </Form.Group>

          <Form.Group className="vh-auth-field">
            <Form.Label className="vh-auth-label">Confirm password</Form.Label>
            <div className="vh-password-wrapper">
              <Form.Control
                className="vh-auth-input"
                placeholder="Repeat your password"
                required
                value={confirmPw}
                type={showConfirmPw ? "text" : "password"}
                onChange={(e) => setConfirmPw(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="vh-password-toggle"
                onClick={() => setShowConfirmPw((prev) => !prev)}
                aria-label={
                  showConfirmPw ? "Hide confirm password" : "Show confirm password"
                }
                disabled={loading}
              >
                <EyeIcon crossed={showConfirmPw} />
              </button>
            </div>
          </Form.Group>

          <Button
            className="vh-auth-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </Form>

        <div className="vh-auth-footer">
          <span className="vh-auth-footer-text">Already a Historian?</span>
          <button
            type="button"
            className="vh-auth-link"
            onClick={() => navigate("/login")}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}
