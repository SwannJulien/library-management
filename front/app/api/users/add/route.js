import { revalidatePath } from "next/cache";

export async function POST(request) {
  const data = await request.json();

  const response = await fetch("http://localhost:8080/users", {
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
    const message = "New user successfully created.";
    const status = response.status;

    revalidatePath("/users");
    return Response.json({ message, status });
  }
}
