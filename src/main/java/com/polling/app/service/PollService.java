package com.polling.app.service;

import com.polling.app.entity.*;
import com.polling.app.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PollService {

    private final PollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;
    private final PollResponseRepository pollResponseRepository;
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    public Poll createPoll(Long adminId, Poll poll, List<String> optionTexts) {
        log.info("Creating new poll: {} by admin ID: {}", poll.getTitle(), adminId);
        
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with ID: " + adminId));
        
        poll.setAdmin(admin);
        Poll savedPoll = pollRepository.save(poll);
        
        // Create poll options
        for (String optionText : optionTexts) {
            PollOption option = new PollOption();
            option.setOptionText(optionText);
            option.setPoll(savedPoll);
            pollOptionRepository.save(option);
        }
        
        return savedPoll;
    }

    @Transactional(readOnly = true)
    public Optional<Poll> getPollById(Long id) {
        return pollRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Poll> getAllActivePolls() {
        return pollRepository.findActivePollsNotExpired(LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public List<Poll> getPollsByAdmin(Long adminId) {
        return pollRepository.findByAdminIdOrderByCreatedAtDesc(adminId);
    }

    @Transactional(readOnly = true)
    public List<Poll> getActivePollsByAdmin(Long adminId) {
        return pollRepository.findByAdminIdAndIsActiveTrue(adminId);
    }

    public Poll updatePoll(Long pollId, Poll updatedPoll) {
        log.info("Updating poll with ID: {}", pollId);
        Poll existingPoll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found with ID: " + pollId));
        
        existingPoll.setTitle(updatedPoll.getTitle());
        existingPoll.setDescription(updatedPoll.getDescription());
        existingPoll.setEndsAt(updatedPoll.getEndsAt());
        
        return pollRepository.save(existingPoll);
    }

    public void deactivatePoll(Long pollId) {
        log.info("Deactivating poll with ID: {}", pollId);
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found with ID: " + pollId));
        
        poll.setIsActive(false);
        pollRepository.save(poll);
    }

    public void activatePoll(Long pollId) {
        log.info("Activating poll with ID: {}", pollId);
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found with ID: " + pollId));
        
        poll.setIsActive(true);
        pollRepository.save(poll);
    }

    public void deletePoll(Long pollId) {
        log.info("Deleting poll with ID: {}", pollId);
        if (!pollRepository.existsById(pollId)) {
            throw new RuntimeException("Poll not found with ID: " + pollId);
        }
        pollRepository.deleteById(pollId);
    }

    public PollResponse submitVote(Long userId, Long pollId, Long optionId) {
        log.info("User {} voting on poll {} with option {}", userId, pollId, optionId);
        
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        // Validate poll exists and is active
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found with ID: " + pollId));
        
        if (!poll.getIsActive() || (poll.getEndsAt() != null && poll.getEndsAt().isBefore(LocalDateTime.now()))) {
            throw new RuntimeException("Poll is not active or has expired");
        }
        
        // Check if user has already voted
        if (pollResponseRepository.existsByUserIdAndPollId(userId, pollId)) {
            throw new RuntimeException("User has already voted on this poll");
        }
        
        // Validate option exists for this poll
        PollOption option = pollOptionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Poll option not found with ID: " + optionId));
        
        if (!option.getPoll().getId().equals(pollId)) {
            throw new RuntimeException("Option does not belong to this poll");
        }
        
        // Create poll response
        PollResponse response = new PollResponse();
        response.setUser(user);
        response.setPoll(poll);
        response.setPollOption(option);
        
        // Update vote count
        option.setVoteCount(option.getVoteCount() + 1);
        pollOptionRepository.save(option);
        
        return pollResponseRepository.save(response);
    }

    @Transactional(readOnly = true)
    public List<PollOption> getPollOptions(Long pollId) {
        return pollOptionRepository.findByPollIdOrderByVoteCountDesc(pollId);
    }

    @Transactional(readOnly = true)
    public List<PollResponse> getPollResults(Long pollId) {
        return pollResponseRepository.findByPollId(pollId);
    }

    @Transactional(readOnly = true)
    public Long getTotalVotesForPoll(Long pollId) {
        return pollResponseRepository.countByPollId(pollId);
    }

    @Transactional(readOnly = true)
    public boolean hasUserVoted(Long userId, Long pollId) {
        return pollResponseRepository.existsByUserIdAndPollId(userId, pollId);
    }

    @Transactional(readOnly = true)
    public List<Poll> getPollsUserHasVotedIn(Long userId) {
        return pollResponseRepository.findDistinctPollsByUserId(userId);
    }
}
