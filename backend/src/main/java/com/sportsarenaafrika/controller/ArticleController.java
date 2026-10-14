package com.sportsarenaafrika.controller;

import com.sportsarenaafrika.dto.ArticleDto;
import com.sportsarenaafrika.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.security.Principal;
import java.util.List;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<List<ArticleDto.ArticleResponse>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllPublishedArticles());
    }

    @GetMapping("/manage")
    public ResponseEntity<List<ArticleDto.ArticleResponse>> getEditorialArticles() {
        return ResponseEntity.ok(articleService.getEditorialArticles());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ArticleDto.ArticleResponse>> getMyArticles(Principal principal) {
        return ResponseEntity.ok(articleService.getMyArticles(principal.getName()));
    }

    @GetMapping("/top-news")
    public ResponseEntity<List<ArticleDto.ArticleResponse>> getTopNews() {
        return ResponseEntity.ok(articleService.getTopNews());
    }

    @GetMapping("/breaking")
    public ResponseEntity<List<ArticleDto.ArticleResponse>> getBreakingNews() {
        return ResponseEntity.ok(articleService.getBreakingNews());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ArticleDto.ArticleResponse>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(articleService.getArticlesByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ArticleDto.ArticleResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(articleService.searchArticles(q));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ArticleDto.ArticleResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(articleService.getArticleBySlug(slug));
    }

    @PutMapping("/{id}/publish")
    public ResponseEntity<ArticleDto.ArticleResponse> publishArticle(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.publishArticle(id));
    }

    @PutMapping("/{id}/submit-review")
    public ResponseEntity<ArticleDto.ArticleResponse> submitForReview(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(articleService.submitForReview(id, principal.getName()));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ArticleDto.ArticleResponse> approveArticle(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.approveArticle(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleDto.ArticleResponse> updateArticle(
            @PathVariable Long id,
            @Valid @RequestBody ArticleDto.ArticleCreateRequest request,
            Authentication authentication) {
        boolean canEditAny = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_SUPER_ADMIN") || authority.getAuthority().equals("ROLE_EDITOR"));
        return ResponseEntity.ok(articleService.updateArticle(id, request, authentication.getName(), canEditAny));
    }

    @PostMapping
    public ResponseEntity<ArticleDto.ArticleResponse> createArticle(
            @Valid @RequestBody ArticleDto.ArticleCreateRequest request,
            Principal principal) {
        return ResponseEntity.ok(articleService.createArticle(request, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}
