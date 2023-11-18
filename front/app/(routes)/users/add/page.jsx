"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function AddUser() {
  const [serverResponse, setServerResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const formRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setLoading(true);

    const firstName = data.firstName;
    const lastName = data.lastName;
    const classYear = data.classYear;
    const yearGroup = data.yearGroup;
    const house = data.house;
    const email = data.email;
    const phoneNumber = data.phoneNumber;
    const role = data.role;

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
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First name
          </label>
          <input
            type="text"
            name="firstName"
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            id="firstName"
            {...register("firstName", {
              required: "You must provide the first name",
            })}
          />
          <p className="text-danger">{errors.firstName && errors.firstName.message}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last name
          </label>
          <input
            type="text"
            name="lastName"
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            id="lastName"
            {...register("lastName", {
              required: "You must provide the last name",
            })}
          />
          <p className="text-danger">{errors.lastName && errors.lastName.message}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="classYear" className="form-label">
            Class year
          </label>
          <input
            type="text"
            name="classYear"
            className={`form-control ${errors.classYear ? "is-invalid" : ""}`}
            id="classYear"
            {...register("classYear", {
              pattern: { value: /^[0-9]/, message: "Must be a number" },
            })}
          />
          <p className="text-danger">{errors.classYear && errors.classYear.message}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="yearGroup" className="form-label">
            Year group
          </label>
          <input type="text" name="yearGroup" className="form-control" id="yearGroup" />
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
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            {...register("email", {
              required: "You must provide an email",
              pattern: { value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, message: "Invalid email address" },
            })}
          />
          <p className="text-danger">{errors.email && errors.email.message}</p>
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
          <input
            className="form-check-input"
            type="radio"
            name="role"
            id="student"
            value="Student"
            {...register("role", {
              required: "You must provide the user's role",
            })}
          />
          <label className="form-check-label" htmlFor="student">
            Student
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="role"
            id="admin"
            value="Admin"
            {...register("role", {
              required: "You must provide the user's role",
            })}
          />

          <label className="form-check-label" htmlFor="admin">
            Admin
          </label>
          <p className="text-danger">{errors.role && errors.role.message}</p>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          {loading ? "Creating user..." : "Add user"}
        </button>
        <p className={`mt-3 fw-bold ${success ? "text-success" : "text-danger"}`}>{serverResponse}</p>
      </form>
    </main>
  );
}
