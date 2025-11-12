import React from "react";
import logo from "../../assets/VH_Title_v3.png";
import "./Header.css";
import TwitchLoginBtn from "../TwitchLoginBtn/TwitchLoginBtn";
import { Link, useNavigate } from "react-router-dom";

export default function Header () {
    const navigate = useNavigate();

    return (
        <div className="header-container">
            <div className="header-flex">
                <img className="vh-logo" src={logo} alt="Victory History logo" />
                <p className="header__cta">Become a Victory Historian today!</p>
                <div className="vh__login-flex">
                    <div><TwitchLoginBtn /></div>
                    <div>
                        <div className="vh__login-btn vh__login-general vh__signup" onClick={() => {
                            navigate('/register');
                        }}>Register</div>
                        <div className="vh__login-btn vh__login-general" onClick={() => {
                            navigate('/login');}}>Login</div>
                    </div>
                </div>
            </div>
        </div>
    );
}