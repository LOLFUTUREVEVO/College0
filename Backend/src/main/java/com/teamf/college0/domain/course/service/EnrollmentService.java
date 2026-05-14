package com.teamf.college0.domain.course.service;

import com.teamf.college0.domain.course.entity.Enrollment;
import com.teamf.college0.domain.course.entity.Enrollment.Status;
import com.teamf.college0.domain.course.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseService courseService) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseService = courseService;
    }

public Enrollment enrollStudent(Enrollment enrollment) {
    Integer courseId = enrollment.getCourse().getCourseId();
    int enrolledCount = enrollmentRepository.countByCourse_CourseIdAndStatus(courseId, Status.ENROLLED);

    if (courseService.isCourseFull(courseId, enrolledCount)) {
        int waitlistCount = enrollmentRepository.countByCourse_CourseIdAndStatus(courseId, Status.WAITLISTED);
        enrollment.setStatus(Status.WAITLISTED);
        enrollment.setWaitlistPosition(waitlistCount + 1);
    } else {
        enrollment.setStatus(Status.ENROLLED);
    }

    return enrollmentRepository.save(enrollment);
}

public void dropStudent(Integer enrollmentId) {
    Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new NoSuchElementException("Enrollment ID " + enrollmentId + " not found."));

    enrollment.setStatus(Status.DROPPED);
    enrollmentRepository.save(enrollment);

    List<Enrollment> waitlist = enrollmentRepository
            .findByCourse_CourseIdAndStatusOrderByWaitlistPositionAsc(
                    enrollment.getCourse().getCourseId(), Status.WAITLISTED);

    if (!waitlist.isEmpty()) {
        Enrollment promoted = waitlist.get(0);
        promoted.setStatus(Status.ENROLLED);
        promoted.setWaitlistPosition(null);
        enrollmentRepository.save(promoted);

        for (int i = 1; i < waitlist.size(); i++) {
            Enrollment w = waitlist.get(i);
            w.setWaitlistPosition(w.getWaitlistPosition() - 1);
            enrollmentRepository.save(w);
        }
    }
}

public List<Enrollment> getEnrollmentsByCourse(Integer courseId) {
    return enrollmentRepository.findByCourse_CourseId(courseId);
}

public List<Enrollment> getEnrollmentsByStudent(Integer studentId) {
    return enrollmentRepository.findByStudent_UserId(studentId);
}
}