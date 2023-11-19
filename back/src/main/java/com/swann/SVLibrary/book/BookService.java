package com.swann.SVLibrary.book;


import com.swann.SVLibrary.DTO.BookDTO;
import com.swann.SVLibrary.borrowing.Borrowing;
import com.swann.SVLibrary.borrowing.BorrowingRepository;
import com.swann.SVLibrary.copy.Copy;
import com.swann.SVLibrary.copy.CopyRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@NoArgsConstructor
@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private CopyRepository copyRepository;
    @Autowired
    private BorrowingRepository borrowingRepository;

    protected static final Logger logger = LogManager.getLogger();

    // Add a book and a copy of this book in DB and return the id of the copy
    /*public ObjectId addBookAndCopyToLibrary(Book book){
        // Check if isbn 10 is 10 characters and isbn is 13 characters
        if (book.getIsbn10() !=null && book.getIsbn10().length() != 10){
            throw new RuntimeException("ISBN 10 must be 10 characters long.");
        } else if (book.getIsbn13() !=null && book.getIsbn13().length() != 13) {
            throw new RuntimeException("ISBN 13 must be 13 characters long.");
        } else {
            String isbn = book.getIsbn10() == null ? book.getIsbn13() : book.getIsbn10();
            Optional<Book> optionalBook = findBookByIsbn(isbn);
            // Avoid saving two books with the same isbn. Make isbn unique
            if (optionalBook.isEmpty()){
                Book savedBook = bookRepository.save(book);
                Copy newCopy = new Copy(savedBook.getId(), true);
                Copy savedCopy =  copyRepository.save(newCopy);
                return savedCopy.getId();
            } else {
                throw new RuntimeException("Book with the same isbn " + isbn + " already exists");
            }
        }
    }*/

    public ObjectId addBookAndCopyToLibrary(Book book){
        // Check if isbn 10 is 10 characters and isbn is 13 characters
        if (book.getIsbn10() !=null && book.getIsbn10().length() != 10){
            throw new IllegalArgumentException("ISBN must be either 10 or 13 characters long.");
        } else if (book.getIsbn13() !=null && book.getIsbn13().length() != 13) {
            throw new IllegalArgumentException("ISBN must be either 10 or 13 characters long.");
        } else {
            String isbn = book.getIsbn10() == null ? book.getIsbn13() : book.getIsbn10();
            if (isbn != null) {
                Optional<Book> optionalBook = findBookByIsbn(isbn);
                // Avoid saving two books with the same isbn. Make isbn unique
                if (optionalBook.isEmpty()){
                    Book savedBook = bookRepository.save(book);
                    Copy newCopy = new Copy(savedBook.getId(), true);
                    Copy savedCopy =  copyRepository.save(newCopy);
                    return savedCopy.getId();
                } else {
                    throw new RuntimeException("Book with the same isbn " + isbn + " already exists");
                }
            } else {
                throw new RuntimeException("ISBN cannot be null.");
            }
        }
    }

    // Receive an isbn in parameter and look for the corresponding book
    public Optional<Book> findBookByIsbn(String isbn) {
        if (isbn == null) {
            throw new IllegalArgumentException("ISBN cannot be null");
        } else {
            int isbnLength = isbn.length();
            if (isbnLength < 10 || isbnLength > 13){
                throw new RuntimeException("ISBN must be 10 or 13 characters.");
            } else if (isbn.length() == 10) {
                return bookRepository.findByIsbn10(isbn);
            } else if (isbn.length() == 13) {
                return bookRepository.findByIsbn13(isbn);
            } else throw new RuntimeException("Something wrong happens. Please try again.");
        }
    }

    // Receive a book id as a String and look for the corresponding book
    public Optional<Book> findBookByIdString(String id) {
        ObjectId restoredObjectId = new ObjectId(id);
        Optional<Book> book = bookRepository.findById(restoredObjectId);
        if (book.isPresent())
            return book;
        throw new IllegalArgumentException("No book with id " + id + " has been found in the library");
    }

    // Receive the book id as an ObjectId and look for the corresponding book
    public Optional<Book> findBookById(ObjectId id){
        Optional<Book> book = bookRepository.findById(id);
        if (book.isPresent())
            return book;
        throw new IllegalArgumentException("No book with id " + id + " has been found in the library");
    }
    // Receive a copyId as a parameter and return the book dto of this copy
    public Optional<BookDTO> findBookByCopyId(String copyId){
        // 1. Change the String id to an ObjectId
        ObjectId restoredObjectId = new ObjectId(copyId);

        // 2. Look for the copy in the database
        Optional<Copy> optionalCopy = copyRepository.findById(restoredObjectId);

        // 3. Find the book of this copy in the database
        if (optionalCopy.isPresent()){
            Copy copy = optionalCopy.get();
            ObjectId bookId = copy.getBookId();
            Optional <Book> optionalBook = findBookById(bookId);

            // 4. Create the DTO with the book and the copy data
            if(optionalBook.isPresent()){
                Book book = optionalBook.get();
                BookDTO bookDTO = new BookDTO();
                bookDTO.setCopyId(copy.getId().toHexString());
                bookDTO.setIsAvailable(copy.getIsAvailable());
                bookDTO.setId(book.getId().toHexString());
                bookDTO.setIsbn10(book.getIsbn10());
                bookDTO.setIsbn13(book.getIsbn13());
                bookDTO.setTitle(book.getTitle());
                bookDTO.setAuthors(book.getAuthors());
                bookDTO.setCover(book.getCover());
                bookDTO.setNumber_of_pages(book.getNumber_of_pages());
                bookDTO.setPublish_date(book.getPublish_date());
                bookDTO.setPublish_places(book.getPublish_places());
                bookDTO.setPublishers(book.getPublishers());
                bookDTO.setSubjects(book.getSubjects());
                bookDTO.setSubject_people(book.getSubject_people());
                bookDTO.setSubject_places(book.getSubject_places());

                return Optional.of(bookDTO);
            } else throw new IllegalArgumentException("No book with id " + bookId + " has been found in the library");
        } else throw new IllegalArgumentException("No copy with id " + copyId + " has been found in the library");
    }

    // Add subject, subject_people or subject_places to a given book
    public String addSubject(String isbn, String subjectType, String subject ){
        Optional<Book> bookOptional = findBookByIsbn(isbn);
        if (bookOptional.isPresent()){
            Book book = bookOptional.get();
            switch (subjectType){
                case "subjects" -> book.getSubjects().add(subject);
                case "subject_places" -> book.getSubject_places().add(subject);
                case "subject_people" -> book.getSubject_people().add(subject);
            }
            bookRepository.save(book);
            return subjectType + " " + subject + " added correctly to book " + isbn;
        } else {
            throw new RuntimeException("Book with isbn " + isbn + " doesn't exist in the database");
        }
    }

    public String removeBook(ObjectId id){
        Optional <Book> optionalBook = findBookById(id);
        if (optionalBook.isPresent()){
            Book book = optionalBook.get();
            bookRepository.delete(book);

            return "Book has been removed from the database.";
        } else throw new RuntimeException("No book with this id in the library.");
    }

    // Remove a subject, subject_people or subject_places to a given book
    public String removeSubject(String isbn, String subjectType, String subject) {
        Optional<Book> bookOptional = findBookByIsbn(isbn);
        // 1. If book with the given isbn exists
        if (bookOptional.isPresent()) {
            Book book = bookOptional.get();
            List<String> subjects = switch (subjectType) {
                case "subjects" -> book.getSubjects();
                case "subject_places" -> book.getSubject_places();
                case "subject_people" -> book.getSubject_people();
                default -> Collections.emptyList();
            };
            // 2. Loop through the subject list of this book and look for the given subject in parameters
            if (subjects != null && !subjects.isEmpty()) {
                for (String subj : subjects) {
                    if (subj.equals(subject)) {
                        // 3.1 If the given subject exists then remove it and save the book into the database
                        subjects.remove(subj);
                        bookRepository.save(book);
                        return "Subject: " + subject + " correctly removed from the database.";
                    }
                }
            }
        } else {
            throw new RuntimeException("Book with isbn " + isbn + " doesn't exist in the database");
        }
        // 3.2 If the given subject doesn't exist, trow an exception
        return subjectType + ": " + subject + " not found";
    }

    // Return all the book of the database
    public List<Book> findAllBooks(){
        return bookRepository.findAll();
    }
}

