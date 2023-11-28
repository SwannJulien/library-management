package com.swann.SVLibrary.user;

import com.swann.SVLibrary.book.Book;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);
}
