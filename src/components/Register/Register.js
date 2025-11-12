import React, { useState } from "react";
import './Register.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../redux/gamesSlice";
import { setItem, setAuthTokenExpiry } from "../../utils/localStorage";

export default function Register () {
    const [username, setUsername] = useState("");
    const [pw, setPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const register = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
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
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username_default: username,
                    password: pw,
                    email
                })
            }); 
        
            const data = await res.json();

            if (res.ok) {
                // Store tokens in localStorage
                setItem("authToken", data.token);
                setItem("refreshToken", data.refreshToken);
                setItem("username", data.username);
                setAuthTokenExpiry();

                // Set authentication state
                dispatch(setIsAuthenticated(true));

                // Navigate to games page
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
    }

    return (
        <div>
            <h1 className="vh__register__head">Register</h1>
            <Form className="w-75 d-flex flex-wrap mx-auto justify-content-center" onSubmit={register}>
                {error && <div className="alert alert-danger w-50">{error}</div>}
                
                <Form.Control 
                    className="w-50 mb-3"
                    placeholder="Email"
                    required
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />

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
                    value={pw}
                    type="password"
                    onChange={(e) => setPw(e.target.value)}
                    disabled={loading}
                />

                <Form.Control
                    className="w-50 mb-3"
                    placeholder="Confirm Password"
                    required
                    value={confirmPw}
                    type="password"
                    onChange={(e) => setConfirmPw(e.target.value)}
                    disabled={loading}
                />
                
                <Button 
                    className="mt-3" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Creating Account..." : "Submit"}
                </Button>

                <div className="mt-3 w-100 text-center">
                    <p>
                        Already have an account?{" "}
                        <a href="/login" className="text-primary">Login here</a>
                    </p>
                </div>
            </Form>
        </div>
    )
}