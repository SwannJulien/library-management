package com.swann.SVLibrary.copy;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "copies")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Copy {
    @Id
    private String id;
    private String bookId;
    private Boolean isAvailable;

    // Constructor
    public Copy(String id, Boolean isAvailable){
        this.bookId = id;
        this.isAvailable = isAvailable;
    }
}
