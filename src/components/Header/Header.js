import React from "react";
import logo from "../../assets/VH_Title_v3.png";
import "./Header.css";
import TwitchLoginBtn from "../TwitchLoginBtn/TwitchLoginBtn";

export default function Header () {
    return (
        <div className="header-container">
            <img className="vh-logo" src={logo} alt="Victory History logo" />
            <p className="header__cta">Become a Victory Historian today!</p>
            <TwitchLoginBtn />
        </div>
    )
}