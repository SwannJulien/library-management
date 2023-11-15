package com.swann.SVLibrary.book;

import com.swann.SVLibrary.borrowing.Borrowing;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// TODO: check if annotations AllArgs and NoArgs are required. Seems not...
@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin
public class BookController {

    @Autowired
    private BookService bookService;

    @PostMapping("/books")
    public ResponseEntity<String> addNewBook (@Valid @RequestBody Book book){
        try {
            ObjectId copyId = bookService.addBookAndCopyToLibrary(book);
            return ResponseEntity.status(
                    HttpStatus.CREATED)
                    .body(copyId.toHexString())
                    ;
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(
                    HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/books/{isbn}")
    public Optional<Book> getBookByIsbn(@PathVariable String isbn){
        Optional<Book> book = bookService.findBookByIsbn(isbn);
        if (book.isEmpty())
            throw new RuntimeException("Isbn number is not valid. Must be 10 or 13 characters");
        return book;
    }

    @GetMapping("/book/get-by-id/{id}")
    public Optional<Book> getBookByIdString(@PathVariable String id){
        Optional<Book> book = bookService.findBookByIdString(id);
        if (book.isEmpty())
            throw new RuntimeException("Id not valid");
        return book;
    }

    @GetMapping("/books/dto/{id}")
    public Optional<BookDTO> getBookById(@PathVariable String id){
        Optional<BookDTO> book = bookService.findBookByCopyId(id);
        if (book.isEmpty())
            throw new RuntimeException("Id not valid");
        return book;
    }



    @PostMapping("books/{isbn}/addSubject")
    public String addSubjectToExistingBook(
            @PathVariable String isbn,
            @RequestParam("subjectType") String subjectType,
            @RequestParam("subject") String subject) {
        return bookService.addSubject(isbn, subjectType, subject);
    }

    @DeleteMapping("books/{isbn}/deleteSubject")
    public String deleteSubject(
            @PathVariable String isbn,
            @RequestParam("subjectType") String subjectType,
            @RequestParam("subject") String subject){
        return bookService.removeSubject(isbn, subjectType, subject);
    }

    @GetMapping("books/all")
    public List<Book> getAllBooks(){
        return bookService.findAllBooks();
    }
}
