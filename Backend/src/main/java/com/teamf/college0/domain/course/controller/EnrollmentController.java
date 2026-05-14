package com.teamf.college0.domain.course.controller;

import com.teamf.college0.domain.course.entity.Enrollment;
import com.teamf.college0.domain.course.service.EnrollmentService;
import com.teamf.college0.domain.user.account.entity.UserAccount.Role;
import com.teamf.college0.utils.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("enrollments")
public class EnrollmentController {

    private static final Logger logger = LoggerFactory.getLogger(EnrollmentController.class);

    private final JwtUtil jwtUtil;
    private final EnrollmentService enrollmentService;

    public EnrollmentController(JwtUtil jwtUtil, EnrollmentService enrollmentService) {
        this.jwtUtil = jwtUtil;
        this.enrollmentService = enrollmentService;
    }

    // Student enrolls in a course
    @PostMapping
    public ResponseEntity<?> enroll(HttpServletRequest request, @RequestBody Enrollment enrollment) {
        try {
            if (!isStudentOrRegistrar(request)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied.");
            }
            Enrollment result = enrollmentService.enrollStudent(enrollment);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            logger.error("Error enrolling student: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Enrollment error: " + e.getMessage());
        }
    }

    // Student drops a course
    @DeleteMapping("/{enrollmentId}")
    public ResponseEntity<?> drop(HttpServletRequest request, @PathVariable Integer enrollmentId) {
        try {
            if (!isStudentOrRegistrar(request)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied.");
            }
            enrollmentService.dropStudent(enrollmentId);
            return ResponseEntity.ok("Successfully dropped.");
        } catch (Exception e) {
            logger.error("Error dropping enrollment {}: {}", enrollmentId, e.getMessage());
            return ResponseEntity.badRequest().body("Drop error: " + e.getMessage());
        }
    }

    // Get all enrollments for a course (registrar only)
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getByCourse(HttpServletRequest request, @PathVariable Integer courseId) {
        try {
            if (!isRegistrar(request)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Registrars only.");
            }
            List<Enrollment> enrollments = enrollmentService.getEnrollmentsByCourse(courseId);
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            logger.error("Error fetching enrollments for course {}: {}", courseId, e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Get all enrollments for a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getByStudent(HttpServletRequest request, @PathVariable Integer studentId) {
        try {
            if (!isStudentOrRegistrar(request)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied.");
            }
            List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudent(studentId);
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            logger.error("Error fetching enrollments for student {}: {}", studentId, e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // --- Helpers ---

    private boolean isRegistrar(HttpServletRequest request) {
        String token = jwtUtil.extractAndValidateToken(request);
        Role role = jwtUtil.extractRole(token);
        return Role.REGISTRAR.equals(role);
    }

    private boolean isStudentOrRegistrar(HttpServletRequest request) {
        String token = jwtUtil.extractAndValidateToken(request);
        Role role = jwtUtil.extractRole(token);
        return Role.STUDENT.equals(role) || Role.REGISTRAR.equals(role);
    }
}