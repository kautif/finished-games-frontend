import React, {useState, useEffect} from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast } from 'react-toastify';
import "./Feedback.css"
import { current } from "@reduxjs/toolkit";

export default function Feedback () {
    const [username, setUsername] = useState("");
    const [formData, setFormData] = useState({});
    const [topic, setTopic] = useState("games");
    const [message, setMessage] = useState("");
    const [validated, setValidated] = useState(false);
    const [hasSubmittedRecently, setHasSubmittedRecently] = useState(false);
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [captcha, setCaptcha] = useState(null);
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    let twitchId = window.localStorage.getItem("twitchId");
    function notify () {
        toast("Feedback Submitted", {
            autoClose: 1000,
            position: "top-center",
            onClose: () => {
                window.location.reload();
            }
        });
    }

    function notifyFeedbackDenied () {
        toast("We've already received your feedback for today. Thank you", {
            autoClose: 1000,
            position: "top-center"
        });
    }

    let feedback;
    let feedbackMonth;
    let feedbackDay;
    let feedbackYear;
    let currentMonth = new Date().getMonth() + 1;
    let currentDay = new Date().getDate();
    let currentYear = new Date().getFullYear();
    async function getFeedback () {
        await axios(`${backendURL}/feedback`, {
            method: "get",
            params: {
                twitchId: twitchId
            }
        }).then(results => {
            feedback = results;
            for (let i = 0; i < feedback.data.response.length; i++) {
                let datePosted = new Date(feedback.data.response[i].date);
                feedbackMonth = datePosted.getMonth() + 1;
                feedbackDay = datePosted.getDate();
                feedbackYear = datePosted.getFullYear();
                if (feedbackMonth === currentMonth && 
                    feedbackYear === currentYear &&
                    Math.abs(currentDay - feedbackDay) < 1
                ) {
                    setHasSubmittedRecently(true);
                    break;
                }
            }
        })
    }

    async function handleSubmit (e) {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
          e.preventDefault();
          e.stopPropagation();
        }

        if (username.length > 0 && message.length > 0) {
            setValidated(true);
        } else {
            setValidated(false);
        }

        if (!hasSubmittedRecently && validated === true) {
            await axios.post(`${backendURL}/send-email`, formData)
            .then(response => {
            }).catch(err => {
                console.error("Error: ", err.message);
            })
        }
    }

    useEffect(() => {
        console.log("captcha: ", process.env.REACT_APP_CAPTCHA_SITE_KEY);
    }, [])

    useEffect(() => {
        // getFeedback();
        // if (hasSubmittedRecently) {
        //     notifyFeedbackDenied();
        // }
    }, [hasSubmittedRecently])

    useEffect(() => {
        if (username.length === 0 || message.length === 0) {
            setValidated(false);
        } else {
            setValidated(true);
        }

        const date = new Date();
        setFormData({
            username: username,
            twitchId: twitchId,
            topic: topic,
            message: message,
            date: date
        })
        setFeedbackSent(false);
    }, [username, message, topic])

    useEffect(() => {
        if (validated === true) {
            setTimeout(function () {
                setUsername("");
                setMessage("")
                setTopic("games");
            }, 1000)
        }
    }, [feedbackSent])
    
    return (
        <div>
                <Form noValidate validated={true} className="feedback-form needs-validation" 
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (hasSubmittedRecently) {
                            return false;
                        }
                    }}>
                        <Form.Group>
                        <Form.Control 
                        id="feedback-username"
                        className="feedback-field"
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        value={username}
                        required
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (e.target.value.length < 1) {
                                setValidated(false);
                            }
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter your username
                    </Form.Control.Feedback>
                        </Form.Group>
                    <div className="topic-flex">
                        <label>Topic:</label>
                        <select onChange={(e) => {
                            setTopic(e.target.value);
                        }} value={topic}>
                            <option value="games">Games</option>
                            <option value="custom">Custom Games</option>
                            <option value="searching">Searching Games</option>
                            <option value="adding">Adding Games</option>
                            <option value="updating">Updating Games</option>
                            <option value="deleting">Deleting Games</option>
                            <option value="logout">Logout</option>
                            <option value="login">Login</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <Form.Group>
                    <Form.Control as="textarea"
                        className="feedback-field"
                        required
                        name="message"
                        value={message}
                        placeholder="Enter message"
                        onChange={(e) => {
                            setMessage(e.target.value);
                            if (e.target.value.length < 1) {
                                setValidated(false);
                            }
                        }}/>

                <Form.Control.Feedback type="invalid">
                    Please enter feedback
                </Form.Control.Feedback>
                    </Form.Group>
                    {(username.length > 0 && message.length > 0) && <ReCAPTCHA
                sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
                onChange={(e) => {
                    console.log("captcha: ", e);
                    setCaptcha(e);
                }}
                ></ReCAPTCHA>}
                    <input
                        id="feedback-btn" 
                        className="feedback-field"
                        type="submit"
                        value="Submit"
                        disabled={captcha !== null ? "" : true}
                        onClick={(e) => {
                            e.preventDefault();
                            setFeedbackSent(true);
                            handleSubmit(e);
                            if (validated) {
                                notify();
                            }
                        }}
                    />
                </Form>
            <ToastContainer />
        </div>
    ) 
}