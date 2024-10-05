import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getUserGames, setUserGames, setLoginTime } from '../../redux/gamesSlice';

import axios from 'axios';
import AuthenticatedNav from '../AuthenticatedNav/AuthenticatedNav';
import { clearStorage } from '../../utils/localStorage';

function AuthenticatedComponent() {
      const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
      // const backendURL = "http://localhost:4000";
  const [data, setData] = useState([]);
  const userGames = useSelector(state => state.gamesReducer.userGames);
  const loginTime = useSelector(state => state.gamesReducer.loginTime);
  const isAuthenticated = useSelector(state => state.gamesReducer.isAuthenticated);
  let token;
  let fetchedGames;
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
        await axios.get(`${backendURL}/protected/userid`, 
          {
            headers: {
              'auth_token': localStorage.getItem("authToken"),
            }
          }
        ).then(response => {
          setData(response.data);
          // dispatch(setLoginTime(response.data.date));
          token = localStorage.getItem("auth_token");
          window.localStorage.setItem('twitchId', response.data.twitchId);
          window.localStorage.setItem('twitchName', response.data.twitchName);
          dispatch(setUserGames(response.data.games));
        }).catch (error => {
          console.log("fetchData");
          console.error('Error fetching data from protected route', error.message);
          if (error.response && error.response.status === 401) {
            window.location.href = '/';
            clearStorage();
          }
        })
      };
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