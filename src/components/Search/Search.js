import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import GameResult from "../GameResult/GameResult";
import "./Search.css";

export default function Search () {
    const [search, setSearch] = useState("");
    // const [summary, setSummary] = useState("");
    const [games, setGames] = useState([]);
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    // const backendURL = "http://localhost:4000";

    let twitchId;
    let twitchName;
    let userGames = useSelector((state) => state.gamesReducer.userGames);
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
            setGames(response.data.results);
        }).catch(error => {
            console.error("error: ", error);
        })
    }

    function addGame (gameName, gameImg, gameSummary) {
        twitchId = window.localStorage.getItem("twitchId");
        twitchName = window.localStorage.getItem("twitchName");
        let gameObj = {
            name: gameName,
            img_url: gameImg,
            summary: gameSummary
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

    let userGameNames = [];
    let gameNames = [];
    userGames.map(userGame => {
        userGameNames.push(userGame.name);
    })

    games.map(game => {
        gameNames.push(game.name);
    })
    console.log("userGames: ", userGames);   
    console.log("games: ", games);

    let retrievedGames = games.map((game, i) => {
        let doNamesMatch;
        return <div className="search-game">
            <h2>{game.name}</h2>
            <img src={game.background_image} alt={game.name + " image"} />
            <textarea placeholder="Let your viewers know how you felt about this game"></textarea>
            {userGameNames.includes(game.name) ? <p className="search-result__added">Added</p> : <p onClick={(e) => addGame(game.name, game.background_image, e.target.previousElementSibling.value)}>Add Game</p>}
            {/* {doNamesMatch ? <p onClick={(e) => addGame(game.name, game.background_image, e.target.previousElementSibling.value)}>Add Game</p> : <p className="search-result__added">Added</p>} */}
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