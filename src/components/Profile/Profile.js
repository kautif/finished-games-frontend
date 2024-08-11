import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import Gameslist from "../Gameslist/Gameslist";

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

    const [gameState, setGameState] = useState("");
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
        }).catch(err => {
            console.log("error");
        })
    }

    useEffect(() => {
        getProfile(setUser);
    }, [])

    useEffect(() => {
        // for (let i = 0; i < document.getElementsByClassName("profile-game__date").length; i++) {
        //     document.getElementsByClassName("profile-game__date")[i].valueAsDate = new Date(user.games[i].date_added);
        // }
        getGameState(user.games);
        getGameDate(user.games);
        getGameSummary(user.games);
        getGameRating(user.games);
    }, [user])

    useEffect(() => {
        if (gameState === "dropped") {
            getGameState(droppedGames);
            getGameDate(droppedGames);
            getGameSummary(droppedGames);
            getGameRating(droppedGames);
        } else if (gameState === "playing") {
            getGameState(playingGames);
            getGameDate(playingGames);
            getGameSummary(playingGames);
            getGameRating(playingGames);
        } else if (gameState === "upcoming") {
            getGameState(upcomingGames);
            getGameDate(upcomingGames) ;
            getGameSummary(upcomingGames);
            getGameRating(upcomingGames);
        } else if (gameState === "completed") {
            getGameState(completedGames);
            getGameDate(completedGames) ;
            getGameSummary(completedGames);
            getGameRating(completedGames);
        } else {
            getGameState(userGames);
            getGameDate(userGames);
            getGameSummary(userGames);
            getGameRating(userGames);
        }
    }, [gameState])

    function getGameDate (games) {
        for (let i = 0; i < document.getElementsByClassName("user-game").length; i++) {
            document.getElementsByClassName("user-game__date")[i].innerHTML = new Date(games[i].date_added).toDateString().substring(4);
            console.log(new Date(games[i].date_added).toDateString().substring(4));
        }
    }

    function getGameState (games) {
        for (let i = 0; i < document.getElementsByClassName("user-game__status").length; i++) {
            document.getElementsByClassName("user-game__status")[i].innerHTML = (games[i].rank).toUpperCase();
        }
    }

    function getGameSummary (games) {
        for (let i = 0; i < document.getElementsByClassName("user-game__summary").length; i++) {
            document.getElementsByClassName("user-game__summary")[i].value = games[i].summary;
        }
    }

    function getGameRating (games) {
        for (let i = 0; i < document.getElementsByClassName("user-game__rating__num").length; i++) {
            document.getElementsByClassName("user-game__rating__num")[i].value = games[i].rating;
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
                        <p className="user-game__date"></p>
                    </div>
                    <div className="user-game__rating">
                        <label>Rating: </label>
                        <select className="user-game__rating__num">
                            <option selected value="10">10</option>
                            <option value="9">9</option>
                            <option value="8">8</option>
                            <option value="7">7</option>
                            <option value="6">6</option>
                            <option value="5">5</option>
                            <option value="4">4</option>
                            <option value="3">3</option>
                            <option value="2">2</option>
                            <option value="1">1</option>    
                        </select>    
                    </div>
                    <div className="user-game__status-container">
                        <p>Game Status</p>
                        {/* <select className="user-game__rank">
                            <option value="progress">In Progress</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                        </select> */}
                        <p className="user-game__status"></p>
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

    return (
        <div>
            <img src={user.profileImageUrl} alt={user.twitchName + "'s profile picture"}  />
            <h1>{user.twitchName}</h1>
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
            <div className="profile-results">
                {user.games !== undefined && 
                gamesList
                    // user.games.map((game, i) => {
                    //     console.log("profile game: ", game);
                        
                    //     return (
                    //         <div className="profile-game">
                    //             <h1>{game.name}</h1>
                    //             <img src={game.img_url} alt={game.name + " game cover"} />
                    //             <input className="profile-game__date" type="date" name="date-added" disabled/>
                    //             <div className="search-game__status">
                    //                 <label>Game Status</label>
                    //                 <select disabled>
                    //                     <option value="progress">In Progress</option>
                    //                     <option value="upcoming">Upcoming</option>
                    //                     <option value="completed">Completed</option>
                    //                     <option value="dropped">Dropped</option>
                    //                 </select>
                    //             </div>
                    //             <p className="user-game__summary">{game.summary}</p>
                    //         </div>
                    //     )
                    // })
                }
            </div>
        </div>
    )
}