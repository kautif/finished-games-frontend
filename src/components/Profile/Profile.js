import React, { useEffect, useState } from "react";
import { setReportUser } from "../../redux/gamesSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Column from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import Image from "react-bootstrap/Image";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import leftArrow from "../../assets/arrow_left_purple.png";
import rightArrow from "../../assets/arrow_right_purple.png";
import searchIcon from "../../assets/search.png";
import firstPage from "../../assets/first.png";
import lastPageImg from "../../assets/last.png";
import upArrow from "../../assets/up-arrow.png";
import downArrow from "../../assets/down-arrow.png";

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
    const [filteredGames, setFilteredGames] = useState([]);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);

    const [title, setTitle] = useState("");
    const [gameSummary, setGameSummary] = useState("");
    const [gameImg, setGameImg] = useState("");
    const [gameDate, setGameDate] = useState("");
    const [gameRating, setGameRating] = useState("");
    const [gameRank, setGameRank] = useState("all");

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

       async function getFilteredGames () {
            let twitchName = document.baseURI.split("/")[3]
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
                    console.log("profile filteredGames: ", result.data.paginatedGames);
                    setFilteredGames(result.data.paginatedGames);
                    setLastPage(result.data.lastPage);
                }
            }).then(games => {
                console.log("profile games: ", filteredGames);
                renderGames(filteredGames);
            }).catch(err => {
                console.error("Failed to get Games: ", err.message);
            }).finally(end => {
                // setLoading(false);
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

        getFilteredGames();
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
        getFilteredGames();
    }, [page])

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
                return <Col xl={3} lg={4} sm={6} xs={12} className="mt-5 mb-5">
                    <Row className="user-game d-flex flex-column me-2">
                        <div class="user-game__bg-blur">

                        </div>
                        <Image className="user-game__img align-self-center mb-4"
                            src={game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url} rounded
                            onClick={() => {
                            setShowModal(true);
                            setTitle(game.name);
                            setGameSummary(game.summary);
                            setGameImg(game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url);
                            setGameRank(game.rank);
                            setGameRating(game.rating);
                            setGameDate(new Date(game.date_added).toDateString().substring(4));
                        }} />
                        <h2 className="user-game__title">{game.name.toUpperCase()}</h2>
                            {/* <Image src={game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url} rounded /> */}
                        <div className="user-game__date-flex">
                            <div className="user-game__date-container">
                                <p className="user-game__date__label">Date:</p>
                                <p className="user-game__date">{new Date(game.date_added).toDateString().substring(4)}</p>
                            </div>
                            <div className="user-game__status-container">
                                <p className="user-game__status__label">Game Status</p>
                                <p className="user-game__status">{game.rank.toUpperCase()}</p>
                            </div>
                            <div className="user-game__rating d-flex flex-column mb-0">
                                <p className="mb-0">Rating: </p>
                                <p className={`user-game__rating__num ${game.rating > 0 && game.rating <= 3 ? "user-game__rating__red" : game.rating >= 5 && game.rating < 8 ? "user-game__rating__yellow" : game.rating >= 8 && game.rating <= 10 ? "user-game__rating__green" : ""}`}>{game.rating === 0 ? "-" : game.rating}</p>    
                            </div>
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

    // filterOrSort();

    // if (search.length > 0 && phase3Arr.length > 0) {
    //     matchArr = [];
    //     phase3Arr.map(game => {
    //         if (game.name.toLowerCase().includes(search.toLowerCase())) {
    //             matchArr.push(game);
    //         }
    //     })
    //     renderGames(matchArr);
    // }

    if (filteredGames.length > 0) {
        renderGames(filteredGames);
    } 

    if (user === null) {
        return <div>
                <h1>Sorry that page doesn't exist (yet 😏)</h1>
                <h2>If you know this user on <a target="_blank" href={`https://www.twitch.tv${window.location.pathname}`}>Twitch</a>, follow them and ask them if they want to join: <a target="_blank" href={`https://www.twitch.tv${window.location.pathname}`}>https://www.twitch.tv{window.location.pathname}</a></h2>
            </div>
    } else {
        return (
            <div>
                <div className="profile-intro-flex">
                    <GameData 
                        gamesObj={gamesObj}
                    />
                    <div className="profile-intro-flex__user">
                        <div className="profile-intro-flex__user__name">
                            <img className="w-25" src={user.profileImageUrl} alt={user.twitch_default + "'s profile picture"}  />
                            <h1 className="align-self-end text-light text-uppercase">{user.twitch_default}</h1>
                        </div>
                        <div className="profile-intro__action float-start ml-5">
                            <p  className="text-light"
                                onClick={() => {
                                localStorage.setItem("reportUser", user.twitch_default);
                                window.location.pathname = "/report";
                            }}>Report User</p>
                            <Button
                                variant="light" 
                                className="share-profile-btn"
                                onClick={() => notifyShareProfile()}>Share Profile</Button>
                        </div>
                    </div>
                </div>
                <div className="user-game__filter-sorting mb-4 mt-4 mx-auto">
                    <div>
                        {/* <select onChange={(e) => {
                            setGameState(e.target.value);
                        }} className="user-games__filter">
                            <option disabled selected>Select Game State</option>
                            <option value="all">Show All Games</option>
                            <option value="playing">Playing</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                        </select> */}
                        {/* <h3 className="text-light">State</h3> */}
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
                    <div>
                        {/* <h3 className="text-light">Sort By</h3> */}
                        {/* <form>
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
                        </form> */}
                        <Dropdown 
                            className="gameslist-game__filter-btn gameslist-game__filter__sort-btn"
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
                    <div>
                        {/* <h3 className="text-light">Game Type</h3> */}
                        <Modal 
                            className=""
                            show={showModal}
                            backdrop={true}
                            onHide={() => {
                                handleClose();
                            }}>
                            <div className="user-game__modal-container">

                            <Modal.Header>
                                <Modal.Title className="text-center ml-auto">
                                    {title}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Image
                                    className="w-100 mb-3" 
                                    src={gameImg}
                                />
                                <div className="user-game__status-container__modal">
                                    <div className="user-game__detail-flex-item">
                                        <p>Date: </p>
                                        <p>{gameDate}</p>
                                    </div>
                                    <div className="user-game__detail-flex-item"> 
                                        <p>Game Status:</p>
                                        <p>{gameRank.toUpperCase()}</p>
                                    </div>
                                    <div className="user-game__detail-flex-item d-flex flex-column" >
                                        <p className="mb-0">Rating:</p>
                                        <p className={`user-game__rating__num ${gameRating > 0 && gameRating <= 3 ? "user-game__rating__red" : gameRating >= 5 && gameRating < 8 ? "user-game__rating__yellow" : gameRating >= 8 && gameRating <= 10 ? "user-game__rating__green" : ""}`}>{gameRating}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="profile-game__summary">{gameSummary}</p>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button 
                                    variant="light"
                                    className="btn btn-primary user-game__modal__close-btn"
                                    onClick={() => {
                                        setShowModal(false);
                                    }}
                                    >Close</Button>
                            </Modal.Footer>
                            </div>
                        </Modal>
                        {/* {showModal && 
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
                                        <div>
                                            <h2 className="user-game__modal__text">Comments</h2>
                                            <p className="user-game__modal__summary">{gameSummary}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>} */}
                        {/* <form>
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
                        </form> */}

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
                        {/* <h3 className="gameslist-game__filter-label">Order</h3> */}
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
                    {/* <form>
                        <h2>Search</h2>
                        <input id="gameslist-games__search" type="text" 
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}/>

                    </form> */}
                     <div className="w-25">
                        {/* <h3 className="text-light">Search</h3> */}
                        <Form 
                            className="w-100 user-game__search__form d-flex align-items-baseline justify-content-around"
                            onSubmit={(e) => {
                                e.preventDefault();
                                getFilteredGames();
                            }}>
                            <Form.Control  
                                type="text"
                                className="w-75 user-game__search"
                                placeholder="Submit search to filter or sort" 
                                onChange={(e) => {
                                setSearch(e.target.value);
                            }}/>
                        <Button
                            variant="light" 
                            className='btn btn-primary mt-4 user-game__sort gameslist-game__submit'
                            onClick={(e) => {
                                e.preventDefault();
                                getFilteredGames();
                                setPage(1);
                            }}>
                            <img    src={searchIcon} 
                                    alt="magnifying glass search icon"
                                    onClick={() => {
                                        getFilteredGames();
                                    }}/>
                        </Button>
                        </Form>
                    </div>
                </div>
                <Stack gap={3} direction="horizontal" id="profile-results-container" className="profile-results" onClick={() => {
                    if (showModal) {
                        setShowModal(false);
                    }
                }}>
                    {user.games !== undefined && 
                    gamesList
                    }
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
                </Stack>
                <ToastContainer 
                    style={{ width: "2000px" }}
                />
            </div>
        )
    }
}