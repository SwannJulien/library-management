export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const isbn = searchParams.get("isbn");

  const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`);

  // OpenLibrary always return 200 OK even when there is no book with the isbn passed as parameter !!!!!!
  // Only option is to handle error message on client side
  const book = await response.json();

  return Response.json({ book });
}
