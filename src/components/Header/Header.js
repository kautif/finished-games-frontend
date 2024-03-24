import React from "react";
import logo from "../../assets/VH_Title_v3.png";
import "./Header.css";

export default function Header () {
    return (
        <div>
            <img className="vh-logo" src={logo} alt="Victory History logo" />
        </div>
    )
}