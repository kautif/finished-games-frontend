import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getUserGames, setUserGames } from '../../redux/gamesSlice';

import axios from 'axios';
import AuthenticatedNav from '../AuthenticatedNav/AuthenticatedNav';

function AuthenticatedComponent() {
  const [data, setData] = useState([]);
  const userGames = useSelector(state => state.gamesReducer.userGames);
  let token;
  let fetchedGames;
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      console.log("fetchData");
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/protected/userid`, { withCredentials: true });
          setData(response.data);
          console.log("root: ", );
          token = localStorage.getItem("auth_token");
          window.localStorage.setItem('twitchId', data.twitchId);
          window.localStorage.setItem('twitchName', data.twitchName);
          dispatch(setUserGames(response.data.games));
          debugger
          alert("fetchData");
        } catch (error) {
          console.log("fetchData");
          alert("You are not logged in. Please log in to view this page.");
          console.error('Error fetching data from protected route', error.message);
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href='/';
          }
        }
      };
    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log("data: ", data);
  // }, [data])

  console.log("index games: ", userGames);  

  return (
    <div> 
      {data && (
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