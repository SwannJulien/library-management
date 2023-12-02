package com.swann.SVLibrary.copy;


import com.swann.SVLibrary.DTO.CopyDTO;
import com.swann.SVLibrary.book.Book;
import com.swann.SVLibrary.book.BookRepository;
import com.swann.SVLibrary.book.BookService;
import com.swann.SVLibrary.borrowing.Borrowing;
import com.swann.SVLibrary.borrowing.BorrowingRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CopyService {
    protected static final Logger logger = LogManager.getLogger();

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private CopyRepository copyRepository;
    @Autowired
    private BookService bookService;
    @Autowired
    private BorrowingRepository borrowingRepository;

    // Add a copy of an existing book into the DB
    public Copy addCopyOfExistingBook(String isbn) {
        try {
            Optional<Book> book = bookService.findBookByIsbn(isbn);

            if (book.isEmpty())
                throw new IllegalArgumentException("Book with isbn " + isbn + " doesn't exist in the database");

            Copy newCopy = new Copy(book.get().getId(), true);
            return copyRepository.save(newCopy);
        } catch (Exception e){
            throw new RuntimeException("Error adding copy to database: " + e.getMessage());
        }
    }

    // Find a copy thanks to its id
    public Optional<Copy> findCopyById(String id) {
        Optional<Copy> copy = copyRepository.findById(id);
        if (copy.isPresent())
            return copy;
        throw new IllegalArgumentException("Copy with id " + id + " doesn't exist in the DB");
    }

    public Optional <CopyDTO> findCopyDTOById(String id){
        Optional<Copy> optionalCopy = copyRepository.findById(id);
        if (optionalCopy.isPresent()) {
            Copy copy = optionalCopy.get();
            CopyDTO copyDTO = new CopyDTO();
            copyDTO.setId(copy.getId());
            copyDTO.setBookId(copy.getBookId());
            copyDTO.setIsAvailable(copy.getIsAvailable());
            return Optional.of(copyDTO);
        }
        throw new IllegalArgumentException("Copy with id " + id + " doesn't exist in the DB");
    }

    // Delete a copy thanks to its id
    public String removeCopy(String id){

        Optional<Copy> optionalCopy = findCopyById(id);
        if (optionalCopy.isPresent()){
           Copy copy = optionalCopy.get();
           String copyId = copy.getId();
           Optional<Borrowing> optionalBorrowing = borrowingRepository.findByCopyId(copyId);

           if (optionalBorrowing.isPresent()){
               throw new RuntimeException ("There is an active borrowing for this book. " +
                       "First you need to delete the borrowing. Only then you could delete the copy.");
           } else {
               String bookId = copy.getBookId();
               logger.info("BookId: " + bookId);
               List<Copy> copies = findAllCopiesOfaBook(bookId);
               logger.info("Copies: " +copies);
               if (copies.size() == 1){
                   copyRepository.deleteById(copy.getId());
                   bookService.removeBook(copy.getBookId());
                   return "This is the last copy of this book. The book has been removed from the library";
               } else {
                   copyRepository.deleteById(copy.getId());
                   return "Copy with id " + id + " has been removed correctly";
               }
           }
        } else return "No copy with id " + id + " has been found";
    }

    // Return all copies associated to a book which isbn is passed in parameter
    public List<Copy> findAllCopiesOfaBook(String bookId){
        // Find the book by its id
        Optional<Book> bookOptional = bookService.findBookByIdString(bookId);
        if (bookOptional.isPresent()) {
            // If the book is found, find all copies associated with its ID
            Book book = bookOptional.get();
            return copyRepository.findAllByBookId(bookId);
        } else {
            // Handle the case where the book with the given ISBN is not found
            throw new IllegalArgumentException("No book with isbn " + bookId + " in the database");
        }
    }

    public String updateAvailabilityOfCopy(String id, Boolean isAvailable){
        Optional<Copy> Copyoptional = findCopyById(id);
        if (Copyoptional.isPresent()){
            Copy copy = Copyoptional.get();
            copy.setIsAvailable(isAvailable);
            copyRepository.save(copy);
            String message = isAvailable ? "is now available" : "is now not available";
            return "The copy with id " + id + " " + message;
        } else throw new RuntimeException("No copy with id " + id + " in the database");
    }
}
