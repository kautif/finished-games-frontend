import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    userGames: [],
    reportUser: "",
    isAuthenticated: false
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
        }
    }
})

export const {setUserGames, setIsAuthenticated, setReportUser} = gamesSlice.actions;
export default gamesSlice.reducer;