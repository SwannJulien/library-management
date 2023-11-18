package com.swann.SVLibrary.copy;

import com.swann.SVLibrary.DTO.CopyDTO;
import com.swann.SVLibrary.book.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
//@AllArgsConstructor
//@NoArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CopyController {

    @Autowired
    private BookService bookService;
    @Autowired
    private CopyService copyService;

    @GetMapping("/copies/{id}")
    public Optional<Copy> getCopyById(@PathVariable String id){
        return copyService.findCopyById(id);
    }

    @GetMapping("/copiesDTO/{id}")
    public Optional<CopyDTO> getCopyDTOById(@PathVariable String id){
        return copyService.findCopyDTOById(id);
    }

    @PostMapping("copies/{isbn}")
    public ResponseEntity<String> addExistingBookCopy (@PathVariable String isbn){
        try {
            Copy copy = copyService.addCopyOfExistingBook(isbn);
            return ResponseEntity.status(HttpStatus.CREATED).body("Copy created " + copy);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("copies/{id}")
    public String removeCopy(@PathVariable String id){
        return copyService.removeCopy(id);
    }

    @GetMapping("all-copies/{id}")
    public List<Copy> findAllCopyOfaBook(@PathVariable String id){
        return copyService.findAllCopiesOfaBook(id);
    }

    @PatchMapping("copies/{id}/updateAvailability")
    public String updateCopyAvailability(
            @PathVariable String id,
            @RequestParam("isAvailable") Boolean isAvailable){
        return copyService.updateAvailabilityOfCopy(id, isAvailable);
    }
}
