package com.polling.app.controller;

import com.polling.app.entity.Poll;
import com.polling.app.entity.PollOption;
import com.polling.app.entity.PollResponse;
import com.polling.app.entity.User;
import com.polling.app.service.PollService;
import com.polling.app.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email and password are required"));
            }
            
            User user = userService.authenticateUser(email, password);
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "user", user
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(userId, user);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/polls/active")
    public ResponseEntity<List<Poll>> getActivePolls() {
        List<Poll> activePolls = pollService.getAllActivePolls();
        return ResponseEntity.ok(activePolls);
    }

    @GetMapping("/polls/{pollId}")
    public ResponseEntity<?> getPollById(@PathVariable Long pollId) {
        return pollService.getPollById(pollId)
                .map(poll -> ResponseEntity.ok(poll))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/polls/{pollId}/options")
    public ResponseEntity<List<PollOption>> getPollOptions(@PathVariable Long pollId) {
        List<PollOption> options = pollService.getPollOptions(pollId);
        return ResponseEntity.ok(options);
    }

    @PostMapping("/{userId}/polls/{pollId}/vote")
    public ResponseEntity<?> submitVote(
            @PathVariable Long userId,
            @PathVariable Long pollId,
            @RequestBody Map<String, Long> voteRequest) {
        try {
            Long optionId = voteRequest.get("optionId");
            if (optionId == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Option ID is required"));
            }
            
            PollResponse response = pollService.submitVote(userId, pollId, optionId);
            return ResponseEntity.ok(Map.of(
                    "message", "Vote submitted successfully",
                    "response", response
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}/polls/{pollId}/voted")
    public ResponseEntity<Map<String, Boolean>> hasUserVoted(
            @PathVariable Long userId,
            @PathVariable Long pollId) {
        boolean hasVoted = pollService.hasUserVoted(userId, pollId);
        return ResponseEntity.ok(Map.of("hasVoted", hasVoted));
    }

    @GetMapping("/polls/{pollId}/results")
    public ResponseEntity<?> getPollResults(@PathVariable Long pollId) {
        try {
            List<PollOption> options = pollService.getPollOptions(pollId);
            Long totalVotes = pollService.getTotalVotesForPoll(pollId);
            
            return ResponseEntity.ok(Map.of(
                    "options", options,
                    "totalVotes", totalVotes
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}/voted-polls")
    public ResponseEntity<?> getUserVotedPolls(@PathVariable Long userId) {
        try {
            List<Poll> votedPolls = pollService.getPollsUserHasVotedIn(userId);
            return ResponseEntity.ok(votedPolls);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
