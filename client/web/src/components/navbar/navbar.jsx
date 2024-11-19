import Message from "../../assets/icons/navbar/message.svg";
import Account from "../../assets/icons/navbar/account.svg";
import "./navbar.scss";
import { Link, useLocation } from "react-router-dom";

import { useState } from "react";

const navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

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
        <div className="message">
          <img src={Message} alt="message" className="icon" />
          <span>1</span>
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
