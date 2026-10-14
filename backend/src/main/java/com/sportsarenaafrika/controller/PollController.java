package com.sportsarenaafrika.controller;

import com.sportsarenaafrika.dto.PollDto;
import com.sportsarenaafrika.service.PollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/polls")
@RequiredArgsConstructor
public class PollController {

    private final PollService pollService;

    @GetMapping("/active")
    public ResponseEntity<PollDto.PollResponse> getActivePoll() {
        PollDto.PollResponse response = pollService.getActivePoll();
        if (response == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{pollId}/vote")
    public ResponseEntity<PollDto.PollResponse> vote(
            @PathVariable Long pollId,
            @RequestBody PollDto.VoteRequest request) {
        return ResponseEntity.ok(pollService.vote(pollId, request.getOptionId()));
    }
}
