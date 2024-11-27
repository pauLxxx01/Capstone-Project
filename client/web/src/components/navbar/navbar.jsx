import Message from "../../assets/icons/navbar/message.svg";
import Account from "../../assets/icons/navbar/account.svg";
import "./navbar.scss";
import { Link, useLocation } from "react-router-dom";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from "react";
import { useSocket } from "../../socket/Socket";
import { useEffect } from "react";

const navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const [notificationCount, setNotificationCount] = useState(0);
  const [notification, setNotification] = useState([])
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("notification", (notif) => {
        setNotificationCount((prev) => prev + 1); // Increment count by 1
        setNotification([...notification, notif]);
      });
    }
  }, [socket])
    // Handle the button click to refresh the page
    const handleRefresh = () => {
      setNotificationCount(0); // Reset the notification count
      window.location.reload(); // Reload the page
    };
  

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const handleAccountDropdownClick = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  return (
    <div className="navbar">
      <div className="logo">
        <h1>AGAPAY</h1>
      </div>
      <div className="icons">
        <div className="notification">
         <NotificationsIcon fontSize="large"/>
          <span>{notificationCount}</span>
        </div>
        <div className="account">
          <div className="account-dropdown">
            <img
              src={Account}
              alt="account"
              className="icon account-dropdown-btn"
              onClick={handleAccountDropdownClick}
            />
            <span className="account-dropdown-btn"></span>
            {isAccountOpen && (
              <div className="account-dropdown-content">
                <Link className="account-dropdown-links" to="/profile">
                  <span className="text-dropdown">Profile</span>
                </Link>

                <Link className="account-dropdown-links" to="/">
                  <span className="text-dropdown">Log out</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default navbar;
