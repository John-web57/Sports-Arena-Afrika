package com.sportsarenaafrika.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class PollDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PollResponse {
        private Long id;
        private String question;
        private Long totalVotes;
        private Boolean isActive;
        private List<PollOptionResponse> options;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PollOptionResponse {
        private Long id;
        private String text;
        private Long votes;
        private Integer percent;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VoteRequest {
        private Long optionId;
    }
}
