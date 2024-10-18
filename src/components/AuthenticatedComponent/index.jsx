import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleUnauthorizedRedirect } from "../../utils";
import AuthenticatedNav from "../AuthenticatedNav/AuthenticatedNav";
import { setIsAuthenticated, setUserGames } from "../../redux/gamesSlice";
import { getUserInfo } from "../../service";
import "./index.css";

function AuthenticatedComponent() {
  const [data, setData] = useState();

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

  // const intervalIdRef = useRef(null); // Store the interval ID
  // const startNewInterval = (intervalTime) => {
  //   console.log("intervalTime", intervalTime);

  //   // Clear any existing interval
  //   if (intervalIdRef.current) {
  //     clearInterval(intervalIdRef.current);
  //   }

  //   // Start a new interval
  //   intervalIdRef.current = setInterval(async () => {
  //     console.log("Interval is running");
  //     clearInterval(intervalIdRef.current);
  //     const time = await fetchTime(); // Use await to get the resolved value
  //     console.log({ time });
  //     if (time) startNewInterval(time);
  //     // Your interval logic here
  //   }, intervalTime); // 1000 ms = 1 second
  // };

  // const fetchTime = async () => {
  //   try {
  //     const response = await axiosInstance.post(
  //       "http://localhost:4000/check-access-token"
  //     );

  //     // Log the response for debugging

  //     return response?.data?.time; // Return the time from the original response
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const fetchTimeAndStartInterval = async () => {
  //   if (isAuthenticated) {
  //     const time = await fetchTime(); // Use await to get the resolved value
  //     console.log({ time });
  //     if (time) startNewInterval(time);
  //   }
  // };

  // useEffect(() => {
  //   fetchTimeAndStartInterval(); // Call the async function
  //   // Cleanup function to clear the interval on component unmount
  //   return () => {
  //     if (intervalIdRef.current) {
  //       clearInterval(intervalIdRef.current);
  //     }
  //   };
  // }, [isAuthenticated, token]);

  const fetchData = async () => {
    try {
      const response = await getUserInfo();

      setData(response.data);
      // Set local storage items based on response data
      window.localStorage.setItem("twitchId", response.data.twitchId);
      window.localStorage.setItem("twitchName", response.data.twitchName);
      dispatch(setUserGames(response.data.games));
    } catch (error) {
      console.error("Error fetching data from protected route", error.message);
      handleUnauthorizedRedirect();
      dispatch(setIsAuthenticated(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {isAuthenticated &&
        (data ? (
          <div>
            {/* <h1>{JSON.stringify(data.message, null, 2)}</h1> */}
            <h1>{data?.message}</h1>
            <h2>This data is from protected route</h2>
            <AuthenticatedNav />
          </div>
        ) : (
          <div className="fetching-data">
            <h1>Fetching your data from server</h1>
            <p>This may take a while</p>
          </div>
        ))}
    </div>
  );
}

export default AuthenticatedComponent;
