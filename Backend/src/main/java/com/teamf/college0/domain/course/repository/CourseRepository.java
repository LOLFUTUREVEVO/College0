package com.teamf.college0.domain.course.repository;

import com.teamf.college0.domain.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

    // Find all courses for a given semester e.g. "Fall2025"
    List<Course> findBySemester(String semester);

    // Find a specific course by its academic number and semester
    Optional<Course> findByCourseNumAndSemester(int courseNum, String semester);

    // Find all courses assigned to a specific instructor
    List<Course> findByInstructor_UserId(Integer instructorId);
}