"use client";
import AddCopyAction from "../../../../actions/actions";
import { SubmitButton } from "../../../../components/submitButton";

export default function AddCopy(props) {
  const isbn = props.isbn;
  const bookTitle = props.title;
  const bindIsbn = AddCopyAction.bind(null, isbn, bookTitle);
  return (
    <form action={bindIsbn}>
      <SubmitButton displayBefore="Add new copy" displayAfter="Adding new copy..." />
    </form>
  );
}
