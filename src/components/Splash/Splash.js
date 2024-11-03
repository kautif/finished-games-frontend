import React from "react";
import Header from "../Header/Header";
import Login from "../Login/Login";
import TwitchLoginBtn from "../TwitchLoginBtn/TwitchLoginBtn";

export default function Splash () {
    return (
        <div>
            <Header />
            <div>
                <TwitchLoginBtn />
            </div>
        </div>
    )
}