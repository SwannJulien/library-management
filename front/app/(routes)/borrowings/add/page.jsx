"use client";
import isObjectEmpty from "@/app/library/isObjectEmpty";
import { useRef, useState } from "react";
import DisplayBorrowings from "./display";

export default function AddBorrowing() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const [userMessage, setUserMessage] = useState("");
  const [user, setUser] = useState("");

  const [copyMessage, setCopyMessage] = useState("");
  const [bookDTO, setBookDTO] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const email = event.target.email.value;
    const copyId = event.target.copyId.value;
    const emailObj = {
      email: email,
    };
    getUser(emailObj);
    getBookDTO(copyId);

    // Reset form's input
    //formRef.current.reset();
  }

  // GET USER
  async function getUser(email) {
    const responseUser = await fetch("http://localhost:3000/api/users/find_by_email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });
    const serverResponse = await responseUser.json();
    const { serverMessage, user } = serverResponse;

    setUserMessage(serverMessage);
    setUser(user);
  }

  // GET BOOKDTO
  async function getBookDTO(copyId) {
    const responseCopy = await fetch(`http://localhost:3000/api/books/dto?bookDTO=${copyId}`);
    const serverResponse = await responseCopy.json();
    const { serverMessage, bookDTO } = serverResponse;

    setBookDTO(bookDTO);
    setCopyMessage(serverMessage);
    setLoading(false);
  }

  console.log(user);
  console.log(bookDTO);

  return (
    <main className="container mb-5 mt-5">
      <h1 className="text-center">Add a new borrowing</h1>
      <p className="mt-5 mb-2 text-center">Please provide an user email and the copy id that the user will borrow.</p>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input type="email" name="email" className="form-control" id="email" required />
          <p className={"text-danger mt-3 "}>{userMessage}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="copyId" className="form-label">
            Copy id
          </label>
          <input type="text" name="copyId" className="form-control" id="copyId" required />
          <p className={"text-danger mt-3 "}>{copyMessage}</p>
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          {loading ? "Searching ..." : "Search"}
        </button>
      </form>
      {!isObjectEmpty(user) && !isObjectEmpty(bookDTO) && <DisplayBorrowings user={user} book={bookDTO}></DisplayBorrowings>}
    </main>
  );
}
