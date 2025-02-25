import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "react-bootstrap/Image";
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

import Custom from "../Custom/Custom";
import AddGame from "../AddGame/AddGame";
import "./Search.css";
import { setUserGames, setSearchGameName, setSearchGameImg, setShowGame, setShowSearch } from "../../redux/gamesSlice";
import smwCart from "../../assets/vh_smw_cart.webp";
import mcCart from "../../assets/vh_minecraft_cart.webp";
import pokemonCart from "../../assets/vh_pokemon_cart.webp";
import otherCart from "../../assets/vh_other_cart.webp";
import leftArrow from "../../assets/arrow.png";
import rightArrow from "../../assets/right-arrow.png";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import DatePicker from "react-datepicker";

export default function Search () {
    const dispatch = useDispatch();
    let userGames = useSelector((state) => state.gamesReducer.userGames);
    let lastSearch = useSelector((state) => state.gamesReducer.lastSearch);
    let lastPage = useSelector((state) => state.gamesReducer.lastPage);
    let searchGameName = useSelector((state) => state.gamesReducer.searchGameName);
    let searchGameImg = useSelector((state) => state.gamesReducer.searchGameImg);

    const [search, setSearch] = useState("");
  
    const [gameType, setGameType] = useState("regular");
    const [customGame, setCustomGame] = useState("other");
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [page, setPage] = useState(1);
    const [newSearch, setNewSearch] = useState(true);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [gamesFound, setGamesFound] = useState(false);
    const [rank, setRank] = useState("");
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [gameStatus, setGameStatus] = useState("playing");
    const [summary, setSummary] = useState("");
    const [customGameMsg, setCustomGameMsg] = useState("");
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    // const backendURL = "http://localhost:4000";

    let twitchId;
    let twitchName;
    twitchId = window.localStorage.getItem("twitchId");
    twitchName = window.localStorage.getItem("twitchName");

    function notifyCustom (gameTitle) {
        toast(`${gameTitle} has been added`, {
            position: "top-center",
            autoClose: 1000,
            onClose: () => {
                window.location.reload();
            }
        });
    }

    function notifyLoading () {
        toast(`Page loading`, {
            position: "top-center",
            autoClose: 1000
        });
    }

    function notifyYears () {
        toast(`Year must between 1970 and ${year + 10}`, {
            position: "top-center",
            autoClose: 3000
        });
    }

    function reqGames () {
        axios({
        url: `https://api.rawg.io/api/games?search=${search}&page=${page}&key=${process.env.REACT_APP_RAWG_API}`,
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
        }).then(response => {
            console.log("responde code: ", response.status);
            let filteredGames = [];
            let tagsList = [];
            if (response.status === 200) {
                setGamesFound(true);
                for (let i = 0; i < response.data.results.length; i++) {
                    for (let k = 0; k < response.data.results[i].tags.length; k++) {
                        console.log("slugs: ", response.data.results[i].tags[k].slug);
                        tagsList.push(response.data.results[i].tags[k].slug);
                    }
                    console.log("next game");
                    if (tagsList.includes("nudity") || tagsList.includes("sex") || tagsList.includes("hentai") || tagsList.includes("sexual-content") || tagsList.includes("toon-sex")) {
                        console.log("nudity found");
                    } else {
                        filteredGames.push(response.data.results[i]);
                    }
                    tagsList = [];
                }
                console.log("filteredGames: ", filteredGames);
                setGames(filteredGames);
            }
            // setGames(response.data.results);
        }).catch((error) => {
            console.log("no games found");
            console.error("error: ", error.response);
            console.log("no games found");
            setGamesFound(false);
            setGames([]);

        })

    }

    function getGames (e) {
        e.preventDefault();
        reqGames();
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

    function addGame (gameName, gameImg, gameSummary, gameStatus,
                        gameDate, index, gameRating, customGame) {
        twitchId = window.localStorage.getItem("twitchId");
        twitchName = window.localStorage.getItem("twitchName");
        // getDate(gameDate, index);
        let gameObj = {
            name: gameName,
            custom_game: customGame,
            img_url: customGame.length === 0 ? gameImg : "",
            summary: gameSummary,
            date_added: selectedDate,
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
                setTitle("");
                setRating(0);
                setGameStatus("playing");
                setSummary("");
                // defaultDate(document.getElementsByClassName("custom-game__date"), 0);
            })
            .catch((error) => {
                console.log("addGame error: ", error);
            })
    }

    function defaultDate (gameDate, index) {
        gameDate[index].valueAsDate = new Date();
        const newDate = new Date(gameDate[index].value);
        setSelectedDate(prevDate => newDate);
    }

    let retrievedGames;

    useEffect(() => {
        twitchId = window.localStorage.getItem("twitchId");
        getUserGames();
        // retrievedGames.map((game, i) => {
            // defaultDate(document.getElementsByClassName("search-game__date"), i);
            // getRating(i);
        // })
    }, [games])

    useEffect(() => {
        if (!gamesFound) {
            setGames([])
        }
    }, [gamesFound])

    useEffect(() => {
        if (gameType === "custom") {
            // defaultDate(document.getElementsByClassName("custom-game__date"), 0);
            // document.getElementsByClassName("custom-game__date")[0].valueAsDate = new Date();
        } else {
            reqGames();
            // retrievedGames.map((game, i) => {
                // defaultDate(document.getElementsByClassName("search-game__date"), i);
            // })
        }

    }, [gameType])

    let day;
    let month;
    let year;

    useEffect(() => {
        if (selectedDate) {
            day = new Date().getDate();
            month = new Date().getMonth();
            year = new Date().getFullYear();
        }
    }, [selectedDate])

    useEffect(() => {
        // notifyLoading();
        reqGames();
        document.querySelector('#discover__title-flex').scrollIntoView({
            behavior: 'smooth'
        });
    }, [page])

    let userGameNames = [];
    let gameNames = [];
    userGames.map(userGame => {
        userGameNames.push(userGame.name);
    })


    games.map(game => {
        gameNames.push(game.name);
    })

    if (gamesFound) {
        retrievedGames = games.map((game, i) => {
            console.log("game: ", game);
            // let noNudity = game.tags.filter(tag => tag.slug !== "nudity");
            // console.log("no nudity: ", noNudity);
                return <Col xl={3} 
                lg={4} 
                sm={6} 
                xs={12}
                key={i}>
                    <Row className="search-game">
                        <h2 className="search-game__name text-center">{game.name}</h2>
                        <img src={game.background_image === null ? otherCart : game.background_image} alt={game.name + " image"} />
        {userGameNames.includes(game.name) ? <p className="search-result__added text-center">Added</p> : <p className="search-result__add-btn text-center" onClick={() => {
                        dispatch(setSearchGameName(game.name));
                        dispatch(setSearchGameImg(game.background_image !== null ? game.background_image : otherCart));
                        dispatch(setShowSearch(false));
                        dispatch(setShowGame(true));
                    }}>Add Game</p>}
                    </Row>
                </Col>    
        })
    }

    // retrievedGames = games.map((game, i) => {        
    //         if (!game.tags[k].slug !== "nudity") {
    //             console.log("nudity: ", game.tags[k]);
    //             return <Col xl={3} 
    //             lg={4} 
    //             sm={6} 
    //             xs={12}
    //             key={i}
    //             >
    //                 <Row className="search-game">
    //                     <h2 className="search-game__name text-center">{game.name}</h2>
    //                     <img src={game.background_image === null ? otherCart : game.background_image} alt={game.name + " image"} />
    //     {userGameNames.includes(game.name) ? <p className="search-result__added text-center">Added</p> : <p className="search-result__add-btn text-center" onClick={() => {
    //                     dispatch(setSearchGameName(game.name));
    //                     dispatch(setSearchGameImg(game.background_image !== null ? game.background_image : otherCart));
    //                     dispatch(setShowSearch(false));
    //                     dispatch(setShowGame(true));
    //                 }}>Add Game</p>}
    //                 </Row>
    //             </Col>
    //         }
        
    // })

    return (
        <div>
            <form id="search-form">
                <select id="search-game__type" onChange={(e) => {
                    setGameType(prevGameType => e.target.value);
                }}>
                    <option value="regular" selected>Regular</option>
                    <option value="custom">Custom</option>
                </select>
                {gameType === "regular" ? 
                <div>
                    <input className="search" placeholder="Search games" 
                        onChange={(e) => {
                                setSearch(prevSearch => e.target.value);
                            }}
                            value={search}/>
                    <button onClick={(e) => {
                        setPage(1);
                        getGames(e);
                        }}>Submit</button>
                </div> : ""}
            </form>
            {gameType === "custom" ? 
            <div className="custom-game-container">
                <form>
                    <div className="custom-game__field" id="custom-game__game-type">
                        <label>Game Type</label>
                        <Form.Select onChange={(e) => {
                            setCustomGame(prevGame => e.target.value);
                        }}>
                            <option value="other">Other</option>
                            <option value="mario">Super Mario</option>
                            <option value="pokemon">Pokemon</option>
                            <option value="minecraft">Minecraft Mod</option>
                        </Form.Select>
                    </div>
                    <img src={customGame === "mario" ? smwCart : customGame === "pokemon" ? pokemonCart : customGame === "minecraft" ? mcCart : otherCart} />
                    <Form.Control className="custom-game__field custom-game__field__text" id="custom-game__title" type="text" value={title} placeholder="Title can't be empty" onChange={(e) => {
                        setTitle(e.target.value);
                    }}/>
                    <div className="custom-game__field">
                        <label>Date:</label>
                        {/* <Form.Control className="custom-game__date" type="date" name="date-added" selected={date} onChange={(e) => {
                            setDate(prevDate => e.target.value);
                            if (date.getFullYear() < 1970 || date.getFullYear() > year + 10) {
                                // setSelectedDate(new Date());
                                // notifyYears();
                                console.log("custom date is out of scope");
                            }
                        }}/> */}
                        <DatePicker 
                            selected={selectedDate}
                            onChange={(e) => {
                                console.log(e.getDate());
                                console.log(e.getMonth());
                                console.log(e.getFullYear());

                                setSelectedDate(`${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`);

                                if (e.getFullYear() < 1970 || e.getFullYear() > year + 10) {
                                    setSelectedDate(new Date());
                                    notifyYears();
                                }
                            }}
                            dateFormat="yyyy-MM-dd"
                            showYearDropdown
                        />
                    </div>
                <div className="custom-game__field custom-game__rating">
                    <label>Rating: </label>
                    <Form.Select id="custom-game__rating__num" value={rating} onChange={(e) => {
                        setRating(e.target.value);
                    }}>
                        <option value="10">10</option>
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
                    </Form.Select>    
                </div>
                <div className="custom-game__field custom-game__status">
                    <label>Game Status</label>
                    <Form.Select id="custom-game__status" value={gameStatus} onChange={(e) => {
                        setGameStatus(e.target.value);
                    }}>
                        <option selected="selected" value="playing">Playing</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="dropped">Dropped</option>
                    </Form.Select>
                </div>
                <textarea id="custom-game__summary" className="custom-game__field" placeholder="Let your viewers know how you felt about this game" value={summary} onChange={(e) => {
                    setSummary(e.target.value);
                }}></textarea>
                {/* {userGameNames.includes(game.name) ? <p className="search-result__added">Added</p> : <p className="search-result__add-btn" onClick={(e) => addGame(game.name, game.background_image, e.target.previousElementSibling.value, e.target.previousElementSibling.previousElementSibling.children[1].value, i)}>Add Game</p>} */}
                <p className="custom-game__add-btn text-center" onClick={() => {
                    let customGameTitle = document.getElementById("custom-game__title").value;
                    let customSummary = document.getElementById("custom-game__summary").value;
                    let customStatus = document.getElementById("custom-game__status").value;
                    // let customDate = document.getElementsByClassName("custom-game__date")[0].value;
                    let customRating = document.getElementById("custom-game__rating__num").value;
                    let titleField = document.getElementsByClassName('custom-game__field__text')[0];
                    // const hasInvalidCharacters = /[^a-zA-Z0-9 &!]/.test(titleField.value);
                    if (customGameTitle !== "") {
                            addGame(title, "", summary, gameStatus, selectedDate, 0, rating, customGame);
                            // document.getElementById("custom-game__title").value = "";
                            // document.getElementById("custom-game__summary").value = "";
                            // document.getElementById("custom-game__status").value = "playing";
                            // defaultDate(document.getElementsByClassName("custom-game__date"), 0);
                            notifyCustom(customGameTitle);
                            // document.getElementById("custom-game__rating__num").value = "10";
                    } else {
                        setCustomGameMsg("Game title can't be empty");
                    }
                }}>Add Game</p>
                <div id="custom-game__notif-container">
                    <p id="custom-game__notif__msg">{customGameMsg}</p>
                </div>
                </form>
                <ToastContainer />
            </div> 
            : ""}
            <div className="search-results">
                <Container className="d-flex flex-wrap">
                    {gameType === "regular" && games.length > 0 ? retrievedGames : ""}
                    {games.length === 0 && page === 1 ? "LOADING" : ""}
                    {games.length === 0 && page > 1 ? "NO MORE GAMES" : ""}
                    <div className="search-results__pages">
                        <img className="search-results__pages__nav" src={leftArrow} alt="previous search page" onClick={() => {
                            if (page > 1) {
                                notifyLoading();
                                setPage(prevPage => parseInt(prevPage - 1));
                            }
                        }} />
                        <input type="text" onChange={(e) => setPage(parseInt(e.target.value))} value={page} />
                        <img className="search-results__pages__nav" src={rightArrow} alt="next search page" onClick={() => {
                            notifyLoading();
                            if (gamesFound) {
                                setPage(prevPage => parseInt(prevPage + 1));
                            }
                        }}/>
                    </div>
                </Container>
            </div>
        </div>
    )
}