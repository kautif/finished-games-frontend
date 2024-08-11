import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuthenticated } from "../../redux/gamesSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AuthenticatedNav.css";
import { clearStorage, getItem } from "../../utils/localStorage";

export default function AuthenticatedNav () {
    const dispatch = useDispatch();
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
            console.log("logout: ", response);
            dispatch(setIsAuthenticated(false));
            clearStorage();
        }).catch(err => {
            console.error("error: ", err.message);
        })
    }

    return (
        <ul className="auth-nav"> 
            <Link className="auth-nav__link" to="/games">Games</Link>
            <Link className="auth-nav__link" to="/search">Search</Link>
            <Link className="auth-nav__link" to="">Donate</Link>
            <p className="auth-nav__link" onClick={() => logout()}>Logout</p>
        </ul>
    )
}