import { revalidatePath } from "next/cache";
export async function POST(request) {
  const data = await request.json();

  const response = await fetch("http://localhost:8080/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await response.text();
    const status = response.status;

    return Response.json({ message, status });
  } else {
    const message = "Your book has been successfully added to the library. You will be redirected now.";
    const copyId = await response.text();
    const status = response.status;

    revalidatePath("/books");
    return Response.json({ message, copyId, status });
  }
}
