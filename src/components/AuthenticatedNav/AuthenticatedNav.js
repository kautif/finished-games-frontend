import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getItem } from "../../utils/localStorage";
import { setIsAuthenticated } from "../../redux/gamesSlice";
import { handleUnauthorizedRedirect } from "../../utils";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import VHLogo from '../../assets/VH_Title_v3.png'
import "./AuthenticatedNav.css";
import { toast, ToastContainer } from "react-toastify";
import Button from "react-bootstrap/esm/Button";

export default function AuthenticatedNav() {
  const dispatch = useDispatch();
  let twitchName = window.localStorage.getItem("twitchName");
  let twitchId = window.localStorage.getItem("twitchId");
  let username = window.localStorage.getItem("username"); // For username/password users
  console.log("AuthNav username: ", username);
  const [profileImg, setProfileImg] = useState("");
  const [defaultName, setDefaultName] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
  const navigate = useNavigate();
  
  // Determine display name (prefer twitchName, fallback to username)
  let displayName;

  if (twitchName === "undefined") {
    displayName = username;
  } else {
    displayName = twitchName;
  }

  function logout() {
    const authToken = getItem("authToken");
    const twitchToken = getItem("twitchToken");

    axios({
      url: `${backendURL}/logout`,
      method: "POST",
      headers: {
        Accept: "application/json",
        authorization: authToken || twitchToken, // Send JWT token or Twitch token
      },
      data: {
        twitchToken: twitchToken, // Send Twitch token in body if exists (for Twitch OAuth users)
        authToken
      }
    })
      .then((response) => {
        console.log("Logout successful:", response.data.message);
        dispatch(setIsAuthenticated(false));
        handleUnauthorizedRedirect();
      })
      .catch((err) => {
        console.error("Logout error: ", err.message);
        // Still logout on frontend even if backend fails
        dispatch(setIsAuthenticated(false));
        handleUnauthorizedRedirect();
      });
  }

  function getUser(username) {
    if (!username) return; // Don't fetch if no username
    
    axios({
        method: 'get',
        url: `${backendURL}/api/user`,
        params: {
            username: username
        }
    }).then(response => {
      if (response.data.user) {
        setProfileImg(response.data.user.profileImageUrl || "");
        setDefaultName(response.data.user.twitch_default || response.data.user.username || username);
      }
    }).catch(err => {
        console.log("Error fetching user data:", err.message);
        // Set default name even if fetch fails
        setDefaultName(username);
    })
}

function deleteUser (user) {
  let config = {
      data: {
          twitchName: defaultName,
          twitchId: twitchId
      }
  }

  axios.delete(`${backendURL}/deleteuser`, config)
    .then(response => {

    }).catch(err => {
        console.error("Failed to delete: ", err.message);

    })
}

function notifyDeleteUser () {
  toast(`Account Deleted. Login to recreate.`, {
      position: "top-center",
      autoClose: 1000,
      onClose: () => {
          window.location.reload();
      }
  });
}

function handleClose () {
  setShowDelete(false);
}

useEffect(() => {
  // Fetch user data using displayName (works for both auth types)
  if (displayName) {
    getUser(displayName);
    setDefaultName(displayName);
  }
}, [displayName])

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </a>
));

  return (
    <div>
        <div className="auth-nav__profile-img-container">
            <div className="auth-nav__profile-flex">
              {profileImg ? (
                <img id="auth-nav__profile-img" src={profileImg} alt="Profile" />
              ) : (
                <div id="auth-nav__profile-img" style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  {defaultName ? defaultName.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <Dropdown id="dropdown__settings">
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                  <span id="user-settings__gear">&#9881;</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="1" onClick={() => {
                              setShowDelete(true);
                          }}>Delete Account</Dropdown.Item>
                  <Dropdown.Item className="dropdown-link" eventKey="2" onClick={() => {
                    navigate("/feedback");
                  }}>Feedback</Dropdown.Item>
                  <Dropdown.Item className="dropdown-link" eventKey="3" onClick={() => {
                    navigate("/faq");
                  }}>FAQ</Dropdown.Item>
                  <Dropdown.Item eventKey="4"><p className="auth-nav__link" onClick={() => logout()}>Logout</p></Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
          <p id="auth-nav__profile__name">{defaultName}</p>
            </div>
          <Link to="/games"><img className="auth-nav__logo" src={VHLogo} /></Link>
        </div>
        <ul className="auth-nav">
          <Link className={window.location.pathname == "/games" ? "auth-nav__link auth-nav__link__selected" : "auth-nav__link"} to="/games">
            My Games
          </Link>
          <Link className={window.location.pathname == "/browseusers" ? "auth-nav__link auth-nav__link__selected" : "auth-nav__link"} to="/browseusers">
            Browse Users
          </Link>
          <Link className={window.location.pathname == "/donate" ? "auth-nav__link auth-nav__link__selected" : "auth-nav__link"} to="/donate">
            Donate
          </Link>
        </ul>
        <Modal show={showDelete} onHide={() => {
          handleClose();
        }}id="delete-modal">
          <Modal.Header>
              <Modal.Title id="delete-modal__title">
                  <h2>Delete Account</h2>    
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
                  <p>If you click on delete, you will lose all your games and users will not be able to find you. Click the Delete button if you want to continue or the Cancel button if you've changed your mind.</p>
                  <div className="delete-btns-container">
                      <Button variant="danger" 
                          onClick={() => {
                            deleteUser(twitchName);
                            notifyDeleteUser();
                      }}>Delete</Button>
                      <Button
                          onClick={() => {
                              setShowDelete(false);
                          }}>
                          Cancel
                      </Button>
                  </div>
          </Modal.Body>
        </Modal>
        <ToastContainer />
    </div>
  );
}
