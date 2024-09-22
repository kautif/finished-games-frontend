import React, {useState, useEffect} from "react";
import axios from "axios";
import "./Feedback.css"

export default function Feedback () {
    const [username, setUsername] = useState("");
    const [formData, setFormData] = useState({});
    const [topic, setTopic] = useState("games");
    const [message, setMessage] = useState("");
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
    const handleSubmit = async (e) => {
        try {
            await axios.post(`${backendURL}/send-email`, formData);
          } catch (error) {
            console.error('There was an error sending the email!', error);
          }
    }

    useEffect(() => {
        console.log(topic);
        setFormData({
            username: username,
            topic: topic,
            message: message
        })
    }, [username, message, topic])
    
    return (
        <div>
            <form className="feedback-form">
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
                    }}>
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
                    }}
                />
            </form>
        </div>
    ) 
}