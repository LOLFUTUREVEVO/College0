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
@RequestMapping("student/courses")
public class StudentCourseController {



    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    private final JwtUtil jwtUtil;
    private final CourseService courseService;
    private final UserAccountRepository userAccountRepository;

    public StudentCourseController(JwtUtil jwtUtil, CourseService courseService, UserAccountRepository userAccountRepository) {
        this.jwtUtil = jwtUtil;
        this.courseService = courseService;
        this.userAccountRepository = userAccountRepository;
    }


    @GetMapping
    public ResponseEntity<?> getAllCoursesForStudents(HttpServletRequest request) {
        try {
            if (!isStudentOrRegistrar(request)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: Registrars only.");
            }

            List<Course> allCourses = courseService.findAllCourses();
            return ResponseEntity.ok(allCourses);

        } catch (Exception e) {
            logger.error("Error fetching courses: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Token error: " + e.getMessage());
        }
    }   


    private boolean isStudentOrRegistrar(HttpServletRequest request) {
        String token = jwtUtil.extractAndValidateToken(request);
        Role role = jwtUtil.extractRole(token);
        return Role.STUDENT.equals(role) || Role.REGISTRAR.equals(role);
    }
}
