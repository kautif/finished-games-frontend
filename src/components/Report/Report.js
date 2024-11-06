import React, {useEffect, useState} from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./Report.css"
import { ToastContainer, toast } from "react-toastify";

export default function Report () {    
    // const reportUser = useSelector((state) => state.gamesReducer.reportUser);
    console.log("reportUser", localStorage.getItem("reportUser"));
    console.log("reporting user", localStorage.getItem("twitchName"));

    const [report, setReport] = useState(localStorage.getItem("reportUser"));
    const [issue, setIssue] = useState("game");
    const [details, setDetails] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";

    function notify (user) {
        toast(`${user} has been reported. Thank you`);
    }

    async function handleSubmit (e) {
        await axios.post(`${backendURL}/send-report`, {
            user: report,
            issue: issue,
            details: details
        }).then(response => {
        }).catch (error => {
            console.error('There was an error sending the email!', error);
        })
    }

    useEffect(() => {
        setSubmitted(false);
    }, [report, issue, details])

    useEffect(() => {
        setTimeout(function () {
            if (submitted === true) {
                setReport("");
                setIssue("game");
                setDetails("");
            }
        }, 1000)
    }, [submitted])

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
                    }} value={issue}>
                        <option value="game">Game</option>
                        <option value="summary">Summary</option>
                        <option value="user">User</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="report__details">
                    <label>Details</label>
                    <textarea className="report__field" required placeholder="Tell us what the issue is. Step by step, tell us what actions/events take place to lead to it" value={details} onChange={(e) => {
                        setDetails(e.target.value);
                    }}></textarea>
                </div>
                <input className="report__submit-btn" type="submit" value="Submit" onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                    notify(report);
                    setSubmitted(true);
                }}/>
            </form>
            <ToastContainer />
        </div>
    )
}