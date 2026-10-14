package com.sportsarenaafrika.repository;

import com.sportsarenaafrika.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByDiscussionIdOrderByCreatedAtAsc(Long discussionId);
}
