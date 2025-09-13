package com.polling.app.service;

import com.polling.app.entity.Admin;
import com.polling.app.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminService {

    private final AdminRepository adminRepository;

    public Admin createAdmin(Admin admin) {
        log.info("Creating new admin: {}", admin.getUsername());
        if (adminRepository.existsByUsername(admin.getUsername())) {
            throw new RuntimeException("Admin username already exists: " + admin.getUsername());
        }
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Admin email already exists: " + admin.getEmail());
        }
        
        // Hash the password before saving
        admin.setPassword(hashPassword(admin.getPassword()));
        
        return adminRepository.save(admin);
    }

    @Transactional(readOnly = true)
    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Admin> getAdminByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    @Transactional(readOnly = true)
    public Optional<Admin> getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin updateAdmin(Long id, Admin updatedAdmin) {
        log.info("Updating admin with ID: {}", id);
        Admin existingAdmin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with ID: " + id));
        
        if (!existingAdmin.getUsername().equals(updatedAdmin.getUsername()) && 
            adminRepository.existsByUsername(updatedAdmin.getUsername())) {
            throw new RuntimeException("Admin username already exists: " + updatedAdmin.getUsername());
        }
        
        if (!existingAdmin.getEmail().equals(updatedAdmin.getEmail()) && 
            adminRepository.existsByEmail(updatedAdmin.getEmail())) {
            throw new RuntimeException("Admin email already exists: " + updatedAdmin.getEmail());
        }

        existingAdmin.setUsername(updatedAdmin.getUsername());
        existingAdmin.setEmail(updatedAdmin.getEmail());
        existingAdmin.setFirstName(updatedAdmin.getFirstName());
        existingAdmin.setLastName(updatedAdmin.getLastName());
        
        return adminRepository.save(existingAdmin);
    }

    public void deleteAdmin(Long id) {
        log.info("Deleting admin with ID: {}", id);
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin not found with ID: " + id);
        }
        adminRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return adminRepository.existsByUsername(username);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return adminRepository.existsByEmail(email);
    }

    public Admin authenticateAdmin(String email, String password) {
        log.info("Attempting to authenticate admin with email: {}", email);
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        String hashedPassword = hashPassword(password);
        if (!admin.getPassword().equals(hashedPassword)) {
            throw new RuntimeException("Invalid email or password");
        }
        
        return admin;
    }

    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}
