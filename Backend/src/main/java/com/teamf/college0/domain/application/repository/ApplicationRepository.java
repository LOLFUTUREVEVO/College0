package com.teamf.college0.domain.application.repository;

import com.teamf.college0.domain.application.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    List<Application> findByApplicationType(Application.ApplicationType type);

    List<Application> findByStatus(Application.Status status);

    List<Application> findByApplicationTypeAndStatus(Application.ApplicationType type, Application.Status status);
}