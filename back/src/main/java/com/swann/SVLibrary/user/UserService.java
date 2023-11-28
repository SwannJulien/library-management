package com.swann.SVLibrary.user;


import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public void addUser(User user) {
        Optional<User> OptionalUser = findUserByEmail(user.getEmail());
        if (OptionalUser.isPresent()){
            throw new IllegalArgumentException("User with email: " + user.getEmail() + " already exists and can't be added to the database");
        } else {
            userRepository.save(user);
        }
    }

    public Optional<User> findUserByEmail(String email){
        try{
            return Optional.ofNullable(userRepository.findByEmail(email));
        } catch (Exception e){
            throw new RuntimeException("Email: " + email + " not found " + e.getMessage());
        }
    }

    public Optional<User> findUserById(String id){
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent())
            return user;
        throw new RuntimeException("User with id " + id + " is not found");
    }

    public List<User> findAllUsers(){
        return userRepository.findAll();
    }

    public String removeUserByEmail(String email){
        Optional<User> userOptional =  findUserByEmail(email);
        if (userOptional.isPresent()){
            User user = userOptional.get();
            userRepository.delete(user);
            return "User with email " + email + " has been successfully deleted";
        } else {
            throw new RuntimeException("User with email: " + email + "is not found.");
        }
    }

    public String updateUser(User user){
        Optional<User> optionalUser = findUserByEmail(user.getEmail());
        if (optionalUser.isPresent()){
            User existingUser = optionalUser.get();
            existingUser.setFirstName(user.getFirstName());
            existingUser.setLastName(user.getLastName());
            existingUser.setClassYear(user.getClassYear());
            existingUser.setYearGroup(user.getYearGroup());
            existingUser.setHouse(user.getHouse());
            existingUser.setPhoneNumber(user.getPhoneNumber());
            existingUser.setRole(user.getRole());
            userRepository.save(existingUser);
            return "User with email: " + user.getEmail() + " successfully updated";
        } else {
            throw new RuntimeException("No user with email: " + user.getEmail() + " found");
        }
    }
}
