import React, {useState, useEffect} from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import "./Feedback.css"

export default function Feedback () {
    const [username, setUsername] = useState("");
    const [formData, setFormData] = useState({});
    const [topic, setTopic] = useState("games");
    const [message, setMessage] = useState("");
    const [feedbackSent, setFeedbackSent] = useState(false);
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    async function handleSubmit (e) {
        await axios.post(`${backendURL}/send-email`, formData)
            .then(response => {
            }).catch(err => {
                console.error("Error: ", err.message);
            })
        // try {
        //   } catch (error) {
        //     console.error('There was an error sending the email!', error);
        //   }
    }

    useEffect(() => {
        setFormData({
            username: username,
            topic: topic,
            message: message
        })
        setFeedbackSent(false);
    }, [username, message, topic])

    useEffect(() => {
        setTimeout(function () {
            setUsername("");
            setMessage("")
            setTopic("games");
        }, 1000)
    }, [feedbackSent])
    
    return (
        <div>
            <Form className="feedback-form" 
                onSubmit={() => {
                    console.log("submit");
                }}>
                <input 
                    id="feedback-username"
                    className="feedback-field"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
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
                <textarea
                    className="feedback-field"
                    name="message"
                    value={message}
                    placeholder="Enter message"
                    onChange={(e) => {
                        setMessage(e.target.value);
                    }}>
                </textarea>
                <input
                    id="feedback-btn" 
                    className="feedback-field"
                    type="submit"
                    value="Submit"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                        setFeedbackSent(true);
                    }}
                />
            </Form>
            {feedbackSent && <p>Feedback Submitted</p>}
        </div>
    ) 
}