"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SaveButton({ data }) {
  const [success, setSuccess] = useState(false);
  const [serverResponse, setServerResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const bookTitle = data.title;

  function handleClick() {
    setLoading(true);
    const book = data;
    renderData(book);
  }

  function renderData(book) {
    let authorName = [];
    for (let i = 0; i < book.authors.length; i++) {
      authorName.push(book.authors[i].name);
    }

    // Create and push in array all subjects if book.subjects is true
    let subjects;
    if (book.subjects) {
      subjects = [];
      for (let i = 0; i < book.subjects.length; i++) {
        subjects.push(book.subjects[i].name);
      }
    }

    // Create and push in array all subject_places if book.subject_places is true
    let subject_places;
    if (book.subject_places) {
      subject_places = [];
      for (let i = 0; i < book.subject_places.length; i++) {
        subject_places.push(book.subject_places[i].name);
      }
    }

    // Create and push in array all subject_people if book.subject_people is true
    let subject_people;
    if (book.subject_people) {
      subject_people = [];
      for (let i = 0; i < book.subject_people.length; i++) {
        subject_people.push(book.subject_people[i].name);
      }
    }

    // Create and push in array all publish_places if book.publish_places is true
    let publish_places;
    if (book.publish_places) {
      publish_places = [];
      for (let i = 0; i < book.publish_places.length; i++) {
        publish_places.push(book.publish_places[i].name);
      }
    }

    // Create and push in array all publishers if book.oublishers is true
    let publishers;
    if (book.publishers) {
      publishers = [];
      for (let i = 0; i < book.publishers.length; i++) {
        publishers.push(book.publishers[i].name);
      }
    }

    // Get isbn_10 and isbn_13 as a string
    let isbn10, isbn13;
    const keys = Object.keys(book.identifiers);
    console.log(keys);

    keys.forEach((key, index) => {
      switch (key) {
        case "isbn_10":
          isbn10 = book.identifiers[key][0];
          break;
        case "isbn_13":
          isbn13 = book.identifiers[key][0];
          break;
      }
    });

    // Formated book that will be POSTed to Java backend
    const extractedData = {
      title: book.title,
      number_of_pages: book.number_of_pages,
      authors: authorName,
      url: book.url,
      publish_date: book.publish_date,
      cover: book.cover,
      subjects: subjects,
      subject_places: subject_places,
      subject_people: subject_people,
      // undefined is falsy so the key/value that follow is not spread (ceedit to https://www.codemzy.com/blog/conditionally-add-property-to-object-javascript)
      ...(publishers && { publishers: publishers }),
      ...(publish_places && { publish_places: publish_places }),
      ...(isbn10 && { isbn10: isbn10.toString() }),
      ...(isbn13 && { isbn13: isbn13.toString() }),
    };

    postBook(extractedData);
  }

  async function postBook(extractedData) {
    const response = await fetch("http://localhost:3000/api/books/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(extractedData),
    });
    const serverMessage = await response.json();
    const { message, copyId, status } = serverMessage;

    //Check if respone is OK or not
    if (status != 201) {
      setSuccess(false);
    } else {
      setSuccess(true);
      router.push(`/books/save/${copyId}?title=${bookTitle}`);
    }

    setServerResponse(message);
    setLoading(false);
  }

  return (
    <>
      <legend className="form-check-label mt-5">Do you want to add this book to the library?</legend>
      <button onClick={handleClick} className="btn btn-primary mt-2">
        {loading ? "Saving book..." : "Add book to library"}
      </button>
      <p className={`mt-3 fw-bold ${success ? "text-success" : "text-danger"}`}>{serverResponse}</p>
    </>
  );
}
