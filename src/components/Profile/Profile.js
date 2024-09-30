import React, { useEffect, useState } from "react";
import { setReportUser } from "../../redux/gamesSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./Profile.css";
import nullGame from "../../assets/null_game_001.png";
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
    const [gameType, setGameType] = useState("all");
    let gamesArr = [];
    let games;
    let gamesList;
    let phase1Arr = [];
    let phase2Arr = [];
    let phase3Arr;
    let matchArr;
    // const [completedGames, setCompletedGames] = useState([]);
    // const [upcomingGames, setUpcomingGames] = useState([]);
    // const [droppedGames, setdroppedGames] = useState([]);
    // const [playingGames, setPlayingGames] = useState([]);

    const [gameState, setGameState] = useState("all");
    const [searchArr, setSearchArr] = useState([]);
    const [sortedArr, setSortedArr] = useState([]);

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
            // let droppedArr = [];
            // let playingArr = [];
            // let upcomingArr = [];
            // let completedArr = [];
            // if (user !== null) {
            //     for (let i = 0; i < response.data.user.games.length; i++) {
            //         if (response.data.user.games[i].rank === "dropped") {
            //             droppedArr.push(response.data.user.games[i]);
            //         }
    
            //         if (response.data.user.games[i].rank === "playing") {
            //             playingArr.push(response.data.user.games[i]);
            //         }
    
            //         if (response.data.user.games[i].rank === "upcoming") {
            //             upcomingArr.push(response.data.user.games[i]);
            //         }
    
            //         if (response.data.user.games[i].rank === "completed") {
            //             completedArr.push(response.data.user.games[i]);
            //         }
            //     }
            //     setdroppedGames(droppedArr);
            //     setPlayingGames(playingArr);
            //     setUpcomingGames(upcomingArr);
            //     setCompletedGames(completedArr);
            // }
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
        // if (userParam.user !== userParam.user.toLowerCase()) {
        //     navigate(`/` + userParam.user.toLowerCase(), { replace: true });
        //   }
    }, [userParam, navigate])

    useEffect(() => {
            // setSortDirection("ascending");
            // setSortFocus("alpha");
            // alphaSort();
    }, [userGames])

    useEffect(() => {
        // searchGameslist();
        // searchGames();
    }, [search])

    useEffect(() => {
        // alphaSort();
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
        console.log("phase3Arr: ", phase3Arr);

        renderGames(phase3Arr);
    }


    function alphaSort () {
        let sortGamesArr;
        let sortedGames;
        if (gameState === "dropped") {
            // sortGamesArr = droppedGames;
        } else if (gameState === "completed") {
            // sortGamesArr = completedGames;
        } else if (gameState === "upcoming") {
            // sortGamesArr = upcomingGames;
        } else if (gameState === "playing") {
            // sortGamesArr = playingGames;
        } else {
            sortGamesArr = userGames;
        }

        if (search.length > 0) {
            sortGamesArr = searchArr;
        }

        if (sortDirection === "ascending" && 
            sortFocus === "alpha") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
        }
        
        if (sortDirection === "descending" && 
            sortFocus === "alpha") {
                setSortedArr(...sortGamesArr.sort((a,b) => (a.name < b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
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

    }

    function searchGameslist () {
        let searchGamesArr;
        let matchArr = []
        if (gameState === "dropped") {
            // searchGamesArr = droppedGames;
        } else if (gameState === "upcoming") {
            // searchGamesArr = upcomingGames;
        } else if (gameState === "completed") {
            // searchGamesArr = completedGames;
        } else if (gameState === "playing") {
            // searchGamesArr = playingGames;
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
                        <label>Rating: </label>
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

    function searchGames() {
        if (search.length > 0) {
            gamesList = searchArr.map((game, i)=> {
                return <div className="user-game__search-game">
                    <h2 className="user-game__title">{game.name}</h2>
                    <div className="user-game__img"><img src={game.custom_game === "mario" ? smwCart : game.custom_game === "pokemon" ? pokemonCart : game.custom_game === "minecraft" ? mcCart : game.custom_game === "other" ? otherCart : game.img_url} /></div>
                    <div className="user-game__date-container">
                        <p>Date:</p>
                        <p className="user-game__date">{new Date(game.date_added).toDateString().substring(4)}</p>
                    </div>
                    <div className="user-game__rating">
                        <label>Rating: </label>
                        <p className="user-game__rating__num">{game.rating === 0 ? "-" : game.rating}</p>    
                    </div>
                    <div className="user-game__status-container">
                        <p>Game Status</p>
                        <p className="user-game__status">{game.rank.toUpperCase()}</p>
                    </div>
                    <p className="user-game__summary" placeholder="Let your viewers know how you felt about this game">{game.summary}</p>
                </div>
            })
            document.getElementById("profile-results-container").scrollIntoView({
                behavior: "smooth"
            })

            console.log("searchArr length: ", searchArr.length);

            if (searchArr.length === 0) {
                let nullGameImg = <div className="user-game__nogame-container">
                    <h2>No games found for this search</h2>
                    <img src={nullGame} alt="no game found image" />
                    </div>
                gamesList = nullGameImg;
            }
        }

        console.log("search length: ", search)
    }

    if (gameState === "dropped") {
        // renderGames(droppedGames);
    } else if (gameState === "upcoming") {
        // renderGames(upcomingGames);
    } else if (gameState === "completed") {
        // renderGames(completedGames);
    } else if (gameState === "playing") {
        // renderGames(playingGames);
    } else {
        // renderGames(userGames);
    }

    // if (search.length > 0) {
    //     searchGames();
    // }



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
                    // dispatch(setReportUser(user.twitchName));
                    // console.log("user: ", reportUser);
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
                                <option value="ascending" onClick={(e) => {
                                    // setSortDirection("ascending");
                                }}>Ascending</option>
                                <option value="descending" onClick={(e) => {
                                    // setSortDirection("descending")
                                }}>Descending</option>
                            </select>
                            <select id="sort-focus" onChange={(e) => {
                                setSortFocus(e.target.value);
                            }}>
                                <option value="alpha" onClick={(e) =>{
                                    // setSortFocus("alpha");
                                }}>Alphabetical</option>
                                <option value="date" onClick={(e) =>{
                                    // setSortFocus("date");
                                }}>Date</option>
                                <option value="rating" onClick={(e) =>{
                                    // setSortFocus("rating");
                                }}>Rating</option>
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