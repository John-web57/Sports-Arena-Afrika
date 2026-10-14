package com.sportsarenaafrika.repository;

import com.sportsarenaafrika.model.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    Optional<Poll> findFirstByIsActiveTrueOrderByCreatedAtDesc();
}
