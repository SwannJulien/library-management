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
    private ObjectId id;
    private ObjectId bookId;
    private Boolean isAvailable;

    // Constructor
    public Copy(ObjectId bookId, Boolean isAvailable){
        this.bookId = bookId;
        this.isAvailable = isAvailable;
    }
}
