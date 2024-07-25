import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    userGames: [],
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
        }
    }
})

export const {setUserGames, setIsAuthenticated} = gamesSlice.actions;
export default gamesSlice.reducer;