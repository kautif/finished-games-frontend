import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getItem } from "../../utils/localStorage";
import { setIsAuthenticated } from "../../redux/gamesSlice";
import { handleUnauthorizedRedirect } from "../../utils";
import "./AuthenticatedNav.css";

export default function AuthenticatedNav() {
  const dispatch = useDispatch();

  const backendURL =
    process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
  function logout() {
    axios({
      url: `${backendURL}/logout`,
      method: "POST",
      headers: {
        Accept: "application/json",
        authorization: getItem("twitchToken"),
      },
    })
      .then((response) => {
        dispatch(setIsAuthenticated(false));
        handleUnauthorizedRedirect();
      })
      .catch((err) => {
        console.error("error: ", err.message);
      });
  }

  return (
    <ul className="auth-nav">
      <Link className="auth-nav__link" to="/games">
        My Games
      </Link>
      <Link className="auth-nav__link" to="/browseusers">
        Browse Users
      </Link>
      <Link className="auth-nav__link" to="/donate">
        Donate
      </Link>
      <Link className="auth-nav__link" to="/feedback">
        Feedback
      </Link>
      <p className="auth-nav__link" onClick={() => logout()}>
        Logout
      </p>
    </ul>
  );
}
