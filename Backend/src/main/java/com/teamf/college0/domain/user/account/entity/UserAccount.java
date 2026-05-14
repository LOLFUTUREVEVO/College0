package com.teamf.college0.domain.user.account.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nonnull;
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
@Table(name="user_account")
public class UserAccount {


    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer userId;

    @Nonnull
    @Column(unique = true, name="username")
    private String userName;

    @JsonIgnore
    @Nonnull
    @Column(name = "first_name")
    private String firstName;

    @JsonIgnore
    @Nonnull
    @Column(name = "last_name")
    private String lastName;

    @JsonIgnore
    @Nonnull
    @Column(name = "password")
    private String password;

    public static enum Role {
        VISITOR,
        STUDENT,
        INSTRUCTOR,
        REGISTRAR
    }


    @Enumerated(EnumType.STRING)
    @Column
    private Role role;


    private boolean isMember;

    public static enum Status {
        PENDING_APPLICATION,
        APPROVED,
        REJECTED,
        DISMISSED
    }

    @Enumerated(EnumType.STRING)
    @Column(name="account_status",nullable = false)
    private Status status;
}
