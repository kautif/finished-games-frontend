import React, {useEffect, useState} from "react";
import axios from "axios";
import "./Gameslist.css";

export default function Gameslist (){
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    // const backendURL = "http://localhost:4000";
    let twitchId;
    let twitchName = window.localStorage.getItem("twitchName");
    let filteredArr = [];
    const [userGames, setUserGames] = useState([]);
    const [completedGames, setCompletedGames] = useState([]);
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [droppedGames, setdroppedGames] = useState([]);
    const [progressGames, setProgressGames] = useState([]);

    const [gameState, setGameState] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [summary, setSummary] = useState("");
    const [date, setDate] = useState("");
    const [gameName, setGameName] = useState("");
    let userGamesList;
    let gamesList;
    useEffect(() => {
        getUserGames();
    }, [])

    useEffect(() => {
        if (userGames.length === 0) {
            console.log("user games is empty")
        } else {
            userGamesList = () => {
                userGames.map(game => {
                    console.log("game:", game);
                })
            }
        }
        getGameDate(userGames);
        getGameState(userGames);
    }, [userGames])

    useEffect(() => {
        console.log("gameState", gameState);
        // 8/3/24: When setting userGames state, also set a completedGame, droppedGames, upcomingGames state and so on.
        if (gameState === "dropped") {
            getGameState(droppedGames);
            getGameDate(droppedGames);
            getGameSummary(droppedGames);
        } else if (gameState === "progress") {
            getGameState(progressGames);
            getGameDate(progressGames);
            getGameSummary(progressGames);
        } else if (gameState === "upcoming") {
            getGameState(upcomingGames);
            getGameDate(upcomingGames) ;
            getGameSummary(upcomingGames);
        } else if (gameState === "completed") {
            getGameState(completedGames);
            getGameDate(completedGames) ;
            getGameSummary(completedGames);
        } else {
            getGameState(userGames);
            getGameDate(userGames);
            getGameSummary(userGames);
        }
    }, [gameState])

    useEffect(() => {
        updateSummary(gameName, summary, date);
    }, [gameName, summary, date])

    async function updateSummary (gameName, gameSummary, gameDate) {
        console.log("gameDate: ", gameDate);
        let config = {
            method: "put",
            url: `${backendURL}/updategame`,
            data: {
                twitchName: twitchName,
                games: {
                    name: gameName,
                    summary: gameSummary,
                    date_added: gameDate
                }
            }
        }

        axios(config)
            .then(result => {
                console.log("update Summary: ", result);
                setGameName(prevGame => gameName);
            })
            .catch(error => {
                console.log("update summary error: ", error);
            })
    }

    async function getUserGames() {
        twitchId = window.localStorage.getItem("twitchId");
        // twitchName = window.localStorage.getItem("twitchName");

        await axios(`${backendURL}/games`, {
            method: "get",
            params: {
                twitchName: twitchName
            }
        }).then(result => {
            setUserGames(result.data.response.games);
            console.log("userGames: ", userGames);
            let droppedArr = [];
            let progressArr = [];
            let upcomingArr = [];
            let completedArr = [];
            for (let i = 0; i < result.data.response.games.length; i++) {
                if (result.data.response.games[i].rank === "dropped") {
                    droppedArr.push(result.data.response.games[i]);
                }

                if (result.data.response.games[i].rank === "progress") {
                    progressArr.push(result.data.response.games[i]);
                }

                if (result.data.response.games[i].rank === "upcoming") {
                    upcomingArr.push(result.data.response.games[i]);
                }

                if (result.data.response.games[i].rank === "completed") {
                    completedArr.push(result.data.response.games[i]);
                }
            }
            setdroppedGames(droppedArr);
            setProgressGames(progressArr);
            setUpcomingGames(upcomingArr);
            setCompletedGames(completedArr);
        })
    }

    function getGameDate (games) {
        for (let i = 0; i < document.getElementsByClassName("gameslist-game").length; i++) {
            document.getElementsByClassName("gameslist-game__date")[i].valueAsDate = new Date(games[i].date_added);
        }
    }

    function getGameState (games) {
        for (let i = 0; i < document.getElementsByClassName("gameslist-game__rank").length; i++) {
            document.getElementsByClassName("gameslist-game__rank")[i].value = games[i].rank;
        }
    }

    function getGameSummary (games) {
        for (let i = 0; i < document.getElementsByClassName("gameslist-game__summary").length; i++) {
            document.getElementsByClassName("gameslist-game__summary")[i].value = games[i].summary;
        }
    }

    function renderGames (games) {
        if (games.length <= 0) {
            gamesList = <h2 className="gameslist-game__no-results">No Games Found in this Category</h2>;
        } else {
            gamesList = games.map((game, i) => {
                return <div className="gameslist-game">
                    {game.name}
                    <img src={game.img_url} />
                    <div class="gameslist-game__date-container">
                        <label>Date:</label>
                        <input className="gameslist-game__date" type="date" name="date-added" />
                    </div>
                    <div className="gameslist-game__status">
                        <label>Game Status</label>
                        <select className="gameslist-game__rank">
                            <option value="progress">In Progress</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                        </select>
                    </div>
                    <textarea className="gameslist-game__summary" placeholder="Let your viewers know how you felt about this game">{game.summary}</textarea>
                    <p className="gameslist-game__add-btn" onClick={(e) => {
                        setDate(prevDate => document.getElementsByClassName("gameslist-game__date")[i].value);
                        console.log("gameslist game date: ", document.getElementsByClassName("gameslist-game__date")[i].value);
                        setSummary(prevSummary => document.getElementsByClassName("gameslist-game__summary")[i].value);
                        setGameName(prevGameName => game.name);
                        setShowModal(true);
                        }}>Update</p>
                </div>
            })   
        }
    }

    if (gameState === "dropped") {
        console.log("current state: ", gameState);
        renderGames(droppedGames);
    } else if (gameState === "upcoming") {
        console.log("current state: ", gameState);
        renderGames(upcomingGames);
    } else if (gameState === "completed") {
        console.log("current state: ", gameState);
        renderGames(completedGames);
    } else if (gameState === "progress") {
        console.log("current state: ", gameState);
        renderGames(progressGames);
    } else {
        renderGames(userGames);
    }

    return (
        <div className="gameslist-games-container"> 
            <h1>Your Games</h1>
            <div>
                <p>Filter Games</p>
                <select onChange={(e) => {
                    setGameState(e.target.value);
                }} className="gameslist-games__filter">
                    <option disabled selected>Select Game State</option>
                    <option value="all">Show All Games</option>
                    <option value="progress">In Progress</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                </select>
            </div>
            <div className="gameslist-games">
                {gamesList}
            </div>

            {showModal ? <div className="gameslist-games__update">
                <p>Summary for {gameName} has been updated</p>
                <span className="gameslist-games__update__close" onClick={() => setShowModal(false)}>X</span>
            </div> : ""}
        </div>
    )
}