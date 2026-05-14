package com.teamf.college0.domain.user.account.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_account")
public class UserAccount {

    public enum Role {
        VISITOR,
        STUDENT,
        INSTRUCTOR,
        REGISTRAR
    }

    public enum Status {
        PENDING_APPLICATION,
        APPROVED,
        REJECTED,
        DISMISSED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "username", unique = true, nullable = false)
    private String userName;

    @JsonIgnore
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @JsonIgnore
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Column(name = "is_member")
    private boolean member; // Lombok generates isMember() and setMember()

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false)
    private Status status;
}