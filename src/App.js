import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import Login from './components/Login/Login';
import Splash from './components/Splash/Splash';

function App() {
  return (
    <GoogleOAuthProvider clientId="236510260850-4dn34qg1pvrmffa4bp84ik7qtjan7qud.apps.googleusercontent.com">
      <div className="App">
        <Splash />
        <Login />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
