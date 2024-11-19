import React, { useState } from "react";
import formatPhilippinePhoneNumber from "../../helper/phoneFormat";
import axios from "axios";
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles

import "./user.scss";

const User = () => {
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

  // Handle role selection
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    // Validate phone numbers
    if (!/^\d+$/.test(phoneNumber)) {
      toast.error(
        "Please enter a valid phone number consisting of digits only."
      );
      return;
    }

    if (!/^\d+$/.test(parentPhone)) {
      toast.error(
        "Please enter a valid parent phone number consisting of digits only."
      );
      return;
    }

    const formattedPhoneNumber = formatPhilippinePhoneNumber(phoneNumber);
    const formattedParentPhoneNumber = formatPhilippinePhoneNumber(parentPhone);

    axios
      .post("/user/register", {
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
      })
      .then((res) => {
        console.log("Data registered: ", {
          role: role.professor ? "Professor" : role.student ? "Student" : "",
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

        // Reset fields after successful registration
        setRole("");
        setName("");
        setEmail("");
        setPassword("");
        setAccountId("");
        setPhoneNumber("");
        setDepartment("");
        setAddress("");
        setParentName("");
        setParentPhone("");
        setParentAddress("");
        setParentRelationship("");

        // Show success toast
        toast.success("User registration successful!");
        console.log(res);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response: ", error.response.data);
          toast.error(error.response.data.message || "Registration failed");
        } else {
          console.error("Error message:", error.message);
          toast.error("An error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="form-container-user">
      <form onSubmit={handleUpload} className="user-form">
        <div className="header-container">
          <h2>Registration</h2>
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
                onChange={(e) => setAccountId(e.target.value.toUpperCase())}
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
          <button type="submit" className="submit-button">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default User;
