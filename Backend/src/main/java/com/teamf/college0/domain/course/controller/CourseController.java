package com.teamf.college0.domain.course.controller;

import com.teamf.college0.domain.course.entity.Course;
import com.teamf.college0.domain.course.service.CourseService;
import com.teamf.college0.domain.user.account.UserAccountRepository;
import com.teamf.college0.domain.user.account.entity.UserAccount;
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
@RequestMapping("registrar/courses")
public class CourseController {

    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    private final JwtUtil jwtUtil;
    private final CourseService courseService;
    private final UserAccountRepository userAccountRepository;

    public CourseController(JwtUtil jwtUtil, CourseService courseService, UserAccountRepository userAccountRepository) {
        this.jwtUtil = jwtUtil;
        this.courseService = courseService;
        this.userAccountRepository = userAccountRepository;
    }

    @PostMapping
    public ResponseEntity<?> createCourse(HttpServletRequest request, @RequestBody Course newCourse) {
        try {
            if (!isRegistrar(request)) {
                logger.warn("Unauthorized course creation attempt");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Registrars only.");
            }

            // Resolve instructor by ID so JPA doesn't treat it as a new transient object
            if (newCourse.getInstructor() != null && newCourse.getInstructor().getUserId() != null) {
                UserAccount instructor = userAccountRepository
                        .findById(newCourse.getInstructor().getUserId())
                        .orElseThrow(() -> new RuntimeException(
                                "Instructor not found with ID: " + newCourse.getInstructor().getUserId()));
                newCourse.setInstructor(instructor);
            } else {
                newCourse.setInstructor(null);
            }

            Course created = courseService.saveCourse(newCourse);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (Exception e) {
            logger.error("Error creating course: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllCourses(HttpServletRequest request) {
        try {
            if (!isRegistrar(request)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Registrars only.");
            }

            List<Course> allCourses = courseService.findAllCourses();
            return ResponseEntity.ok(allCourses);

        } catch (Exception e) {
            logger.error("Error fetching courses: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Token error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<?> removeCourse(HttpServletRequest request, @PathVariable Integer courseId) {
        try {
            if (!isRegistrar(request)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Registrars only.");
            }

            courseService.deleteCourse(courseId);
            return ResponseEntity.ok("Course deleted successfully.");

        } catch (Exception e) {
            logger.error("Error deleting course {}: {}", courseId, e.getMessage());
            return ResponseEntity.badRequest().body("Error deleting course: " + e.getMessage());
        }
    }

    // --- Helper ---

    private boolean isRegistrar(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        String token = authHeader.substring(7);
        Role role = jwtUtil.extractRole(token);
        return Role.REGISTRAR.equals(role);
    }
}