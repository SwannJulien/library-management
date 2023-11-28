async function getData() {
  const res = await fetch("http://localhost:8080/users/all", {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function Users() {
  const data = await getData();

  return (
    <main className="container-fluid">
      <div className="table-responsive">
        <table className="table table-bordered table-hover mt-5 align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th>FIRST NAME</th>
              <th>LAST NAME</th>
              <th>CLASS YEAR</th>
              <th>YEAR GROUP</th>
              <th>HOUSE</th>
              <th>EMAIL</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {data.map((user) => {
              return (
                <tr key={user.email}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.classYear}</td>
                  <td>{user.yearGroup}</td>
                  <td>{user.house}</td>
                  <td>{user.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
