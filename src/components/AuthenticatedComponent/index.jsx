import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserGames } from "../../redux/gamesSlice";
import AuthenticatedNav from "../AuthenticatedNav/AuthenticatedNav";
import axiosInstance from "../../service/interceptor";

function AuthenticatedComponent() {
  // const backendURL = "http://localhost:4000";
  const [data, setData] = useState([]);

  const isAuthenticated = useSelector(
    (state) => state.gamesReducer.isAuthenticated
  );
  const dispatch = useDispatch();

  // // Optional: Ensure the tab reacts immediately when it becomes active again

  // const fetchData = async () => {
  //   await axios
  //     .get(`${backendURL}/protected/userid`, {
  //       headers: {
  //         auth_token: localStorage.getItem("authToken"),
  //         refresh_token: localStorage.getItem("refreshToken"),
  //       },
  //     })
  //     .then((response) => {
  //       setData(response.data);
  //       if (response.headers?.auth_token)
  //         setItem("authToken", response.headers?.auth_token);
  //       // dispatch(setLoginTime(response.data.date));
  //       token = localStorage.getItem("auth_token");
  //       window.localStorage.setItem("twitchId", response.data.twitchId);
  //       window.localStorage.setItem("twitchName", response.data.twitchName);
  //       dispatch(setUserGames(response.data.games));
  //     })
  //     .catch((error) => {
  //       console.log("fetchData");
  //       console.error(
  //         "Error fetching data from protected route",
  //         error.message
  //       );
  //       if (error.response && error.response.status === 401) {
  //         fetchData();
  //       }
  //       if (error.response && error.response.status === 403) {
  //         window.location.href = "/";
  //         clearStorage();
  //         setItem("reload", true);
  //       }
  //     });
  // };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/protected/userid`);
      setData(response.data);
      // Set local storage items based on response data
      window.localStorage.setItem("twitchId", response.data.twitchId);
      window.localStorage.setItem("twitchName", response.data.twitchName);
      dispatch(setUserGames(response.data.games));
    } catch (error) {
      console.error("Error fetching data from protected route", error.message);
      // No need to handle 401 or 403 errors here, they are handled in the interceptor
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {isAuthenticated && (
        <div>
          {/* <h1>{JSON.stringify(data.message, null, 2)}</h1> */}
          <h1>{data.message}</h1>
          <h2>This data is from protected route</h2>
          <AuthenticatedNav />
        </div>
      )}
    </div>
  );
}

export default AuthenticatedComponent;
