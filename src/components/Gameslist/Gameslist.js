import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Search from '../Search/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { setShowGame, setShowSearch } from "../../redux/gamesSlice";

import './Gameslist.css';
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

    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    // const backendURL = "http://localhost:4000";
    let twitchId;
    let twitchName = window.localStorage.getItem("twitchName");
    const [userGames, setUserGames] = useState([]);
    const [loading, setLoading] = useState();
    let selectedGameTypeArr = [];
    const [gameType, setGameType] = useState("all");

    const [gameState, setGameState] = useState("all");
    
    const [showModal, setShowModal] = useState(false);
    const [showDiscover, setShowDiscover] = useState(false);

    const [gameName, setGameName] = useState("");
    const [gameImg, setGameImg] = useState("");
    const [gameSummary, setGameSummary] = useState("");
    const [gameRating, setGameRating] = useState(0);
    const [gameDate, setGameDate] = useState("");
    const [gameRank, setGameRank] = useState("");

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
        console.log("gamesObj: ", gamesObj);
    }, [gamesObj])

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
    
    useEffect(() => {
        if (showModal && gameDate) {
            document.getElementById("gameslist-game__date").valueAsDate = gameDate;
        }
    }, [gameDate])

    function organizeGameData (gameTypeArr, gameStatus, counter, setCount) {
        gameTypeArr.map(game => {
            if (game.rank === gameStatus) {
                counter++;
            }
            setCount(counter);
        })
    }

    function notifyUpdate (gameTitle) {
        toast(`${gameTitle} has been updated`, {
            autoClose: 1000,
            position: "top-center",
            onClose: () => {
                window.location.reload();
            }
        });
    }

    function notifyDelete(gameTitle) {
        toast(`${gameTitle} has been deleted`, {
            position: "top-center",
            autoClose: 1000,
            onClose: () => {
                window.location.reload();
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
        console.log("phase3Arr: ", phase3Arr);

        renderGames(phase3Arr);
    }

    async function updateGame (name, summary, gameDate, rank, rating) {
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
                console.log("found games: ", result.data.response.games);
            }
        }).catch(err => {
            console.error("Failed to get Games: ", err.message);
        }).finally(end => {
            setLoading(false);
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
                let formattedDate = new Date(game.date_added);
                let month = parseInt(formattedDate.getMonth() + 1);
                let day = parseInt(formattedDate.getDate() + 1);

                if ((month === 4 || month === 5 || month === 9 || month === 11) && day > 30) {
                    day = "1";
                } else if ((month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) && day > 31) {
                    day = "1";
                    month++;
                } else if (month === 2 && day > 28 ) {
                    day = "1";
                    month++;
                } else {
                    day = formattedDate.getDate() + 1;
                }
                let year = formattedDate.getFullYear();
                console.log("month: ", month);
                return <Col xl={3} lg={4} sm={6} xs={12}><Row className="gameslist-game d-flex flex-column me-2">
                                <h2 className="gameslist-game__title">{game.name}</h2>
                                <Image className="gameslist-game__img align-self-center" src={game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url} rounded />
                                <div className="gameslist__game-info-flex">
                                    <div className="gameslist-game__date-container flex-column justify-content-around">
                                        <label>Date:</label>
                                        {/* <input className="gameslist-game__date" type="date" name="date-added" /> */}
                                        {/* <Form.Control type="date" className="gameslist-game__date" name="date-added"></Form.Control> */}
                                        <p className="gameslist-game__detail">{`${month}/${day}/${year}`}</p>
                                    </div>
                                    <div className="gameslist-game__rating flex-column justify-content-around">
                                        <label>Rating: </label>
                                        {/* <Form.Select className="gameslist-game__rating__num">
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
                                        </Form.Select> */}
                                        {/* <p>{game.rating}</p> */}
                                        <p className={`user-game__rating__num gameslist-game__detail ${game.rating > 0 && game.rating <= 3 ? "user-game__rating__red" : game.rating >= 5 && game.rating < 8 ? "user-game__rating__yellow" : game.rating >= 8 && game.rating <= 10 ? "user-game__rating__green" : ""}`}>{game.rating === 0 ? "-" : game.rating}</p>
                                    </div>
                                    <div className="gameslist-game__status flex-column justify-content-around my-4">
                                        <label>Game Status</label>
                                        {/* <Form.Select className="gameslist-game__rank">
                                            <option selected={game.rank === "playing" ? true : false} value="playing">Playing</option>
                                            <option selected={game.rank === "upcoming" ? true : false} value="upcoming">Upcoming</option>
                                            <option selected={game.rank === "completed" ? true : false} value="completed">Completed</option>
                                            <option selected={game.rank === "dropped" ? true : false} value="dropped">Dropped</option>
                                        </Form.Select> */}
                                        <p className="gameslist-game__detail">{(game.rank).toUpperCase()}</p>
                                    </div>
                                </div>

                                {/* <Form.Control as="textarea" className="gameslist-game__summary" placeholder="Let your viewers know how you felt about this game"/> */}
                                <div className="gameslist-btn-container">
                                    {/* <p className="gameslist-game__add-btn" onClick={(e) => {
                                        updateSummary(game.name, document.getElementsByClassName("gameslist-game__summary")[i].value, document.getElementsByClassName("gameslist-game__date")[i].value, document.getElementsByClassName("gameslist-game__rank")[i].value, document.getElementsByClassName("gameslist-game__rating__num")[i].value);
                                        notifyUpdate(game.name);
                                        }}>Update</p> */}
                                        <p className="gameslist-game__add-btn" onClick={() => {
                                            setShowModal(true);
                                            setGameName(game.name); 
                                            setGameImg(game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url);
                                            setGameSummary(game.summary);
                                            setGameRating(game.rating);
                                            setGameDate(new Date(game.date_added));
                                            setGameRank(game.rank);
                                        }}>Edit</p>
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
        renderGames(matchArr);
    }

    return (
        <div className="gameslist-games-container">
            {<GameData 
                gamesObj={gamesObj}
            />}
            <Container>
                <Button onClick={() => setShowDiscover(true)}>Discover</Button>
                <Row>
                    <Col lg={3} sm={6} xs={12}>
                        <h2>Filter Games</h2>
                        <Form.Select onChange={(e) => {
                            setGameState(e.target.value);
                        }} className="gameslist-games__filter w-33 mx-auto">
                            <option disabled selected>Select Game State</option>
                            <option value="all">Show All Games</option>
                            <option value="playing">Playing</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                        </Form.Select>
                    </Col>
                    <Col lg={3} sm={6} xs={12}>
                        <h2>Game Type</h2>
                        <Form className="w-33 mx-auto">
                            <Form.Select onChange={(e) => {
                                setGameType(e.target.value);
                            }}>
                                <option value="all">All</option>
                                <option value="regular">Regular</option>
                                <option value="custom">All Custom</option>
                                <option value="other">Other</option>
                                <option value="mario">Super Mario</option>
                                <option value="pokemon">Pokemon</option>
                                <option value="minecraft">Minecraft Mod</option>
                            </Form.Select>
                        </Form>
                    </Col>
                    <Col lg={3} sm={6} xs={12}>
                        <h2>Sorting</h2>
                        <Form>
                            <Form.Select id="sort-direction" onChange={(e) => {
                                setSortDirection(e.target.value);
                            }}>
                                <option value="ascending">Ascending</option>
                                <option value="descending">Descending</option>
                            </Form.Select>
                            <Form.Select id="sort-focus" onChange={(e) => {
                                setSortFocus(e.target.value);
                            }}>
                                <option value="alpha">Alphabetical</option>
                                <option value="date">Date</option>
                                <option value="rating">Rating</option>
                            </Form.Select>
                        </Form>
                    </Col>
                    <Col lg={3} sm={6} xs={12}>
                        <Form className="w-33 mx-auto">
                        <h2>Search</h2>
                        <Form.Control id="gameslist-games__search" type="text" onChange={(e) => {
                            setSearch(e.target.value);
                        }}/>
                        </Form>
                    </Col>
                    <Modal show={showModal}>
                        <Modal.Header>
                            <Modal.Title>
                                 {gameName}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Image 
                                className="gameslist__game-img"
                                src={gameImg}
                            />
                            <Form.Control type="date" id="gameslist-game__date" name="date-added" onChange={(e) => {
                                setGameDate(new Date(e.target.value));
                            }}></Form.Control>
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
                            <textarea className="gameslist-game-summary" onChange={(e) => {
                                setGameSummary(e.target.value);
                            }}>{gameSummary}</textarea>
                        </Modal.Body>
                        <Modal.Footer id="gameslist-game-flex-container">
                            <p className="gameslist-game__add-btn modal-btn text-center" onClick={() => {
                                        deleteGame(gameName);
                                        notifyDelete(gameName);
                                    }}>Delete</p>
                            <Button className="modal-btn" onClick={() => {
                                updateGame(gameName, gameSummary, gameDate, gameRank, gameRating)
                                setShowModal(false);
                                notifyUpdate(gameName);
                            }}>Save</Button>
                            <Button className="modal-btn" onClick={() => setShowModal(false)}>Cancel</Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal id="discover" show={showDiscover}>
                        <Modal.Header>
                            <Modal.Title id="discover__title-flex">
                                <h1>Discover</h1>
                                {showGame && <Button onClick={() => {
                                    dispatch(setShowGame(false));
                                    dispatch(setShowSearch(true));
                                }}>Back</Button>}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {showSearch && <Search />}
                            {showGame && <AddGame />}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => setShowDiscover(false)}>Close</Button>
                        </Modal.Footer>
                    </Modal>


                    <ToastContainer />
                </Row>
            </Container>
            {/* <div className="gameslist-games">
                {gamesList}
            </div> */}
            <Container className="gameslist-games">
                {gamesList}
            </Container>
        </div>
    )
}