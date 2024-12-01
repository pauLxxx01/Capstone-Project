 import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import formatPhilippinePhoneNumber from "../../helper/phoneFormat";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

import {
  TextField,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const UserAccounts = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // for user
  const [role, setRole] = useState({
    professor: false,
    student: false,
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountId, setAccountId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [address, setAddress] = useState("");

  // for parent
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentAddress, setParentAddress] = useState("");
  const [parentRelationship, setParentRelationship] = useState("");

  // messages
  const [messages, setMessages] = useState([]);
  // for parent
  const [parents, setParents] = useState([]);

  // error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle role selection
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
  };

  // Fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parentsResponse, reportsResponse] = await Promise.all([
          axios.get(`/user/parent/getParent`),
          axios.get(`/user/messages`),
        ]);
        setParents(parentsResponse.data.parents);
        setMessages(reportsResponse.data.messages);
        console.log("parents: ", parentsResponse.data.parents);
        console.log("repots: ", reportsResponse.data.messages);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle delete operation
  const handleDelete = async (id) => {
    try {
      // Fetch the user to get the parent ID and message ID
      const userResponse = await axios.get(`/user/account/specific/${id}`);
      const parentId = userResponse.data.user.parent;
      const messageId = userResponse.data.user.message;

      // Deleting the user, parent, and message in parallel
      await Promise.all([
        axios.delete(`/user/delete/${id}`),
        axios.delete(`/user/parent/delete/${parentId.toString()}`),
        axios.delete(`/user/message/delete/${messageId.toString()}`),
      ]);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user and parent:", error);
    }
  };

  // Handle update operation
  const handleUpdate = async (id) => {
    const formattedPhoneNumber = formatPhilippinePhoneNumber(phoneNumber);
    const formattedParentPhoneNumber = formatPhilippinePhoneNumber(parentPhone);

    try {
      await axios.put(`/userUpdate/parentUpdate/${id}`, {
        role: role,
        name,
        email,
        password,
        account_id: accountId,
        phone_number: formattedPhoneNumber,
        department,
        address,
        parentName,
        parentAddress,
        parentRelationship,
        parentPhone: formattedParentPhoneNumber,
      });

      // Show success toast
      toast.success("User and parent updated successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
      });

      setModalOpen(false);
    } catch (error) {
      console.error("Error updating user and parent:", error);

      // Show error toast
      toast.error("Failed to update user and parent. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
  };

  // Open update modal
  const openUpdateModal = (user, userParent) => {
    setModalOpen(true);
    setSelectedUser(user._id);
    setRole(user.role);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setAccountId(user.account_id);
    setDepartment(user.department);
    setPhoneNumber(user.phone_number);
    setAddress(user.address);
    setParentAddress(userParent.address)
    setParentName(userParent.name);
    setParentRelationship(userParent.parentRelationship);
    setParentPhone(userParent.phone);
  };

  // Close update modal
  const closeUpdateModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  console.log(users)
  return (
    <div className="admin-accounts">
      <h2>User Accounts</h2>
      <button className="btn" onClick={() => navigate("/user/registration")}>
        Create Account
      </button>

      {/* Modal for updating user and parent info */}
      <div className="admin-list">
        {isModalOpen && (
          <div className="modal">
            <div className="form-container-user">
              <form
                className="user-form"
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent the default form submission
                  handleUpdate(selectedUser); // Call the update function
                }}
              >
                <div className="header-container">
                  <h2>Edit</h2>
                </div>
                <div className="grid-container">
                  <div className="user-info">
                    <h3>User Information</h3>
                    <div className="form-group">
                      <label>Role</label>
                      <div className="radio-group">
                        <label>
                          <input
                            type="radio"
                            name="role"
                            value="Professor"
                            checked={role === "Professor"}
                            onChange={handleRoleChange}
                          />
                          Professor
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="role"
                            value="Student"
                            checked={role === "Student"}
                            onChange={handleRoleChange}
                          />
                          Student
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="accountId">User ID</label>
                      <input
                        type="text"
                        id="accountId"
                        value={accountId}
                        onChange={(e) =>
                          setAccountId(e.target.value.toUpperCase())
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="department">Department</label>
                      <select
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select a department
                        </option>
                        <option value="CCMS">CCMS</option>
                        <option value="CENG">CENG</option>
                        <option value="CAFA">CAFA</option>
                        <option value="CIHTM">CIHTM</option>
                        <option value="ABM">ABM</option>
                        <option value="CE">CE</option>
                        <option value="CAS">CAS</option>
                        <option value="CBA">CBA</option>
                        <option value="CCJC">CCJC</option>
                        <option value="CME">CME</option>
                        <option value="CNAHS">CNAHS</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <input
                        type="text"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">User's Full Address</label>
                      <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="parent-info">
                    <h3>Parent Information</h3>
                    <div className="form-group">
                      <label htmlFor="parentName">Parent Name</label>
                      <input
                        type="text"
                        id="parentName"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="parentPhone">Parent Phone Number</label>
                      <input
                        type="tel"
                        id="parentPhone"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="parentAddress">Parent's Address</label>
                      <input
                        type="text"
                        id="parentAddress"
                        value={parentAddress}
                        onChange={(e) => setParentAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="parentRelationship">Relationship</label>
                      <select
                        id="parentRelationship"
                        value={parentRelationship}
                        onChange={(e) => setParentRelationship(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select a relationship
                        </option>
                        <option value="Mother">MOTHER</option>
                        <option value="Father">FATHER</option>
                        <option value="Guardian">GUARDIAN</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="update-btn">
                    Update
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeUpdateModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Display the user information */}
        {users.length > 0 ? (
          users.map((user) => {
            const userParent = parents.find(
              (parent) => parent._id.toString() === user.parent.toString()
            );

            const userMessageIds = user.report_data || [];
            const userMessages = messages.filter((message) =>
              userMessageIds.includes(message._id.toString())
            );

            return (
              <div key={user._id} className="admin-card">
                <div className="admin-info">
                  <h3 className="admin-name">{user.role}</h3>
                  <h3 className="admin-phone">{user.name}</h3>
                  <p className="admin-phone">{user.email}</p>
                  <p className="admin-phone">{user.account_id}</p>
                  <p className="admin-phone">{user.department}</p>
                  <p className="admin-phone">{user.phone_number}</p>
                  <p className="admin-phone">{user.address}</p>
                </div>
                <div className="parents-info">
                  {userParent ? (
                    <div key={userParent._id} className="admin-info">
                      <h3 className="admin-name">{userParent.relationship}</h3>
                      <h3 className="admin-phone">{userParent.name}</h3>
                      <p className="admin-phone">{userParent.phone}</p>
                    </div>
                  ) : (
                    <p className="no-admins">No parents found.</p>
                  )}
                </div>
                <div className="messages">
                  <h3 className="admin-name">Message</h3>
                  <p className="admin-phone">Count: {userMessages.length}</p>
                  <br />
                  {userMessages.length > 0 ? (
                    userMessages.map((message) => (
                      <div key={message._id} className="admin-info">
                        <p className="admin-phone">{message.emergency}</p>
                        <p className="admin-phone">{message._id}</p>
                        <p className="admin-phone">{message.respond}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-messages">No messages found.</p>
                  )}
                </div>

                <button
                  className="btn"
                  onClick={() => openUpdateModal(user, userParent)}
                >
                  Update
                </button>
                <button className="btn" onClick={() => handleDelete(user._id)}>
                  Delete
                </button>
              </div>
            );
          })
        ) : (
          <p className="no-admins">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default UserAccounts;
