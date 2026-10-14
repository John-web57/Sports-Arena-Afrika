package com.sportsarenaafrika.repository;

import com.sportsarenaafrika.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    Optional<Article> findBySlug(String slug);

    Optional<Article> findBySlugAndStatus(String slug, String status);

    List<Article> findByStatusOrderByPublishedAtDesc(String status);

    List<Article> findByIsTopNewsTrueAndStatusOrderByPublishedAtDesc(String status);

    List<Article> findByIsBreakingTrueAndStatusOrderByPublishedAtDesc(String status);

    List<Article> findByCategoryIdAndStatusOrderByPublishedAtDesc(Long categoryId, String status);

    List<Article> findAllByOrderByCreatedAtDesc();

    List<Article> findByAuthor_UsernameOrderByCreatedAtDesc(String username);

    long countByAuthor_Id(Long authorId);

    @Query("SELECT a FROM Article a WHERE a.status = 'PUBLISHED' AND (LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.summary) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Article> searchArticles(String query);
}
