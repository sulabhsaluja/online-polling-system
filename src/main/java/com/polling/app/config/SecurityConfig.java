package com.polling.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Allow authentication endpoints
                .requestMatchers("/api/user/register", "/api/user/login").permitAll()
                .requestMatchers("/api/admin/register", "/api/admin/login").permitAll()
                // Allow public endpoints
                .requestMatchers("/api/user/polls/active").permitAll()
                .requestMatchers("/api/user/polls/*/results").permitAll()
                .requestMatchers("/api/admin/polls/*/results").permitAll()
                .requestMatchers("/api/user/polls/*/options").permitAll()
                .requestMatchers("/api/admin/polls/*/options").permitAll()
                // Allow all API endpoints for now (we'll implement proper JWT authentication later)
                .requestMatchers("/api/**").permitAll()
                // All other endpoints require authentication
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
