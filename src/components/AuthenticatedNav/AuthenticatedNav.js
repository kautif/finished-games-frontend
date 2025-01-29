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
import "./AuthenticatedNav.css";
import { toast, ToastContainer } from "react-toastify";
import Button from "react-bootstrap/esm/Button";

export default function AuthenticatedNav() {
  const dispatch = useDispatch();
  let twitchName = window.localStorage.getItem("twitchName");
  let twitchId = window.localStorage.getItem("twitchId");
  const [profileImg, setProfileImg] = useState("");
  const [defaultName, setDefaultName] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const backendURL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:4000";
  const navigate = useNavigate();

  function logout() {
    axios({
      url: `${backendURL}/logout`,
      method: "POST",
      headers: {
        Accept: "application/json",
        authorization: getItem("twitchToken"),
      },
    })
      .then((response) => {
        dispatch(setIsAuthenticated(false));
        handleUnauthorizedRedirect();
      })
      .catch((err) => {
        console.error("error: ", err.message);
      });
  }

  function getUser(username) {
    axios({
        method: 'get',
        url: `${backendURL}/api/user`,
        params: {
            username: username
        }
    }).then(response => {
      setProfileImg(response.data.user.profileImageUrl);
      setDefaultName(response.data.user.twitch_default);
    }).catch(err => {
        console.log("error");
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
  getUser(twitchName);
}, [])

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
    &#x25bc;
  </a>
));

// const CustomMenu = React.forwardRef(
//   ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
//     const [value, setValue] = useState('');

//     return (
//       <div
//         ref={ref}
//         style={style}
//         className={className}
//         aria-labelledby={labeledBy}
//       >
//         <Form.Control
//           autoFocus
//           className="mx-3 my-2 w-auto"
//           placeholder="Type to filter..."
//           onChange={(e) => setValue(e.target.value)}
//           value={value}
//         />
//         <ul className="list-unstyled">
//           {React.Children.toArray(children).filter(
//             (child) =>
//               !value || child.props.children.toLowerCase().startsWith(value),
//           )}
//         </ul>
//       </div>
//     );
//   },
// );

  return (
    <div>
        <div className="auth-nav__profile-img-container">
          <img id="auth-nav__profile-img" src={profileImg} />
          {/* <Dropdown size="sm" id="user-settings">
                <Dropdown.Toggle id="dropdown-basic">
                        <span id="user-settings__gear">&#9881;</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {
                        setShowDelete(true);
                    }}>Delete Account</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> */}
            <Dropdown>
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
            <Dropdown.Item eventKey="4" active><p className="auth-nav__link" onClick={() => logout()}>Logout</p></Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

          <p id="auth-nav__profile__name">{defaultName}</p>
        </div>
        <ul className="auth-nav">
          <Link className="auth-nav__link" to="/games">
            My Games
          </Link>
          <Link className="auth-nav__link" to="/browseusers">
            Browse Users
          </Link>
          <Link className="auth-nav__link" to="/donate">
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
