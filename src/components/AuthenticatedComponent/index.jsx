import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AuthenticatedComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/protected/userid`, { withCredentials: true });
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data from protected route', error);
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
          <h1>{JSON.stringify(data, null, 2)}</h1>
          <h2>This data is from protected route</h2>
        </div>
      )}
    </div>
  );
}

export default AuthenticatedComponent;