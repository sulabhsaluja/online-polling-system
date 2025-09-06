package com.polling.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "poll_responses", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "poll_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PollResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poll_id", nullable = false)
    @ToString.Exclude
    private Poll poll;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poll_option_id", nullable = false)
    @ToString.Exclude
    private PollOption pollOption;

    @Column(name = "response_date", nullable = false)
    private LocalDateTime responseDate;

    @PrePersist
    protected void onCreate() {
        responseDate = LocalDateTime.now();
    }
}
