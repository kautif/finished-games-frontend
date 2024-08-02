import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuthenticated } from "../../redux/gamesSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AuthenticatedNav.css";

export default function AuthenticatedNav () {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.gamesReducer.isAuthenticated);
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    function logout () {
        dispatch(setIsAuthenticated(false));
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set("verified", false);
        localStorage.setItem("auth_token", false);
        console.log("verified?: ", searchParams.get("verified"));
        axios({
            url: `${backendURL}/logout`,
            method: "POST",
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            console.log("logout isAuthenticated:", isAuthenticated);
            console.log("logout: ", response);
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