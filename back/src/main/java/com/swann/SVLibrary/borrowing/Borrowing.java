package com.swann.SVLibrary.borrowing;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Document(collection = "borrowings")
public class Borrowing {
    @Id
    private String id;
    private String copyId;
    private String userId;
    private LocalDate borrowDate;
    private LocalDate dueDate;

    public Borrowing(String copyId, String userId, LocalDate borrowDate, LocalDate dueDate){
        this.copyId = copyId;
        this.userId = userId;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
    }
}
