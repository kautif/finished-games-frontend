import React, {useEffect, useState} from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./Report.css"

export default function Report () {    
    // const reportUser = useSelector((state) => state.gamesReducer.reportUser);
    console.log("reportUser", localStorage.getItem("reportUser"));
    console.log("reporting user", localStorage.getItem("twitchName"));

    const [report, setReport] = useState(localStorage.getItem("reportUser"));
    const [issue, setIssue] = useState("game");
    const [details, setDetails] = useState("");

    const handleSubmit = async (e) => {
        try {
            await axios.post('http://localhost:4000/send-report', {
                user: report,
                issue: issue,
                details: details
            });
          } catch (error) {
            console.error('There was an error sending the email!', error);
          }
    }

    return (
        <div className="report-container">
            <form>
                <input className="report__field" required value={report} placeholder="Enter username" onChange={(e) => {
                    setReport(e.target.value);
                }}/>
                <div className="report__issue">
                    <label>Issue</label>
                    <select required onChange={(e) => {
                        setIssue(e.target.value);
                    }}>
                        <option value="game">Game</option>
                        <option value="summary">Summary</option>
                        <option value="user">User</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="report__details">
                    <label>Details</label>
                    <textarea className="report__field" required placeholder="Tell us what the issue is. Step by step, tell us what actions/events take place to lead to it" onChange={(e) => {
                        setDetails(e.target.value);
                    }}></textarea>
                </div>
                <input className="report__submit-btn" type="submit" value="Submit" onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}/>
            </form>
        </div>
    )
}