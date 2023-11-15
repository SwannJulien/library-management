// 1. Fetch book by ISBN number in the OpenLibrary API
async function getBookByIsbn(isbn) {
  const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`);

  const data = await response.json();
  console.log(data);
  renderData(data[`ISBN:${isbn}`]);
}

// 2. Change the json file structure to match Java POJO
function renderData(data) {
  // Get only the name of each author and store it in an array
  let authorName = [];
  for (let i = 0; i < data.authors.length; i++) {
    authorName.push(data.authors[i].name);
  }

  // Create and push in array all subjects if data.subjects is true
  let subjects;
  if (data.subjects) {
    subjects = [];
    for (let i = 0; i < data.subjects.length; i++) {
      subjects.push(data.subjects[i].name);
    }
  }

  // Create and push in array all subject_places if data.subject_places is true
  let subject_places;
  if (data.subject_places) {
    subject_places = [];
    for (let i = 0; i < data.subject_places.length; i++) {
      subject_places.push(data.subject_places[i].name);
    }
  }

  // Create and push in array all subject_people if data.subject_people is true
  let subject_people;
  if (data.subject_people) {
    subject_people = [];
    for (let i = 0; i < data.subject_people.length; i++) {
      subject_people.push(data.subject_people[i].name);
    }
  }

  // Create and push in array all publish_places if data.publish_places is true
  let publish_places;
  if (data.publish_places) {
    publish_places = [];
    for (let i = 0; i < data.publish_places.length; i++) {
      publish_places.push(data.publish_places[i].name);
    }
  }

  // Create and push in array all publishers if data.oublishers is true
  let publishers;
  if (data.publishers) {
    publishers = [];
    for (let i = 0; i < data.publishers.length; i++) {
      publishers.push(data.publishers[i].name);
    }
  }

  // Get isbn_10 and isbn_13 as a string
  let isbn10, isbn13;
  const keys = Object.keys(data.identifiers);

  keys.forEach((key, index) => {
    switch (key) {
      case "isbn_10":
        isbn10 = data.identifiers[key];
        break;
      case "isbn_13":
        isbn13 = data.identifiers[key];
        break;
    }
  });

  // Formated data that will be POSTed to Java backend
  const extractedData = {
    title: data.title,
    number_of_pages: data.number_of_pages,
    authors: authorName,
    url: data.url,
    publish_date: data.publish_date,
    cover: data.cover,
    subjects: subjects,
    subject_places: subject_places,
    subject_people: subject_people,
    // undefined is falsy so the key/value that follow is not spread (ceedit to https://www.codemzy.com/blog/conditionally-add-property-to-object-javascript)
    ...(publishers && { publishers: publishers }),
    ...(publish_places && { publish_places: publish_places }),
    ...(isbn10 && { isbn10: isbn10.toString() }),
    ...(isbn13 && { isbn13: isbn13.toString() }),
  };

  console.log(extractedData);

  // POST the newly formated data
  postExtractedBook(extractedData);
}

// 3. POST the newly formated data
async function postExtractedBook(extractedData) {
  const response = await fetch("http://localhost:8080/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // redirect: "follow", // manual, *follow, error
    // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(extractedData),
  });
  const copyId = await response.text();
  console.log(copyId);
}

// Function that must be called to send the data to the backend aplication
getBookByIsbn("0451526538");

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("page loaded");
});

// 0451526538 => Tom Sawer (1 x isbn)
// 0553381687 => Game of Thrones (2 x isbn)
// 207036822X => 1984 (NO publish_places)
