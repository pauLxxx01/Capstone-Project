import React, { useState } from "react";
import "./modal.scss";
import { motion } from "framer-motion";
import { zoomIn } from "../../../../variants";
import { headerTableModal } from "../../../../newData";
import { Link, useNavigate } from "react-router-dom";

function Modal({ setOpenModal, title, data, users }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter users based on search term and message IDs
  // Filter users based on search term and matching message IDs (reversed logic)
  const filteredUsers = data
    .filter((datas) =>
      users.some(
        (user) =>
          user._id.toString() === datas.senderId.toString() &&
          (datas.senderId
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
            user.userId
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            user.department
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (datas.createdAt &&
              datas.createdAt.toString().includes(searchTerm)) ||
            (datas.respond && datas.respond.toString().includes(searchTerm.toLowerCase())))
      )
    )
    .map((datas) => {
      const matchedUser = users.find(
        (user) => user._id.toString() === datas.senderId.toString()
      );
      return {
        ...matchedUser,
        createdAt: datas ? datas.createdAt : null,
        messageID: datas ? datas._id : null,
        respond: datas? datas.respond : null,
      };
    });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handlePageChange = (page) => setCurrentPage(page);

  const prePage = (e) => {
    e.preventDefault();
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleRowClick = (data) => {
    if (data.respond === "in-progress") {
      console.log("Received " + data.respond);
      navigate(`/home/report/in-progress/${data.messageID}`);
    } else {
      navigate(`/home/report/${data.messageID}`);
    }
  };

  return (
    <div className="main-modal">
      <motion.div
        variants={zoomIn(0)}
        initial="hidden"
        whileInView={"show"}
        className="popup"
      >
        <div className="containerModal">
          <div className="button-container">
            <button onClick={() => setOpenModal(false)}>X</button>
          </div>
          <motion.div className="popup-header">
            <span>{data.length}</span>
            <span>{title}</span>
          </motion.div>
          <div className="search">
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
            />
          </div>
          <div className="container-body">
            <table>
              <thead className="headerTableModal">
                <tr>
                  {headerTableModal.map((header, index) => (
                    <th key={index}>{header.Label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((row, index) => (
                    <tr key={`${row._id}-${index}`}>
                      {/* Combine `_id` with `index` for uniqueness */}
                      <td>{row.name}</td>
                      <td>{row.userId}</td>
                      <td>{row.department}</td>
                      <td>
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>
                        {row.respond.toUpperCase()}
                      </td>
                      <td>
                        <div>
                          <p
                            className="showView"
                            onClick={() => handleRowClick(row)}
                          >
                            View Report
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="containerNav">
              <nav>
                <ul className="pagination-modal">
                  {currentPage > 1 && (
                    <li className="page-item">
                      <button className="page-link" onClick={prePage}>
                        Previous
                      </button>
                    </li>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button className="page-link">{i + 1}</button>
                    </li>
                  ))}
                  {currentPage < totalPages && (
                    <li className="page-item">
                      <button className="page-link" onClick={nextPage}>
                        Next
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Modal;
