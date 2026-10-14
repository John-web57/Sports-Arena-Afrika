package com.sportsarenaafrika.controller;

import com.sportsarenaafrika.dto.DiscussionDto;
import com.sportsarenaafrika.service.DiscussionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discussions")
@RequiredArgsConstructor
public class DiscussionController {

    private final DiscussionService discussionService;

    @GetMapping
    public ResponseEntity<List<DiscussionDto.DiscussionResponse>> getTrendingDiscussions() {
        return ResponseEntity.ok(discussionService.getTrendingDiscussions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiscussionDto.DiscussionResponse> getDiscussionById(@PathVariable Long id) {
        return ResponseEntity.ok(discussionService.getDiscussionById(id));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<DiscussionDto.DiscussionResponse> likeDiscussion(@PathVariable Long id) {
        return ResponseEntity.ok(discussionService.likeDiscussion(id));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<DiscussionDto.CommentResponse> addComment(
            @PathVariable Long id,
            @RequestBody DiscussionDto.CommentCreateRequest request) {
        return ResponseEntity.ok(discussionService.addComment(id, request));
    }
}
