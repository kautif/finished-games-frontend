import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FindUser.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import Form from 'react-bootstrap/Form';

import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function FindUser () {
    const [user, setUser] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);
    const [showFill, setShowFill] = useState(false);
    const [userList, setUserList] = useState([]);
    const [inputValue, setInputValue] = useState("ste");
    const [noResults, setNoResults] = useState(false);
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";

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

    function getUsers (user) {
        console.log("getUsers");
        axios(
            {
                url: `${backendURL}/getusers`,
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                },
                params: {
                    user: document.getElementById("free-solo-2-demo").value.toLowerCase()
                }
            }).then(response => {
                console.log("backend response: ", response);
                setFoundUsers(response.data.users);
            }).catch(err => {
                console.error("Find User Error: ", err.message);
            })
    }

    function handleChange (newValue) {
        console.log("handleChange");
        getUsers(newValue.target.textContent.toLowerCase());
    }

    useEffect(() => {
        getUsers();
        getUserList();
        setNoResults(false);
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.MuiAutocomplete-root')) {
              setShowFill(false); // Close dropdown if click is outside
            }
          });
    }, [])

    useEffect(() => {
        if (inputValue.length >= 1) {
            setShowFill(true);
            getUserList(inputValue);
        } else {
            setShowFill(false);
        }
    }, [inputValue])

    useEffect(() => {
        if (foundUsers.length >= 1) {
            setShowFill(false);
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
                    getUsers(inputValue);
                }}>
                <Stack>
                <Autocomplete
                                // freeSolo
                                id="free-solo-2-demo"
                                freeSolo
                                disableClearable
                                inputValue={inputValue}
                                open={inputValue.length > 1 && showFill === true}
                                onInputChange={(e, value) => {
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
                                    handleChange(e);
                                    console.log("input changing");
                                }}
                                onClose={() => {
                                    setShowFill(false);
                                }}
                                onBlur={() => setShowFill(false)}
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
                            />
                </Stack>
            </Form >
            <div className="find-user__results d-flex flex-wrap">
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