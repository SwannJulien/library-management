import isImageFound from "@/app/library/isImageFound";

async function getData() {
  const response = await fetch("http://localhost:8080/books/all", {
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

export default async function Books() {
  const data = await getData();

  return (
    <main className="container">
      <table className="table table-bordered table-hover mt-5">
        <thead className="table-dark text-center">
          <tr>
            <th>COVER</th>
            <th>TITLE</th>
            <th>AUTHOR</th>
            <th>NUMBER OF PAGES</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {data.map((book) => {
            return (
              <tr key={book.isbn10 || book.isbn13}>
                <td>{isImageFound(book, 50, 80, "Book's cover")}</td>
                <td>{book.title}</td>
                <td>
                  {/* TODO: need to change that for a better conditional function */}
                  {book.authors.length > 1 ? book.authors[0] : book.authors}
                </td>
                <td>{book.number_of_pages}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
