import React, {useEffect, useState} from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Form from 'react-bootstrap/Form';
import "./Report.css"
import { ToastContainer, toast } from "react-toastify";

export default function Report () {    
    // const reportUser = useSelector((state) => state.gamesReducer.reportUser);
    console.log("reportUser", localStorage.getItem("reportUser"));
    console.log("reporting user", localStorage.getItem("twitchName"));
    let twitchId = localStorage.getItem("twitchId");

    const [report, setReport] = useState(localStorage.getItem("reportUser"));
    const [issue, setIssue] = useState("game");
    const [details, setDetails] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [validated, setValidated] = useState(false);
    const [hasSubmittedRecently, setHasSubmittedRecently] = useState(false);
    const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";

    function notify (user) {
        toast(`${user} has been reported. Thank you`, {
            autoClose: 1000,
            position: "top-center",
            onClose: () => {
                window.location.reload();
            }
        });
    }

    function notifyReportDenied (user) {
        toast(`You've already reported a user today. Thank you`, {
            autoClose: 1000,
            position: "top-center"
        });
    }

    let reportInstance;
    let reportMonth;
    let reportDay;
    let reportYear;
    let currentMonth = new Date().getMonth() + 1;
    let currentDay = new Date().getDate();
    let currentYear = new Date().getFullYear();
    async function getReports () {
        await axios(`${backendURL}/report`, {
            method: "get",
            params: {
                twitchId: twitchId
            }
        }).then(results => {
            reportInstance = results;
            for (let i = 0; i < reportInstance.data.response.length; i++) {
                let datePosted = new Date(reportInstance.data.response[i].date);
                reportMonth = datePosted.getMonth() + 1;
                reportDay = datePosted.getDate();
                reportYear = datePosted.getFullYear();
                if (reportMonth === currentMonth && 
                    reportYear === currentYear &&
                    Math.abs(currentDay - reportDay) < 1
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
        setValidated(true);
        if (validated === true) {
            const date = new Date();
            await axios.post(`${backendURL}/send-report`, {
                twitchId: twitchId,
                date: date,
                user: report,
                issue: issue,
                details: details
            }).then(response => {
            }).catch (error => {
                console.error('There was an error sending the email!', error);
            })
        }
    }

    useEffect(() => {
        // getReports();
        if (hasSubmittedRecently) {
            notifyReportDenied();
        }
    }, [hasSubmittedRecently])

    useEffect(() => {
        // setSubmitted(false);
        if (report.length > 0 && details.length > 0) {
            setValidated(true);
        } else {
            setValidated(false);
        }
    }, [report, issue, details])

    useEffect(() => {
        setTimeout(function () {
            if (submitted === true && validated === true) {
                setReport("");
                setIssue("game");
                setDetails("");
            }
        }, 1000)
    }, [submitted, validated])



    return (
        <div className="report-container">
            <Form noValidate validated={validated} 
                className="feedback-form needs-validation" 
                onSubmit={(e) => {
                    e.preventDefault();
                    if (hasSubmittedRecently) {
                        notifyReportDenied();
                        return false; 
                    }
            }}>
                <Form.Group>
                    <Form.Control 
                    className="report__field" 
                    required value={report} 
                    placeholder="Enter username" 
                    onChange={(e) => {
                        setReport(e.target.value);
                    }}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter your username
                    </Form.Control.Feedback>
                </Form.Group>
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
                    <Form.Group>
                        <label>Details</label>
                        <Form.Control 
                            as={"textarea"} 
                            className="report__field" 
                            required 
                            placeholder="Tell us what the issue is. Step by step, tell us what actions/events take place to lead to it" 
                            value={details} 
                            onChange={(e) => {
                            setDetails(e.target.value);
                        }} />
                        <Form.Control.Feedback type="invalid">
                            Please enter your feedback
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
                <input className={`report__submit-btn ${!hasSubmittedRecently ? "report__submit__enabled" : "report__submit__disabled"}`} disabled={hasSubmittedRecently} type="submit" value="Submit" onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                    if (validated) {
                        notify(report);
                        setSubmitted(true);
                    }
                }}/>
            </Form>
            <ToastContainer />
        </div>
    )
}