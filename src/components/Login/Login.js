import React, { useState } from "react";
import "./Login.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../redux/gamesSlice";
import { setItem, setAuthTokenExpiry } from "../../utils/localStorage";
import logo from "../../assets/VH_Title_v3.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const backendURL =
    process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("Login response data:", data);

      if (res.ok) {
        setItem("authToken", data.token);
        setItem("refreshToken", data.refreshToken);
        setItem("username", username);
        setItem("twitchName", data.twitchName);
        setAuthTokenExpiry();

        dispatch(setIsAuthenticated(true));
        navigate("/games", { replace: true });
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-auth-page login-container">
      <div className="vh-auth-glow vh-auth-glow--left" />
      <div className="vh-auth-glow vh-auth-glow--right" />

      <div className="vh-auth-card" style={{ paddingTop: 36, paddingBottom: 30 }}>
        <div className="vh-auth-logo" style={{ marginBottom: 14 }}>
          <img className="vh-logo" src={logo} alt="Victory History logo" />
        </div>

        <p className="vh-auth-tagline" style={{ marginBottom: 14 }}>
          Become a victory historian today
        </p>

        <div className="vh-auth-divider" />

        <h1
          className="vh-auth-title"
          style={{ marginTop: 18, marginBottom: 8, textTransform: "none" }}
        >
          Login
        </h1>
        <p
          className="vh-auth-subtitle"
          style={{ marginBottom: 22, textTransform: "none" }}
        >
          Welcome back, historian. Log in to continue tracking your victories.
        </p>

        {error && (
          <div className="vh-auth-error" style={{ marginBottom: 18 }}>
            {error}
          </div>
        )}

        <Form
          className="vh-auth-form"
          onSubmit={handleLogin}
          style={{ gap: 18 }}
        >
          <Form.Group className="vh-auth-field" style={{ marginBottom: 10 }}>
            <Form.Label
              className="vh-auth-label"
              style={{ textAlign: "left", display: "block", textTransform: "none" }}
            >
              Username
            </Form.Label>
            <Form.Control
              className="vh-auth-input"
              placeholder="Enter your username"
              required
              value={username}
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="vh-auth-field" style={{ marginBottom: 16 }}>
            <Form.Label
              className="vh-auth-label"
              style={{ textAlign: "left", display: "block", textTransform: "none" }}
            >
              Password
            </Form.Label>
            <Form.Control
              className="vh-auth-input"
              placeholder="Enter your password"
              required
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Button
            className="vh-auth-button"
            type="submit"
            disabled={loading}
            style={{ marginTop: 18, marginBottom: 8 }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>

        <div
          className="vh-auth-footer"
          style={{ marginTop: 22, textTransform: "none" }}
        >
          <span className="vh-auth-footer-text">
            Do not have an account?
          </span>
          <button
            type="button"
            className="vh-auth-link"
            onClick={() => navigate("/register")}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}
