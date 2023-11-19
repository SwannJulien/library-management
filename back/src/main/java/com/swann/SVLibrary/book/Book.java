package com.swann.SVLibrary.book;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    private ObjectId id;
    // TODO: ISBN10 and 13 should be an array because Open Library return an array
    private String isbn10;
    private String isbn13;
    private String title;
    private List<String> authors;
    private int number_of_pages;
    private List<String> publishers;
    private String publish_date;
    private List<String> publish_places;
    private List<String> subjects;
    private List<String> subject_places;
    private List<String> subject_people;
    private Cover cover;
}
