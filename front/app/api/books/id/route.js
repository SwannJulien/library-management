export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("book");
  const response = await fetch(`http://localhost:8080/book/get-by-id/${bookId}`);

  if (!response.ok) {
    const serverMessage = "An error occured while searching the book of this copy id. The book may have been deleted but not the copy";
    return Response.json({ serverMessage });
  } else {
    const book = await response.json();
    return Response.json({ book });
  }
}
