import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddGame.css";

import Image from "react-bootstrap/esm/Image";
import { useDispatch, useSelector } from "react-redux";
import { setShowGame, setShowSearch, setUserGames, setShowDiscover } from "../../redux/gamesSlice";
import { ToastContainer, toast } from 'react-toastify';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

export default function AddGame () {
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    let twitchId;
    let twitchName;
    twitchId = window.localStorage.getItem("twitchId");
    twitchName = window.localStorage.getItem("twitchName");

    const dispatch = useDispatch();
    let showGame = useSelector((state) => state.gamesReducer.showGame);
    let showSearch = useSelector((state) => state.gamesReducer.showSearch);
    let userGames = useSelector((state) => state.gamesReducer.userGames);

    let searchGameName = useSelector((state) => state.gamesReducer.searchGameName);
    let searchGameImg = useSelector((state) => state.gamesReducer.searchGameImg);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selected, setSelected] = useState(false);
    const [rating, setRating] = useState(0);
    const [gameRank, setGameRank] = useState("playing");
    const [summary, setSummary] = useState("");

    function defaultDate (gameDate, index) {
        gameDate[index].valueAsDate = new Date;
        const newDate = new Date(gameDate[index].value);
        setSelectedDate(prevDate => newDate);
    }

    const currentYear = new Date().getFullYear();

    const handleDateChange = (date) => {
        if (date) {
            const selectedYear = date.getFullYear();

            if (selectedYear < 1970 || selectedYear > currentYear + 10) {
                alert("Invalid date");
                const correctedDate = new Date(date);
                correctedDate.setFullYear(correctedDate);
            }
        } else {
            setSelectedDate(date);
        }
    }

    function notifyUpdate (game) {
        toast(`${game} has been added`, {
            position: "top-center",
            autoClose: 1000,
            onClose: () => {
                // window.location.reload();
                dispatch(setShowDiscover(false));
            }
        });
    }

    function notifyYears () {
        toast(`Year must between 1970 and ${year + 10}`, {
            position: "top-center",
            autoClose: 3000
        });
    }

    function addGame (gameName, gameImg, gameSummary, gameStatus, gameRating, customGame) {
        let gameObj = {
            name: gameName,
            custom_game: customGame,
            img_url: customGame === "regular" ? gameImg : "",
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
        // getUserGames();
            // setTitle("");
            setRating(0);
            setGameRank("playing");
            setSummary("");
            // setSelectedDate(defaultDate(document.getElementsByClassName("custom-game__date"), 0));
        })
        .catch((error) => {
        console.log("addGame error: ", error);
        })
    }

    useEffect(() => {
        // defaultDate(document.getElementsByClassName("search-game__date"), 0);
    }, [searchGameName])

    let day;
    let month;
    let year;

    useEffect(() => {
        console.log("addGame img: ", searchGameImg);
        console.log("addGame name: ", searchGameName);
    }, [searchGameImg, searchGameName])

    useEffect(() => {
        console.log("addGame userGames: ", userGames)
    }, [userGames])

    useEffect(() => {
        if (selectedDate) {
            day = new Date().getDate();
            month = new Date().getMonth();
            year = new Date().getFullYear();
            // console.log("day: ", day);
            // console.log("month: ", month + 1);
            // console.log("year: ", year);
            
        }
    }, [selectedDate])

    return (
        <Col>
            <Row className="addgame-container">
                <div className="addgame-intro">
                    <h1 className="text-left">{searchGameName}</h1>
                    <Image
                        className="addgame-img"
                        src={searchGameImg}
                    />
                </div>
                <div className="addgame-details">
                    {/* <label>Date:</label> */}
                    {/* <input  
                        className="search-game__date" 
                        type="date" 
                        name="date-added"
                        selected={selectedDate} 
                    onChange={(e) => {
                        if (selectedDate.getFullYear() < 1970 || selectedDate.getFullYear() > year + 10) {

                        } else {
                            setSelectedDate(e.target.value);
                        }
                    }}
                    /> */}

                    {/* <DatePicker 
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
                        showMonthDropdown
                        autoFocus
                    /> */}

                    <DayPicker
                        animate
                        mode="single"
                        selected={selected}
                        onSelect={(e) => {
                            if (e) {
                                setSelected(e);
                                // console.log(e.getDate());
                                // console.log(e.getMonth());
                                // console.log(e.getFullYear());
    
                                setSelectedDate(`${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`);
    
                                if (e.getFullYear() < 1970 || e.getFullYear() > year + 10) {
                                    setSelectedDate(new Date());
                                    notifyYears();
                                }
                            }
                        }}
                        modifiers={{
                            weekend: (date) => date.getDay() === 0 || date.getDay() === 6, // Sunday (0) or Saturday (6)
                          }}
                          classNames={{
                            weekend: 'my-weekend',
                          }}
                        captionLayout="dropdown"
                        // footer={
                        //     selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
                        // }
                        />
                    <div className="addgame-details-container">
                    <Dropdown 
                            className="addgame-filter-btn"
                            as={ButtonGroup}>
                            <Button className="" variant="success">Rating</Button>
    
                            <Dropdown.Toggle 
                                split variant="success" 
                                className="dropdown-split"
                                id="dropdown-split-rating" />
    
                            <Dropdown.Menu >
                                <Dropdown.Item><option disabled selected>Select</option></Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setRating(10);
                                }}>10</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setRating(9);
                                }}>9</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setRating(8);
                                }}>8</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setRating(7);
                                }}>7</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setRating(6);
                                }}>6</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setRating(5);
                                }}>5</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setRating(4);
                                }}>4</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setRating(3);
                                }}>3</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setRating(2);
                                }}>2</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setRating(1);
                                }}>1</Dropdown.Item>
                            </Dropdown.Menu>
                            
                        </Dropdown>
                        {/* <div className="search-game__rating addgame-rating">
                            <label>Rating: </label>
                            <select className="search-game__rating__num" onChange={(e) => {
                                setRating(e.target.value)
                            }}>
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
                        </div> */}

                        <Dropdown 
                            className="addgame-filter-btn"
                            as={ButtonGroup}>
                            <Button className="" variant="success">Game Status</Button>
    
                            <Dropdown.Toggle 
                                split variant="success" 
                                className="dropdown-split"
                                id="dropdown-split-rating" />
    
                            <Dropdown.Menu >
                                <Dropdown.Item><option disabled selected>Select</option></Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setGameRank("playing");
                                }}>Playing</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setGameRank("upcoming");
                                }}>Upcoming</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setGameRank("completed");
                                }}>Completed</Dropdown.Item>
                                <Dropdown.Item onClick={() => {
                                    setGameRank("Dropped");
                                }}>Dropped</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        {/* <div className="search-game__status addgame-status" onChange={(e) => {
                            setGameRank(e.target.value);
                        }}>
                            <label>Game Status</label>
                            <select>
                                <option selected="selected" value="playing">Playing</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="completed">Completed</option>
                                <option value="dropped">Dropped</option>
                            </select>
                        </div> */}
                    </div>
                    <textarea onChange={(e) => {
                        setSummary(e.target.value);
                    }}placeholder="Let your viewers know how you felt about this game" ></textarea>
                    <p className="search-result__add-btn text-center" onClick={() => {
                        notifyUpdate(searchGameName);
                        addGame(searchGameName, searchGameImg, summary, gameRank, rating, "regular");
                        dispatch(setUserGames([...userGames, {
                            name: searchGameName,
                            custom_game: "regular",
                            img_url: searchGameImg,
                            summary: summary,
                            date_added: selectedDate.toISOString(),
                            rank: gameRank,
                            rating: rating
                        }]))

                    }}>Add Game</p>
                </div>
                <ToastContainer />
            </Row>
        </Col>
    )
}