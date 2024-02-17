import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import Login from './components/Login/Login';
import Splash from './components/Splash/Splash';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <div className="App">
        <Splash />
        <Login />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
