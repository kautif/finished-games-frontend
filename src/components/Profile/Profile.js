import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Search/Search.css"

export default function Profile (match) {
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    console.log("profile");
    // const backendURL = "http://localhost:4000";
    const [user, setUser] = useState({});
    let gamesArr = [];
    let games;
    function getProfile(setObject) {
        axios({
            method: 'get',
            url: `${backendURL}/api/user`,
            params: {
                username: document.baseURI.split("/")[3] 
            }
        }).then(response => {
            console.log("username res: ", response);
            setObject(response.data.user);
            gamesArr = [...response.data.user.games];
        }).catch(err => {
            console.log("error");
        })
    }

    useEffect(() => {
        getProfile(setUser);
    }, [])

    useEffect(() => {
        for (let i = 0; i < document.getElementsByClassName("profile-game__date").length; i++) {
            document.getElementsByClassName("profile-game__date")[i].valueAsDate = new Date(user.games[i].date_added);
        }
    }, [user])

    return (
        <div>
            <img src={user.profileImageUrl} alt={user.twitchName + "'s profile picture"}  />
            <h1>{user.twitchName}</h1>
            <div className="profile-results">
                {user.games !== undefined && 
                    user.games.map((game, i) => {
                        console.log("profile game: ", game);
                        
                        return (
                            <div className="profile-game">
                                <h1>{game.name}</h1>
                                <img src={game.img_url} alt={game.name + " game cover"} />
                                <input className="profile-game__date" type="date" name="date-added" disabled/>
                                <p>{game.summary}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}