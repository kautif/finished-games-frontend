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
    const [inputValue, setInputValue] = useState("");
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";

    function getUserList () {
        axios(
            {
                url: `${backendURL}/getusers`,
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                },
                params: {
                    user: ""
                }
            }).then(response => {
                console.log("backend response: ", response);
                setUserList(response.data.users);
            }).catch(err => {
                console.error("Get all users Error: ", err.message);
            })
    }

    function getUsers (user) {
        axios(
            {
                url: `${backendURL}/getusers`,
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                },
                params: {
                    user: user
                }
            }).then(response => {
                console.log("backend response: ", response);
                setFoundUsers(response.data.users);
            }).catch(err => {
                console.error("Find User Error: ", err.message);
            })
    }

    function handleChange (newValue) {
        getUsers(newValue.target.textContent.toLowerCase());
    }

    useEffect(() => {
        getUserList("");
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.MuiAutocomplete-root')) {
              setShowFill(false); // Close dropdown if click is outside
            }
          });
    }, [])

    useEffect(() => {
        console.log("user list: ", userList);
    })

    useEffect(() => {
        if (inputValue.length > 1) {
            setShowFill(true);
        } else {
            setShowFill(false);
        }
    }, [inputValue])

    useEffect(() => {
        console.log(foundUsers);
    }, [foundUsers])

    return (
        <Container onClick={() => {
        }}>
            <Form                 
                onSubmit={(e) => {
                    e.preventDefault();
                }}>
                <Stack>
                <Autocomplete
                                // freeSolo
                                id="free-solo-2-demo"
                                disableClearable
                                inputValue={inputValue}
                                open={inputValue.length > 1 && showFill === true}
                                onInputChange={(e, value) => setInputValue(value)}
                                noOptionsText="No results found"
                                options={userList.map((option) => option.twitch_default)}
                                filterOptions={(options, state) =>
                                    options.filter((option) =>
                                      option.toLowerCase().includes(state.inputValue.toLowerCase())
                                    ).slice(0, 10)
                                  }
                                onChange={(e) => {
                                    handleChange(e);
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
            </Form>
            <div className="find-user__results d-flex flex-wrap">
                {foundUsers.map(foundUser => {
                    return (
                        <Row>
                            <Col className="mr-3">
                                <h1 className="mt-4">{foundUser.twitch_default}</h1>
                                <Image src={foundUser.profileImageUrl} alt={`${foundUser.twitchName}'s profile image`} rounded/>
                                <a class="found-user__link" href={`/${foundUser.twitchName}`}><p className="found-user__btn mt-3">See Profile</p></a>
                            </Col>
                        </Row>
                    )
                })}
            </div>
        </Container>
    ) 
}