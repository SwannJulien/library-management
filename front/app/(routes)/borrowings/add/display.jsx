"use client";
import Image from "next/image";
import { useState } from "react";
import arrow from "../../../../public/arrow.png";
import styles from "./styles.module.css";
export default function DisplayBorrowings(props) {
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, book } = props;
  const userArr = [];
  userArr.push(user);
  const bookDTOArr = [];
  bookDTOArr.push(book);

  async function handleClick() {
    setLoading(true);
    const borrowingObj = {
      email: user.email,
      copyId: book.copyId,
    };
    console.log(borrowingObj);

    const response = await fetch("http://localhost:3000/api/borrowings/add", {
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(borrowingObj),
    });

    const serverResponse = await response.json();
    const { serverMessage, status } = serverResponse;

    if (status == 200 || status == 201) {
      setSuccess(true);
    }
    setMessage(serverMessage);
    setLoading(false);
  }
  console.log(message);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftFrame}>
          {userArr.map((user) => {
            return (
              <div key={user.email}>
                <h2>
                  {user.firstName} {user.lastName}
                </h2>
                <p className="mt-3">
                  {user.email} <br />
                  {user.classYear} {user.yearGroup}
                  <br />
                  {user.house}
                </p>
              </div>
            );
          })}
        </div>
        <div className={styles.middleFrame}>
          <p>Is going to borrow</p>
          <Image src={arrow} width={80} height={50} alt="Picture of an arrow" />
          <button onClick={handleClick} className="btn btn-primary mt-3">
            {loading ? "Saving borrowing..." : "Yes, that's correct!"}
          </button>
        </div>
        <div className={styles.rightFrame}>
          {bookDTOArr.map((book) => {
            return (
              <div key={book.isbn10 || book.isbn13}>
                <h2>{book.title}</h2>
                <p>{book.authors}</p>
              </div>
            );
          })}
        </div>
      </div>
      <p className={`mt-3 text-center fw-bold ${success ? "text-success" : "text-danger"}`}>{message}</p>
    </>
  );
}
