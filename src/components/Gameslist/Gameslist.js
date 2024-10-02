import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Gameslist.css";
import smwCart from "../../assets/vh_smw_cart.webp";
import mcCart from "../../assets/vh_minecraft_cart.webp";
import pokemonCart from "../../assets/vh_pokemon_cart.webp";
import otherCart from "../../assets/vh_other_cart.webp";

export default function Gameslist (){
    const navigate = useNavigate();

    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    // const backendURL = "http://localhost:4000";
    let twitchId;
    let twitchName = window.localStorage.getItem("twitchName");
    const [userGames, setUserGames] = useState([]);

    let selectedGameTypeArr = [];
    const [gameType, setGameType] = useState("all");

    const [gameState, setGameState] = useState("all");
    const [sortedArr, setSortedArr] = useState([]);
    const [searchArr, setSearchArr] = useState([]);
    const [rank, setRank] = useState("");
    const [rating, setRating] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [summary, setSummary] = useState("");
    const [date, setDate] = useState("");
    const [gameName, setGameName] = useState("");

    const [sortDirection, setSortDirection] = useState("ascending");
    const [sortFocus, setSortFocus] = useState("alpha");

    const [search, setSearch] = useState("");
    let userGamesList;
    let gamesList;
    let phase1Arr = [];
    let phase2Arr = [];
    let phase3Arr;
    let matchArr;

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


        console.log("phase3Arr: ", phase3Arr);
        getGameDate(userGames);
        getGameSummary(userGames);
    }, [userGames])

    useEffect(() => {
        if (matchArr !== undefined) {
            getGameSummary(matchArr);
            getGameDate(matchArr);
        } else {
            getGameSummary(phase3Arr);
            getGameDate(phase3Arr);
        }
    }, [search])

    useEffect(() => {
        getGameSummary(phase3Arr);
        getGameDate(phase3Arr);
    }, [gameType, gameState, sortDirection, sortFocus])

    let gameTypesArr = ["regular", "custom", "other", "mario", "pokemon", "minecraft"];
    let gameStateArr = ["all", "playing", "upcoming", "completed", "dropped"];
    function filterOrSort () {
        if (gameType === "all") {
            phase1Arr = userGames;
        } else {
            for (let i = 0; i < userGames.length; i++) {
                for (let k = 0; k < gameTypesArr.length; k++) {
                    if (userGames[i].custom_game === gameTypesArr[k] && gameType === gameTypesArr[k]) {
                        phase1Arr.push(userGames[i]);
                    }
                }	
            }
    
            if (gameType === "custom") {
                phase1Arr = [];
                for (let i = 0; i < userGames.length; i++) {
                    if (userGames[i].custom_game === "other" || userGames[i].custom_game === "mario" || userGames[i].custom_game === "pokemon" || userGames[i].custom_game === "minecraft") {
                        phase1Arr.push(userGames[i]);
                    }
                }
            }
        }

        for (let i = 0; i < phase1Arr.length; i++) {
            if (gameState === "all") {
                phase2Arr = phase1Arr;
            } else {
                for (let k = 0; k < gameStateArr.length; k++) {
                    if (phase1Arr[i].rank === gameStateArr[k] && gameState === gameStateArr[k]) {
                        phase2Arr.push(phase1Arr[i]);
                    }
                }
            }
        }

        if (sortDirection === "ascending" && 
            sortFocus === "alpha") {
                phase3Arr = [...phase2Arr.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))];
        }
        
        if (sortDirection === "descending" && 
            sortFocus === "alpha") {
                phase3Arr = [...phase2Arr.sort((a,b) => (a.name < b.name) ? 1 : ((a.name > b.name) ? -1 : 0))];
        }

        if (sortDirection === "ascending" && 
            sortFocus === "date") {
                phase3Arr = [...phase2Arr.sort((a,b) => (a.date_added > b.date_added) ? 1 : ((b.date_added > a.date_added) ? -1 : 0))];
        }

        if (sortDirection === "descending" && 
            sortFocus === "date") {
                phase3Arr = [...phase2Arr.sort((a,b) => (a.date_added < b.date_added) ? 1 : ((a.date_added > b.date_added) ? -1 : 0))];
        }

        if (sortDirection === "ascending" && 
            sortFocus === "rating") {
                phase3Arr = [...phase2Arr.sort((a,b) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0))];
        }

        if (sortDirection === "descending" && 
            sortFocus === "rating") {
                phase3Arr = [...phase2Arr.sort((a,b) => (a.rating < b.rating) ? 1 : ((a.rating > b.rating) ? -1 : 0))];
        }
        console.log("phase3Arr: ", phase3Arr);

        renderGames(phase3Arr);
    }

    async function updateSummary (gameName, gameSummary, gameDate, gameRank, gameRating) {
        let config = {
            method: "put",
            url: `${backendURL}/updategame`,
            data: {
                twitchName: twitchName,
                games: {
                    name: gameName,
                    summary: gameSummary,
                    date_added: gameDate,
                    rank: gameRank,
                    rating: gameRating
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

    function deleteGame (gameName) {
        let config = {
            data: {
                twitchName: twitchName,
                games: {
                    name: gameName
                }
            }
        }
            axios.delete(`${backendURL}/deletegame`, config)
                .then(response => {

                }).catch(err => {
                    console.error("Failed to delete: ", err.message);
                })
    }

    async function getUserGames() {
        twitchId = window.localStorage.getItem("twitchId");

        await axios(`${backendURL}/games`, {
            method: "get",
            params: {
                twitchName: twitchName
            }
        }).then(result => {
            setUserGames(result.data.response.games);
        })
    }

    function getGameDate (games) {
        for (let i = 0; i < document.getElementsByClassName("gameslist-game__date").length; i++) {
            document.getElementsByClassName("gameslist-game__date")[i].valueAsDate = new Date(games[i].date_added);
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
                    <h2 className="gameslist-game__title">{game.name}</h2>
                    <img className="gameslist-game__img" src={game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url} />
                    <div className="gameslist-game__date-container">
                        <label>Date:</label>
                        <input className="gameslist-game__date" type="date" name="date-added" />
                    </div>
                    <div className="gameslist-game__rating">
                        <label>Rating: </label>
                        <select className="gameslist-game__rating__num">
                            <option selected={game.rating === 10 ? true : false} value="10">10</option>
                            <option selected={game.rating === 9 ? true : false} value="9">9</option>
                            <option selected={game.rating === 8 ? true : false} value="8">8</option>
                            <option selected={game.rating === 7 ? true : false} value="7">7</option>
                            <option selected={game.rating === 6 ? true : false} value="6">6</option>
                            <option selected={game.rating === 5 ? true : false} value="5">5</option>
                            <option selected={game.rating === 4 ? true : false} value="4">4</option>
                            <option selected={game.rating === 3 ? true : false} value="3">3</option>
                            <option selected={game.rating === 2 ? true : false} value="2">2</option>
                            <option selected={game.rating === 1 ? true : false} value="1">1</option>
                            <option selected={game.rating === 0 ? true : false} value="0">-</option>
                        </select>    
                    </div>
                    <div className="gameslist-game__status">
                        <label>Game Status</label>
                        <select className="gameslist-game__rank">
                            <option selected={game.rank === "playing" ? true : false} value="playing">Playing</option>
                            <option selected={game.rank === "upcoming" ? true : false} value="upcoming">Upcoming</option>
                            <option selected={game.rank === "completed" ? true : false} value="completed">Completed</option>
                            <option selected={game.rank === "dropped" ? true : false} value="dropped">Dropped</option>
                        </select>
                    </div>
                    <textarea className="gameslist-game__summary" placeholder="Let your viewers know how you felt about this game"></textarea>
                    <div className="gameslist-btn-container">
                        <p className="gameslist-game__add-btn" onClick={(e) => {
                            updateSummary(game.name, document.getElementsByClassName("gameslist-game__summary")[i].value, document.getElementsByClassName("gameslist-game__date")[i].value, document.getElementsByClassName("gameslist-game__rank")[i].value, document.getElementsByClassName("gameslist-game__rating__num")[i].value);
                            setShowModal(true);
                            }}>Update</p>
                        <p className="gameslist-game__add-btn" onClick={() => {
                            deleteGame(game.name);
                        }}>Delete</p>
                    </div>
                </div>
            })
        }        
    }

    filterOrSort();

    if (search.length > 0 && phase3Arr.length > 0) {
        matchArr = [];
        phase3Arr.map(game => {
            if (game.name.toLowerCase().includes(search.toLowerCase())) {
                matchArr.push(game);
            }
        })
        renderGames(matchArr);
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
                    <option value="playing">Playing</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                </select>
            </div>
            <div>
                <h2>Sorting</h2>
                <form>
                    <select id="sort-direction" onChange={(e) => {
                        setSortDirection(e.target.value);
                    }}>
                        <option value="ascending">Ascending</option>
                        <option value="descending" >Descending</option>
                    </select>
                    <select id="sort-focus" onChange={(e) => {
                        setSortFocus(e.target.value);
                    }}>
                        <option value="alpha">Alphabetical</option>
                        <option value="date">Date</option>
                        <option value="rating">Rating</option>
                    </select>
                </form>
            </div>
            <div>
                <h2>Game Type</h2>
                <form>
                    <select onChange={(e) => {
                        setGameType(e.target.value);
                    }}>
                        <option value="all">All</option>
                        <option value="regular">Regular</option>
                        <option value="custom">All Custom</option>
                        <option value="other">Other</option>
                        <option value="mario">Super Mario</option>
                        <option value="pokemon">Pokemon</option>
                        <option value="minecraft">Minecraft Mod</option>
                    </select>
                </form>
            </div>
            <form>
                <h2>Search</h2>
                <input id="gameslist-games__search" type="text" onChange={(e) => {
                    setSearch(e.target.value);
                }}/>
                <input type="submit" value="Submit" onClick={(e) => {
                    e.preventDefault();
                }}/>
            </form>
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