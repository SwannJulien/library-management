//import FadeLoader from "react-spinners/FadeLoader";
import styles from "./styles.module.css";
export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}></div>

      {/* <FadeLoader color="#36d7b7" speedMultiplier={1} loading={true} aria-label="Loading Spinner" data-testid="loader" /> */}
    </div>
  );
}
