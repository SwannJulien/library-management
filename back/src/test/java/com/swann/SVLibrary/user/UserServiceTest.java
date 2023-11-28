package com.swann.SVLibrary.user;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void testFindAllUsers() {
        // Arrange
        User user1 = new User(new String(), "User1F", "User1L", "2023", "A", "Gryffindor", "user1@example.com", "123456789", "Student");
        User user2 = new User(new String(), "User2F", "User2L", "2023", "B", "Hufflepuff", "user2@example.com", "2345678901", "Student");
        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));
        // Act
        List<User> result = userService.findAllUsers();
        // Assert
        assertEquals(2, result.size());
        assertEquals(user1, result.get(0));
        assertEquals(user2, result.get(1));
    }

    @Test
    void testAddUser() {
        // Arrange
        User user = new User(new String(), "User1F", "User1L", "2023", "A", "Gryffindor", "user1@example.com", "123456789", "Student");
        // No user returned so can go to the next step
        when(userRepository.findByEmail(user.getEmail())).thenReturn(null);
        // Act
        userService.addUser(user);
        // Verify save method is called only once
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testAddUserWithExistingEmail() {
        // Arrange
        User user = new User(new String(), "User1F", "User1L", "2023", "A", "Gryffindor", "user1@example.com", "123456789", "Student");
        // return an existing user
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
        // Act and Assert
        assertThrows(IllegalArgumentException.class, () -> userService.addUser(user));
        // Verify that save method is not called
        verify(userRepository, never()).save(user);
    }
}
