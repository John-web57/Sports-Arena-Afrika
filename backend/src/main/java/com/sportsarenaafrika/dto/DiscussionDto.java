package com.sportsarenaafrika.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class DiscussionDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DiscussionResponse {
        private Long id;
        private String authorName;
        private String authorAvatar;
        private String authorHandle;
        private String title;
        private String content;
        private Integer likesCount;
        private Integer commentsCount;
        private Boolean isTrending;
        private LocalDateTime createdAt;
        private List<CommentResponse> comments;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CommentResponse {
        private Long id;
        private String authorName;
        private String authorAvatar;
        private String content;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentCreateRequest {
        private String authorName;
        private String authorAvatar;
        private String content;
    }
}
