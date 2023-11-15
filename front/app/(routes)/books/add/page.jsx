import AddByIsbn from "./addByIsbn";
import AddManually from "./addManually";

export default function AddBook(props) {
  return (
    <main className="container mb-5 mt-5">
      <h1 className="text-center mt-3">Add a new book</h1>
      <div className="text-center mt-3">
        <p className="mb-1">You have two options to add a book to the library. You can either find it by its ISBN on Open Library or add it manually. </p>
        <p className="mb-1">If you have the ISBN of the book you want to add, it is recommended to first try to find it on Open Library.</p>
        <p className="mb-1">Use the manual option only in the case you have not found your book on Open Library catalogue.</p>
      </div>

      <div className="blockContainer mt-5">
        <div className="option1">
          <button type="button" className="btn" data-bs-toggle="collapse" data-bs-target="#collapseOption1" aria-expanded="false" aria-controls="collapseOption1">
            <input className="form-check-input" type="radio" name="addBookOptions" id="option1" />
            <label className="form-check-label ms-2 " htmlFor="option1">
              <span className="fw-bold">Option 1:</span> Find book on Open Library by its ISBN and add it
            </label>
          </button>
          <div className="collapse" id="collapseOption1">
            <div className="card card-body">
              <AddByIsbn></AddByIsbn>
            </div>
          </div>
        </div>
        <div className="option2">
          <button type="button" className="btn" data-bs-toggle="collapse" data-bs-target="#collapseOption2" aria-expanded="false" aria-controls="collapseOption2">
            <input className="form-check-input" type="radio" name="addBookOptions" id="option2" />
            <label className="form-check-label ms-2" htmlFor="option2">
              <span className="fw-bold">Option 2:</span> Add a book manually
            </label>
          </button>

          <div className="collapse" id="collapseOption2">
            <div className="card card-body">
              <AddManually></AddManually>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
