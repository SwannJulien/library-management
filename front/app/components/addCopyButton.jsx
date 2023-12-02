"use client";
export default function AddCopy(props) {
  const isbn = props.isbn;

  async function handleAddCopy() {
    const response = fetch(`http://localhost:8080/copies/${isbn}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const serverMessage = await response;
    console.log(serverMessage);
    // const { message, copyId } = serverMessage;
    // console.log(message);
    // console.log(copyId);
  }

  return (
    <button className="btn btn-primary" onClick={handleAddCopy}>
      Add a copy
    </button>
  );
}
