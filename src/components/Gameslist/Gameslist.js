import React, {useEffect, useState} from "react";
import axios from "axios";
import "./Gameslist.css";

export default function Gameslist (){
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    // const backendURL = "http://localhost:4000";
    let twitchId;
    let twitchName = window.localStorage.getItem("twitchName");
    const [userGames, setUserGames] = useState([]);
    const [completedGames, setCompletedGames] = useState([]);
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [droppedGames, setdroppedGames] = useState([]);
    const [playingGames, setPlayingGames] = useState([]);

    const [gameState, setGameState] = useState("all");
    const [sortedArr, setSortedArr] = useState([]);
    const [searchArr, setSearchArr] = useState([]);
    const [rank, setRank] = useState("");
    const [rating, setRating] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [summary, setSummary] = useState("");
    const [date, setDate] = useState("");
    const [gameName, setGameName] = useState("");

    const [search, setSearch] = useState("");
    let userGamesList;
    let gamesList;
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
        getGameDate(userGames);
        getGameState(userGames);
        getGameRating(userGames);
        getGameSummary(userGames);
    }, [userGames])

    useEffect(() => {
        console.log("gameState", gameState);
        // 8/3/24: When setting userGames state, also set a completedGame, droppedGames, upcomingGames state and so on.
        if (gameState === "dropped") {
            getGameState(droppedGames);
            getGameDate(droppedGames);
            getGameSummary(droppedGames);
            getGameRating(droppedGames);
        } else if (gameState === "playing") {
            getGameState(playingGames);
            getGameDate(playingGames);
            getGameSummary(playingGames);
            getGameRating(playingGames);
        } else if (gameState === "upcoming") {
            getGameState(upcomingGames);
            getGameDate(upcomingGames) ;
            getGameSummary(upcomingGames);
            getGameRating(upcomingGames);
        } else if (gameState === "completed") {
            getGameState(completedGames);
            getGameDate(completedGames) ;
            getGameSummary(completedGames);
            getGameRating(completedGames);
        } else {
            getGameState(userGames);
            getGameDate(userGames);
            getGameSummary(userGames);
            getGameRating(userGames);
        }
    }, [gameState])

    useEffect(() => {
        updateSummary(gameName, summary, date, rank, rating);
    }, [gameName, summary, date, rank, rating])

    useEffect(() => {
        // renderGames([searchArr]);
        console.log(searchArr);
            searchGameslist();
            searchGames();
    }, [search])

    function alphaSort () {
        let sortGamesArr;
        let sortedGames;
        if (gameState === "dropped") {
            sortGamesArr = droppedGames;
        } else if (gameState === "completed") {
            sortGamesArr = completedGames;
        } else if (gameState === "upcoming") {
            sortGamesArr = upcomingGames;
        } else if (gameState === "playing") {
            sortGamesArr = playingGames;
        } else {
            sortGamesArr = userGames;
        }

        if (search.length > 0) {
            sortGamesArr = searchArr;
        }

        if (document.getElementById("sort-direction").value === "ascending" && 
            document.getElementById("sort-focus").value === "alpha") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
        }
        
        if (document.getElementById("sort-direction").value === "descending" && 
            document.getElementById("sort-focus").value === "alpha") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.name < b.name) ? 1 : ((a.name > b.name) ? -1 : 0)));
        }

        if (document.getElementById("sort-direction").value === "ascending" && 
            document.getElementById("sort-focus").value === "date") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.date_added > b.date_added) ? 1 : ((b.date_added > a.date_added) ? -1 : 0)));
        }

        if (document.getElementById("sort-direction").value === "descending" && 
            document.getElementById("sort-focus").value === "date") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.date_added < b.date_added) ? 1 : ((a.date_added > b.date_added) ? -1 : 0)));
        }

        if (document.getElementById("sort-direction").value === "ascending" && 
            document.getElementById("sort-focus").value === "rating") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0)));
        }

        if (document.getElementById("sort-direction").value === "descending" && 
            document.getElementById("sort-focus").value === "rating") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.rating < b.rating) ? 1 : ((a.rating > b.rating) ? -1 : 0)));
        }
        getGameTitle(sortGamesArr);
        getGameImage(sortGamesArr);
        getGameSummary(sortGamesArr);
        getGameDate(sortGamesArr);
        getGameRating(sortGamesArr);
        getGameState(sortGamesArr);
    }

    function searchGameslist () {
        let searchGamesArr;
        let matchArr = []
        if (gameState === "dropped") {
            searchGamesArr = droppedGames;
        } else if (gameState === "upcoming") {
            searchGamesArr = upcomingGames;
        } else if (gameState === "completed") {
            searchGamesArr = completedGames;
        } else if (gameState === "playing") {
            searchGamesArr = playingGames;
        } else {
            searchGamesArr = userGames;
        }

        searchGamesArr.map(game => {
            if (game.name.toLowerCase().includes(search.toLowerCase())) {
                matchArr.push(game);
            }
        })
        setSearchArr(prevArr => [...matchArr]);
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

    async function getUserGames() {
        twitchId = window.localStorage.getItem("twitchId");
        // twitchName = window.localStorage.getItem("twitchName");

        await axios(`${backendURL}/games`, {
            method: "get",
            params: {
                twitchName: twitchName
            }
        }).then(result => {
            setUserGames(result.data.response.games);
            let droppedArr = [];
            let playingArr = [];
            let upcomingArr = [];
            let completedArr = [];
            for (let i = 0; i < result.data.response.games.length; i++) {
                if (result.data.response.games[i].rank === "dropped") {
                    droppedArr.push(result.data.response.games[i]);
                }

                if (result.data.response.games[i].rank === "playing") {
                    playingArr.push(result.data.response.games[i]);
                }

                if (result.data.response.games[i].rank === "upcoming") {
                    upcomingArr.push(result.data.response.games[i]);
                }

                if (result.data.response.games[i].rank === "completed") {
                    completedArr.push(result.data.response.games[i]);
                }
            }
            setdroppedGames(droppedArr);
            setPlayingGames(playingArr);
            setUpcomingGames(upcomingArr);
            setCompletedGames(completedArr);
        })
    }

    function getGameTitle (games) {
        for (let i = 0; i < document.getElementsByClassName("gameslist-game__title").length; i++) {
            document.getElementsByClassName("gameslist-game__title")[i].innerHTML = games[i].name;
        }
    }

    function getGameImage (games) {
        for (let i = 0; i < document.getElementsByClassName("gameslist-game__img").length; i++) {
            document.getElementsByClassName("gameslist-game__img")[i].src = games[i].img_url;
        }
    }

    function getGameDate (games) {
        for (let i = 0; i < document.getElementsByClassName("gameslist-game__date").length; i++) {
            document.getElementsByClassName("gameslist-game__date")[i].valueAsDate = new Date(games[i].date_added);
        }
    }

    function getGameState (games) {
        for (let i = 0; i < document.getElementsByClassName("gameslist-game__rank").length; i++) {
            document.getElementsByClassName("gameslist-game__rank")[i].value = games[i].rank;
        }
    }

    function getGameSummary (games) {
        for (let i = 0; i < document.getElementsByClassName("gameslist-game__summary").length; i++) {
            document.getElementsByClassName("gameslist-game__summary")[i].value = games[i].summary;
        }
    }

    function getGameRating (games) {
        for (let i = 0; i < document.getElementsByClassName("gameslist-game__rating__num").length; i++) {
            document.getElementsByClassName("gameslist-game__rating__num")[i].value = games[i].rating;
        }
    }

    function renderGames (games) {
        if (games.length <= 0) {
            gamesList = <h2 className="gameslist-game__no-results">No Games Found in this Category</h2>;
        } else {
            gamesList = games.map((game, i) => {
                return <div className="gameslist-game">
                    <h2 className="gameslist-game__title">{game.name}</h2>
                    <img className="gameslist-game__img" src={game.img_url} />
                    <div className="gameslist-game__date-container">
                        <label>Date:</label>
                        <input className="gameslist-game__date" type="date" name="date-added" />
                    </div>
                    <div className="gameslist-game__rating">
                        <label>Rating: </label>
                        <select className="gameslist-game__rating__num">
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
                    <div className="gameslist-game__status">
                        <label>Game Status</label>
                        <select className="gameslist-game__rank">
                            <option value="playing">Playing</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                        </select>
                    </div>
                    <textarea className="gameslist-game__summary" placeholder="Let your viewers know how you felt about this game">{game.summary}</textarea>
                    <p className="gameslist-game__add-btn" onClick={(e) => {
                        setDate(prevDate => document.getElementsByClassName("gameslist-game__date")[i].value);
                        setSummary(prevSummary => document.getElementsByClassName("gameslist-game__summary")[i].value);
                        setGameName(prevGameName => game.name);
                        setRank(document.getElementsByClassName("gameslist-game__rank")[i].value);
                        setRating(document.getElementsByClassName("gameslist-game__rating__num")[i].value);
                        setShowModal(true);
                        }}>Update</p>
                </div>
            })   
        }
    }

    function searchGames() {
        if (search.length > 0) {
            gamesList = searchArr.map((game, i)=> {
                return <div className="gameslist__search-game">
                    <h2 className="gameslist-game__title">{game.name}</h2>
                    <img className="gameslist-game__img" src={game.img_url} />
                    <div className="gameslist-game__date-container">
                        <label>Date:</label>
                        <input className="gameslist-game__date" type="date" name="date-added" />
                    </div>
                    <div className="gameslist-game__rating">
                        <label>Rating: </label>
                        <select className="gameslist-game__rating__num">
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
                    <div className="gameslist-game__status">
                        <label>Game Status</label>
                        <select className="gameslist-game__rank">
                            <option value="playing">Playing</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                        </select>
                    </div>
                    <textarea className="gameslist-game__summary" placeholder="Let your viewers know how you felt about this game">{game.summary}</textarea>
                    <p className="gameslist-game__add-btn" onClick={(e) => {
                        setDate(prevDate => document.getElementsByClassName("gameslist-game__date")[i].value);
                        setSummary(prevSummary => document.getElementsByClassName("gameslist-game__summary")[i].value);
                        setGameName(prevGameName => game.name);
                        setRank(document.getElementsByClassName("gameslist-game__rank")[i].value);
                        setRating(document.getElementsByClassName("gameslist-game__rating__num")[i].value);
                        setShowModal(true);
                        }}>Update</p>
                </div>
            })
        }
    }

    if (gameState === "dropped") {
        renderGames(droppedGames);
    } else if (gameState === "upcoming") {
        renderGames(upcomingGames);
    } else if (gameState === "completed") {
        renderGames(completedGames);
    } else if (gameState === "playing") {
        renderGames(playingGames);
    } else {
        renderGames(userGames);
    }

    // Con't *** 8/26/24
    if (search.length > 0) {
        searchGames();
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
                    <select id="sort-direction">
                        <option value="ascending">Ascending</option>
                        <option value="descending" >Descending</option>
                    </select>
                    <select id="sort-focus">
                        <option value="alpha">Alphabetical</option>
                        <option value="date">Date</option>
                        <option value="rating">Rating</option>
                    </select>
                    <input type="submit" id="sorting-btn" value="Submit" onClick={(e) => {
                        e.preventDefault();
                        alphaSort();
                    }}/>
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