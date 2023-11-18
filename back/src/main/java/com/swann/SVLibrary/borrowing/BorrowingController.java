package com.swann.SVLibrary.borrowing;


import com.swann.SVLibrary.DTO.BorrowingDTO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class BorrowingController {

    protected static final Logger logger = LogManager.getLogger();

    @Autowired
    private BorrowingService borrowingService;

    @PostMapping("borrowings")
    public ResponseEntity<String> addBorrowing(@RequestBody Map<String, String> requestBody){
        String email = requestBody.get("email");
        String copyId = requestBody.get("copyId");

        if (email == null || email.isEmpty()){
            return ResponseEntity.badRequest().body("Please enter a valid email");
        } else if (copyId == null || copyId.isEmpty()) {
            return ResponseEntity.badRequest().body("Please enter a valid copyId");
        }
        String addMessage = borrowingService.addBorrowing(copyId, email);
        if (!addMessage.isEmpty()){
            return ResponseEntity.status(HttpStatus.CREATED).body(addMessage);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(addMessage);
        }
    }

    @DeleteMapping("borrowings/{copyId}")
    public ResponseEntity<String> deleteBorrowing(@PathVariable String copyId){
        try{
            borrowingService.removeBorrowing(copyId);
            return ResponseEntity.status(HttpStatus.OK).body("Borrowing of copy id " + copyId + " correctly deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(
                    HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @GetMapping("borrowings/all")
    public List<Borrowing> getAllBorrowings(){
        return borrowingService.findAllBorrowings();
    }

    @GetMapping("borrowings/show-all")
    public List<BorrowingDTO> getAllBorrowingsDTO(){
        return borrowingService.showAllBorrowingsDTO();
    }

    @GetMapping("borrowings/user/{id}")
    public List<Borrowing> getAllBorrowingByUser(@PathVariable String id){
        return borrowingService.getBorrowingByUser(id);
    }
}
