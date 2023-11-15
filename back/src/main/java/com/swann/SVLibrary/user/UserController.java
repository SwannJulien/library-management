package com.swann.SVLibrary.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("users")
    public ResponseEntity<String> addUser (@RequestBody User user){
        try {
            userService.addUser(user);
            return ResponseEntity.status(
                            HttpStatus.CREATED)
                    .body("User " + user.getFirstName() + " has been successfully created")
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

    @GetMapping("/users/{id}")
    public Optional<User> getUserById(@PathVariable String id){
        return userService.findUserById(id);
    }

    // Get user by passing its email in body of http request
    @PostMapping("users/get-by-email")
    public ResponseEntity<Object> getUserByEmail(@RequestBody Map<String, String> requestBody){
        String email = requestBody.get("email");
        if (email == null || email.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please provide a valid email");
        }

        Optional<User> userOptional = userService.findUserByEmail(email);
        if (userOptional.isPresent()){
            User user = userOptional.get();
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No user found with email " + email);
        }
    }

    @GetMapping("users/all")
    public List<User> findAllUsers(){
        return userService.findAllUsers();
    }

    @DeleteMapping("users")
    public ResponseEntity<String> deleteUserByEmail(@RequestBody Map<String, String> requestBody){
        String email = requestBody.get("email");
        if (email == null || email.isEmpty()){
            return ResponseEntity.badRequest().body("Please enter a valid email");
        }

        String deleteMessage = userService.removeUserByEmail(email);
        if (deleteMessage != null && !deleteMessage.isEmpty()){
            return ResponseEntity.ok(deleteMessage);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No resource with this email");
        }
    }

    @PutMapping("users")
    public ResponseEntity<String> updateUserByEmail(@RequestBody User user) {
        String email = user.getEmail();
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Please enter a valid email");
        }

        String updateMessage = userService.updateUser(user);
        if (updateMessage != null && !updateMessage.isEmpty()) {
            return ResponseEntity.ok(updateMessage);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No resource with this email");
        }
    }

}
