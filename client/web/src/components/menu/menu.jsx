import { Link } from "react-router-dom";
import "./menu.scss";

import Dashboard from "../../assets/icons/menu/dashboard.svg";
import Report from "../../assets/icons/menu/report.svg";
import History from "../../assets/icons/menu/history.svg";
import Announcement from "../../assets/icons/menu/announcement.svg";
import Responder from "../../assets/icons/menu/responder.svg";
import { useLocation } from "react-router-dom";

const menu = () => {
  return (
    <div className="menu">
      <div className="item">
        <Link
          to="/home/dashboard"
          className={`listItem ${
            useLocation().pathname === "/home/dashboard" ? "active" : ""
          }`}
        >
          <img src={Dashboard} alt="" className="icon" />
          <span className="listItemTitle">Dashboard</span>
        </Link>
        <Link
          to="/home/report"
          className={`listItem ${
            useLocation().pathname === "/home/report" ? "active" : ""
          }`}
        >
          <img src={Report} alt="" className="icon" />
          <span className="listItemTitle">Report</span>
        </Link>
        <Link
          to="/home/history"
          className={`listItem ${
            useLocation().pathname === "/home/history" ? "active" : ""
          }`}
        >
          <img src={History} alt="" className="icon" />
          <span className="listItemTitle">History</span>
        </Link>
        <Link
          to="/home/announcement"
          className={`listItem ${
            useLocation().pathname === "/home/announcement" ? "active" : ""
          }`}
        >
          <img src={Announcement} alt="" className="icon" />
          <span className="listItemTitle">Announcement</span>
        </Link>
        <Link
          to="/home/responder"
          className={`listItem ${
            useLocation().pathname === "/home/responder" ? "active" : ""
          }`}
        >
          <img src={Responder} alt="" className="icon" />
          <span className="listItemTitle">Responder</span>
        </Link>
      </div>
    </div>
  );
};

export default menu;
