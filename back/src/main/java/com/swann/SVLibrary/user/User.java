package com.swann.SVLibrary.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {
    @Id
    private ObjectId id;
    private String firstName;
    private String lastName;
    private String classYear;
    private String yearGroup;
    private String house;
    private String email;
    private String phoneNumber;
    private String role;
}
