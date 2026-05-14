package com.teamf.college0.domain.application.controller;

import com.teamf.college0.domain.application.entity.Application;
import com.teamf.college0.domain.application.service.ApplicationService;
import com.teamf.college0.domain.user.account.entity.UserAccount.Role;
import com.teamf.college0.utils.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationController.class);

    private final ApplicationService applicationService;
    private final JwtUtil jwtUtil;

    public ApplicationController(ApplicationService applicationService, JwtUtil jwtUtil) {
        this.applicationService = applicationService;
        this.jwtUtil = jwtUtil;
    }

    // ── Public endpoints (no auth required) ──────────────────────────────────

    /** Submit a new student or instructor application. */
    @PostMapping
    public ResponseEntity<?> submit(@RequestBody Application application) {
        try {
            Application saved = applicationService.submitApplication(application);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            logger.error("Error submitting application: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
    }

    // ── Registrar-only endpoints ──────────────────────────────────────────────

    /** Get all applications (registrar only). */
    @GetMapping
    public ResponseEntity<?> getAll(HttpServletRequest request) {
        if (!isRegistrar(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Registrars only.");
        }
        return ResponseEntity.ok(applicationService.findAll());
    }

    /** Get all student applications (registrar only). */
    @GetMapping("/students")
    public ResponseEntity<?> getStudentApplications(HttpServletRequest request) {
        if (!isRegistrar(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Registrars only.");
        }
        return ResponseEntity.ok(applicationService.findByType(Application.ApplicationType.STUDENT));
    }

    /** Get all instructor applications (registrar only). */
    @GetMapping("/instructors")
    public ResponseEntity<?> getInstructorApplications(HttpServletRequest request) {
        if (!isRegistrar(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Registrars only.");
        }
        return ResponseEntity.ok(applicationService.findByType(Application.ApplicationType.INSTRUCTOR));
    }

    /** Get all pending student applications — for the registrar dashboard. */
    @GetMapping("/students/pending")
    public ResponseEntity<?> getPendingStudents(HttpServletRequest request) {
        if (!isRegistrar(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Registrars only.");
        }
        return ResponseEntity.ok(applicationService.findPendingByType(Application.ApplicationType.STUDENT));
    }

    /** Get all pending instructor applications — for the registrar dashboard. */
    @GetMapping("/instructors/pending")
    public ResponseEntity<?> getPendingInstructors(HttpServletRequest request) {
        if (!isRegistrar(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Registrars only.");
        }
        return ResponseEntity.ok(applicationService.findPendingByType(Application.ApplicationType.INSTRUCTOR));
    }

    /**
     * Registrar reviews an application — sets final status and optional note.
     * Body: { "status": "APPROVED" | "REJECTED" | "PENDING", "registrarNote": "..." }
     */
    @PatchMapping("/{applicationId}/review")
    public ResponseEntity<?> review(
            HttpServletRequest request,
            @PathVariable Integer applicationId,
            @RequestBody Map<String, String> body) {
        if (!isRegistrar(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Registrars only.");
        }
        try {
            Application.Status newStatus = Application.Status.valueOf(body.get("status"));
            String registrarNote = body.get("registrarNote"); // nullable
            Application updated = applicationService.reviewApplication(applicationId, newStatus, registrarNote);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value. Use APPROVED, REJECTED, or PENDING.");
        } catch (Exception e) {
            logger.error("Error reviewing application {}: {}", applicationId, e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /** Delete an application (registrar only). */
    @DeleteMapping("/{applicationId}")
    public ResponseEntity<?> delete(HttpServletRequest request, @PathVariable Integer applicationId) {
        if (!isRegistrar(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Registrars only.");
        }
        try {
            applicationService.deleteApplication(applicationId);
            return ResponseEntity.ok("Application deleted.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private boolean isRegistrar(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        String token = authHeader.substring(7);
        Role role = jwtUtil.extractRole(token);
        return Role.REGISTRAR.equals(role);
    }
}