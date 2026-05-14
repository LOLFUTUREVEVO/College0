package com.teamf.college0.domain.application.service;

import com.teamf.college0.domain.application.entity.Application;
import com.teamf.college0.domain.application.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    /** Submit a new application. Automated decision runs via @PrePersist. */
    public Application submitApplication(Application application) {
        return applicationRepository.save(application);
    }

    /** Get all applications. */
    public List<Application> findAll() {
        return applicationRepository.findAll();
    }

    /** Get all applications of a specific type (STUDENT or INSTRUCTOR). */
    public List<Application> findByType(Application.ApplicationType type) {
        return applicationRepository.findByApplicationType(type);
    }

    /** Get all applications with a specific status. */
    public List<Application> findByStatus(Application.Status status) {
        return applicationRepository.findByStatus(status);
    }

    /** Get all pending applications of a specific type — used by the registrar dashboard. */
    public List<Application> findPendingByType(Application.ApplicationType type) {
        return applicationRepository.findByApplicationTypeAndStatus(type, Application.Status.PENDING);
    }

    /**
     * Registrar manually sets the final status and optionally leaves a note.
     * This overrides whatever the automated decision produced.
     */
    public Application reviewApplication(Integer applicationId, Application.Status newStatus, String registrarNote) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new NoSuchElementException("Application ID " + applicationId + " not found."));

        application.setStatus(newStatus);
        application.setRegistrarNote(registrarNote);
        return applicationRepository.save(application);
    }

    /** Delete an application by ID. */
    public void deleteApplication(Integer applicationId) {
        if (!applicationRepository.existsById(applicationId)) {
            throw new NoSuchElementException("Application ID " + applicationId + " not found.");
        }
        applicationRepository.deleteById(applicationId);
    }
}