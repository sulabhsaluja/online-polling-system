package com.polling.app.repository;

import com.polling.app.entity.PollResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PollResponseRepository extends JpaRepository<PollResponse, Long> {
    
    Optional<PollResponse> findByUserIdAndPollId(Long userId, Long pollId);
    
    List<PollResponse> findByPollId(Long pollId);
    
    List<PollResponse> findByUserId(Long userId);
    
    @Query("SELECT COUNT(pr) FROM PollResponse pr WHERE pr.poll.id = :pollId")
    Long countByPollId(@Param("pollId") Long pollId);
    
    @Query("SELECT COUNT(pr) FROM PollResponse pr WHERE pr.pollOption.id = :optionId")
    Long countByPollOptionId(@Param("optionId") Long optionId);
    
    boolean existsByUserIdAndPollId(Long userId, Long pollId);
}
