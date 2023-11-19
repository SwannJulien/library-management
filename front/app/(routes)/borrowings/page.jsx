async function getData() {
  const response = await fetch("http://localhost:8080/borrowings/show-all", {
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  console.log(response);
  return response.json();
}

export default async function Borrowings() {
  const data = await getData();
  console.log(data);

  return (
    <main className="container">
      <table className="table table-bordered table-hover mt-5">
        <thead className="table-dark text-center">
          <tr>
            <th>TITLE</th>
            <th>COPY ID</th>
            <th>FIRST NAME</th>
            <th>LAST NAME</th>
            <th>EMAIL</th>
            <th>BORROW DATE</th>
            <th>DUE DATE</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {data.map((borrowing) => {
            return (
              <tr key={borrowing.copyId}>
                <td>{borrowing.title}</td>
                <td>{borrowing.copyId}</td>
                <td>{borrowing.firstName}</td>
                <td>{borrowing.lastName}</td>
                <td>{borrowing.email}</td>
                <td>{borrowing.borrowDate}</td>
                <td>{borrowing.dueDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
