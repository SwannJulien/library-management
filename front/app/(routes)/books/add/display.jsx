import isImageFound from "@/app/library/isImageFound";
import styles from "./styles.module.css";
export default function DisplayBook({ data }) {
  // Change the props to array to be able to use the map method
  const bookArray = [];
  bookArray.push(data);

  bookArray.map((book) => {
    const isbn = book.identifiers.isbn_10 || book.identifiers.isbn_13;
    console.log(isbn);
  });

  return (
    <div>
      {bookArray.map((book) => {
        return (
          <div className={`mt-5 ${styles.bookContainer}`} key={book.identifiers.isbn_10 || book.identifiers.isbn_13}>
            {isImageFound(book, 100, 160, "Book's cover")}

            <div className={styles.bookDetailsContainer}>
              <h2>{book.title}</h2>
              <p className="mb-2">
                <span className="fw-bold">Isbn: </span>
                {book.identifiers.isbn_10 || book.identifiers.isbn_13}
              </p>

              {book.authors.map((type, index) => {
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

              {book.publishers.map((type, index) => {
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
    </div>
  );
}
