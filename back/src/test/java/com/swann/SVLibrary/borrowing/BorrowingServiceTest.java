package com.swann.SVLibrary.borrowing;

import org.bson.types.ObjectId;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class BorrowingServiceTest {

        @Mock
        private BorrowingRepository borrowingRepository;

        @InjectMocks
        private BorrowingService borrowingService;

        @Test
        public void testFindAllBorrowings() {
            // Arrange
            Borrowing borrowing1 = new Borrowing(new String(), new String(), LocalDate.now(), LocalDate.now().plusDays(14));
            Borrowing borrowing2 = new Borrowing(new String(), new String(), LocalDate.now(), LocalDate.now().plusDays(14));
            when(borrowingRepository.findAll()).thenReturn(Arrays.asList(borrowing1, borrowing2));
            // Act
            List<Borrowing> result = borrowingService.findAllBorrowings();
            // Assert
            assertEquals(2, result.size());
            assertEquals(borrowing1, result.get(0));
            assertEquals(borrowing2, result.get(1));
            // Verify that findAll() method is called once
            verify(borrowingRepository, times(1)).findAll();
        }
    }

