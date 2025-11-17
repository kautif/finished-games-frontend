import React, { useState } from "react";
import "./Login.css";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../redux/gamesSlice";
import { setItem, setAuthTokenExpiry } from "../../utils/localStorage";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
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
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Store tokens in localStorage
                setItem("authToken", data.token);
                setItem("refreshToken", data.refreshToken);
                setItem("username", username);
                setItem("twitchName", "");
                setAuthTokenExpiry();

                // Set authentication state
                dispatch(setIsAuthenticated(true));

                // Navigate to games page
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
        <div className="login-container">
            <h1 className="vh__login__head">Login</h1>
            <Form className="w-75 d-flex flex-wrap mx-auto justify-content-center" onSubmit={handleLogin}>
                {error && <div className="alert alert-danger w-50">{error}</div>}
                
                <Form.Control
                    className="w-50 mb-3"
                    placeholder="Username"
                    required
                    value={username}
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                />

                <Form.Control
                    className="w-50 mb-3"
                    placeholder="Password"
                    required
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />

                <Button 
                    className="mt-3" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="mt-3 w-100 text-center">
                    <p>
                        Don't have an account?{" "}
                        <a href="/register" className="text-primary">Register here</a>
                    </p>
                </div>
            </Form>
        </div>
    );
}