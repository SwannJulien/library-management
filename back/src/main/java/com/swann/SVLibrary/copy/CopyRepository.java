package com.swann.SVLibrary.copy;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;


import java.util.List;

public interface CopyRepository extends MongoRepository<Copy, String> {

    List<Copy> findAllByBookId(String bookId);
}
