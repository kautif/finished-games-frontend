import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FindUser.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import Form from 'react-bootstrap/Form';

export default function FindUser () {
    const [user, setUser] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);
    const [userList, setUserList] = useState([]);
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

    useEffect(() => {
        getUserList("");
    }, [])

    useEffect(() => {
        console.log("user list: ", userList);
    })

    useEffect(() => {
        console.log(foundUsers);
    }, [foundUsers])

    return (
        <Container>
            <Form>
                <input placeholder="Enter username or term" onChange={(e) => setUser(e.target.value.toLowerCase())}/>
                <input type="submit" value="Submit" onClick={(e) => {
                    e.preventDefault();
                    getUsers(user);
                }}/>
            </Form>
            <div className="find-user__results d-flex flex-wrap">
                {foundUsers.map(foundUser => {
                    return (
                        <Row>
                            <Col>
                                <h1 className="mt-4">{foundUser.twitch_default}</h1>
                                <Image src={foundUser.profileImageUrl} alt={`${foundUser.twitchName}'s profile image`} rounded/>
                                <p className="found-user__btn mt-3"><a href={`/${foundUser.twitchName}`}>See Profile</a></p>
                            </Col>
                        </Row>
                    )
                })}
            </div>
        </Container>
    ) 
}