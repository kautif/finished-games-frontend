import React, { useEffect, useState } from "react";
import { setReportUser } from "../../redux/gamesSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Column from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import Image from "react-bootstrap/Image";
import Button from 'react-bootstrap/Button';
import axios from "axios";
import "./Profile.css";
import smwCart from "../../assets/vh_smw_cart.webp";
import mcCart from "../../assets/vh_minecraft_cart.webp";
import pokemonCart from "../../assets/vh_pokemon_cart.webp";
import otherCart from "../../assets/vh_other_cart.webp";
import Col from "react-bootstrap/Col";
import GameData from "../GameData/GameData";
import { toast, ToastContainer } from "react-toastify";

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

    const [regCount, setRegCount] = useState(0);
    const [regUpCount, setRegUpCount] = useState(0);
    const [regCompCount, setRegCompCount] = useState(0);
    const [regDroppedCount, setRegDroppedCount] = useState(0);
    
    const [marioCount, setMarioCount] = useState(0);
    const [marioUpCount, setMarioUpCount] = useState(0);
    const [marioCompCount, setMarioCompCount] = useState(0);
    const [marioDroppedCount, setMarioDroppedCount] = useState(0);

    const [pokemonCount, setPokemonCount] = useState(0);
    const [pokemonUpCount, setPokemonUpCount] = useState(0);
    const [pokemonCompCount, setPokemonCompCount] = useState(0);
    const [pokemonDroppedCount, setPokemonDroppedCount] = useState(0);

    const [minecraftCount, setMinecraftCount] = useState(0);
    const [minecraftUpCount, setMinecraftUpCount] = useState(0);
    const [minecraftCompCount, setMinecraftCompCount] = useState(0);
    const [minecraftDroppedCount, setMinecraftDroppedCount] = useState(0);

    const [otherCount, setOtherCount] = useState(0);
    const [otherUpCount, setOtherUpCount] = useState(0);
    const [otherCompCount, setOtherCompCount] = useState(0);
    const [otherDroppedCount, setOtherDroppedCount] = useState(0);

    const [gamesObj, setGamesObj] = useState({
        regular: {
            playing: 0,
            upcoming: 0,
            completed: 0,
            dropped: 0
        },
        mario: {
            playing: 0,
            upcoming: 0,
            completed: 0,
            dropped: 0
        },
        pokemon: {
            playing: 0,
            upcoming: 0,
            completed: 0,
            dropped: 0
        },
        minecraft: {
            playing: 0,
            upcoming: 0,
            completed: 0,
            dropped: 0
        },
        other: {
            playing: 0,
            upcoming: 0,
            completed: 0,
            dropped: 0
        }
    })
    
    let regPlaying = 0;
    let regUp = 0;
    let regComp = 0;
    let regDropped = 0;

    let smwPlaying = 0;
    let smwUp = 0;
    let smwComp = 0;
    let smwDropped = 0;

    let pokemonPlaying = 0;
    let pokemonUp = 0;
    let pokemonComp = 0;
    let pokemonDropped = 0;

    let minecraftPlaying = 0;
    let minecraftUp = 0;
    let minecraftComp = 0;
    let minecraftDropped = 0;

    let otherPlaying = 0;
    let otherUp = 0;
    let otherComp = 0;
    let otherDropped = 0;

    let regularArr = [];
    let otherArr = [];
    let minecraftArr = [];
    let pokemonArr = [];
    let smwArr = [];

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

    function shareProfile () {
        navigator.clipboard.writeText(window.location.href);
    }

    function notifyShareProfile () {
        shareProfile();
        toast(`${window.location.href} has been copied to your clipboard`, {
            position: "top-center",
            autoClose: 2000
        });
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
        if (userGames) {
            userGames.map(game => {
                if (game.custom_game === "regular") {
                    regularArr.push(game);
                }

                if (game.custom_game === "other") {
                    otherArr.push(game);
                }

                if (game.custom_game === "minecraft") {
                    minecraftArr.push(game);
                }

                if (game.custom_game === "mario") {
                    smwArr.push(game);
                }

                if (game.custom_game === "pokemon") {
                    pokemonArr.push(game);
                }
            })
        }

        organizeGameData(regularArr, "playing", regPlaying, setRegCount);
        organizeGameData(regularArr, "upcoming", regUp, setRegUpCount);
        organizeGameData(regularArr, "completed", regComp, setRegCompCount);
        organizeGameData(regularArr, "dropped", regDropped, setRegDroppedCount);

        organizeGameData(smwArr, "playing", smwPlaying, setMarioCount);
        organizeGameData(smwArr, "upcoming", smwUp, setMarioUpCount);
        organizeGameData(smwArr, "completed", smwComp, setMarioCompCount);
        organizeGameData(smwArr, "dropped", smwDropped, setMarioDroppedCount);

        organizeGameData(pokemonArr, "playing", pokemonPlaying, setPokemonCount);
        organizeGameData(pokemonArr, "upcoming", pokemonUp, setPokemonUpCount);
        organizeGameData(pokemonArr, "completed", pokemonComp, setPokemonCompCount);
        organizeGameData(pokemonArr, "dropped", pokemonDropped, setPokemonDroppedCount);

        organizeGameData(minecraftArr, "playing", minecraftPlaying, setMinecraftCount);
        organizeGameData(minecraftArr, "upcoming", minecraftUp, setMinecraftUpCount);
        organizeGameData(minecraftArr, "completed", minecraftComp, setMinecraftCompCount);
        organizeGameData(minecraftArr, "dropped", minecraftDropped, setMinecraftDroppedCount);

        organizeGameData(otherArr, "playing", otherPlaying, setOtherCount);
        organizeGameData(otherArr, "upcoming", otherUp, setOtherUpCount);
        organizeGameData(otherArr, "completed", otherComp, setOtherCompCount);
        organizeGameData(otherArr, "dropped", otherDropped, setOtherDroppedCount);
    }, [userGames])

    useEffect(() => {
        setGamesObj((prevObj) => ({
            ...prevObj,
            regular: {
                ...prevObj.regular,
                playing: regCount,
                upcoming: regUpCount,
                completed: regCompCount,
                dropped: regDroppedCount
            },
            mario: {
                ...prevObj.mario,
                playing: marioCount,
                upcoming: marioUpCount,
                completed: marioCompCount,
                dropped: marioDroppedCount
            },
            pokemon: {
                ...prevObj.pokemon,
                playing: pokemonCount,
                upcoming: pokemonUpCount,
                completed: pokemonCompCount,
                dropped: pokemonDroppedCount
            },
            minecraft: {
                ...prevObj.minecraft,
                playing: minecraftCount,
                upcoming: minecraftUpCount,
                completed: minecraftCompCount,
                dropped: minecraftDroppedCount
            },
            other: {
                ...prevObj.other,
                playing: otherCount,
                upcoming: otherUpCount,
                completed: otherCompCount,
                dropped: otherDroppedCount
            }
        }))
    }, [regCount, regUpCount, regCompCount, regDroppedCount])

    useEffect(() => {
        console.log("gameType: ", gameType);
    }, [gameType, gameState, sortDirection, sortFocus])

    function organizeGameData (gameTypeArr, gameStatus, counter, setCount) {
        gameTypeArr.map(game => {
            if (game.rank === gameStatus) {
                counter++;
            }
            setCount(counter);
        })
    }

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
                return <Col xl={3} lg={4} sm={6} xs={12}>
                    <Row className="user-game d-flex flex-column me-2">
                        <div className="user-game__title"><h2>{game.name}</h2></div>
                        <div className="user-game__img" onClick={() => {
                            setShowModal(true);
                            setTitle(game.name);
                            setGameSummary(game.summary);
                            setGameImg(game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url);
                            setGameRank(game.rank);
                            setGameRating(game.rating);
                            setGameDate(new Date(game.date_added).toDateString().substring(4));
                        }}><Image src={game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url} rounded /></div>
                        <div className="user-game__date-container">
                            <p>Date:</p>
                            <p className="user-game__date">{new Date(game.date_added).toDateString().substring(4)}</p>
                        </div>
                        <div className="user-game__rating">
                            <p>Rating: </p>
                            <p className={`user-game__rating__num ${game.rating > 0 && game.rating <= 3 ? "user-game__rating__red" : game.rating >= 5 && game.rating < 8 ? "user-game__rating__yellow" : game.rating >= 8 && game.rating <= 10 ? "user-game__rating__green" : ""}`}>{game.rating === 0 ? "-" : game.rating}</p>    
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
                    </Row>
                </Col> 
                // <Row>
                //             <Column>
                //                 <div className="user-game__title"><h2>{game.name}</h2></div>
                //                 <Image width="390px" height="250px" src={game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url} rounded />
                //             </Column>
                //         </Row>
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
                <GameData 
                    gamesObj={gamesObj}
                />
                <img src={user.profileImageUrl} alt={user.twitch_default + "'s profile picture"}  />
                <h1>{user.twitch_default}</h1>
                <p onClick={() => {
                    localStorage.setItem("reportUser", user.twitch_default);
                    window.location.pathname = "/report";
                }}>Report User</p>
                <Button onClick={() => notifyShareProfile()}>Share Profile</Button>
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
                                        <div>
                                            <p className="btn btn-primary mt-4" onClick={() => {
                                                localStorage.setItem("reportUser", user.twitch_default);
                                                window.location.pathname = "/report";
                                            }}>Report Inappropriate Content</p>
                                        </div>
                                    </div>
                                    <div className="user-game__modal__text-container">
                                        <div className="user-game__modal__text-flex">
                                            <p className="user-game__modal__text">Game Status: </p>
                                            <p className="user-game__modal__rank">{gameRank.toUpperCase()}</p>
                                        </div>
                                        <div className="user-game__modal__text-flex">
                                            <p className="user-game__modal__text">Date: </p>
                                            <p className="user-game__modal__date">{gameDate}</p>
                                        </div>
                                        <div className="user-game__modal__text-flex">
                                            <p className="user-game__modal__text">Rating: </p>
                                            <p className="user-game__modal__rating">{gameRating}</p>
                                        </div>
                                        <div>
                                            <h2 className="user-game__modal__text">Comments</h2>
                                            <p className="user-game__modal__summary">{gameSummary}</p>
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
                <Stack gap={3} direction="horizontal" id="profile-results-container" className="profile-results" onClick={() => {
                    if (showModal) {
                        setShowModal(false);
                    }
                }}>
                    {user.games !== undefined && 
                    gamesList
                    }
                </Stack>
                <ToastContainer 
                    style={{ width: "2000px" }}
                />
            </div>
        )
    }
}