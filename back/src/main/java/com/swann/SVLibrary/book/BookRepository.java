package com.swann.SVLibrary.book;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    Optional<Book> findByIsbn10(String isbn);
    Optional<Book> findByIsbn13(String isbn);
}
