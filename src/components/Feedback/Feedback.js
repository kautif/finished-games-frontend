import React, {useState} from "react";
import axios from "axios";

export default function Feedback () {
    const [username, setUsername] = useState("");
    const [issue, setIssue] = useState("");
    const [formData, setFormData] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/send-email', formData);
            alert('Email sent successfully!');
          } catch (error) {
            console.error('There was an error sending the email!', error);
          }
    }
    
    return (
        <div>
            <form>
                <input 
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <textarea
                    name="issue"
                    value={issue}
                    placeholder="Enter issue"
                    onChange={(e) => {
                        setIssue(e.target.value);
                    }}>
                </textarea>
                <input 
                    type="submit"
                    value="Submit"
                    onClick={(e) => {
                        e.preventDefault();
                        setFormData({
                            username: username,
                            issue: issue
                        })
                        handleSubmit(e);
                    }}
                />
            </form>
        </div>
    ) 
}