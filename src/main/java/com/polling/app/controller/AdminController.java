package com.polling.app.controller;

import com.polling.app.entity.Admin;
import com.polling.app.entity.Poll;
import com.polling.app.entity.PollOption;
import com.polling.app.entity.PollResponse;
import com.polling.app.service.AdminService;
import com.polling.app.service.PollService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;
    private final PollService pollService;

    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {
        try {
            Admin createdAdmin = adminService.createAdmin(admin);
            return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{adminId}")
    public ResponseEntity<?> getAdminById(@PathVariable Long adminId) {
        return adminService.getAdminById(adminId)
                .map(admin -> ResponseEntity.ok(admin))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{adminId}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long adminId, @RequestBody Admin admin) {
        try {
            Admin updatedAdmin = adminService.updateAdmin(adminId, admin);
            return ResponseEntity.ok(updatedAdmin);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{adminId}/polls")
    public ResponseEntity<?> createPoll(
            @PathVariable Long adminId,
            @RequestBody Map<String, Object> pollRequest) {
        try {
            Poll poll = new Poll();
            poll.setTitle((String) pollRequest.get("title"));
            poll.setDescription((String) pollRequest.get("description"));
            
            @SuppressWarnings("unchecked")
            List<String> options = (List<String>) pollRequest.get("options");
            
            if (options == null || options.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Poll must have at least one option"));
            }
            
            Poll createdPoll = pollService.createPoll(adminId, poll, options);
            return new ResponseEntity<>(createdPoll, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{adminId}/polls")
    public ResponseEntity<List<Poll>> getAdminPolls(@PathVariable Long adminId) {
        List<Poll> polls = pollService.getPollsByAdmin(adminId);
        return ResponseEntity.ok(polls);
    }

    @GetMapping("/{adminId}/polls/active")
    public ResponseEntity<List<Poll>> getActiveAdminPolls(@PathVariable Long adminId) {
        List<Poll> activePolls = pollService.getActivePollsByAdmin(adminId);
        return ResponseEntity.ok(activePolls);
    }

    @PutMapping("/{adminId}/polls/{pollId}")
    public ResponseEntity<?> updatePoll(
            @PathVariable Long adminId,
            @PathVariable Long pollId,
            @RequestBody Poll poll) {
        try {
            // Verify the poll belongs to this admin
            Poll existingPoll = pollService.getPollById(pollId)
                    .orElseThrow(() -> new RuntimeException("Poll not found"));
            
            if (!existingPoll.getAdmin().getId().equals(adminId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Not authorized to update this poll"));
            }
            
            Poll updatedPoll = pollService.updatePoll(pollId, poll);
            return ResponseEntity.ok(updatedPoll);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{adminId}/polls/{pollId}/deactivate")
    public ResponseEntity<?> deactivatePoll(
            @PathVariable Long adminId,
            @PathVariable Long pollId) {
        try {
            // Verify the poll belongs to this admin
            Poll existingPoll = pollService.getPollById(pollId)
                    .orElseThrow(() -> new RuntimeException("Poll not found"));
            
            if (!existingPoll.getAdmin().getId().equals(adminId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Not authorized to deactivate this poll"));
            }
            
            pollService.deactivatePoll(pollId);
            return ResponseEntity.ok(Map.of("message", "Poll deactivated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{adminId}/polls/{pollId}")
    public ResponseEntity<?> deletePoll(
            @PathVariable Long adminId,
            @PathVariable Long pollId) {
        try {
            // Verify the poll belongs to this admin
            Poll existingPoll = pollService.getPollById(pollId)
                    .orElseThrow(() -> new RuntimeException("Poll not found"));
            
            if (!existingPoll.getAdmin().getId().equals(adminId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Not authorized to delete this poll"));
            }
            
            pollService.deletePoll(pollId);
            return ResponseEntity.ok(Map.of("message", "Poll deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/polls/{pollId}/results")
    public ResponseEntity<?> getPollResults(@PathVariable Long pollId) {
        try {
            List<PollOption> options = pollService.getPollOptions(pollId);
            List<PollResponse> responses = pollService.getPollResults(pollId);
            Long totalVotes = pollService.getTotalVotesForPoll(pollId);
            
            return ResponseEntity.ok(Map.of(
                    "options", options,
                    "responses", responses,
                    "totalVotes", totalVotes
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/polls/{pollId}/options")
    public ResponseEntity<List<PollOption>> getPollOptions(@PathVariable Long pollId) {
        List<PollOption> options = pollService.getPollOptions(pollId);
        return ResponseEntity.ok(options);
    }
}
