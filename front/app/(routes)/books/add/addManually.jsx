"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function AddManually() {
  const [serverResponse, setServerResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  //const [title, setTitle] = useState("");
  const formRef = useRef(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    setLoading(true);
    //setTitle(data.title);
    const isbn = data.isbn;
    const title = data.title;
    const author = data.author;
    const numberOfPages = data.numberOfPages;
    const publisher = data.publisher;
    const publishDate = data.publishDate;
    const publishPlaces = data.publishPlaces;
    const subjects = data.subjects;
    const subjectPlaces = data.subjectPlaces;
    const subjectPeople = data.subjectPeople;

    renderData(isbn, title, author, numberOfPages, publisher, publishDate, publishPlaces, subjects, subjectPlaces, subjectPeople);
    formRef.current.reset();
  }

  function renderData(isbn, title, author, numberOfPages, publisher, publishDate, publishPlaces, subjects, subjectPlaces, subjectPeople) {
    // Get only the name of each author and store it in an array
    let authorArr = [];
    authorArr.push(author);

    // Create and push in array all subjects if data.subjects is true
    let subjectsArr = [];
    subjectsArr.push(subjects);

    // Create and push in array all subject_places if data.subject_places is true
    let subjectPlacesArr = [];
    subjectPlacesArr.push(subjectPlaces);

    // Create and push in array all subject_people if data.subject_people is true
    let subjectPeopleArr = [];
    subjectPeopleArr.push(subjectPeople);

    // Create and push in array all publish_places if data.publish_places is true
    let publishPlacesArr = [];
    publishPlacesArr.push(publishPlaces);

    // Create and push in array all publishers if data.oublishers is true
    let publishersArr = [];
    publishersArr.push(publisher);

    // Get isbn_10 and isbn_13 as a string
    let isbn10, isbn13;
    if (isbn.length == 10) {
      isbn10 = isbn;
    } else if (isbn.length == 13) {
      isbn13 = isbn;
    }

    const book = {
      title: title,
      number_of_pages: numberOfPages,
      authors: authorArr,
      publish_date: publishDate,
      subjects: subjectsArr,
      subject_places: subjectPlacesArr,
      subject_people: subjectPeopleArr,
      publishers: publishersArr,
      publish_places: publishPlacesArr,
      ...(isbn10 && { isbn10: isbn10 }),
      ...(isbn13 && { isbn13: isbn13 }),
    };

    postBook(book);
  }

  async function postBook(book) {
    const response = await fetch("http://localhost:3000/api/books/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });

    const serverMessage = await response.json();
    const { message, copyId, status } = serverMessage;

    //Check if respone is OK or not
    if (status != 201) {
      setSuccess(false);
    } else {
      setSuccess(true);
      router.push(`/books/save/${copyId}?title=${book.title}`);
    }
    setServerResponse(message);
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <div className="mb-3">
          <label htmlFor="isbn" className="form-label">
            ISBN
          </label>
          <input
            type="text"
            className={`form-control ${errors.isbn ? "is-invalid" : ""}`}
            id="isbn"
            name="isbn"
            aria-describedby="isbnHelp"
            {...register("isbn", {
              required: "You must provide an ISBN",
              minLength: { value: 10, message: "ISBN must be at least 10 characters long" },
              maxLength: { value: 13, message: "ISBN must be 13 characters long maximum" },
            })}
          />
          <p className="text-danger">{errors.isbn && errors.isbn.message}</p>
          <div id="isbnHelp" className="form-text">
            Either ISBN 10 or ISBN 13
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            id="title"
            name="title"
            {...register("title", {
              required: "You must provide a title",
            })}
          />
          <p className="text-danger">{errors.title && errors.title.message}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">
            Author
          </label>
          <input
            type="text"
            className={`form-control ${errors.author ? "is-invalid" : ""}`}
            id="author"
            name="author"
            {...register("author", {
              required: "You must specify the author of the book",
            })}
          />
        </div>
        <p className="text-danger">{errors.author && errors.author.message}</p>
        <div className="mb-3">
          <label htmlFor="numberOfPages" className="form-label">
            Number of pages
          </label>
          <input type="number" className="form-control" id="numberOfPages" name="numberOfPages" aria-describedby="numberOfPageHelp" />
          <div id="numberOfPageHelp" className="form-text">
            Must be a number
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="publisher" className="form-label">
            Publisher
          </label>
          <input type="text" className="form-control" id="publisher" name="publisher" />
        </div>
        <div className="mb-3">
          <label htmlFor="publishDate" className="form-label">
            Publish date
          </label>
          <input type="text" className="form-control" id="publishDate" name="publishDate" />
        </div>
        <div className="mb-3">
          <label htmlFor="publishPlaces" className="form-label">
            Publish place
          </label>
          <input type="text" className="form-control" id="publishPlaces" name="publishPlaces" />
        </div>
        <div className="mb-3">
          <label htmlFor="subjects" className="form-label">
            Subjects
          </label>
          <input type="text" className="form-control" id="subjects" name="subjects" />
        </div>
        <div className="mb-3">
          <label htmlFor="subjectPlaces" className="form-label">
            Subject places
          </label>
          <input type="text" className="form-control" id="subjectPlaces" name="subjectPlaces" />
        </div>
        <div className="mb-3">
          <label htmlFor="subjectPeople" className="form-label">
            Subject people
          </label>
          <input type="text" className="form-control" id="subjectPeople" name="subjectPeople" />
        </div>

        <button type="submit" className="btn btn-primary">
          {loading ? "Saving book..." : "Add book to library"}
        </button>
      </form>
      <p className={`mt-3 fw-bold ${success ? "text-success" : "text-danger"}`}>{serverResponse}</p>
    </div>
  );
}
