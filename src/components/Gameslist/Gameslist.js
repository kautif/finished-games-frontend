import React, {useEffect, useState} from "react";
import axios from "axios";
import "./Gameslist.css";

export default function Gameslist (){
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    // const backendURL = "http://localhost:4000";
    let twitchId;
    let twitchName = window.localStorage.getItem("twitchName");
    const [userGames, setUserGames] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [summary, setSummary] = useState("");
    const [date, setDate] = useState("");
    const [gameName, setGameName] = useState("");
    let userGamesList;

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
        getGameDate();
    }, [userGames])

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
        })
    }

    function getGameDate () {
        // document.getElementsByClassName("user-game").map((userGame, i) => {
            // document.getElementsByClassName("user-game")[i].children[2].valueAsDate = new Date(userGames[i].date_added);
        // })

        for (let i = 0; i < document.getElementsByClassName("user-game").length; i++) {
            document.getElementsByClassName("user-game")[i].children[2].valueAsDate = new Date(userGames[i].date_added);
        }
    }

    let gamesList = userGames.map(game => {
        return <div className="user-game">
            {game.name}
            <img src={game.img_url} />
            <label>Date:</label><input className="user-game__date" type="date" name="date-added" />
            <textarea placeholder="Let your viewers know how you felt about this game">{game.summary}</textarea>
            <p onClick={(e) => {
                setDate(prevDate => e.target.previousSibling.previousSibling.value);
                console.log(e.target.previousSibling.previousSibling.value);
                setSummary(prevSummary => e.target.previousElementSibling.value);
                setGameName(prevGameName => game.name);
                setShowModal(true);
                }}>Update</p>
        </div>
    })

    return (
        <div className="user-games-container"> 
            <h1>Your Games</h1>
            <div className="user-games">
                {gamesList}
            </div>

            {showModal ? <div className="user-games__update">
                <p>Summary for {gameName} has been updated</p>
                <span className="user-games__update__close" onClick={() => setShowModal(false)}>X</span>
            </div> : ""}
        </div>
    )
}