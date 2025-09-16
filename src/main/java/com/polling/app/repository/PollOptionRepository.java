package com.polling.app.repository;

import com.polling.app.entity.PollOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollOptionRepository extends JpaRepository<PollOption, Long> {

    /**
     * Retrieves all poll options associated with a specific poll.
     *
     * @param pollId the ID of the poll
     * @return list of poll options
     */
    List<PollOption> findByPollId(Long pollId);

    /**
     * Retrieves all poll options for a specific poll, ordered by vote count in descending order.
     *
     * @param pollId the ID of the poll
     * @return list of poll options sorted by vote count
     */
    List<PollOption> findByPollIdOrderByVoteCountDesc(Long pollId);

    /**
     * Retrieves a specific poll option by its ID and the ID of its associated poll.
     * Useful for validation when voting.
     *
     * @param optionId the ID of the poll option
     * @param pollId the ID of the poll
     * @return the matching poll option, or null if not found
     */
    PollOption findByIdAndPollId(Long optionId, Long pollId);
}
