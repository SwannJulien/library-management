"use client";
import { useRef, useState } from "react";

export default function AddUser() {
  const [serverResponse, setServerResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const formRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const classYear = event.target.classYear.value;
    const yearGroup = event.target.yearGroup.value;
    const house = event.target.house.value;
    const email = event.target.email.value;
    const phoneNumber = event.target.phoneNumber.value;
    const role = event.target.role.value;

    const user = {
      firstName: firstName,
      lastName: lastName,
      classYear: classYear,
      yearGroup: yearGroup,
      house: house,
      email: email,
      phoneNumber: phoneNumber,
      role: role,
    };

    const response = await fetch("http://localhost:3000/api/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const serverMessage = await response.json();
    const { message, status } = serverMessage;

    //Check if respone is OK or not
    status != 201 ? setSuccess(false) : setSuccess(true);

    setServerResponse(message);
    setLoading(false);
    formRef.current.reset();
  }

  return (
    <main className="container mb-5 mt-5">
      <h1 className="text-center ">Add a new user</h1>
      <p className="mt-5 mb-2 text-center">Please fill up all fields of the form to add a new user.</p>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First name
          </label>
          <input type="text" name="firstName" className="form-control" id="firstName" required />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last name
          </label>
          <input type="text" name="lastName" className="form-control" id="lastName" required />
        </div>
        <div className="mb-3">
          <label htmlFor="classYear" className="form-label">
            Class year
          </label>
          <input type="text" name="classYear" className="form-control" id="classYear" required />
        </div>
        <div className="mb-3">
          <label htmlFor="yearGroup" className="form-label">
            Year group
          </label>
          <input type="text" name="yearGroup" className="form-control" id="yearGroup" required />
        </div>
        <div className="mb-3">
          <label htmlFor="house" className="form-label">
            House
          </label>
          <input type="text" name="house" className="form-control" id="house" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input type="email" name="email" className="form-control" id="email" required />
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            Phone number
          </label>
          <input type="text" name="phoneNumber" className="form-control" id="phoneNumber" />
        </div>

        <legend>Select a role for this user</legend>
        <p>
          BE CAREFUL
          <br />
          Admin have all rights on the database: create, update, delete either books, users and borrowings. <br />
          Student on the other hand can only see books availability, that's it.
        </p>

        <div className="form-check">
          <input className="form-check-input" type="radio" name="role" id="student" value="Student" required />
          <label className="form-check-label" htmlFor="student">
            Student
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="role" id="admin" value="Admin" required />
          <label className="form-check-label" htmlFor="admin">
            Admin
          </label>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          {loading ? "Creating user..." : "Add user"}
        </button>
        <p className={`mt-3 fw-bold ${success ? "text-success" : "text-danger"}`}>{serverResponse}</p>
      </form>
    </main>
  );
}
