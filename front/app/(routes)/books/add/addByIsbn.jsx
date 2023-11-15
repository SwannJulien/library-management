"use client";

import isObjectEmpty from "@/app/library/isObjectEmpty";
import { useRef, useState } from "react";
import DisplayBook from "./display";
import SaveButton from "./saveButton";

export default function AddByIsbn() {
  const [book, setBook] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const isbn = event.target.isbn.value;

    const response = await fetch(`http://localhost:3000/api/books/openLibrary?isbn=${isbn}`);

    const serverResponse = await response.json();
    const { book } = serverResponse;

    if (isObjectEmpty(book)) {
      setSuccess(false);
      setMessage("No book found with this ISBN");
    } else {
      setSuccess(true);
      setMessage("");
      const dataDetails = book[`ISBN:${isbn}`];
      setBook(dataDetails);
    }
    setLoading(false);
    formRef.current.reset();
  }
  return (
    <div className="mt-2">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="input-group flex-nowrap">
          <span className="input-group-text" id="addon-wrapping">
            ISBN
          </span>
          <input type="text" className="form-control" aria-label="Isbn" aria-describedby="addon-wrapping" id="isbn" name="isbn" />
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          {loading ? "Finding book..." : "Search"}
        </button>
      </form>
      {success && <DisplayBook data={book}></DisplayBook>}
      {success && <SaveButton data={book}></SaveButton>}
      <p className="text-danger fw-bold">{message}</p>
    </div>
  );
}
