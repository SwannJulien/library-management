import { revalidatePath } from "next/cache";
export async function POST(request) {
  const data = await request.json();

  const response = await fetch("http://localhost:8080/borrowings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const serverResponse = await response.json();
    console.log(serverResponse);
    const serverMessage = serverResponse.message;
    const status = response.status;
    return Response.json({ serverMessage, status });
  } else {
    const serverMessage = "Borrowing successfully created";
    const status = response.status;
    revalidatePath("/borrowings");
    return Response.json({ serverMessage, status });
  }
}
