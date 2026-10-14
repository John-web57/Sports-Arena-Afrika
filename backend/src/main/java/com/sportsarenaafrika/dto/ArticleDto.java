package com.sportsarenaafrika.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

public class ArticleDto {
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ArticleResponse {
        private Long id; private String title; private String slug; private String summary; private String content;
        private String featuredImage; private String categoryName; private String categorySlug; private String authorName; private String editedBy;
        private Boolean isBreaking; private Boolean isTopNews; private Long viewsCount; private Integer readingTime;
        private String status; private String metaTitle; private String metaDescription;
        private LocalDateTime publishedAt; private LocalDateTime createdAt;
    }
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ArticleCreateRequest {
        @NotBlank @Size(max=255) private String title;
        @Size(max=10000) private String summary;
        @NotBlank private String content;
        @Size(max=500) private String featuredImage;
        @NotNull private Long categoryId;
        private Boolean isBreaking; private Boolean isTopNews;
        @Min(1) @Max(120) private Integer readingTime;
        @Size(max=255) private String metaTitle;
        @Size(max=10000) private String metaDescription;
    }
}
