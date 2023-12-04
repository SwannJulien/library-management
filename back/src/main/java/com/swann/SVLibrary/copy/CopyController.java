package com.swann.SVLibrary.copy;

import com.swann.SVLibrary.DTO.CopyDTO;
import com.swann.SVLibrary.book.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
//@AllArgsConstructor
//@NoArgsConstructor
@CrossOrigin
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
    public ResponseEntity<Object> addExistingBookCopy (@PathVariable String isbn){
        try {
            Copy copy = copyService.addCopyOfExistingBook(isbn);
            Map<String, String> data = new HashMap<>();
            data.put("message", "Copy successfully created");
            data.put("copyId", copy.getId());
            data.put("bookId", copy.getBookId());
            data.put("isAvailable", copy.getIsAvailable().toString());
            return ResponseEntity.status(HttpStatus.CREATED).body(data);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("copies/{id}")
    public ResponseEntity<Object> removeCopy(@PathVariable String id)
    {
        try{
            String message = copyService.removeCopy(id);
            Map<String, String> data = new HashMap<>();
            data.put("message", message);
            return ResponseEntity.status(HttpStatus.OK).body(data);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

    @GetMapping("all-copies/{bookId}")
    public List<Copy> findAllCopiesOfaBook(@PathVariable String bookId){
        return copyService.findAllCopiesOfaBook(bookId);
    }

    @PatchMapping("copies/{id}/updateAvailability")
    public String updateCopyAvailability(
            @PathVariable String id,
            @RequestParam("isAvailable") Boolean isAvailable){
        return copyService.updateAvailabilityOfCopy(id, isAvailable);
    }
}
