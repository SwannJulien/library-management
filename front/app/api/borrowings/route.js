export async function GET() {
  const response = await fetch("http://localhost:8080/borrowings/show-all", {
    cache: "no-store",
  });
  const data = await response.json();
  console.log(data);
  return Response.json(data);
}
