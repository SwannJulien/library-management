export async function POST(request) {
  const data = await request.json();

  const response = await fetch("http://localhost:8080/users/get-by-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const serverMessage = await response.text();
    return Response.json({ serverMessage });
  } else {
    const user = await response.json();
    return Response.json({ user });
  }
}
