package com.swann.SVLibrary.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowingDTO {
    private String title;
    private String copyId;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate borrowDate;
    private LocalDate dueDate;
}
