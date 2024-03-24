import React, {useState, useEffect} from "react";
import axios from "axios";
import GameResult from "../GameResult/GameResult";
import "./Search.css";

export default function Search () {
    const [search, setSearch] = useState("");
    const [games, setGames] = useState([]);
    const backendURL = process.env.REACT_APP_NODE_BACKEND || "http://localhost:4000";

    let twitchId;
    let twitchName;

    function getGames (e) {
        e.preventDefault();
        axios({
            url: `https://api.rawg.io/api/games?search=${search}&key=${process.env.REACT_APP_RAWG_API}`,
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log("response: ", response.data.results);
            setGames(response.data.results);
        }).catch(error => {
            console.error("error: ", error);
        })
    }

    function addGame (gameName, gameImg) {
        twitchId = window.localStorage.getItem("twitchId");
        twitchName = window.localStorage.getItem("twitchName");
        let gameObj = {
            name: gameName,
            img_url: gameImg
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
            })
            .catch(error => {
                console.log("addGame error: ", error);
            })
    }

    useEffect(() => {
        console.log(games);
        twitchId = window.localStorage.getItem("twitchId");
        console.log("twitchId: ", twitchId);
    }, [games])

    let retrievedGames = games.map((game) => {
        return <div className="search-game">
            <h2>{game.name}</h2>
            <img src={game.background_image} alt={game.name + " image"} />
            <p onClick={() => addGame(game.name, game.background_image)}>Add Game</p>
        </div>
    })

    return (
        <div>
            <form>
                <input className="search" placeholder="Search games" 
                onChange={(e) => {setSearch(prevSearch => e.target.value)}} value={search}/>
                <button onClick={(e) => {getGames(e)}}>Submit</button>  
            </form>
            <div className="search-results">
                {retrievedGames}
            </div>
        </div>
    )
}