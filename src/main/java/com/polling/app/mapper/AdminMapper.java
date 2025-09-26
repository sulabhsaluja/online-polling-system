package com.polling.app.mapper;

import com.polling.app.dto.AdminRegistrationDto;
import com.polling.app.entity.Admin;

/**
 * Mapper utility for converting between Admin DTOs and entities
 */
public class AdminMapper {

    public static Admin toEntity(AdminRegistrationDto dto) {
        if (dto == null) {
            return null;
        }

        Admin admin = new Admin();
        admin.setUsername(dto.getUsername());
        admin.setEmail(dto.getEmail());
        admin.setPassword(dto.getPassword());
        admin.setFirstName(dto.getFirstName());
        admin.setLastName(dto.getLastName());
        
        return admin;
    }

    public static AdminRegistrationDto toRegistrationDto(Admin admin) {
        if (admin == null) {
            return null;
        }

        return AdminRegistrationDto.builder()
                .username(admin.getUsername())
                .email(admin.getEmail())
                .firstName(admin.getFirstName())
                .lastName(admin.getLastName())
                .build();
    }
}
