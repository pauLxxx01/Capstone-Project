import React, { useState, useMemo } from "react";
import "./report.scss";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, zoomIn } from "../../../variants";
import { headerTableGeneral } from "../../../newData";

const Report = ({ users, messages }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortDirection, setSortDirection] = useState("desc"); 
  const recordsPerPage = 5;

  const count = (data) => {
    return data.reduce(
      (acc, item) => {
        const status = item.respond.toLowerCase();

        // Check for valid statuses and increment the appropriate counter
        if (status === "completed") {
          acc.completed++;
        } else if (status === "in-progress") {
          acc.inProgress++;
        } else {
          acc.unused++;
        }

        return acc;
      },
      { completed: 0, inProgress: 0, unused: 0 }
    );
  };

  const responseCount = count(messages);

  const handleRowClick = (data) => {
    if (data.respond === "in-progress") {
      console.log("Received " + data.respond);
      navigate(`/home/report/in-progress/${data.messageID}`, {
        state: { id: data },
      });
    } else if (data.respond === "unused") {
      navigate(`/home/report/${data.messageID}`);
    } else {
      navigate(`/home/report`);
    }
  };

  const handleDateSortToggle = () => {
    setSortDirection((prevDirection) => (prevDirection === "desc" ? "asc" : "desc"));
  };

  console.log(users)

  const filteredUsers = useMemo(() => {
    return messages
      .filter((data) =>
        users.some(
          (user) =>
            (user._id.toString() === data.senderId.toString() &&
              (data.senderId
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                user.account_id
                  .toString()
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                user.department
                  .toString()
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                (data.createdAt &&
                  data.createdAt
                    .toString()
                    .includes(searchTerm.toLowerCase())))) ||
            (data.respond &&
              data.respond
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (data.emergency &&
              data.emergency
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase()))
        )
      )
      .map((data) => {
        const matchedUser = users.find(
          (user) => user._id.toString() === data.senderId.toString()
        );
        return {
          ...matchedUser,
          createdAt: data.createdAt
            ? new Date(data.createdAt).toLocaleString()
            : null,
          messageID: data._id,
          respond: data.respond,
          emergency: data.emergency,
        };
      })
      .sort((a, b) =>
        sortDirection === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      ); 

    return sortedUsers;
  },  [messages, users, searchTerm, sortDirection]); 

  // Filter based on selected status
  const getFilteredUsersByStatus = () => {
    if (filterStatus === "all") return filteredUsers;
    return filteredUsers.filter((user) => user.respond === filterStatus);
  }

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentUsers = getFilteredUsersByStatus().slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(
    getFilteredUsersByStatus().length / recordsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const prePage = (e) => {
    e.preventDefault();
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="report">
      <motion.div
        variants={fadeIn("down", 0.1)}
        initial="hidden"
        whileInView={"show"}
        className="title"
      >
        <h1>REPORT</h1>
      </motion.div>

      <div className="containerReportCount">
        {/* Total */}
        <motion.div
          variants={zoomIn(0.1)}
          initial="hidden"
          whileInView="show"
          className="totalReport"
        >
          <div className="countAll-history">
            <div className="countTotal-history">
              <span className="dataCountT">{messages.length}</span>
              <span className="dataCountT">Total Report</span>
            </div>
          </div>
        </motion.div>

        {/* Each Report Count as Buttons */}
        <motion.div
          variants={zoomIn(0.1)}
          initial="hidden"
          whileInView="show"
          className="eachReport"
        >
          <div
            className="count-history"
            onClick={() => setFilterStatus("completed")}
          >
            <span className="dataCount completed">
              {responseCount.completed}
            </span>
            <span className="dataCount">Completed report</span>
          </div>
          <div
            className="count-history"
            onClick={() => setFilterStatus("in-progress")}
          >
            <span className="dataCount inProgress">
              {responseCount.inProgress}
            </span>
            <span className="dataCount">In Progress report</span>
          </div>
          <div
            className="count-history"
            onClick={() => setFilterStatus("unused")}
          >
            <span className="dataCount unused">{responseCount.unused}</span>
            <span className="dataCount">Unused report</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        whileInView={"show"}
        className="search"
      >
        <input
          type="search"
          value={searchTerm.toString()}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
      </motion.div>

      <motion.table
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        whileInView={"show"}
        className="user-table"
      >
      <thead>
          <tr>
            {headerTableGeneral.map((header, index) => (
             <th
             key={index}
             onClick={
               header.Label === "DATE" ? handleDateSortToggle : undefined
             }
             style={{
               cursor: header.Label === "DATE" ? "pointer" : "default",
             }}
           >
             {header.Label}
             {header.Label === "DATE" &&
               (sortDirection === "desc" ? " ↑" : " ↓")}
           </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((data) => (
            <tr
              className="items-row"
              key={data.messageID}
              onClick={() => handleRowClick(data)}
            >
              <td>{data.name}</td>
              <td>{data.account_id}</td>
              <td>{data.department}</td>
              <td>{data.emergency}</td>
              <td>{data.createdAt || ""}</td>
              <td>
                <div className={`data ${data.respond}`}>
                  {data.respond === "completed"
                    ? "Completed"
                    : data.respond === "unused"
                    ? "Unused"
                    : data.respond === "in-progress"
                    ? "In - Progress"
                    : "No respond received"}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>

      {totalPages > 1 && (
        <motion.div
        variants={fadeIn("right", 0.1)}
        initial="hidden"
        whileInView={"show"}
      
         className="containerNav">
          <nav>
            <ul className="pagination-modal">
              {currentPage > 1 && (
                <li className="page-items">
                  <button className="page-links" onClick={prePage}>
                    Previous
                  </button>
                </li>
              )}
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`page-items ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button className="page-links">{i + 1}</button>
                </li>
              ))}
              {currentPage < totalPages && (
                <li className="page-items">
                  <button className="page-links" onClick={nextPage}>
                    Next
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default Report;
