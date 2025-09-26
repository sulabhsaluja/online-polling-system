package com.polling.app.controller;

import com.polling.app.dto.*;
import com.polling.app.entity.Admin;
import com.polling.app.entity.Poll;
import com.polling.app.entity.PollOption;
import com.polling.app.entity.PollResponse;
import com.polling.app.exception.ResourceNotFoundException;
import com.polling.app.exception.UnauthorizedOperationException;
import com.polling.app.exception.ValidationException;
import com.polling.app.mapper.AdminMapper;
import com.polling.app.mapper.PollMapper;
import com.polling.app.service.AdminService;
import com.polling.app.service.PollService;
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
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;
    private final PollService pollService;

    @PostMapping("/register")
    public ResponseEntity<Admin> registerAdmin(
            @Validated(ValidationGroups.Create.class) @RequestBody AdminRegistrationDto adminDto) {
        Admin admin = AdminMapper.toEntity(adminDto);
        Admin createdAdmin = adminService.createAdmin(admin);
        return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginAdmin(
            @Validated(ValidationGroups.Login.class) @RequestBody LoginDto loginDto) {
        Admin admin = adminService.authenticateAdmin(loginDto.getEmail(), loginDto.getPassword());
        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "admin", admin
        ));
    }

    @GetMapping("/{adminId}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long adminId) {
        Admin admin = adminService.getAdminById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin", adminId));
        return ResponseEntity.ok(admin);
    }

    @PutMapping("/{adminId}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable Long adminId, @RequestBody Admin admin) {
        Admin updatedAdmin = adminService.updateAdmin(adminId, admin);
        return ResponseEntity.ok(updatedAdmin);
    }

    @PostMapping("/{adminId}/polls")
    public ResponseEntity<Poll> createPoll(
            @PathVariable Long adminId,
            @Validated(ValidationGroups.Create.class) @RequestBody PollCreationDto pollDto) {
        Poll poll = PollMapper.toEntity(pollDto);
        Poll createdPoll = pollService.createPoll(adminId, poll, pollDto.getOptions());
        return new ResponseEntity<>(createdPoll, HttpStatus.CREATED);
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
    public ResponseEntity<Poll> updatePoll(
            @PathVariable Long adminId,
            @PathVariable Long pollId,
            @RequestBody Poll poll) {
        // Verify the poll belongs to this admin
        Poll existingPoll = pollService.getPollById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll", pollId));
        
        if (!existingPoll.getAdmin().getId().equals(adminId)) {
            throw new UnauthorizedOperationException("update", "poll");
        }
        
        Poll updatedPoll = pollService.updatePoll(pollId, poll);
        return ResponseEntity.ok(updatedPoll);
    }

    @PatchMapping("/{adminId}/polls/{pollId}/deactivate")
    public ResponseEntity<Map<String, String>> deactivatePoll(
            @PathVariable Long adminId,
            @PathVariable Long pollId) {
        // Verify the poll belongs to this admin
        Poll existingPoll = pollService.getPollById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll", pollId));
        
        if (!existingPoll.getAdmin().getId().equals(adminId)) {
            throw new UnauthorizedOperationException("deactivate", "poll");
        }
        
        pollService.deactivatePoll(pollId);
        return ResponseEntity.ok(Map.of("message", "Poll deactivated successfully"));
    }

    @PatchMapping("/{adminId}/polls/{pollId}/activate")
    public ResponseEntity<Map<String, String>> activatePoll(
            @PathVariable Long adminId,
            @PathVariable Long pollId) {
        // Verify the poll belongs to this admin
        Poll existingPoll = pollService.getPollById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll", pollId));
        
        if (!existingPoll.getAdmin().getId().equals(adminId)) {
            throw new UnauthorizedOperationException("activate", "poll");
        }
        
        pollService.activatePoll(pollId);
        return ResponseEntity.ok(Map.of("message", "Poll activated successfully"));
    }

    @DeleteMapping("/{adminId}/polls/{pollId}")
    public ResponseEntity<Map<String, String>> deletePoll(
            @PathVariable Long adminId,
            @PathVariable Long pollId) {
        // Verify the poll belongs to this admin
        Poll existingPoll = pollService.getPollById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll", pollId));
        
        if (!existingPoll.getAdmin().getId().equals(adminId)) {
            throw new UnauthorizedOperationException("delete", "poll");
        }
        
        pollService.deletePoll(pollId);
        return ResponseEntity.ok(Map.of("message", "Poll deleted successfully"));
    }

    @GetMapping("/polls/{pollId}/results")
    public ResponseEntity<Map<String, Object>> getPollResults(@PathVariable Long pollId) {
        // First verify the poll exists
        Poll poll = pollService.getPollById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll", pollId));
        
        List<PollOption> options = pollService.getPollOptions(pollId);
        Long totalVotes = pollService.getTotalVotesForPoll(pollId);
        
        return ResponseEntity.ok(Map.of(
                "options", options,
                "totalVotes", totalVotes
        ));
    }

    @GetMapping("/polls/{pollId}/options")
    public ResponseEntity<List<PollOption>> getPollOptions(@PathVariable Long pollId) {
        List<PollOption> options = pollService.getPollOptions(pollId);
        return ResponseEntity.ok(options);
    }
}
