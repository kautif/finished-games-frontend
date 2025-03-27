import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FindUser.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import Form from 'react-bootstrap/Form';

import leftArrow from "../../assets/arrow.png";
import rightArrow from "../../assets/right-arrow.png";

import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';

export default function FindUser () {
    const [user, setUser] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);
    const [showFill, setShowFill] = useState(false);
    const [userList, setUserList] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [noResults, setNoResults] = useState(false);
    const [page, setPage] = useState(1);

    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [imagesRendered, setImagesRendered] = useState(false);
    let totalImages = 0;

    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";

    function notifyLoading () {
        toast(`Page loading`, {
            position: "top-center",
            autoClose: 1000
        });
    }

    function getUserList () {
        console.log("getUserList");
        axios(
            {
                url: `${backendURL}/getusers`,
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                },
                params: {
                    user: inputValue.toLowerCase()
                }
            }).then(response => {
                console.log("backend response: ", response);
                setUserList(response.data.users);
            }).catch(err => {
                console.error("Get all users Error: ", err.message);
            })
    }

    function getUsers (user, userPage) {
        console.log("getUsers");
        axios(
            {
                url: `${backendURL}/getusers`,
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                },
                params: {
                    // user: document.getElementById("free-solo-2-demo").value.toLowerCase()
                    user: user.length > 0 ? user : "",
                    page: userPage
                }
            }).then(response => {
                console.log("backend response: ", response);
                setFoundUsers(response.data.users);
                // paginatedUsers = response.data.users;
                // console.log("paginatedUsers: ", paginatedUsers);
                // console.log("pages: ", Math.ceil(paginatedUsers.length / 10))
            }).catch(err => {
                console.error("Find User Error: ", err.message);
            })
    }

    function handleChange (newValue) {
        console.log("handleChange");
        getUsers(newValue.target.textContent.toLowerCase());
    }

    useEffect(() => {
        // getUsers();
        // getUserList();
        setNoResults(false);
        // document.addEventListener('click', (event) => {
        //     if (!event.target.closest('.MuiAutocomplete-root')) {
        //       setShowFill(false); // Close dropdown if click is outside
        //     }
        //   });
    }, [])

    useEffect(() => {
        if (page < 1) {
            setPage(1);
        }
    }, [page])

    useEffect(() => {
        console.log("inputValue: ", inputValue);
        if (inputValue.length >= 1) {
            // setShowFill(true);
            // getUserList(inputValue);
        } else {
            // setShowFill(false);
        }
    }, [inputValue])

    useEffect(() => {
        if (foundUsers.length >= 1) {
            // setShowFill(false);
            setNoResults(false);
        } else {
            setNoResults(true);
        }
    }, [foundUsers])

    return (
        <Container onClick={() => {
        }}>
            <Form                 
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log("submitted: ", e.target[0].value);
                    getUsers(inputValue.toLowerCase(), page);
                }}>
                <Stack>
                <Form.Control 
                    type="text"
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                    >

                </Form.Control>
                {/* <Autocomplete
                                // freeSolo
                                id="free-solo-2-demo"
                                freeSolo
                                disableClearable
                                disablePortal
                                inputValue={inputValue}
                                open={inputValue.length > 1 && showFill === true}
                                onInputChange={(e, value) => {
                                    e.stopPropagation();
                                    setInputValue(value);
                                    console.log("value: ", value);
                                }}
                                noOptionsText="No results found"
                                options={userList.map((option) => option.twitch_default)}
                                filterOptions={(options, state) =>
                                    options.filter((option) =>
                                      option.toLowerCase().includes(state.inputValue.toLowerCase())
                                    ).slice(0, 10)
                                  }
                                onChange={(e) => {
                                    e.stopPropagation();
                                    handleChange(e);
                                    console.log("input changing");
                                }}
                                onClose={(e) => {
                                    e.stopPropagation();
                                    setShowFill(false);
                                }}
                                onBlur={(e) => {
                                    e.stopPropagation();
                                    setShowFill(false);
                                }}
                            renderInput={(params) => {
                                return (
                                    <TextField
                                        {...params}
                                        label="Enter a username"
                                        onBlur={() => setShowFill(false)}
                                        slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            type: 'search',
                                        },
                                        }}
                                    />
                                )}
                            }
                            /> */}
                </Stack>
                <Button 
                    className="btn btn-primary"
                    onClick={() => {
                        getUsers(inputValue.toLowerCase(), page);
                    }}
                    >Submit</Button>
            </Form >
            <div className="find-user__results d-flex flex-wrap">
                <div className="find-results__pages">
                    <img className="find-results__pages__nav" src={leftArrow} alt="previous find user page" onClick={() => {
                        if (page > 1) {
                            notifyLoading();
                            setPage(prevPage => parseInt(prevPage - 1));
                        }
                    }} />
                    <input className="find-user__pages" type="number" onChange={(e) => setPage(parseInt(e.target.value))} value={page} />
                    <img className="find-results__pages__nav" src={rightArrow} alt="next find user page" onClick={() => {
                        notifyLoading();
                        // dispatch(setImagesRendered(false));
                        setImagesRendered(false);
                        setImagesLoaded(0);
                        setPage(prevPage => parseInt(prevPage + 1));
                    }}/>
                </div>
                {foundUsers.map(foundUser => {
                    return (
                        <Row className="mx-5">
                            <Col>
                                <h1 className="mt-4 find-user__head">{foundUser.twitch_default}</h1>
                                <Image src={foundUser.profileImageUrl} alt={`${foundUser.twitchName}'s profile image`} rounded/>
                                <a class="found-user__link" href={`/${foundUser.twitchName}`}><p className="found-user__btn mt-3">See Profile</p></a>
                            </Col>
                        </Row>
                    )
                })}
                {noResults && "no results found"}
            </div>
        </Container>
    ) 
}