import React, {useState} from "react"
import "./Donate.css";

export default function Donate () {
    return (
        <div>
            <p className="donate__origin">This website is a collaboration between <a href="https://www.twitch.tv/StepOne_DrawCircle" target="_blank">StepOne_DrawCircle</a> & <a href="https://www.twitch.tv/MinisterGold" target="_blank">MinisterGold</a></p>
            <div className="donate-container">
                <iframe id='kofiframe' src='https://ko-fi.com/victoryhistory/?hidefeed=true&widget=true&embed=true&preview=true' styles={'border:none;width:100%;padding:4px;background:#f9f9f9;'} height='712' title='victoryhistory'></iframe>
                <div className="donate__justify">
                    <p>Your support keeps this site running!</p>
                    <p>Current Cost: $xxx</p>
                    <p>This cost includes hosting, domain registration, servers, and databases</p>
                    <p>If you want to report an issue, please contact us at <a mailto="support@victoryhistory.gg">support@victoryhistory.gg</a></p>
                </div>
                {/* <p>If you'd like to donate to <a href="https://www.twitch.tv/StepOne_DrawCircle" target="_blank">StepOne</a> and <a href="https://www.twitch.tv/MinisterGold" target="_blank">MinisterGold</a>, please go <a href="#">here</a>. Thanks</p> */}
                {/* <h2>What is Victory History</h2>
                <p>This site is both for people who want to see what games their friends and streamers are playing and what they think of them. And, its also for people on Twitch, whether streamers or not to show the games they like to play and share their thoughts on it as well. There are also features to help you search through and sort their games.</p>

                <h2>Who made this and why?</h2>
                <p>On Twitch, their names are <a href="https://www.twitch.tv/StepOne_DrawCircle" target="_blank">StepOne_DrawCircle</a> and <a href="https://www.twitch.tv/MinisterGold" target="_blank">MinisterGold</a>. StepOne DMed Gold about his idea for an app where users can search for games, put their thoughts, rating, date of completion etc. Gold thought on it for a day or so and then agreed it was a good idea. So, Gold got to work. StepOne has the visual expertise and Gold has the development skill. They coordinate regularly to make sure they're on the same page for the direction of the app.</p>

                <p>Hello. This is Gold speaking now instead of talking from a 3rd person perspective. I wanted to say a little more about why I ended up devoting time to this project. I worked on this project 30 minutes per day before I headed to work. I would get up at 430 in the morning on days I went to the gym and 6 am if I didn't. And then, finally, I decided to pump more time into this project after I got back from work if I wasn't streaming.</p>
                <p>Ultimately, I had a few reasons for agreeing to work with StepOne on this project. #1 I really do think this is a good idea. It's practical. Because what's the alternative? Making a spreadsheet? It's not user friendly in terms of adding games, searching for them, looking at other people's games. #2 I wanted a way to create value. I do care about having some significance/value, about doing something useful for others. Because if you don't create something that people find useful, if you don't have a source of interest, then why would people care about you. So, that was the combination of reasons for why I ended up getting involved with this project.</p> */}
            </div>
        </div>
    )
}