package com.sportsarenaafrika.service;

import com.sportsarenaafrika.dto.DiscussionDto;
import com.sportsarenaafrika.model.Comment;
import com.sportsarenaafrika.model.Discussion;
import com.sportsarenaafrika.repository.CommentRepository;
import com.sportsarenaafrika.repository.DiscussionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final CommentRepository commentRepository;

    public List<DiscussionDto.DiscussionResponse> getTrendingDiscussions() {
        return discussionRepository.findByIsTrendingTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DiscussionDto.DiscussionResponse getDiscussionById(Long id) {
        Discussion discussion = discussionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Discussion not found with ID: " + id));
        return mapToResponse(discussion);
    }

    @Transactional
    public DiscussionDto.DiscussionResponse likeDiscussion(Long id) {
        Discussion discussion = discussionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Discussion not found with ID: " + id));
        discussion.setLikesCount(discussion.getLikesCount() + 1);
        Discussion saved = discussionRepository.save(discussion);
        return mapToResponse(saved);
    }

    @Transactional
    public DiscussionDto.CommentResponse addComment(Long discussionId, DiscussionDto.CommentCreateRequest request) {
        Discussion discussion = discussionRepository.findById(discussionId)
                .orElseThrow(() -> new IllegalArgumentException("Discussion not found with ID: " + discussionId));

        Comment comment = Comment.builder()
                .discussion(discussion)
                .authorName(request.getAuthorName() != null ? request.getAuthorName() : "Fan Member")
                .authorAvatar(request.getAuthorAvatar())
                .content(request.getContent())
                .build();

        Comment saved = commentRepository.save(comment);

        discussion.setCommentsCount(discussion.getCommentsCount() + 1);
        discussionRepository.save(discussion);

        return DiscussionDto.CommentResponse.builder()
                .id(saved.getId())
                .authorName(saved.getAuthorName())
                .authorAvatar(saved.getAuthorAvatar())
                .content(saved.getContent())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    private DiscussionDto.DiscussionResponse mapToResponse(Discussion d) {
        List<DiscussionDto.CommentResponse> commentList = d.getComments().stream()
                .map(c -> DiscussionDto.CommentResponse.builder()
                        .id(c.getId())
                        .authorName(c.getAuthorName())
                        .authorAvatar(c.getAuthorAvatar())
                        .content(c.getContent())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return DiscussionDto.DiscussionResponse.builder()
                .id(d.getId())
                .authorName(d.getAuthorName())
                .authorAvatar(d.getAuthorAvatar())
                .authorHandle(d.getAuthorHandle())
                .title(d.getTitle())
                .content(d.getContent())
                .likesCount(d.getLikesCount())
                .commentsCount(d.getCommentsCount())
                .isTrending(d.getIsTrending())
                .createdAt(d.getCreatedAt())
                .comments(commentList)
                .build();
    }
}
