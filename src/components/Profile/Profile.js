import React, { useEffect, useState } from "react";
import { setReportUser } from "../../redux/gamesSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./Profile.css";
import smwCart from "../../assets/vh_smw_cart.webp";
import mcCart from "../../assets/vh_minecraft_cart.webp";
import pokemonCart from "../../assets/vh_pokemon_cart.webp";
import otherCart from "../../assets/vh_other_cart.webp";

export default function Profile (match) {
    const dispatch = useDispatch();
    const reportUser = useSelector((state) => state.gamesReducer.reportUser);
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    const userParam = useParams();
    const navigate = useNavigate();
    // const backendURL = "http://localhost:4000";
    const [user, setUser] = useState({});
    const [userGames, setUserGames] = useState([]);

    const [title, setTitle] = useState("");
    const [gameSummary, setGameSummary] = useState("");
    const [gameImg, setGameImg] = useState("");
    const [gameDate, setGameDate] = useState("");
    const [gameRating, setGameRating] = useState("");
    const [gameRank, setGameRank] = useState("");

    const [showModal, setShowModal] = useState(false);


    const [gameType, setGameType] = useState("all");
    let gamesArr = [];
    let games;
    let gamesList;
    let phase1Arr = [];
    let phase2Arr = [];
    let phase3Arr;
    let matchArr;

    const [gameState, setGameState] = useState("all");

    const [sortFocus, setSortFocus] = useState("alpha");
    const [sortDirection, setSortDirection] = useState("ascending");
    const [search, setSearch] = useState("");

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
        }).catch(err => {
            console.log("error");
        })
    }

    useEffect(() => {
        if (user !== null) {
            if (userParam.user !== userParam.user.toLowerCase()) {
                navigate(`/` + userParam.user.toLowerCase(), { replace: true });
              }
            getProfile(setUser);
        }
    }, [])

    useEffect(() => {
        console.log("gameType: ", gameType);
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

        renderGames(phase3Arr);
    }

    function renderGames (games) {
        if (games.length <= 0) {
            gamesList = <h2 className="user-game__no-results">No Games Found in this Category</h2>
        } else {
            gamesList = games.map(game => {
                return <div className="user-game">
                    <div className="user-game__title"><h2>{game.name}</h2></div>
                    <div className="user-game__img"><img src={game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url} /></div>
                    <div className="user-game__date-container">
                        <p>Date:</p>
                        <p className="user-game__date">{new Date(game.date_added).toDateString().substring(4)}</p>
                    </div>
                    <div className="user-game__rating">
                        <p>Rating: </p>
                        <p className="user-game__rating__num">{game.rating === 0 ? "-" : game.rating}</p>    
                    </div>
                    <div className="user-game__status-container">
                        <p>Game Status</p>
                        <p className="user-game__status">{game.rank.toUpperCase()}</p>
                    </div>
                    <div className="user-game__summary-container">
                        <h3>Comments</h3>
                        <p className="user-game__summary">{game.summary}</p>
                    </div>
                        <p className="user-game__readmore" onClick={() => {
                            setShowModal(true);
                            setTitle(game.name);
                            setGameSummary(game.summary);
                            setGameImg(game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url);
                            setGameRank(game.rank);
                            setGameRating(game.rating);
                            setGameDate(new Date(game.date_added).toDateString().substring(4));
                        }}>Read More</p>
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

    if (user === null) {
        return <div>
                <h1>Sorry that page doesn't exist (yet 😏)</h1>
                <h2>If you know this user on <a target="_blank" href={`https://www.twitch.tv${window.location.pathname}`}>Twitch</a>, follow them and ask them if they want to join: <a target="_blank" href={`https://www.twitch.tv${window.location.pathname}`}>https://www.twitch.tv{window.location.pathname}</a></h2>
            </div>
    } else {
        return (
            <div>
                <img src={user.profileImageUrl} alt={user.twitch_default + "'s profile picture"}  />
                <h1>{user.twitch_default}</h1>
                <p onClick={() => {
                    localStorage.setItem("reportUser", user.twitch_default);
                    window.location.pathname = "/report";
                }}>Report User</p>
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
                        <form>
                            <select id="sort-direction" onChange={(e) => {
                                setSortDirection(e.target.value);
                            }}>
                                <option value="ascending">Ascending</option>
                                <option value="descending">Descending</option>
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
                        {showModal && 
                        <div id="user-game__modal">
                            <p className="user-game__modal__close" onClick={() => {
                                setShowModal(false);
                            }}>X</p>
                            <div id="user-game__modal__selected">
                                <div className="user-game__modal__flex">
                                    <div>
                                        <h1 className="user-game__modal__title">{title}</h1>
                                        <img className="user-game__modal__img" src={gameImg} alt={`${title} cover`} />
                                        <p className="user-game__scroll-warning">(scroll if needed)</p>
                                    </div>
                                    <div className="user-game__modal__text-container">
                                        <div>
                                            <h2 className="user-game__modal__text">Comments</h2>
                                            <p className="user-game__modal__summary">{gameSummary}</p>
                                        </div>
                                        <div className="user-game__modal__text-flex">
                                            <p className="user-game__modal__text">Date: </p>
                                            <p className="user-game__modal__date">{gameDate}</p>
                                        </div>
                                        <div className="user-game__modal__text-flex">
                                            <p className="user-game__modal__text">Game Status: </p>
                                            <p className="user-game__modal__rank">{gameRank.toUpperCase()}</p>
                                        </div>
                                        <div className="user-game__modal__text-flex">
                                            <p className="user-game__modal__text">Rating: </p>
                                            <p className="user-game__modal__rating">{gameRating}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
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
                        <input id="gameslist-games__search" type="text" 
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}/>
                        <input type="submit" value="Submit" onClick={(e) => { 
                            e.preventDefault();
                        }}/>
                    </form>
                </div>
                <div id="profile-results-container" className="profile-results">
                    {user.games !== undefined && 
                    gamesList
                    }
                </div>
            </div>
        )
    }
}