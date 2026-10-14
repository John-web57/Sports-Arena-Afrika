package com.sportsarenaafrika.service;

import com.sportsarenaafrika.dto.PollDto;
import com.sportsarenaafrika.model.Poll;
import com.sportsarenaafrika.model.PollOption;
import com.sportsarenaafrika.repository.PollOptionRepository;
import com.sportsarenaafrika.repository.PollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PollService {

    private final PollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;

    public PollDto.PollResponse getActivePoll() {
        Poll poll = pollRepository.findFirstByIsActiveTrueOrderByCreatedAtDesc()
                .orElse(null);

        if (poll == null) return null;
        return mapToResponse(poll);
    }

    @Transactional
    public PollDto.PollResponse vote(Long pollId, Long optionId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new IllegalArgumentException("Poll not found with ID: " + pollId));

        PollOption option = pollOptionRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("Option not found with ID: " + optionId));

        option.setVotesCount(option.getVotesCount() + 1);
        pollOptionRepository.save(option);

        poll.setTotalVotes(poll.getTotalVotes() + 1);
        Poll saved = pollRepository.save(poll);

        return mapToResponse(saved);
    }

    private PollDto.PollResponse mapToResponse(Poll poll) {
        long total = poll.getTotalVotes() != null && poll.getTotalVotes() > 0 ? poll.getTotalVotes() : 1;

        List<PollDto.PollOptionResponse> options = poll.getOptions().stream()
                .map(opt -> {
                    long votes = opt.getVotesCount() != null ? opt.getVotesCount() : 0;
                    int percent = (int) Math.round(((double) votes / total) * 100);
                    return PollDto.PollOptionResponse.builder()
                            .id(opt.getId())
                            .text(opt.getOptionText())
                            .votes(votes)
                            .percent(percent)
                            .build();
                })
                .collect(Collectors.toList());

        return PollDto.PollResponse.builder()
                .id(poll.getId())
                .question(poll.getQuestion())
                .totalVotes(poll.getTotalVotes())
                .isActive(poll.getIsActive())
                .options(options)
                .build();
    }
}
