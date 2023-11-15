import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";

export default async function SaveBook(params) {
  const copyId = params.params.copyId;
  const title = params.searchParams.title;

  return (
    <>
      <div className={styles.container}>
        <div className={`text-center ${styles.centeredElement}`}>
          <Image src={`http://api.qrserver.com/v1/create-qr-code/?data=${copyId}&size=200x200`} alt="QR code of the book's copy" width={150} height={150} />
          <p className="mb-0 fw-bold">{title}</p>
          <p>{copyId}</p>
          <Link href={"/"} className="btn btn-primary">
            Go back to library
          </Link>
        </div>
      </div>
    </>
  );
}
