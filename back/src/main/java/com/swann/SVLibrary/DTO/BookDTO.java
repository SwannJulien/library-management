package com.swann.SVLibrary.DTO;

import com.swann.SVLibrary.book.Cover;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookDTO {

    private String id;
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
    private String copyId;
    private Boolean isAvailable;
}
