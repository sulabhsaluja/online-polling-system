package com.polling.app.controller;

import com.polling.app.dto.*;
import com.polling.app.entity.Poll;
import com.polling.app.entity.PollOption;
import com.polling.app.entity.PollResponse;
import com.polling.app.entity.User;
import com.polling.app.exception.ResourceNotFoundException;
import com.polling.app.exception.ValidationException;
import com.polling.app.mapper.UserMapper;
import com.polling.app.service.PollService;
import com.polling.app.service.UserService;
import com.polling.app.validation.ValidationGroups;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final PollService pollService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(
            @Validated(ValidationGroups.Create.class) @RequestBody UserRegistrationDto userDto) {
        User user = UserMapper.toEntity(userDto);
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(
            @Validated(ValidationGroups.Login.class) @RequestBody LoginDto loginDto) {
        User user = userService.authenticateUser(loginDto.getEmail(), loginDto.getPassword());
        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "user", user
        ));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User user) {
        User updatedUser = userService.updateUser(userId, user);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/polls/active")
    public ResponseEntity<List<Poll>> getActivePolls() {
        List<Poll> activePolls = pollService.getAllActivePolls();
        return ResponseEntity.ok(activePolls);
    }

    @GetMapping("/polls/{pollId}")
    public ResponseEntity<Poll> getPollById(@PathVariable Long pollId) {
        Poll poll = pollService.getPollById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll", pollId));
        return ResponseEntity.ok(poll);
    }

    @GetMapping("/polls/{pollId}/options")
    public ResponseEntity<List<PollOption>> getPollOptions(@PathVariable Long pollId) {
        List<PollOption> options = pollService.getPollOptions(pollId);
        return ResponseEntity.ok(options);
    }

    @PostMapping("/{userId}/polls/{pollId}/vote")
    public ResponseEntity<Map<String, Object>> submitVote(
            @PathVariable Long userId,
            @PathVariable Long pollId,
            @Validated @RequestBody VoteSubmissionDto voteDto) {
        PollResponse response = pollService.submitVote(userId, pollId, voteDto.getOptionId());
        return ResponseEntity.ok(Map.of(
                "message", "Vote submitted successfully",
                "response", response
        ));
    }

    @GetMapping("/{userId}/polls/{pollId}/voted")
    public ResponseEntity<Map<String, Boolean>> hasUserVoted(
            @PathVariable Long userId,
            @PathVariable Long pollId) {
        boolean hasVoted = pollService.hasUserVoted(userId, pollId);
        return ResponseEntity.ok(Map.of("hasVoted", hasVoted));
    }

    @GetMapping("/polls/{pollId}/results")
    public ResponseEntity<Map<String, Object>> getPollResults(@PathVariable Long pollId) {
        List<PollOption> options = pollService.getPollOptions(pollId);
        Long totalVotes = pollService.getTotalVotesForPoll(pollId);
        
        return ResponseEntity.ok(Map.of(
                "options", options,
                "totalVotes", totalVotes
        ));
    }

    @GetMapping("/{userId}/voted-polls")
    public ResponseEntity<List<Poll>> getUserVotedPolls(@PathVariable Long userId) {
        List<Poll> votedPolls = pollService.getPollsUserHasVotedIn(userId);
        return ResponseEntity.ok(votedPolls);
    }
}
