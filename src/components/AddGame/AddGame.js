import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddGame.css";

import Image from "react-bootstrap/esm/Image";
import { useDispatch, useSelector } from "react-redux";
import { setShowGame, setShowSearch } from "../../redux/gamesSlice";
import { ToastContainer, toast } from 'react-toastify';

export default function AddGame () {
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    let twitchId;
    let twitchName;
    twitchId = window.localStorage.getItem("twitchId");
    twitchName = window.localStorage.getItem("twitchName");

    const dispatch = useDispatch();
    let showGame = useSelector((state) => state.gamesReducer.showGame);
    let showSearch = useSelector((state) => state.gamesReducer.showSearch);

    let searchGameName = useSelector((state) => state.gamesReducer.searchGameName);
    let searchGameImg = useSelector((state) => state.gamesReducer.searchGameImg);
    const [date, setDate] = useState("");
    const [rating, setRating] = useState(0);
    const [gameRank, setGameRank] = useState("playing");
    const [summary, setSummary] = useState("");

    function defaultDate (gameDate, index) {
        gameDate[index].valueAsDate = new Date;
        const newDate = new Date(gameDate[index].value);
        setDate(prevDate => newDate);
    }

    function addGame (gameName, gameImg, gameSummary, gameStatus, gameRating, customGame) {
        let gameObj = {
            name: gameName,
            custom_game: customGame,
            img_url: customGame.length === 0 ? gameImg : "",
            summary: gameSummary,
            date_added: date,
            rank: gameStatus,
            rating: gameRating
        }

        let config = {
            method: "post",
            url: `${backendURL}/addgame`,
            data: {
                twitchName: twitchName,
                twitchId: twitchId,
                games: gameObj
            }
        }

        axios(config)
        .then(result => {
        console.log("addGame: ", result)
        // getUserGames();
            // setTitle("");
            setRating(0);
            setGameRank("playing");
            setSummary("");
            setDate(defaultDate(document.getElementsByClassName("custom-game__date"), 0));
        })
        .catch((error) => {
        console.log("addGame error: ", error);
        })
    }

    useEffect(() => {
        defaultDate(document.getElementsByClassName("search-game__date"), 0);
    }, [searchGameName])

    return (
        <div className="addgame-container">
            <div className="addgame-intro">
                <h1 className="text-left">{searchGameName}</h1>
                <Image 
                    className="addgame-img"
                    src={searchGameImg}
                />
            </div>
            <div className="addgame-details">
                <label>Date:</label><input className="search-game__date" type="date" name="date-added" 
                onChange={(e) => {
                    setDate(e.target.value);
                    console.log(e.target.value);
                }}
                />
                <div className="search-game__rating">
                    <label>Rating: </label>
                    <select className="search-game__rating__num" onChange={(e) => {
                        setRating(e.target.value)
                    }}>
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
                        <option selected value="0">-</option> 
                    </select>    
                </div>
                <div className="search-game__status" onChange={(e) => {
                    setGameRank(e.target.value);
                }}>
                    <label>Game Status</label>
                    <select>
                        <option selected="selected" value="playing">Playing</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="dropped">Dropped</option>
                    </select>
                </div> 
                <textarea onChange={(e) => {
                    setSummary(e.target.value);
                }}placeholder="Let your viewers know how you felt about this game" ></textarea>
                <p className="search-result__add-btn text-center" onClick={() => {
                    dispatch(setShowGame(false));
                    dispatch(setShowSearch(true));
                    console.log("date: ", date);
                    console.log("rating: ", rating);
                    console.log("status: ", gameRank);
                    console.log("summary: ", summary);
                    addGame(searchGameName, searchGameImg, summary, gameRank, rating, "")
                    // dispatch(setSearchGameName(game.name));
                    // dispatch(setSearchGameImg(game.background_image));
                }}>Add Game</p>
            </div>
            <ToastContainer />
        </div>
    )
}