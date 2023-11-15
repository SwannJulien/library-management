export async function GET() {
  const response = await fetch("http://localhost:8080/users/all", {
    cache: "no-store",
  });
  const data = await response.json();

  return Response.json(data);
}
