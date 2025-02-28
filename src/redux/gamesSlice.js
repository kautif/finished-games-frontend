import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    userGames: [],
    reportUser: "",
    isAuthenticated: false,
    showGame: false,
    showSearch: true,
    imagesRendered: false,
    searchGameName: "",
    searchGameImg: "",
    loginTime: 0
}

let twitchId;
const backendURL = process.env.REACT_APP_NODE_BACKEND || "http://localhost:4000";
let twitchName = window.localStorage.getItem("twitchName");
export const gamesSlice = createSlice({
    name: "games",
    initialState,
    reducers: {
        setUserGames: (state, action)  => {
            state.userGames = [...action.payload];
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
            console.log("gamesSlice isAuthenticated: ", state.isAuthenticated);
        },
        setReportUser: (state, action) => {
            state.reportUser = action.payload;
            console.log("gamesSlice reportUser", action.payload);
        },
        setLoginTime: (state, action) => {
            state.loginTime = action.payload;
            console.log("gamesSlice loginTime: ", action.payload);
        },
        setShowGame: (state, action) => {
            state.showGame = action.payload;
            console.log("gamesSlice showGame?: ", action.payload);
        },
        setShowSearch: (state, action) => {
            state.showSearch = action.payload;
            console.log("gamesSlice showSearch?: ", action.payload);
        },
        setSearchGameName: (state, action) => {
            state.searchGameName = action.payload;
            console.log("gamesSlice searchGameName?: ", action.payload);
        },
        setSearchGameImg: (state, action) => {
            state.searchGameImg = action.payload;
            console.log("gamesSlice searchGameImg?: ", action.payload);
        },
        setImagesRendered: (state, action) => {
            state.imagesRendered = action.payload;
            console.log("gamesSlice imagesRendered: ", action.payload);
        }
    }
})

export const {setUserGames, setIsAuthenticated, setReportUser, setLoginTime, setShowGame, setShowSearch, setSearchGameName, setSearchGameImg, setImagesRendered} = gamesSlice.actions;
export default gamesSlice.reducer;