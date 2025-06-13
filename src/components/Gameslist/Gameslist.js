import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

import Search from '../Search/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { setShowGame, setShowSearch, setShowDiscover } from "../../redux/gamesSlice";

import './Gameslist.css';

import leftArrow from "../../assets/arrow_left_purple.png";
import searchIcon from "../../assets/search.png";
import rightArrow from "../../assets/arrow_right_purple.png";
import upArrow from "../../assets/up-arrow.png";
import downArrow from "../../assets/down-arrow.png";
import firstPage from "../../assets/first.png";
import lastPageImg from "../../assets/last.png";

import smwCart from '../../assets/vh_smw_cart.webp';
import mcCart from '../../assets/vh_minecraft_cart.webp';
import pokemonCart from '../../assets/vh_pokemon_cart.webp';
import otherCart from '../../assets/vh_other_cart.webp';

import { useDispatch, useSelector } from 'react-redux';
import AddGame from '../AddGame/AddGame';
import GameData from '../GameData/GameData';

export default function Gameslist (){
    const dispatch = useDispatch();
    let showGame = useSelector((state) => state.gamesReducer.showGame);
    let showSearch = useSelector((state) => state.gamesReducer.showSearch);
    let showDiscover = useSelector((state) => state.gamesReducer.showDiscover);
    let imagesRendered = useSelector((state) => state.gamesReducer.imagesRendered);

    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    // const backendURL = "http://localhost:4000";
    let twitchId;
    let twitchName = window.localStorage.getItem("twitchName");



    const [userGames, setUserGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [loading, setLoading] = useState();
    const [lastPage, setLastPage] = useState(0);
    let selectedGameTypeArr = [];
    const [gameType, setGameType] = useState("all");

    const [gameState, setGameState] = useState("all");
    
    const [showModal, setShowModal] = useState(false);
    // const [showDiscover, setShowDiscover] = useState(false);

    const [showDelete, setShowDelete] = useState(false);

    const [gameName, setGameName] = useState("");
    const [gameImg, setGameImg] = useState("");
    const [gameSummary, setGameSummary] = useState("");
    const [gameRating, setGameRating] = useState(0);
    const [gameDate, setGameDate] = useState("");
    const [gameRank, setGameRank] = useState("all");
    const [gameIndex, setGameIndex] = useState(0);

    const [page, setPage] = useState(1);

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
        // getFilteredGames()
    }, [])

    useEffect(() => {
        getUserGames();
    }, [loading])

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
        getGameSummary(userGames);
        setLoading(false);

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

        getFilteredGames()
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
    }, [regCount])

    useEffect(() => {
        getFilteredGames();
    }, [page])

    // useEffect(() => {
    //     if (matchArr !== undefined) {
    //         getGameSummary(matchArr);
    //         getGameDate(matchArr);
    //     } else {
    //         getGameSummary(phase3Arr);
    //         getGameDate(phase3Arr);
    //     }
    // }, [search])

    // useEffect(() => {
    //     getGameSummary(phase3Arr);
    //     getGameDate(phase3Arr);
    // }, [gameType, gameState, sortDirection, sortFocus])
    
    useEffect(() => {
        if (showModal && gameDate) {
            document.getElementById("gameslist-game__date").valueAsDate = gameDate;
        }
    }, [gameDate])

    useEffect(() => {
        console.log(gameRank);
    }, [gameRank])

    useEffect(() => {
        if (showModal) {
            document.addEventListener("click", function (e) {
                if (e.target.classList) {
                    // setShowModal(false);
                }
            })
        }
    }, [showModal])

    useEffect(() => {
        if (!showDiscover) {
            getUserGames();
            setPage(page + 1);
            setPage(1);
        }
    }, [showDiscover])

    function organizeGameData (gameTypeArr, gameStatus, counter, setCount) {
        gameTypeArr.map(game => {
            if (game.rank === gameStatus) {
                counter++;
            }
            setCount(counter);
        })
    }

    function handleClose () {
        setShowModal(false);
        dispatch(setShowDiscover(false));
    }

    function notifyUpdate (gameTitle) {
        if (userGames[gameIndex].name === gameName && userGames[gameIndex].summary === gameSummary && new Date(userGames[gameIndex].date_added).toDateString() === gameDate.toDateString() && userGames[gameIndex].rank === gameRank) {
            console.log("usergame rank: ", userGames[gameIndex].rank);
            console.log("gameRank: ", gameRank);
            toast(`${gameTitle} details did not change`, {
                autoClose: 1000,
                position: "top-center",
                onClose: () => {
                    // window.location.reload();
                }
            });
        } else {
            toast(`${gameTitle} has been updated`, {
                autoClose: 1000,
                position: "top-center",
                onClose: () => {
                    window.location.reload();
                }
            });
        }
    }

    function notifyDelete(gameTitle) {
        toast(`${gameTitle} has been deleted`, {
            position: "top-center",
            autoClose: 1000,
            onClose: () => {
                setPage(page + 1);
                setPage(page - 1);
                // setShowDelete(false);
                // setShowModal(false);
                // setShowGame(false);
                // window.location.reload();
            }
        });
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

        // renderGames(phase3Arr);
    }

    async function updateGame (name, summary, gameDate, rank, rating) {
        console.log("rank: ", rank);
        let config = {
            method: "put",
            url: `${backendURL}/updategame`,
            data: {
                twitchName: twitchName,
                games: {
                    name: name,
                    summary: summary,
                    date_added: gameDate,
                    rank: rank,
                    rating: rating
                }
            }
        }

        axios(config)
            .then(result => {
                // setGameName(prevGame => gameName);
                console.log("update game result: ", result);
            })
            .catch(error => {
                console.log("update summary error: ", error);
            })
    }

    function deleteGame (gameName) {
        console.log("deleting game");
        findGame(gameName);
        const deleteTarget = findGame(gameName);
        setUserGames(userGames.filter(prevGame => prevGame.name !== gameName));
        setShowDelete(false);
        console.log("deleteTarget: ", deleteTarget);
        console.log("delete userGames: ", userGames);
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
                    console.log("delete response: ", response);
                }).catch(err => {
                    console.error("Failed to delete: ", err.message);
                })
    }

    function findGame (gameName) {
        return userGames.find(obj => obj.name === gameName);
    }

    async function getUserGames() {
        twitchId = window.localStorage.getItem("twitchId");
        setLoading(true);
        await axios(`${backendURL}/games`, {
            method: "get",
            params: {
                twitchName: twitchName
            }
        }).then(result => {
            if (result.data.response === null) {
                console.log("no games: ", result);
            } else {
                setUserGames(result.data.response.games);
            }
        }).catch(err => {
            console.error("Failed to get Games: ", err.message);
        }).finally(end => {
            setLoading(false);
        })
    }

    async function getFilteredGames () {
        twitchId = window.localStorage.getItem("twitchId");
        // setLoading(true);
        await axios(`${backendURL}/filter`, {
            method: "get",
            params: {
                twitchName: twitchName,
                search: search,
                rank: gameState,
                gameType: gameType,
                sortFocus: sortFocus,
                sortDirection: sortDirection,
                page: page
            }
        }).then(result => {
            if (result.data.response === null) {
                console.log("no games: ", result);
            } else {
                // setUserGames(result.data.response.games);
                console.log("filteredGames: ", result.data.paginatedGames);
                setFilteredGames(result.data.paginatedGames);
                setLastPage(result.data.lastPage);
            }
        }).then(games => {
            console.log("games: ", filteredGames);
            renderGames(filteredGames);
        }).catch(err => {
            console.error("Failed to get Games: ", err.message);
        }).finally(end => {
            // setLoading(false);
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
            console.log("no renderGames");
            gamesList = <h2 className="gameslist-game__no-results">No Games Found in this Category</h2>;
        } else {
            console.log("renderGames found: ", games);
            gamesList = games.map((game, i) => {
                let formattedDate = new Date(game.date_added);
                let month = parseInt(formattedDate.getMonth() + 1);
                let day = parseInt(formattedDate.getDate());

                if ((month === 4 || month === 5 || month === 9 || month === 11) && day > 30) {
                    day = "1";
                } else if ((month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) && day > 31) {
                    day = "1";
                    month++;
                } else if (month === 2 && day > 28 ) {
                    day = "1";
                    month++;
                } else {
                    day = formattedDate.getDate();
                }
                let year = formattedDate.getFullYear();
                return <Col xl={4} lg={4} sm={6} xs={12}>
                    <div class="gameslist-game__bg-blur">

                    </div>
                            <Row className="gameslist-game d-flex flex-column me-2">
                            <Image className="gameslist-game__img align-self-center" src={game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url} rounded
                                        onClick={() => {
                                            setShowModal(true);
                                            setGameName(game.name); 
                                            setGameImg(game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url);
                                            setGameSummary(game.summary);
                                            setGameRating(game.rating);
                                            setGameDate(new Date(game.date_added));
                                            setGameRank(game.rank);
                                            setGameIndex(i);
                                        }}
                                    />
                                <h2 className="gameslist-game__title mx-auto">{game.name.toUpperCase()}</h2>
                                <div className="gameslist__game-info-flex">
                                    <div className="gameslist-game__date-container flex-column justify-content-around">
                                        <label>Date:</label>
                                        <p className="gameslist-game__detail">{`${month}/${day}/${year}`}</p>
                                    </div>
                                    <div className="gameslist-game__status flex-column justify-content-around">
                                        <label>Game Status</label>
                                        <p className="gameslist-game__detail">{(game.rank).toUpperCase()}</p>
                                    </div>
                                    <div className="gameslist-game__rating flex-column justify-content-around">
                                        <label>Rating: </label>
                                        <p className={`user-game__rating__num gameslist-game__detail ${game.rating > 0 && game.rating <= 3 ? "user-game__rating__red" : game.rating >= 5 && game.rating < 8 ? "user-game__rating__yellow" : game.rating >= 8 && game.rating <= 10 ? "user-game__rating__green" : ""}`}>{game.rating === 0 ? "-" : game.rating}</p>
                                    </div>
                                </div>

                                {/* <Form.Control as="textarea" className="gameslist-game__summary" placeholder="Let your viewers know how you felt about this game"/> */}
                                <div className="gameslist-btn-container">
                                    {/* <p className="gameslist-game__add-btn" onClick={(e) => {
                                        updateSummary(game.name, document.getElementsByClassName("gameslist-game__summary")[i].value, document.getElementsByClassName("gameslist-game__date")[i].value, document.getElementsByClassName("gameslist-game__rank")[i].value, document.getElementsByClassName("gameslist-game__rating__num")[i].value);
                                        notifyUpdate(game.name);
                                        }}>Update</p> */}
                                        {/* <p className="gameslist-game__add-btn" onClick={() => {
                                            setShowModal(true);
                                            setGameName(game.name); 
                                            setGameImg(game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url);
                                            setGameSummary(game.summary);
                                            setGameRating(game.rating);
                                            setGameDate(new Date(game.date_added));
                                            setGameRank(game.rank);
                                            setGameIndex(i);
                                        }}>Edit</p> */}
                                    {/* <p className="gameslist-game__add-btn" onClick={() => {
                                        deleteGame(game.name);
                                        setTimeout(function () {
                                            window.location.reload();
                                        }, 390)
                                    }}>Delete</p> */}
                                </div>
                            </Row>
                        </Col>
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
        // renderGames(matchArr);
    }

    if (filteredGames.length > 0) {
        renderGames(filteredGames);
    } 

    return (
        <div className='gameslist-parent'>
            <ToastContainer />
            <div className="gameslist-games-container">
                <div className="gameslist-games__filters">
                    <Button
                        className="gameslist-game__add-btn" 
                        onClick={() => dispatch(setShowDiscover(true))}>Add Game</Button>
                        <div className="gameslist-game__filter-container">
                            {/* <p className="gameslist-game__filter-label">State</p> */}
                            <Dropdown 
                                className="gameslist-game__filter-btn"
                                as={ButtonGroup}>
                                <Button className="gameslist-game__filter-dropdown-btn" variant="success">{gameState.toUpperCase() === "ALL" ? "STATE" : gameState.toUpperCase()}</Button>

                                <Dropdown.Toggle 
                                    split variant="success" 
                                    className="dropdown-split"
                                    id="dropdown-split-basic" />

                                <Dropdown.Menu >
                                    <Dropdown.Item><option disabled selected>Select Game State</option></Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                        setGameState("all");
                                    }}><option value="all">Show All Games</option></Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                        setGameState("playing");
                                    }}><option value="playing">Playing</option></Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                        setGameState("upcoming");
                                    }}><option value="upcoming">Upcoming</option></Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                        setGameState("completed");
                                    }}><option value="completed">Completed</option></Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                        setGameState("dropped");
                                    }} 
                                    ><option value="dropped">Dropped</option></Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <div className="gameslist-game__filter-container">
                        {/* <p className="gameslist-game__filter-label">Type</p> */}
                        <Dropdown 
                            className="gameslist-game__filter-btn"
                            as={ButtonGroup}>
                            <Button className="gameslist-game__filter-dropdown-btn" variant="success">{gameType.toUpperCase() === "ALL" ? "FILTER" : gameType.toUpperCase()}</Button>

                            <Dropdown.Toggle 
                                split variant="success" 
                                className="dropdown-split"
                                id="dropdown-split-basic-gametype" />

                            <Dropdown.Menu >
                                <Dropdown.Item><option disabled selected>Select Game Type</option></Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setGameType("all");
                                }}><option value="all">All</option></Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setGameType("regular");
                                }}><option value="regular">Regular</option></Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setGameType("custom");
                                }}><option value="custom">Custom</option></Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setGameType("other");
                                }}><option value="other">Other</option></Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setGameType("mario");
                                }} 
                                ><option value="mario">Mario</option></Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setGameType("pokemon");
                                }} 
                                ><option value="pokemon">Pokemon</option></Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setGameType("minecraft");
                                }} 
                                ><option value="minecraft">Minecraft</option></Dropdown.Item>
                            </Dropdown.Menu>
                            
                        </Dropdown>
                        </div>

                    <div className="gameslist-game__filter-container">
                    {/* <p className="gameslist-game__filter-label">Sort By</p> */}
                    <Dropdown 
                        className="gameslist-game__filter-btn gameslist-game__filter__sort-btn "
                        as={ButtonGroup}>
                        <Button className="gameslist-game__filter-dropdown-btn" variant="success">{sortFocus.toUpperCase() === "ALPHA" ? "SORT BY" : sortFocus.toUpperCase()}</Button>

                        <Dropdown.Toggle 
                            split variant="success" 
                            className="dropdown-split"
                            id="dropdown-split-basic-sort-dir" />

                        <Dropdown.Menu >
                            <Dropdown.Item><option disabled selected>Select Game State</option></Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setSortFocus("alpha");
                            }}>Alphabetical</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setSortFocus("date");
                            }}>Date</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setSortFocus("rating");
                            }}>Rating</Dropdown.Item>
                        </Dropdown.Menu>
                        
                    </Dropdown>
                    </div>
                    
                    <div className="gameslist-game__filter-container">
                    {/* <p className="gameslist-game__filter-label">Order</p> */}
                        <div>
                            {sortDirection === "ascending" && <Image 
                                src={upArrow}
                                alt="ascending arrow"
                                className="gameslist-game__filter__sort-arrow"
                                onClick={() => {
                                    setSortDirection("descending");
                                }}
                            />}
                            {sortDirection === "descending" && <Image 
                                src={downArrow}
                                alt="descending arrow"
                                className="gameslist-game__filter__sort-arrow"
                                onClick={() => {
                                    setSortDirection("ascending");
                                }}
                            />}
                        </div>
                    </div>
                    <div className="gameslist-game__filter-container filter-container__search">
                        {/* <p className="gameslist-game__filter-label">Search</p> */}
                        <Form 
                            className="gameslist-games__search-container"
                            onSubmit={(e) => {
                                e.preventDefault();
                                getFilteredGames();
                            }}
                            >
                            <Form.Control 
                                id="gameslist-games__search"
                                type="text" 
                                placeholder="Search"
                                onChange={(e) => {
                                setSearch(e.target.value);
                            }}/>
                        <Button 
                            className='btn btn-primary gameslist-game__filter-btn gameslist-game__submit'
                            onClick={(e) => {
                                e.preventDefault();
                                getFilteredGames();
                                setPage(1);
                            }}>
                            <img src={searchIcon} alt="search magnifying glass" onClick={() => getFilteredGames()}/>
                        </Button>
                        </Form>
                    </div>
                    {<GameData 
                            gamesObj={gamesObj}
                        />}
                </div>
                            <Container>
                                <Row>
                                <Col>
                                </Col>
                                <Modal 
                                        id="gameslist-game__info"
                                        show={showModal}
                                        backdrop={true}
                                        onHide={() => {
                                            handleClose();
                                        }}>
                                    <Modal.Header className="ml-auto border-bottom-0">
                                        <Modal.Title>
                                            {gameName}
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Image 
                                            className="gameslist__game-img"
                                            src={gameImg}
                                        />
                                        <div className="d-flex justify-content-around mt-3 mb-3">
                                            <Form.Control type="date" id="gameslist-game__date" name="date-added" onChange={(e) => {
                                                setGameDate(new Date(e.target.value));
                                            }}></Form.Control>
                                            <Form.Select className="search-game__status gameslist-game__status" onChange={(e) => {
                                                setGameRank(e.target.value);
                                            }}>
                                            <option selected={gameRank === "playing" ? true : false} value="playing">Playing</option>
                                            <option  selected={gameRank === "upcoming" ? true : false} value="upcoming">Upcoming</option>
                                            <option  selected={gameRank === "completed" ? true : false}value="completed">Completed</option>
                                            <option selected={gameRank === "dropped" ? true : false} value="dropped">Dropped</option>
                                            </Form.Select>
                                            <Form.Select className="gameslist-game__rating__num" onChange={(e) => {
                                                setGameRating(e.target.value);
                                            }}>
                                                <option selected={gameRating === 10 ? true : false} value="10">10</option>
                                                <option selected={gameRating === 9 ? true : false} value="9">9</option>
                                                <option selected={gameRating === 8 ? true : false} value="8">8</option>
                                                <option selected={gameRating === 7 ? true : false} value="7">7</option>
                                                <option selected={gameRating === 6 ? true : false} value="6">6</option>
                                                <option selected={gameRating === 5 ? true : false} value="5">5</option>
                                                <option selected={gameRating === 4 ? true : false} value="4">4</option>
                                                <option selected={gameRating === 3 ? true : false} value="3">3</option>
                                                <option selected={gameRating === 2 ? true : false} value="2">2</option>
                                                <option selected={gameRating === 1 ? true : false} value="1">1</option>
                                                <option selected={gameRating === 0 ? true : false} value="0">-</option>
                                            </Form.Select>
                                        </div>
                                        <textarea className="gameslist-game-summary" onChange={(e) => {
                                            setGameSummary(e.target.value);
                                        }}>{gameSummary}</textarea>
                                    </Modal.Body>
                                    <Modal.Footer id="gameslist-game-flex-container">
                                        <p className="modal-btn text-center btn btn-danger delete-game__btn" onClick={() => setShowDelete(true)}>Delete</p>
                                        <Button 
                                            variant="light"
                                            className="modal-btn" 
                                            onClick={() => {
                                            if (userGames[gameIndex].name !== gameName || userGames[gameIndex].summary !== gameSummary || new Date(userGames[gameIndex].date_added).toDateString() !== gameDate.toDateString() || userGames[gameIndex].rank !== gameRank) {
                                                updateGame(gameName, gameSummary, gameDate, gameRank, gameRating);
                                            }
                                            setShowModal(false);
                                            notifyUpdate(gameName);
                                        }}>Save</Button>
                                        <Button 
                                            variant="light"
                                            className="modal-btn" 
                                            onClick={() => setShowModal(false)}>Cancel</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal id="discover" onHide={() => {
                                    handleClose();
                                }}show={showDiscover}>
                                    <Modal.Header className="text-center">
                                        <Modal.Title id="discover__title-flex">
                                            <h1>Discover</h1>
                                        </Modal.Title>
                                        {showGame && <Button
                                                        variant="light" 
                                                        onClick={() => {
                                                        dispatch(setShowGame(false));
                                                        dispatch(setShowSearch(true));
                                                    }}>Back</Button>}
                                    </Modal.Header>
                                    <Modal.Body>
                                        {showSearch && <Search />}
                                        {showGame && <AddGame />}
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button id="discover__close" variant="light" onClick={() => dispatch(setShowDiscover(false))}>Close</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal id="delete-game" show={showDelete}>
                                    <Modal.Header>
                                        <Modal.Title>
                                            <h1 className="delete-game__head">Delete</h1>
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p>Are you sure you want to delete {gameName}?</p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button 
                                            className='btn btn-danger delete-game__btn' onClick={() => {
                                            setShowDelete(false);
                                            setShowModal(false);
                                            deleteGame(gameName);
                                            notifyDelete(gameName);
                                        }}>Yes</Button>
                                        <Button onClick={() => setShowDelete(false)}>Close</Button>
                                    </Modal.Footer>
                                </Modal>
                            </Row> 
                        </Container>
                        {/* <div className="gameslist-games">
                            {gamesList}
                        </div> */}
                        <div className="gameslist-games">
                            {gamesList}
                            <div className="gameslist-results__pages">
                                <img className="gameslist-results__pages__nav" src={firstPage} alt="first gameslist page" onClick={() => {
                                    if (page > 1) {
                                        // notifyLoading();
                                        setPage(prevPage => parseInt(1));
                                    }
                                }} />
                                <img className="gameslist-results__pages__nav" src={leftArrow} alt="previous gameslist page" onClick={() => {
                                    if (page > 1) {
                                        // notifyLoading();
                                        setPage(prevPage => parseInt(prevPage - 1));
                                    }
                                }} />
                                <p className="gameslist-results__pages__num">{page}</p>
                                <img className="gameslist-results__pages__nav" src={rightArrow} alt="next gameslist page" onClick={() => {
                                    // notifyLoading();
                                    // dispatch(setImagesRendered(false));
                                    // setImagesRendered(false);
                                    // setImagesLoaded(0);
                                    // if (gamesFound) {
                                    //     setPage(prevPage => parseInt(prevPage + 1));
                                    // }
                                    if (page < lastPage) {
                                        setPage(prevPage => parseInt(prevPage + 1));
                                    }

                                }}/>
                                    <img className="gameslist-results__pages__nav" src={lastPageImg} alt="last gameslist page" onClick={() => {
                                        // notifyLoading();
                                        setPage(prevPage => parseInt(lastPage));
                                }} />
                            </div>
                        </div>
                    </div>
        </div>
    )
}