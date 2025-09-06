package com.polling.app.repository;

import com.polling.app.entity.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    
    List<Poll> findByIsActiveTrue();
    
    List<Poll> findByAdminIdAndIsActiveTrue(Long adminId);
    
    List<Poll> findByAdminId(Long adminId);
    
    @Query("SELECT p FROM Poll p WHERE p.isActive = true AND (p.endsAt IS NULL OR p.endsAt > :currentTime)")
    List<Poll> findActivePollsNotExpired(@Param("currentTime") LocalDateTime currentTime);
    
    @Query("SELECT p FROM Poll p WHERE p.admin.id = :adminId ORDER BY p.createdAt DESC")
    List<Poll> findByAdminIdOrderByCreatedAtDesc(@Param("adminId") Long adminId);
}
