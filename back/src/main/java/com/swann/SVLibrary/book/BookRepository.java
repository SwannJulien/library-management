package com.swann.SVLibrary.book;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends MongoRepository<Book, ObjectId> {
    Book findByIsbn10(String isbn);
    Book findByIsbn13(String isbn);
}
