package com.teamf.college0.domain.course.repository;

import com.teamf.college0.domain.course.entity.Enrollment;
import com.teamf.college0.domain.course.entity.Enrollment.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {

    List<Enrollment> findByCourse_CourseId(Integer courseId);

    List<Enrollment> findByStudent_UserId(Integer studentId);

    Optional<Enrollment> findByCourse_CourseIdAndStudent_UserId(Integer courseId, Integer studentId);

    int countByCourse_CourseIdAndStatus(Integer courseId, Status status);

    List<Enrollment> findByCourse_CourseIdAndStatusOrderByWaitlistPositionAsc(Integer courseId, Status status);
}