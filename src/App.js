import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import Login from './components/Login/Login';
import Splash from './components/Splash/Splash';
import TwitchLoginBtn from './components/TwitchLoginBtn/TwitchLoginBtn';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <div className="App">
        <Splash />
        <Login />
        <TwitchLoginBtn />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
