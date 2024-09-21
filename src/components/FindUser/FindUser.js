import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FindUser.css";

export default function FindUser () {
    const [user, setUser] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);
    

    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";

    function getUsers (user) {
        axios(
            {
                url: `${backendURL}/getusers`,
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                },
                params: {
                    user: user
                }
            }).then(response => {
                console.log("backend response: ", response);
                setFoundUsers(response.data.users);
            }).catch(err => {
                console.error("Find User Error: ", err.message);
            })
    }

    useEffect(() => {
        console.log(foundUsers);
    }, [foundUsers])

    return (
        <div>
            <form>
                <input placeholder="Enter username or term" onChange={(e) => setUser(e.target.value.toLowerCase())}/>
                <input type="submit" value="Submit" onClick={(e) => {
                    e.preventDefault();
                    getUsers(user);
                }}/>
            </form>
            <div className="find-user__results">
                {foundUsers.map(foundUser => {
                    return (
                        <div>
                            <h1>{foundUser.twitch_default}</h1>
                            <img src={foundUser.profileImageUrl} alt={`${foundUser.twitchName}'s profile image`}/>
                            <p className="found-user__btn"><a href={`/${foundUser.twitchName}`}>See Profile</a></p>
                        </div>
                    )
                })}
            </div>
        </div>
    ) 
}