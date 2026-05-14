package com.teamf.college0.domain.course.service;

import com.teamf.college0.domain.course.entity.Course;
import com.teamf.college0.domain.course.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    /**
     * Saves or updates a course in the database.
     */
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    /**
     * Retrieves all courses in the catalog.
     */
    public List<Course> findAllCourses() {
        return courseRepository.findAll();
    }

    /**
     * Finds a specific course by its ID.
     */
    public Optional<Course> findCourseById(Integer courseId) {
        return courseRepository.findById(courseId);
    }

    /**
     * Finds all courses for a given semester.
     */
    public List<Course> findCoursesBySemester(String semester) {
        return courseRepository.findBySemester(semester);
    }

    /**
     * Deletes a course by ID.
     * Throws NoSuchElementException if the course doesn't exist.
     */
    public void deleteCourse(Integer courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new NoSuchElementException("Cannot delete: Course ID " + courseId + " not found.");
        }
        courseRepository.deleteById(courseId);
    }

    /**
     * Checks if a course is at full capacity given a current enrollment count.
     * Intended to be called from EnrollmentService, not the controller.
     */
    public boolean isCourseFull(Integer courseId, int currentEnrollmentCount) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course ID " + courseId + " not found."));
        return currentEnrollmentCount >= course.getCapacity();
    }
}