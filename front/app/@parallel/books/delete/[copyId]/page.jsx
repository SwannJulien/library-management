"use client";
import Modal from "@/app/components/modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./styles.module.css";

export default function DeleteCopy(params) {
  const copyId = params.params.copyId;
  const isbn = params.searchParams;
  const data = { copyId, isbn };

  const router = useRouter();
  const [serverResponse, setServerResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);

  async function hanleClick() {
    setLoading(true);
    const response = await fetch("http://localhost:3000/api/copies/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
      body: JSON.stringify(data),
    });

    const serverMessage = await response.json();
    const { message, status } = serverMessage;

    if (status === 200) {
      setSuccess(true);
      setServerResponse(message);
      setLoading(false);
      router.refresh();
      return router.back();
    } else {
      setSuccess(false);
      setServerResponse(message);
      setLoading(false);
    }
  }

  function handleEscape(e) {
    if (e.key === "Escape") {
      router.back();
    }
  }

  return (
    <Modal>
      <div onKeyDown={handleEscape} className={styles.modal_inner}>
        <div className={styles.close} onClick={() => router.back()}>
          &times;
        </div>
        <h3 className="mb-5">Are you sure you want to delete this copy?</h3>
        <button className="btn btn-danger me-3" onClick={hanleClick}>
          {loading ? "Deleting copy..." : "Yes, delete copy"}
        </button>
        <button className={` btn btn-primary ${styles.closeBtn}`} onClick={() => router.back()}>
          Cancel
        </button>
        <p className={`mt-3 fw-bold ${success ? "text-success" : "text-danger"}`}>{serverResponse}</p>
      </div>
    </Modal>
  );
}
