import React, { useEffect, useState } from "react";
import axios from "axios";
// import Header from "../Header/Header";
import { GoogleLogin } from '@react-oauth/google';
export default function Login () {
      const handleSuccess = async (credentialResponse) => {
        console.log("credentialResponse: ", credentialResponse)
    try {
      const accessToken = credentialResponse.credential.accessToken;
      const config = {
        method: "POST",
        url: `http://localhost:4000/balls`,
        body: JSON.stringify(credentialResponse),
        headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff"
        },
      };
      const response = await axios(config);
      console.log("to backend: ", response.data);
    } catch (error) {
      console.error("client side axios failure: ", error);
      // setError(error);
      // debugger;
    }
  };

    const [credential, setCredential] = useState({});
    return (
        <div>
            {/* <Header /> */}
            <GoogleLogin
                onSuccess={credentialResponse => {
                    setCredential(credentialResponse.credential);
                    handleSuccess(credentialResponse);
                }}
                onError={() => {
                    console.log("Login failed");
                }}
                clientId={process.env.REACT_APP_CLIENT_ID}
            />
        </div>
    )
}