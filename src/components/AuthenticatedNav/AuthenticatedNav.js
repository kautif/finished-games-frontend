import React from "react";
import { useDispatch } from 'react-redux';
import { setIsAuthenticated } from "../../redux/gamesSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AuthenticatedNav.css";
import { clearStorage, getItem } from "../../utils/localStorage";
import { useNavigate } from 'react-router-dom';

export default function AuthenticatedNav () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
     function logout () {
        axios({
            url: `${backendURL}/logout`,
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'auth_token': getItem("authToken"),
                'twitch_token': getItem("twitchToken"),
            },
        }).then(response => {
            dispatch(setIsAuthenticated(false));
            clearStorage();
            navigate('/');
        }).catch(err => {
            console.error("error: ", err.message);
        })
    }

    return (
        <ul className="auth-nav"> 
            <Link className="auth-nav__link" to="/games">Games</Link>
            <Link className="auth-nav__link" to="/search">Add Game</Link>
            <Link className="auth-nav__link" to="/finduser">Find User</Link>
            <Link className="auth-nav__link" to="/donate">Donate</Link>
            <Link className="auth-nav__link" to="/feedback">Feedback</Link>
            <p className="auth-nav__link" onClick={() => logout()}>Logout</p>
        </ul>
    )
}