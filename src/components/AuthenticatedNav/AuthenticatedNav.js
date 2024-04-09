import React from "react";
import { Link } from "react-router-dom";
import "./AuthenticatedNav.css";
import Search from "../Search/Search";

export default function AuthenticatedNav () {
    return (
        <ul className="auth-nav"> 
            <Link className="auth-nav__link" to="">Completed</Link>
            <Link className="auth-nav__link" to="">Upcoming</Link>
            <Link className="auth-nav__link" to="">Dropped</Link>
            <Link className="auth-nav__link" to="/games">All</Link>
            <Link className="auth-nav__link" to="/search">Search</Link>
            <Link className="auth-nav__link" to="">Donate</Link>
        </ul>
    )
}