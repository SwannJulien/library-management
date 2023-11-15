package com.swann.SVLibrary.copy;

import com.swann.SVLibrary.CustomException;
import com.swann.SVLibrary.book.Book;
import com.swann.SVLibrary.book.BookRepository;
import com.swann.SVLibrary.book.BookService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CopyService {

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private CopyRepository copyRepository;
    @Autowired
    private BookService bookService;

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
        ObjectId restoredObjectId = new ObjectId(id);
            Optional<Copy> copy = copyRepository.findById(restoredObjectId);
            if (copy.isPresent())
                return copy;
            throw new IllegalArgumentException("Copy with id " + id + " doesn't exist in the DB");
    }

    public Optional <CopyDTO> findCopyDTOById(String id){
        ObjectId restoredObjectId = new ObjectId(id);
        Optional<Copy> optionalCopy = copyRepository.findById(restoredObjectId);
        if (optionalCopy.isPresent()) {
            Copy copy = optionalCopy.get();
            CopyDTO copyDTO = new CopyDTO();
            copyDTO.setId(copy.getId().toHexString());
            copyDTO.setBookId(copy.getBookId().toHexString());
            copyDTO.setIsAvailable(copy.getIsAvailable());
            return Optional.of(copyDTO);
        }
        throw new IllegalArgumentException("Copy with id " + id + " doesn't exist in the DB");
    }

    // Delete a copy thanks to its id
    public String removeCopy(String id){
        Optional<Copy> copy = findCopyById(id);
        copyRepository.deleteById(copy.get().getId());
        return "Copy with id " + id + " has been removed correctly";
    }

    // Return all copies associated to a book which isbn is passed in parameter
    public List<Copy> findAllCopiesOfaBook(String isbn){
        // Find the book by its isbn
        Optional<Book> bookOptional = bookService.findBookByIsbn(isbn);
        if (bookOptional.isPresent()) {
            // If the book is found, find all copies associated with its ID
            Book book = bookOptional.get();
            return copyRepository.findAllByBookId(book.getId());
        } else {
            // Handle the case where the book with the given ISBN is not found
            throw new IllegalArgumentException("No book with isbn " + isbn + " in the database");
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
        } else throw new CustomException.ResourceNotFoundException("No copy with id " + id + " in the database");
    }
}
