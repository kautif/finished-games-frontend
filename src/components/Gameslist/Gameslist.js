import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Gameslist.css";
import smwCart from "../../assets/vh_smw_cart.webp";
import mcCart from "../../assets/vh_minecraft_cart.webp";
import pokemonCart from "../../assets/vh_pokemon_cart.webp";
import otherCart from "../../assets/vh_other_cart.webp";

// 9/27/2024: Filtering by game status and game type is inefficient. Simplify it
// - Then, simplify sorting and search. 
// - Make it so that every sorting and filtering function/feature all access the same array of games instead of making an array for each attribute of game

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
        // getGameState(userGames);
        // getGameRating(userGames);
        getGameSummary(userGames);
        // setSortFocus("alpha");
        // setSortDirection("ascending");
        // alphaSort();
    }, [userGames])

    useEffect(() => {
        // console.log("gameState", gameState);
        // 8/3/24: When setting userGames state, also set a completedGame, droppedGames, upcomingGames state and so on.
        // if (gameState === "dropped") {
        //     // make this a function
        //     getGameState(droppedGames);
        //     getGameDate(droppedGames);
        //     getGameSummary(droppedGames);
        //     getGameRating(droppedGames);
        // } else if (gameState === "playing") {
        //     getGameState(playingGames);
        //     getGameDate(playingGames);
        //     getGameSummary(playingGames);
        //     getGameRating(playingGames);

        //     if (gameType === "pokemon") {
        //         getGameState(pokemonGames);
        //         getGameDate(pokemonGames);
        //         getGameSummary(pokemonGames);
        //         getGameRating(pokemonGames);
        //     }
        // } else if (gameState === "upcoming") {
        //     getGameState(upcomingGames);
        //     getGameDate(upcomingGames) ;
        //     getGameSummary(upcomingGames);
        //     getGameRating(upcomingGames);
        // } else if (gameState === "completed") {
        //     getGameState(completedGames);
        //     getGameDate(completedGames) ;
        //     getGameSummary(completedGames);
        //     getGameRating(completedGames);
        // } else {
        //     if (gameType === "pokemon") {
        //         getGameState(pokemonGames);
        //         getGameDate(pokemonGames);
        //         getGameSummary(pokemonGames);
        //         getGameRating(pokemonGames);
        //     } else {
        //         getGameState(userGames);
        //         getGameDate(userGames);
        //         getGameSummary(userGames);
        //         getGameRating(userGames);
        //     }
        // }

        // if (search.length > 0) {
        //     getGameRating(searchArr);
        //     getGameDate(searchArr);
        //     getGameState(searchArr);
        //     getGameSummary(searchArr);
        // }
    // }, [gameState, searchArr])
}, [searchArr])

    useEffect(() => {
        // updateSummary(gameName, summary, date, rank, rating);
    }, [gameName, summary, date, rank, rating])

    useEffect(() => {
        // searchGameslist();
        // searchGames();
    }, [search])

    useEffect(() => {
        // filterByGameType();
        // renderGameTypes()
        // filterOrSort();
    getGameSummary(phase3Arr);
    getGameDate(phase3Arr);
    }, [gameType, gameState, sortDirection, sortFocus])

    // useEffect(() => {
        // renderGameTypes();
        // if (gameType === "pokemon") {
        //     getGameState(pokemonGames);
        //     getGameDate(pokemonGames);
        //     getGameSummary(pokemonGames);
        //     getGameRating(pokemonGames);
        // }
    // }, [gameTypeArr])

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
                // setSortedArr(...phase2Arr.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
                phase3Arr = [...phase2Arr.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))];
        }
        
        if (sortDirection === "descending" && 
            sortFocus === "alpha") {
                // setSortedArr(...phase2Arr.sort((a,b) => (a.name < b.name) ? 1 : ((a.name > b.name) ? -1 : 0)));
                phase3Arr = [...phase2Arr.sort((a,b) => (a.name < b.name) ? 1 : ((a.name > b.name) ? -1 : 0))];
        }

        if (sortDirection === "ascending" && 
            sortFocus === "date") {
                // setSortedArr(...phase2Arr.sort((a,b) => (a.date_added > b.date_added) ? 1 : ((b.date_added > a.date_added) ? -1 : 0)));
                phase3Arr = [...phase2Arr.sort((a,b) => (a.date_added > b.date_added) ? 1 : ((b.date_added > a.date_added) ? -1 : 0))];
        }

        if (sortDirection === "descending" && 
            sortFocus === "date") {
                // setSortedArr(...phase2Arr.sort((a,b) => (a.date_added < b.date_added) ? 1 : ((a.date_added > b.date_added) ? -1 : 0)));
                phase3Arr = [...phase2Arr.sort((a,b) => (a.date_added < b.date_added) ? 1 : ((a.date_added > b.date_added) ? -1 : 0))];
        }

        if (sortDirection === "ascending" && 
            sortFocus === "rating") {
                // setSortedArr(...phase2Arr.sort((a,b) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0)));
                phase3Arr = [...phase2Arr.sort((a,b) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0))];
        }

        if (sortDirection === "descending" && 
            sortFocus === "rating") {
                // setSortedArr(...phase2Arr.sort((a,b) => (a.rating < b.rating) ? 1 : ((a.rating > b.rating) ? -1 : 0)));
                phase3Arr = [...phase2Arr.sort((a,b) => (a.rating < b.rating) ? 1 : ((a.rating > b.rating) ? -1 : 0))];
        }
        console.log("phase3Arr: ", phase3Arr);
        renderGames(phase3Arr);
        // getGameTitle(phase3Arr);
        // getGameImage(phase3Arr);
        // getGameSummary(phase3Arr);
        // getGameDate(phase3Arr);
        // getGameRating(phase3Arr);
        // getGameState(phase3Arr);
    }

    // con't *** 9/25/24
    function alphaSort () {
        let sortGamesArr;
        // let gameTypeSort = [];
        // if (gameState === "dropped") {
        //     sortGamesArr = droppedGames;
        // } else if (gameState === "completed") {
        //     sortGamesArr = completedGames;
        // } else if (gameState === "upcoming") {
        //     sortGamesArr = upcomingGames;
        // } else if (gameState === "playing") {
        //     sortGamesArr = playingGames;
        // } else {
        //     sortGamesArr = userGames;
        // }

        if (search.length >= 0) {
            sortGamesArr = searchArr;
        }

        if (sortDirection === "ascending" && 
            sortFocus === "alpha") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
        }
        
        if (sortDirection === "descending" && 
            sortFocus === "alpha") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.name < b.name) ? 1 : ((a.name > b.name) ? -1 : 0)));
        }

        if (sortDirection === "ascending" && 
            sortFocus === "date") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.date_added > b.date_added) ? 1 : ((b.date_added > a.date_added) ? -1 : 0)));
        }

        if (sortDirection === "descending" && 
            sortFocus === "date") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.date_added < b.date_added) ? 1 : ((a.date_added > b.date_added) ? -1 : 0)));
        }

        if (sortDirection === "ascending" && 
            sortFocus === "rating") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0)));
        }

        if (sortDirection === "descending" && 
            sortFocus === "rating") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.rating < b.rating) ? 1 : ((a.rating > b.rating) ? -1 : 0)));
        }
        // getGameTitle(sortGamesArr);
        // getGameImage(sortGamesArr);
        // getGameSummary(sortGamesArr);
        // getGameDate(sortGamesArr);
        // getGameRating(sortGamesArr);
        // getGameState(sortGamesArr);
        console.log("alphaSort games: ", sortGamesArr);
    }

    function searchGameslist () {
        let searchGamesArr;
        let matchArr = []
        // if (gameState === "dropped") {
        //     searchGamesArr = droppedGames;
        // } else if (gameState === "upcoming") {
        //     searchGamesArr = upcomingGames;
        // } else if (gameState === "completed") {
        //     searchGamesArr = completedGames;
        // } else if (gameState === "playing") {
        //         searchGamesArr = playingGames;
        // } else {
        //     searchGamesArr = userGames;
        // }

        console.log("searchGameArr: ", searchGamesArr);

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
                window.location.reload();
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
            // let droppedArr = [];
            // let playingArr = [];
            // let upcomingArr = [];
            // let completedArr = [];

            // let pokemonArr = [];
            // let playingPokemonArr = [];
            // for (let i = 0; i < result.data.response.games.length; i++) {
            //     if (result.data.response.games[i].rank === "dropped") {
            //         droppedArr.push(result.data.response.games[i]);
            //     }

            //     if (result.data.response.games[i].rank === "playing") {
            //         playingArr.push(result.data.response.games[i]);
            //     }

            //     if (result.data.response.games[i].rank === "upcoming") {
            //         upcomingArr.push(result.data.response.games[i]);
            //     }

            //     if (result.data.response.games[i].rank === "completed") {
            //         completedArr.push(result.data.response.games[i]);
            //     }
            // }
            // setdroppedGames(droppedArr);
            // setPlayingGames(playingArr);
            // setUpcomingGames(upcomingArr);
            // setCompletedGames(completedArr);

            // setPokemonGames(pokemonArr);
            // setPlayingPokemon(playingPokemonArr);
        })
    }

    function getGameTitle (games) {
        for (let i = 0; i < document.getElementsByClassName("gameslist-game__title").length; i++) {
            document.getElementsByClassName("gameslist-game__title")[i].innerHTML = games[i].name;
        }
    }

    function getGameImage (games) {
        for (let i = 0; i < document.getElementsByClassName("gameslist-game__img").length; i++) {
            if (gameType === "pokemon") {
                document.getElementsByClassName("gameslist-game__img")[i].src = pokemonCart;                
            } else {
                document.getElementsByClassName("gameslist-game__img")[i].src = games[i].img_url;
            }
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
                return <div className="gameslist-game" onLoad={(e) => {
                    console.log("onLoad: ", e);
                }}>
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
                            setDate(prevDate => document.getElementsByClassName("gameslist-game__date")[i].value);
                            setSummary(prevSummary => document.getElementsByClassName("gameslist-game__summary")[i].value);
                            setGameName(prevGameName => game.name);
                            setRank(document.getElementsByClassName("gameslist-game__rank")[i].value);
                            setRating(document.getElementsByClassName("gameslist-game__rating__num")[i].value);
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

    function searchGames() {
        if (search.length > 0) {
            gamesList = searchArr.map((game, i)=> {
                return <div className="gameslist__search-game">
                    <h2 className="gameslist-game__title">{game.name}</h2>
                    <img className="gameslist-game__img" src={game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url} />
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
                            <option selected value="0">-</option>
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
                    <textarea className="gameslist-game__summary" placeholder="Let your viewers know how you felt about this game"></textarea>
                    <div className="gameslist-btn-container">
                        <p className="gameslist-game__add-btn" onClick={(e) => {
                            setDate(prevDate => document.getElementsByClassName("gameslist-game__date")[i].value);
                            setSummary(prevSummary => document.getElementsByClassName("gameslist-game__summary")[i].value);
                            setGameName(prevGameName => game.name);
                            setRank(document.getElementsByClassName("gameslist-game__rank")[i].value);
                            setRating(document.getElementsByClassName("gameslist-game__rating__num")[i].value);
                            setShowModal(true);
                            }}>Update</p>
                        <p onClick={() => {
                            deleteGame(game.name);
                        }}>Delete</p>
                    </div>
                </div>
            })
        }
    }

    // if (gameState === "dropped") {
    //     renderGames(droppedGames);
    // } else if (gameState === "upcoming") {
    //     renderGames(upcomingGames);
    // } else if (gameState === "completed") {
    //     renderGames(completedGames);
    // } else if (gameState === "playing") {
    //     renderGames(playingGames);
    // } else {
    //         renderGames(userGames);
    // }
    // renderGames(userGames);
    filterOrSort();
    // getGameTitle(phase3Arr);
    // getGameImage(phase3Arr);
    // getGameSummary(phase3Arr);
    // getGameDate(phase3Arr);
    // getGameRating(phase3Arr);
    // getGameState(phase3Arr);


    if (search.length > 0) {
        // searchGames();
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
                    {/*<input type="submit" id="sorting-btn" value="Submit" onClick={(e) => {
                        e.preventDefault();
                        alphaSort();
                    }}/> */}
                </form>
            </div>
            <div>
                <h2>Game Type</h2>
                <form>
                    <select onChange={(e) => {
                        setGameType(e.target.value);
                        // filterByGameType();
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