package com.swann.SVLibrary.borrowing;

import com.swann.SVLibrary.DTO.BorrowingDTO;
import com.swann.SVLibrary.book.Book;
import com.swann.SVLibrary.book.BookService;
import com.swann.SVLibrary.copy.Copy;
import com.swann.SVLibrary.copy.CopyService;
import com.swann.SVLibrary.user.UserService;
import com.swann.SVLibrary.user.User;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowingService {
    protected static final Logger logger = LogManager.getLogger();

    @Autowired
    private CopyService copyService;
    @Autowired
    private UserService userService;
    @Autowired
    private BookService bookService;
    @Autowired
    private BorrowingRepository borrowingRepository;

    static final int MAX_BORROWINGS_ALLOWED = 3;

    // TODO: debug this code, when passing wrong email we don't get the expected error message

    public String addBorrowing(String copyId, String email) {
        try {
            Optional<Copy> copyOptional = copyService.findCopyById(copyId);
            Optional<User> userOptional = userService.findUserByEmail(email);

            // 1. Check if copy and user exists
            if (copyOptional.isPresent() && userOptional.isPresent()) {
                Copy copy = copyOptional.get();
                User user = userOptional.get();

                ObjectId copyObjectId = copy.getId();
                ObjectId userObjectId = user.getId();

            // 2. Check if user has exceeded the max of borrowings allowed
                List<Borrowing> borrowingPerUser = getBorrowingByUser(userObjectId.toHexString());
                boolean isOverLimit = borrowingPerUser.size() > MAX_BORROWINGS_ALLOWED;
                if (isOverLimit) {
                    throw new RuntimeException("User " + user.getFirstName() + " " + user.getLastName() + " has exceeded the number of borrowings allowed");

            // 3. Check if copy is available
                } else if (!copy.getIsAvailable()) {
                    throw new RuntimeException("Copy " + copyId + " is not available");
                } else {
                    Borrowing borrowing = new Borrowing(copyObjectId, userObjectId, LocalDate.now(), LocalDate.now().plusMonths(1));
                    borrowingRepository.save(borrowing);
                    copyService.updateAvailabilityOfCopy(copyId, false);
                    return "Borrowing successfully created";
                }
            } else {
                throw new Exception("No user or copy with these ids");
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public Optional<Borrowing> findBorrowingByCopyId(String copyId){
        ObjectId restoredObjectId = new ObjectId(copyId);
        Optional<Borrowing> borrowing = borrowingRepository.findByCopyId(restoredObjectId);
        if (borrowing.isPresent())
            return borrowing;
        throw new RuntimeException("No borrowing of copy id: " + copyId + " found in the system");
    }

    public void removeBorrowing(String copyId){
        try {
            Optional<Borrowing> borrowingOptional = findBorrowingByCopyId(copyId);
            if (borrowingOptional.isPresent()) {
                borrowingRepository.deleteById(borrowingOptional.get().getId());
            }
        } catch (Exception e){
            throw new RuntimeException("Error deleting borrowing in database: " + e.getMessage());
        }
    }

    public List<Borrowing> findAllBorrowings(){
        return borrowingRepository.findAll();
    }

    public List<BorrowingDTO> showAllBorrowingsDTO(){
        List<BorrowingDTO> borrowingDTOS = new ArrayList<BorrowingDTO>();
        List<Borrowing> borrowings = findAllBorrowings();

        for (Borrowing borrowing: borrowings) {
            BorrowingDTO borrowingDTO = new BorrowingDTO();

            String userId = borrowing.getUserId().toString();
            Optional<User> userOptional = userService.findUserById(userId);
            if (userOptional.isPresent()){
                User user = userOptional.get();
                String userEmail = user.getEmail();
                borrowingDTO.setEmail(userEmail);

                String userFirstName = user.getFirstName();
                borrowingDTO.setFirstName(userFirstName);

                String userLastName = user.getLastName();
                borrowingDTO.setLastName(userLastName);
            }

            String copyId = borrowing.getCopyId().toString();
            borrowingDTO.setCopyId(copyId);
            Optional<Copy> copyOptional = copyService.findCopyById(copyId);
            if (copyOptional.isPresent()){
                Copy copy = copyOptional.get();
                String bookId = copy.getBookId().toString();

                Optional<Book> bookOptional = bookService.findBookByIdString(bookId);
                if (bookOptional.isPresent()){
                    Book book = bookOptional.get();
                    String bookTitle = book.getTitle();
                    borrowingDTO.setTitle(bookTitle);
                }
            }
            LocalDate borrowDate =  borrowing.getBorrowDate();
            borrowingDTO.setBorrowDate(borrowDate);

            LocalDate dueDate = borrowing.getDueDate();
            borrowingDTO.setDueDate(dueDate);

            borrowingDTOS.add(borrowingDTO);
        }
        return borrowingDTOS;
    }

    public List<Borrowing> getBorrowingByUser(String userId){
        try{
            ObjectId userObjectId = new ObjectId(userId);
            return borrowingRepository.findAllByUserId(userObjectId);
        } catch (Exception e){
            throw new RuntimeException("No user with id " + userId + " found");
        }
    }
}

