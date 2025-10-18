package com.sweepgoat.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity // Indicates that this is a database table
@Table(name = "users") // Table name in database table will be "users"
@Data // Lombok: Auto generates getters setter toString
@NoArgsConstructor // Lombok: creates empty constructor
@AllArgsConstructor // Lombok: creates constructor with all feilds
public class User {

    @Id // Primary ID
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auti inc
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // many users belong to one host
    @JoinColumn(name = "host_id", nullable = false) // creates forign key column
    private Host host;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(nullable = false)
    private String email;

    @NotBlank(message = "Username is required")
    @Column(nullable = false)
    private String username;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "email_opt_in", nullable = false)
    private Boolean emailOptIn = false; // Consent for email marketing

    @Column(name = "sms_opt_in", nullable = false)
    private Boolean smsOptIn = false; // Consent for SMS marketing

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}