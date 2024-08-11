import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import GameResult from "../GameResult/GameResult";
import "./Search.css";
import { setUserGames } from "../../redux/gamesSlice";

export default function Search () {
    const dispatch = useDispatch();
    let userGames = useSelector((state) => state.gamesReducer.userGames);
    console.log("search userGames: ", setUserGames);
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("");
    const [games, setGames] = useState([]);
    const [rank, setRank] = useState("");
    const [rating, setRating] = useState(0);
    const [searchGames, setSearchGames] = useState(userGames);
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

    function addGame (gameName, gameImg, gameSummary, gameStatus, index) {
        twitchId = window.localStorage.getItem("twitchId");
        twitchName = window.localStorage.getItem("twitchName");
        getDate(index);
        let gameObj = {
            name: gameName,
            img_url: gameImg,
            summary: gameSummary,
            date_added: date,
            rank: gameStatus,
            rating: document.getElementsByClassName("search-game__rating__num")[index].value
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

    function defaultDate (index) {
        document.getElementsByClassName("search-game__date")[index].valueAsDate = new Date();
        const newDate = new Date(document.getElementsByClassName("search-game__date")[index].value);
        // console.log("Day: ", newDate.getDate());
        // console.log("Month: ", newDate.getMonth());
        // console.log("Year: ", newDate.getFullYear());
        // setDate(prevDate => `${newDate.getMonth() + 1}/${newDate.getDate() + 1}/${newDate.getFullYear()}`);
        setDate(prevDate => newDate);
    }

    function getDate (index) {
        const newDate = new Date(document.getElementsByClassName("search-game__date")[index].value);
        // console.log("Day: ", newDate.getDate());
        // console.log("Month: ", newDate.getMonth());
        // console.log("Year: ", newDate.getFullYear());
        setDate(prevDate => newDate);
    }



    // function getRating (index) {
    //     let ratingNum = document.getElementsByClassName("search-game__rating__num")[index].value;
    //     setRating(ratingNum);
    // }

    let retrievedGames;

    useEffect(() => {
        twitchId = window.localStorage.getItem("twitchId");
        getUserGames();
        retrievedGames.map((game, i) => {
            defaultDate(i);
            // getRating(i);
        })
    }, [games])

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
            <label>Date:</label><input className="search-game__date" type="date" name="date-added" onChange={(e) => getDate(i)}/>
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
            {userGameNames.includes(game.name) ? <p className="search-result__added">Added</p> : <p className="search-result__add-btn" onClick={(e) => addGame(game.name, game.background_image, e.target.previousElementSibling.value, e.target.previousElementSibling.previousElementSibling.children[1].value, i)}>Add Game</p>}
        </div>
    })

    return (
        <div>
            <form>
                <input className="search" placeholder="Search games" 
                onChange={(e) => {setSearch(prevSearch => e.target.value)}} value={search}/>
                <button onClick={(e) => {getGames(e)}}>Submit</button>  
            </form>
            <div className="search-results">
                {retrievedGames}
            </div>
        </div>
    )
}