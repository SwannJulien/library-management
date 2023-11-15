package com.swann.SVLibrary.book;

import com.swann.SVLibrary.CustomException;
import com.swann.SVLibrary.borrowing.Borrowing;
import com.swann.SVLibrary.copy.Copy;
import com.swann.SVLibrary.copy.CopyRepository;
import com.swann.SVLibrary.user.User;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
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

    // Add a book and a copy of this book in DB and return the id of the copy
    public ObjectId addBookAndCopyToLibrary(Book book){
            String isbn = book.getIsbn10()==null ? book.getIsbn13() : book.getIsbn10();
            Optional<Book> optionalBook = findBookByIsbn(isbn);
            // Avoid saving two books with the same isbn number. Make isbn unique
            if (optionalBook.isEmpty()){
                Book savedBook = bookRepository.save(book);
                Copy newCopy = new Copy(savedBook.getId(), true);
                Copy savedCopy =  copyRepository.save(newCopy);
                return savedCopy.getId();
            } else {
                throw new RuntimeException("Book with the same isbn " + isbn + " already exists");
            }
    }

    // Find a book thanks to its isbn
    public Optional<Book> findBookByIsbn(String isbn) {
        return switch (isbn.length()) {
            case 10 -> Optional.ofNullable(bookRepository.findByIsbn10(isbn));
            case 13 -> Optional.ofNullable(bookRepository.findByIsbn13(isbn));
            default -> Optional.empty();
        };
    }

    public Optional<Book> findBookByIdString(String id) {
        ObjectId restoredObjectId = new ObjectId(id);
        Optional<Book> book = bookRepository.findById(restoredObjectId);
        if (book.isPresent())
            return book;
        throw new IllegalArgumentException("Book with id " + id + " not found in the DB");
    }

    public Optional<Book> findBookById(ObjectId id){
        Optional<Book> book = bookRepository.findById(id);
        if (book.isPresent())
            return book;
        throw new IllegalArgumentException("Book with id " + id + " not found in the DB");
    }

    public Optional<BookDTO> findBookByCopyId(String copyId){
        ObjectId restoredObjectId = new ObjectId(copyId);
        Optional<Copy> optionalCopy = copyRepository.findById(restoredObjectId);
        if (optionalCopy.isPresent()){
            Copy copy = optionalCopy.get();
            ObjectId bookId = copy.getBookId();
            Optional <Book> optionalBook = findBookById(bookId);
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
            } else throw new IllegalArgumentException("Book with id " + bookId + " not found in the DB");
        } else throw new IllegalArgumentException("Copy with id " + copyId + " not found in the DB");
    }

    // Add subject, subject_people or subject_places to a certain book
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
            throw new CustomException.ResourceNotFoundException("Book with isbn " + isbn + " doesn't exist in the database");
        }
    }

    // Remove a subject, subject_people or subject_places to a certain book
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
            throw new CustomException.ResourceNotFoundException("Book with isbn " + isbn + " doesn't exist in the database");
        }
        // 3.2 If the given subject doesn't exist, trow an exception
        return subjectType + ": " + subject + " not found";
    }

    public List<Book> findAllBooks(){
        return bookRepository.findAll();
    }
}

