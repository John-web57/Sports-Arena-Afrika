package com.sportsarenaafrika.service;

import com.sportsarenaafrika.dto.ArticleDto;
import com.sportsarenaafrika.model.Article;
import com.sportsarenaafrika.model.Category;
import com.sportsarenaafrika.model.User;
import com.sportsarenaafrika.repository.ArticleRepository;
import com.sportsarenaafrika.repository.CategoryRepository;
import com.sportsarenaafrika.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<ArticleDto.ArticleResponse> getAllPublishedArticles() {
        return articleRepository.findByStatusOrderByPublishedAtDesc("PUBLISHED")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ArticleDto.ArticleResponse> getEditorialArticles() {
        return articleRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ArticleDto.ArticleResponse> getMyArticles(String username) {
        return articleRepository.findByAuthor_UsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ArticleDto.ArticleResponse> getTopNews() {
        return articleRepository.findByIsTopNewsTrueAndStatusOrderByPublishedAtDesc("PUBLISHED")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ArticleDto.ArticleResponse> getBreakingNews() {
        return articleRepository.findByIsBreakingTrueAndStatusOrderByPublishedAtDesc("PUBLISHED")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ArticleDto.ArticleResponse> getArticlesByCategory(Long categoryId) {
        return articleRepository.findByCategoryIdAndStatusOrderByPublishedAtDesc(categoryId, "PUBLISHED")
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ArticleDto.ArticleResponse> searchArticles(String query) {
        return articleRepository.searchArticles(query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ArticleDto.ArticleResponse getArticleBySlug(String slug) {
        Article article = articleRepository.findBySlugAndStatus(slug, "PUBLISHED")
                .orElseThrow(() -> new IllegalArgumentException("Article not found with slug: " + slug));
        
        article.setViewsCount(article.getViewsCount() + 1);
        articleRepository.save(article);

        return mapToResponse(article);
    }

    @Transactional
    public ArticleDto.ArticleResponse createArticle(ArticleDto.ArticleCreateRequest request, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Author user not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + request.getCategoryId()));


        String baseSlug = request.getTitle().toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
        String slug = baseSlug + "-" + System.currentTimeMillis();

        Article article = Article.builder()
                .title(request.getTitle())
                .slug(slug)
                .summary(request.getSummary())
                .content(request.getContent())
                .featuredImage(request.getFeaturedImage())
                .category(category)
                .author(author)
                .isBreaking(request.getIsBreaking() != null ? request.getIsBreaking() : false)
                .isTopNews(request.getIsTopNews() != null ? request.getIsTopNews() : false)
                .readingTime(request.getReadingTime() != null ? request.getReadingTime() : 3)
                .metaTitle(request.getMetaTitle())
                .metaDescription(request.getMetaDescription())
                .status("DRAFT")
                .publishedAt(null)
                .build();

        Article saved = articleRepository.save(article);
        return mapToResponse(saved);
    }

    @Transactional
    public ArticleDto.ArticleResponse publishArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with ID: " + id));
        if (!"APPROVED".equals(article.getStatus()) && !"PUBLISHED".equals(article.getStatus())) {
            throw new IllegalStateException("An editor must approve the article before publication.");
        }
        article.setStatus("PUBLISHED");
        article.setPublishedAt(LocalDateTime.now());
        return mapToResponse(articleRepository.save(article));
    }

    @Transactional
    public ArticleDto.ArticleResponse submitForReview(Long id, String username) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with ID: " + id));
        if (!article.getAuthor().getUsername().equals(username)) {
            throw new AccessDeniedException("You can only submit your own articles for review.");
        }
        if (!"DRAFT".equals(article.getStatus()) && !"PENDING_REVIEW".equals(article.getStatus())) {
            throw new IllegalStateException("Only drafts can be submitted for editorial review.");
        }
        article.setStatus("PENDING_REVIEW");
        return mapToResponse(articleRepository.save(article));
    }

    @Transactional
    public ArticleDto.ArticleResponse approveArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with ID: " + id));
        if (!"PENDING_REVIEW".equals(article.getStatus()) && !"DRAFT".equals(article.getStatus())) {
            throw new IllegalStateException("Only draft or review submissions can be approved.");
        }
        article.setStatus("APPROVED");
        return mapToResponse(articleRepository.save(article));
    }

    @Transactional
    public ArticleDto.ArticleResponse updateArticle(Long id, ArticleDto.ArticleCreateRequest request, String username, boolean canEditAny) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with ID: " + id));

        if (!canEditAny && (!article.getAuthor().getUsername().equals(username)
                || (!"DRAFT".equals(article.getStatus()) && !"PENDING_REVIEW".equals(article.getStatus())))) {
            throw new AccessDeniedException("You can only edit your own draft or review submission.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + request.getCategoryId()));

        article.setTitle(request.getTitle());
        article.setSummary(request.getSummary());
        article.setContent(request.getContent());
        article.setCategory(category);
        if (request.getFeaturedImage() != null && !request.getFeaturedImage().isBlank()) {
            article.setFeaturedImage(request.getFeaturedImage());
        }
        if (request.getIsBreaking() != null) {
            article.setIsBreaking(request.getIsBreaking());
        }
        if (request.getIsTopNews() != null) {
            article.setIsTopNews(request.getIsTopNews());
        }
        if (request.getReadingTime() != null) {
            article.setReadingTime(request.getReadingTime());
        }
        article.setMetaTitle(request.getMetaTitle());
        article.setMetaDescription(request.getMetaDescription());
        article.setEditedBy(userRepository.findByUsername(username).map(User::getFullName).orElse(null));
        if (!canEditAny && "PENDING_REVIEW".equals(article.getStatus())) {
            article.setStatus("DRAFT");
        }

        return mapToResponse(articleRepository.save(article));
    }

    @Transactional
    public void deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new IllegalArgumentException("Article not found with ID: " + id);
        }
        articleRepository.deleteById(id);
    }

    private ArticleDto.ArticleResponse mapToResponse(Article article) {
        return ArticleDto.ArticleResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .slug(article.getSlug())
                .summary(article.getSummary())
                .content(article.getContent())
                .featuredImage(article.getFeaturedImage())
                .categoryName(article.getCategory().getName())
                .categorySlug(article.getCategory().getSlug())
                .authorName(article.getAuthor().getFullName())
                .editedBy(article.getEditedBy())
                .isBreaking(article.getIsBreaking())
                .isTopNews(article.getIsTopNews())
                .viewsCount(article.getViewsCount())
                .readingTime(article.getReadingTime())
                .status(article.getStatus())
                .metaTitle(article.getMetaTitle())
                .metaDescription(article.getMetaDescription())
                .publishedAt(article.getPublishedAt())
                .createdAt(article.getCreatedAt())
                .build();
    }
}
