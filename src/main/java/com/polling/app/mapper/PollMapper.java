package com.polling.app.mapper;

import com.polling.app.dto.PollCreationDto;
import com.polling.app.entity.Poll;

/**
 * Mapper utility for converting between Poll DTOs and entities
 */
public class PollMapper {

    public static Poll toEntity(PollCreationDto dto) {
        if (dto == null) {
            return null;
        }

        Poll poll = new Poll();
        poll.setTitle(dto.getTitle());
        poll.setDescription(dto.getDescription());
        poll.setEndsAt(dto.getEndsAt());
        poll.setIsActive(true); // Default to active when created
        
        return poll;
    }
}
