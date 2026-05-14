package com.teamf.college0.domain.application.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "applications")
public class Application {

    public enum ApplicationType {
        STUDENT,
        INSTRUCTOR
    }

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Integer applicationId;

    @Enumerated(EnumType.STRING)
    @Column(name = "application_type", nullable = false)
    private ApplicationType applicationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.PENDING;

    @Column(name = "institution")
    private String institution;

    // ── Shared personal info ──────────────────────────────────────────────────

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    // ── Student-only fields ───────────────────────────────────────────────────

    @Column(name = "major")
    private String major;

    @Column(name = "gpa")
    private Double gpa;

    // ── Instructor-only fields ────────────────────────────────────────────────

    @Column(name = "degree_level")
    private String degreeLevel;       // "B.S", "M.S", "Ph.D"

    @Column(name = "expertise_topic")
    private String expertiseTopic;

    // ── Automated decision ────────────────────────────────────────────────────

    /**
     * Result of the automated screening logic.
     * Populated at submission time via runAutomatedDecision().
     * The registrar can override this via status + registrarNote.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "automated_decision")
    private Status automatedDecision;

    /**
     * Optional note left by the registrar when they override or confirm
     * the automated decision. Null if no manual review has been done.
     */
    @Column(name = "registrar_note", length = 1000)
    private String registrarNote;

    // ── Metadata ──────────────────────────────────────────────────────────────

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onSubmit() {
        submittedAt = LocalDateTime.now();
        automatedDecision = runAutomatedDecision();
        // Final status starts as the automated result; registrar can change it later
        status = automatedDecision;
    }

    // ── Automated decision logic (placeholder) ────────────────────────────────

    /**
     * Placeholder for automated accept/reject screening.
     * Currently leaves all applications as PENDING — replace with real criteria.
     *
     * Example student criteria to implement:
     *   - REJECTED if gpa < 2.0
     *   - APPROVED if gpa >= 3.0
     *   - PENDING for manual review otherwise
     *
     * Example instructor criteria to implement:
     *   - REJECTED if degreeLevel is "B.S"
     *   - APPROVED if degreeLevel is "Ph.D"
     *   - PENDING otherwise
     */
    private Status runAutomatedDecision() {
        // TODO: replace with real screening logic
        return Status.PENDING;
    }
}