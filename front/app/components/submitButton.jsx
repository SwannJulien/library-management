"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton(props) {
  const displayBefore = props.displayBefore;
  const displayAfter = props.displayAfter;
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn btn-primary">
      {pending ? displayAfter : displayBefore}
    </button>
  );
}
