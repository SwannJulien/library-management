export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const copyId = searchParams.get("bookDTO");

  const response = await fetch(`http://localhost:8080/books/dto/${copyId}`);

  if (!response.ok) {
    const serverResponse = await response.json();
    const serverMessage = serverResponse.message;
    return Response.json({ serverMessage });
  } else {
    const bookDTO = await response.json();
    return Response.json({ bookDTO });
  }
}
