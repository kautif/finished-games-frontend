import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getUserGames, setUserGames } from '../../redux/gamesSlice';
import { setIsAuthenticated } from "../../redux/gamesSlice";
import axios from 'axios';
import AuthenticatedNav from '../AuthenticatedNav/AuthenticatedNav';
import { clearStorage } from '../../utils/localStorage';
import { useNavigate } from 'react-router-dom';

function AuthenticatedComponent() {
      const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
      // const backendURL = "http://localhost:4000";
  const [data, setData] = useState([]);
  const userGames = useSelector(state => state.gamesReducer.userGames);
  let token;
  let fetchedGames;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  function logout () {
    axios({
        url: `${backendURL}/logout`,
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'auth_token': localStorage.getItem("authToken"),
            'twitch_token':   localStorage.getItem("twitchToken"),
        },
    }).then(response => {
        dispatch(setIsAuthenticated(false));
        clearStorage();
        navigate('/');
    }).catch(err => {
        console.error("error: ", err.message);
    })
}

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
      {data &&
        <div>
          {/* <h1>{JSON.stringify(data.message, null, 2)}</h1> */}
          <h1>{data.message}</h1>
          <h2>This data is from protected route</h2>
          <AuthenticatedNav />
        </div>
      }
    </div>
  );
}

export default AuthenticatedComponent;