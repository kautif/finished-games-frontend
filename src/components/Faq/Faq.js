import React from "react";
import "./Faq.css";

export default function Faq () {
    return (
        <div>
            <h1>Frequently Asked Questions</h1>
            <div className="faq-container">
                <div className="faq-item">
                    <h2>How do I login to another Twitch account?</h2>
                    <p>Unfortunately, the only way you'll be able to for now is to go to Twitch, log out, and log back in with your other account</p>
                </div>
            </div>
        </div>
    )
}