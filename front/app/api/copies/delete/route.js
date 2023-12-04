//import { revalidatePath } from "next/cache";
export async function DELETE(request) {
  const data = await request.json();
  console.log(data.isbn.isbn);

  const response = await fetch(`http://localhost:8080/copies/${data.copyId}`, { method: "DELETE" });

  if (!response.ok) {
    const serverResponse = await response.json();
    const message = serverResponse.message;
    const status = response.status;

    return Response.json({ message, status });
  } else {
    const serverResponse = await response.json();
    const message = serverResponse.message;
    const status = response.status;

    //revalidatePath(`{/books/${data.isbn.isbn}}`);
    return Response.json({ message, status });
  }
}
