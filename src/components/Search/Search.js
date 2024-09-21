import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Custom from "../Custom/Custom";
import "./Search.css";
import { setUserGames } from "../../redux/gamesSlice";
import smwCart from "../../assets/vh_smw_cart.webp";
import mcCart from "../../assets/vh_minecraft_cart.webp";
import pokemonCart from "../../assets/vh_pokemon_cart.webp";
import otherCart from "../../assets/vh_other_cart.webp";

export default function Search () {
    const dispatch = useDispatch();
    let userGames = useSelector((state) => state.gamesReducer.userGames);
    const [search, setSearch] = useState("");
    const [gameType, setGameType] = useState("regular");
    const [customGame, setCustomGame] = useState("mario");
    const [date, setDate] = useState("");
    const [games, setGames] = useState([]);
    const [rank, setRank] = useState("");
    const [rating, setRating] = useState(0);
    const [searchGames, setSearchGames] = useState(userGames);
    const [customGameMsg, setCustomGameMsg] = useState("");
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    // const backendURL = "http://localhost:4000";

    let twitchId;
    let twitchName;
    twitchId = window.localStorage.getItem("twitchId");
    twitchName = window.localStorage.getItem("twitchName");
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

    async function getUserGames() {
        twitchId = window.localStorage.getItem("twitchId");
        // twitchName = window.localStorage.getItem("twitchName");

        await axios(`${backendURL}/games`, {
            method: "get",
            params: {
                twitchName: twitchName
            }
        }).then(result => {
            dispatch(setUserGames(result.data.response.games));
        })
    }

    function addGame (gameName, 
                        gameSummary, gameStatus,
                        gameDate, index, gameRating, customGame) {
        twitchId = window.localStorage.getItem("twitchId");
        twitchName = window.localStorage.getItem("twitchName");
        getDate(gameDate, index);
        let gameObj = {
            name: gameName,
            custom_game: customGame,
            img_url: "",
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
                getUserGames();
            })
            .catch(error => {
                console.log("addGame error: ", error);
            })
    }

    function defaultDate (gameDate, index) {
        gameDate[index].valueAsDate = new Date();
        const newDate = new Date(gameDate[index].value);
        setDate(prevDate => newDate);
    }

    function getDate (dateField, index) {
        const newDate = new Date(dateField[index].value);
        setDate(prevDate => newDate);
    }

    let retrievedGames;

    useEffect(() => {
        twitchId = window.localStorage.getItem("twitchId");
        getUserGames();
        retrievedGames.map((game, i) => {
            defaultDate(document.getElementsByClassName("search-game__date"), i);
            // getRating(i);
        })
    }, [games])

    useEffect(() => {
        if (gameType === "custom") {
            defaultDate(document.getElementsByClassName("custom-game__date"), 0);
        }
    }, [gameType])

    let userGameNames = [];
    let gameNames = [];
    userGames.map(userGame => {
        userGameNames.push(userGame.name);
    })


    games.map(game => {
        gameNames.push(game.name);
    })

    retrievedGames = games.map((game, i) => {
        return <div className="search-game">
            <h2 className="search-game__name">{game.name}</h2>
            <img src={game.background_image} alt={game.name + " image"} />
            <label>Date:</label><input className="search-game__date" type="date" name="date-added" onChange={(e) => getDate("search-game__date", i)}/>
            <div className="search-game__rating">
                <label>Rating: </label>
                <select className="search-game__rating__num">
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
            <div className="search-game__status">
                <label>Game Status</label>
                <select>
                    <option selected="selected" value="playing">Playing</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                </select>
            </div>
            <textarea placeholder="Let your viewers know how you felt about this game" ></textarea>
            {userGameNames.includes(game.name) ? <p className="search-result__added">Added</p> : <p className="search-result__add-btn" onClick={(e) => addGame(game.name, game.background_image, e.target.previousElementSibling.value, e.target.previousElementSibling.previousElementSibling.children[1].value,
                document.getElementsByClassName("search-game__date"), i, document.getElementsByClassName("search-game__rating__num")[i].value, "")}>Add Game</p>}
        </div>
    })

    return (
        <div>
            <form>
                <select id="search-game__type" onChange={(e) => {
                    setGameType(prevGameType => e.target.value);
                }}>
                    <option value="regular" selected>Regular</option>
                    <option value="custom">Custom</option>
                </select>
                {gameType === "regular" ? 
                <div>
                    <input className="search" placeholder="Search games" 
                        onChange={(e) => {setSearch(prevSearch => e.target.value)}} value={search}/>
                    <button onClick={(e) => {getGames(e)}}>Submit</button>
                </div> : ""}
            </form>
            {gameType === "custom" ? 
            <div className="custom-game-container">
                <form>
                    <div className="custom-game__field" id="custom-game__game-type">
                        <label>Game Type</label>
                        <select onChange={(e) => {
                            setCustomGame(prevGame => e.target.value);
                        }}>
                            <option value="mario">Super Mario</option>
                            <option value="pokemon">Pokemon</option>
                            <option value="minecraft">Minecraft Mod</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <img src={customGame === "mario" ? smwCart : customGame === "pokemon" ? pokemonCart : customGame === "minecraft" ? mcCart : otherCart} />
                    <input className="custom-game__field custom-game__field__text" id="custom-game__title" type="text" placeholder="Title - Only permitted special characters are & and !"/>
                    <div className="custom-game__field">
                        <label>Date:</label><input className="custom-game__date" type="date" name="date-added"/>
                    </div>
                <div className="custom-game__field custom-game__rating">
                    <label>Rating: </label>
                    <select id="custom-game__rating__num">
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
                <div className="custom-game__field custom-game__status">
                    <label>Game Status</label>
                    <select id="custom-game__status">
                        <option selected="selected" value="playing">Playing</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="dropped">Dropped</option>
                    </select>
                </div>
                <textarea id="custom-game__summary" className="custom-game__field" placeholder="Let your viewers know how you felt about this game" ></textarea>
                {/* {userGameNames.includes(game.name) ? <p className="search-result__added">Added</p> : <p className="search-result__add-btn" onClick={(e) => addGame(game.name, game.background_image, e.target.previousElementSibling.value, e.target.previousElementSibling.previousElementSibling.children[1].value, i)}>Add Game</p>} */}
                <p className="custom-game__add-btn" onClick={() => {
                    let customGameTitle = document.getElementById("custom-game__title").value;
                    let customSummary = document.getElementById("custom-game__summary").value;
                    let customStatus = document.getElementById("custom-game__status").value;
                    let customDate = document.getElementsByClassName("custom-game__date")[0].value;
                    let customRating = document.getElementById("custom-game__rating__num").value;

                    console.log(customDate);
                    let titleField = document.getElementsByClassName('custom-game__field__text')[0];
                    const hasInvalidCharacters = /[^a-zA-Z0-9 &!]/.test(titleField.value);
                    if (!hasInvalidCharacters) {
                            addGame(customGameTitle, customSummary, customStatus, customDate, 0, customRating, gameType);
                            setCustomGameMsg(`${customGameTitle} has been added`);
                            document.getElementById("custom-game__title").value = "";
                            document.getElementById("custom-game__img-url").value = "";
                            document.getElementById("custom-game__summary").value = "";
                            document.getElementById("custom-game__status").value = "playing";
                            defaultDate(document.getElementsByClassName("custom-game__date"), 0);
                            document.getElementById("custom-game__rating__num").value = "10";

                    } else {
                        setCustomGameMsg("No special characters (except '&')");
                    }
                }}>Add Game</p>
                <div id="custom-game__notif-container">
                    <p id="custom-game__notif__msg">{customGameMsg}</p>
                </div>
                </form>
            </div> 
            : ""}
            <div className="search-results">
                {gameType === "regular" ? retrievedGames : ""}
            </div>
        </div>
    )
}