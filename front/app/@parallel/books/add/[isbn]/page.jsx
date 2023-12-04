"use client";
import SaveButton from "@/app/(routes)/books/add/saveButton";
import Modal from "@/app/components/modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./styles.module.css";

export default function DisplayBook(params) {
  const copyId = params.params.copyId;
  const isbn = params.searchParams;
  const data = { copyId, isbn };

  const router = useRouter();
  const [serverResponse, setServerResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);

  return (
    <Modal>
      <div onKeyDown={handleEscape} className={styles.modal_inner}>
        <div className={styles.close} onClick={() => router.back()}>
          &times;
        </div>
        {bookArray.map((book) => {
          return (
            <div className={`mt-5 ${styles.bookContainer}`} key={book.identifiers.isbn_10 || book.identifiers.isbn_13}>
              {isImageFound(book, 100, 160, "Book's cover")}

              <div className={styles.bookDetailsContainer}>
                <h2>{book.title}</h2>
                {/* TODO: isbn can come as an array with multiple isbn by length so if there is multiple isbn it bugs */}
                <p className="mb-2">
                  <span className="fw-bold">Isbn: </span>
                  {book.identifiers.isbn_10 || book.identifiers.isbn_13}
                </p>

                {book.authors &&
                  book.authors.map((type, index) => {
                    return (
                      <p className="mb-2" key={index}>
                        <span className="fw-bold">Author: </span>
                        {type.name}
                      </p>
                    );
                  })}
                <p className="mb-2">
                  <span className="fw-bold">Publish date: </span> {book.publish_date}
                </p>

                {book.publishers &&
                  book.publishers.map((type, index) => {
                    return (
                      <p className="mb-2" key={index}>
                        <span className="fw-bold">Publisher: </span> {type.name}
                      </p>
                    );
                  })}
              </div>
            </div>
          );
        })}
        <SaveButton data={data}></SaveButton>
        <button className={` btn btn-primary ${styles.closeBtn}`} onClick={() => router.back()}>
          Cancel
        </button>
        <p className={`mt-3 fw-bold ${success ? "text-success" : "text-danger"}`}>{serverResponse}</p>
      </div>
    </Modal>
  );
}
