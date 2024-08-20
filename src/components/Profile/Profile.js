import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

export default function Profile (match) {
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    console.log("profile");
    // const backendURL = "http://localhost:4000";
    const [user, setUser] = useState({});
    const [userGames, setUserGames] = useState([]);
    let gamesArr = [];
    let games;
    let gamesList;
    const [completedGames, setCompletedGames] = useState([]);
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [droppedGames, setdroppedGames] = useState([]);
    const [playingGames, setPlayingGames] = useState([]);

    const [gameState, setGameState] = useState("all");
    const [sortedArr, setSortedArr] = useState([]);
    function getProfile(setObject) {
        axios({
            method: 'get',
            url: `${backendURL}/api/user`,
            params: {
                username: document.baseURI.split("/")[3] 
            }
        }).then(response => {
            setObject(response.data.user);
            gamesArr = [...response.data.user.games];
            setUserGames(gamesArr);
            let droppedArr = [];
            let playingArr = [];
            let upcomingArr = [];
            let completedArr = [];
            if (user !== null) {
                for (let i = 0; i < response.data.user.games.length; i++) {
                    if (response.data.user.games[i].rank === "dropped") {
                        droppedArr.push(response.data.user.games[i]);
                    }
    
                    if (response.data.user.games[i].rank === "playing") {
                        playingArr.push(response.data.user.games[i]);
                    }
    
                    if (response.data.user.games[i].rank === "upcoming") {
                        upcomingArr.push(response.data.user.games[i]);
                    }
    
                    if (response.data.user.games[i].rank === "completed") {
                        completedArr.push(response.data.user.games[i]);
                    }
                }
                setdroppedGames(droppedArr);
                setPlayingGames(playingArr);
                setUpcomingGames(upcomingArr);
                setCompletedGames(completedArr);
            }
        }).catch(err => {
            console.log("error");
        })
    }

    useEffect(() => {
        if (user !== null) {
            getProfile(setUser);
        }
    }, [])

    function alphaSort () {
        let sortGamesArr;
        let sortedGames;
        if (gameState === "dropped") {
            sortGamesArr = droppedGames;
        } else if (gameState === "completed") {
            sortGamesArr = completedGames;
        } else if (gameState === "upcoming") {
            sortGamesArr = upcomingGames;
        } else if (gameState === "playing") {
            sortGamesArr = playingGames;
        } else {
            sortGamesArr = userGames;
        }

        if (document.getElementById("sort-direction").value === "ascending" && 
            document.getElementById("sort-focus").value === "alpha") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
        }
        
        if (document.getElementById("sort-direction").value === "descending" && 
            document.getElementById("sort-focus").value === "alpha") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.name < b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
        }
    }

    function renderGames (games) {
        if (games.length <= 0) {
            gamesList = <h2 className="user-game__no-results">No Games Found in this Category</h2>
        } else {
            gamesList = games.map(game => {
                return <div className="user-game">
                    <div className="user-game__title"><h2>{game.name}</h2></div>
                    <div className="user-game__img"><img src={game.img_url} /></div>
                    <div className="user-game__date-container">
                        <p>Date:</p>
                        <p className="user-game__date">{new Date(game.date_added).toDateString().substring(4)}</p>
                    </div>
                    <div className="user-game__rating">
                        <label>Rating: </label>
                        <p className="user-game__rating__num">{game.rating}</p>    
                    </div>
                    <div className="user-game__status-container">
                        <p>Game Status</p>
                        <p className="user-game__status">{game.rank.toUpperCase()}</p>
                    </div>
                    <div className="user-game__summary-container">
                        <h3>Comments</h3>
                        <p className="user-game__summary">{game.summary}</p>
                    </div>
                </div>
            })
        }
    }

    if (gameState === "dropped") {
        renderGames(droppedGames);
    } else if (gameState === "upcoming") {
        renderGames(upcomingGames);
    } else if (gameState === "completed") {
        renderGames(completedGames);
    } else if (gameState === "playing") {
        renderGames(playingGames);
    } else {
        renderGames(userGames);
    }



    if (user === null) {
        return <div>
                <h1>Sorry that page doesn't exist (yet 😏)</h1>
                <h2>If you know this user on <a target="_blank" href={`https://www.twitch.tv${window.location.pathname}`}>Twitch</a>, follow them and ask them if they want to join: <a target="_blank" href={`https://www.twitch.tv${window.location.pathname}`}>https://www.twitch.tv{window.location.pathname}</a></h2>
            </div>
    } else {
        return (
            <div>
                <img src={user.profileImageUrl} alt={user.twitchName + "'s profile picture"}  />
                <h1>{user.twitchName}</h1>
                <div>
                    <div>
                        <select onChange={(e) => {
                            setGameState(e.target.value);
                        }} className="user-games__filter">
                            <option disabled selected>Select Game State</option>
                            <option value="all">Show All Games</option>
                            <option value="playing">Playing</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                        </select>
                    </div>
                    <div>
                        <h2>Sorting</h2>
                        <div>
                            <select id="sort-direction">
                                <option value="ascending">Ascending</option>
                                <option value="descending" >Descending</option>
                            </select>
                            <select id="sort-focus">
                                <option value="alpha">Alphabetical</option>
                                <option value="date">Date</option>
                                <option value="rating">Rating</option>
                            </select>
                            <input type="submit" id="sorting-btn" value="Submit" onClick={(e) => {
                                e.preventDefault();
                                alphaSort();
                            }}/>
                        </div>
                    </div>
                </div>
                <div className="profile-results">
                    {user.games !== undefined && 
                    gamesList
                    }
                </div>
            </div>
        )
    }
}