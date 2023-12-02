import AddCopy from "@/app/components/addCopyButton";
import isImageFound from "@/app/library/isImageFound";
import bin from "@/public/recycle-bin.png";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";

export default async function BookDetails(params) {
  const isbn = params.params.isbn;

  async function getBook() {
    const response = await fetch(`http://localhost:8080/books/${isbn}`);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  }

  async function getCopies(id) {
    const response = await fetch(`http://localhost:8080/all-copies/${id}`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  }

  async function handleAddCopy() {
    const response = fetch(`http://localhost:8080/copies/${isbn}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const book = await getBook();
  const bookId = book.id;
  const copies = await getCopies(bookId);
  const bookArray = [];
  bookArray.push(book);

  // TODO: préparer comment vont se voir les données avant de les envoyer dans return. Créer une fonction renderData() qui prend en compte tous les cas de figure: array null, array avec 1 élément, array avec plusiseurs éléments etc.

  return (
    <main className="container mb-5 mt-5">
      <h1 className="text-center">Book details</h1>
      <div>
        {bookArray.map((book) => {
          return (
            <div className={`mt-5 ${styles.bookContainer}`} key={book.isbn10[0] || book.isbn13[0]}>
              {isImageFound(book, 100, 160, "Book's cover")}

              <div className={styles.bookDetailsContainer}>
                <h2>{book.title}</h2>
                <p className="mb-2">
                  <span className="fw-bold">Isbn: </span>
                  {book.isbn10 || book.isbn13}
                </p>
                <p className="mb-2">
                  <span className="fw-bold">Author: </span>
                  {book.authors && book.authors.length === 1 ? book.authors[0] : book.authors.slice(0, -1).join(", ") + " and " + book.authors.slice(-1)}
                </p>
                <p className="mb-2">
                  <span className="fw-bold">Publish date: </span> {book.publish_date}
                </p>
                <p className="mb-2">
                  <span className="fw-bold">Publishers: </span>
                  {book.publishers && book.publishers.length === 1 ? book.publishers[0] : book.publishers.slice(0, -1).join(", ") + " and " + book.publishers.slice(-1)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="table-responsive mt-5">
        <AddCopy isbn={isbn}></AddCopy>
        <table className="table table table-hover align-middle">
          <thead className="fw-semibold">
            <tr>
              <td>COPY ID</td>
              <td>AVAILABILITY</td>
              <td>ACTION</td>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {copies.map((copy) => {
              return (
                <tr key={copy.id}>
                  <td>{copy.id}</td>
                  <td>{copy.isAvailable ? <span className={styles.font_green}>Available</span> : <span className={styles.font_red}>Not available</span>}</td>
                  <td>
                    <Link href={`/books/delete/${copy.id}?isbn=${isbn}`}>
                      <Image src={bin} alt="Picture of a bin" width="20" height="20" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
