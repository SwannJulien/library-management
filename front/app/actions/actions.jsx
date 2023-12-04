"use server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export default async function AddCopyAction(isbn, bookTitle) {
  async function handleAddCopy() {
    const response = await fetch(`http://localhost:8080/copies/${isbn}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }

  const serverResponse = await handleAddCopy();
  const { message, copyId } = serverResponse;

  revalidateTag("copies");
  redirect(`/books/save/${copyId}?title=${bookTitle}`);
}
