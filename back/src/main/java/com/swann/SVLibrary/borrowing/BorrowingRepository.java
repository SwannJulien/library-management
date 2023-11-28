package com.swann.SVLibrary.borrowing;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowingRepository extends MongoRepository<Borrowing, String> {
    Optional<Borrowing> findByCopyId(String copyId);
    List<Borrowing> findAllByUserId(ObjectId userId);
}
