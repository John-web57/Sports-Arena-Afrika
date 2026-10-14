package com.sportsarenaafrika.repository;

import com.sportsarenaafrika.model.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    List<Discussion> findByIsTrendingTrueOrderByCreatedAtDesc();
    List<Discussion> findAllByOrderByCreatedAtDesc();
}
