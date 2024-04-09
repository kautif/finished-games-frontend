import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedNav from '../AuthenticatedNav/AuthenticatedNav';

function AuthenticatedComponent() {
  const [data, setData] = useState(null);
  let token;

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/protected/userid`, { withCredentials: true });
          setData(response.data);
          console.log("data: ", data);
          token = localStorage.getItem("auth_token");
          window.localStorage.setItem('twitchId', data.twitchId);
          window.localStorage.setItem('twitchName', data.twitchName);
        } catch (error) {
          console.error('Error fetching data from protected route', error.message);
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href='/';
          }
        }
      };
    fetchData();
  }, []);

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