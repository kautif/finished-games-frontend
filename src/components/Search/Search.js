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
            // setUserGames(result.data.response.games);
            dispatch(setUserGames(result.data.response.games));
            console.log("getUserGames: ", userGames);
            // console.log("result: ", result.data.response.games)
        })
    }

    function addGame (gameName, gameImg, gameSummary, index) {
        twitchId = window.localStorage.getItem("twitchId");
        twitchName = window.localStorage.getItem("twitchName");
        // console.log("addGame twitchId: ", twitchId);
        // console.log("addGame twitchName: ", twitchName);
        getDate(index);
        let gameObj = {
            name: gameName,
            img_url: gameImg,
            summary: gameSummary,
            date_added: date
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

    // Con't ***
    // 7/18/24: Will the correct date go to the database when it is not changed in the UI?
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
        console.log("date added: ", date);
    }

    let retrievedGames;

    useEffect(() => {
        twitchId = window.localStorage.getItem("twitchId");
        getUserGames();
        retrievedGames.map((game, i) => {
            defaultDate(i);
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
    // console.log("userGames: ", userGames);   
    // console.log("games: ", games);

    retrievedGames = games.map((game, i) => {
        return <div className="search-game">
            <h2>{game.name}</h2>
            <img src={game.background_image} alt={game.name + " image"} />
            <label>Date Completed:</label><input className="search-game__date" type="date" name="date-added" onChange={(e) => getDate(i)}/>
            <textarea placeholder="Let your viewers know how you felt about this game" ></textarea>
            {userGameNames.includes(game.name) ? <p className="search-result__added">Added</p> : <p className="search-result__add-btn" onClick={(e) => addGame(game.name, game.background_image, e.target.previousElementSibling.value, i)}>Add Game</p>}
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