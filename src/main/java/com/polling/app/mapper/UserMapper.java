package com.polling.app.mapper;

import com.polling.app.dto.UserRegistrationDto;
import com.polling.app.entity.User;

/**
 * Mapper utility for converting between User DTOs and entities
 */
public class UserMapper {

    public static User toEntity(UserRegistrationDto dto) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        
        return user;
    }

    public static UserRegistrationDto toRegistrationDto(User user) {
        if (user == null) {
            return null;
        }

        return UserRegistrationDto.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                // Note: We don't include password in response DTOs for security
                .build();
    }
}
