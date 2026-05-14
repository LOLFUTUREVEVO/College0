package com.teamf.college0.domain.course.entity;

import com.teamf.college0.domain.user.account.entity.UserAccount;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="Course")

public class Course{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Integer courseId;

    
    @Column(name = "capacity", nullable = false)
    private int capacity;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private UserAccount instructor;

    @Column(name = "course_num", nullable = false)
    private int courseNum;

    @Column(nullable = false)
    private String title;
    
    @Column(name = "start_time")
    private LocalTime startTime; //09:00

    @Column(name = "duration_minutes")
    private Integer durationMinutes; // 90

    @Column(name = "days_of_week")
    private String daysOfWeek; //"MWF"

    @Column(name = "semester")
    private String semester;

    @Column(name = "room_number")
    private String roomNumber;
}

/**
 * Size done
 * waitlist made a table for it 
 * instructors 1 instructor
 * course number 
 * reviews
 * students
 * classid done
 * time
 */