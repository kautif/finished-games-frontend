import React from "react";
import Header from "../Header/Header";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
export default function Login () {
    return (
        <div>
            <Header />
            <GoogleLogin
                onSuccess={credentialResponse => {
                    console.log(credentialResponse)
                }}
                onError={() => {
                    console.log("Login failed");
                }}
            />
        </div>
    )
}