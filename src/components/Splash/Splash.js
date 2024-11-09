import React from "react";
import Header from "../Header/Header";
import Login from "../Login/Login";
import TwitchLoginBtn from "../TwitchLoginBtn/TwitchLoginBtn";
import "./Splash.css";

export default function Splash () {
    return (
        <div className="splash-container">
            <Header />
            <div>
                {/* <TwitchLoginBtn /> */}
            </div>
        </div>
    )
}