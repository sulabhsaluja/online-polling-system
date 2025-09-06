package com.polling.app.repository;

import com.polling.app.entity.PollOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollOptionRepository extends JpaRepository<PollOption, Long> {
    
    List<PollOption> findByPollId(Long pollId);
    
    List<PollOption> findByPollIdOrderByVoteCountDesc(Long pollId);
}
